import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import 'isomorphic-fetch';

// Variables de entorno requeridas
const TENANT_ID = process.env.AZURE_TENANT_ID || process.env.NEXT_PUBLIC_AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID || process.env.NEXT_PUBLIC_AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;

if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
  // No lanzar aquí para permitir build, pero los handlers validarán
  console.warn('[graph-email] Variables de entorno incompletas para Microsoft Graph');
}

const SCOPES = ['https://graph.microsoft.com/.default'];

export interface GraphAttachment {
  name: string;
  contentType: string;
  contentBytes: string; // base64
}

export interface SendEmailOptions {
  fromEmail: string; // cuenta del buzón desde la que se envía
  to: Array<{ address: string; name?: string }>; // usar BCC externamente si se requiere ocultar
  subject: string;
  htmlContent: string;
  attachments?: GraphAttachment[];
}

function getClientCredential() {
  return new ClientSecretCredential(TENANT_ID as string, CLIENT_ID as string, CLIENT_SECRET as string);
}

async function getAccessToken(): Promise<string> {
  const credential = getClientCredential();
  const token = await credential.getToken(SCOPES);
  if (!token?.token) {
    throw new Error('No se pudo obtener el token de acceso de Microsoft Graph');
  }
  return token.token;
}

function getGraphClient(accessToken: string) {
  return Client.init({
    authProvider: done => done(null, accessToken),
  });
}

export async function sendEmailViaGraph(options: SendEmailOptions) {
  const accessToken = await getAccessToken();
  const client = getGraphClient(accessToken);

  const message: any = {
    subject: options.subject,
    body: {
      contentType: 'HTML',
      content: options.htmlContent,
    },
    toRecipients: options.to.map(r => ({ emailAddress: { address: r.address, name: r.name } })),
    attachments: options.attachments?.map(att => ({
      '@odata.type': '#microsoft.graph.fileAttachment',
      name: att.name,
      contentType: att.contentType,
      contentBytes: att.contentBytes,
    })),
  };

  // Usamos /users/{fromEmail}/sendMail con permisos de aplicación
  await client.api(`/users/${encodeURIComponent(options.fromEmail)}/sendMail`).post({ message });
}

export async function sendBulkBccViaGraph(options: SendEmailOptions) {
  const accessToken = await getAccessToken();
  const client = getGraphClient(accessToken);

  const message: any = {
    subject: options.subject,
    body: {
      contentType: 'HTML',
      content: options.htmlContent,
    },
    toRecipients: [],
    bccRecipients: options.to.map(r => ({ emailAddress: { address: r.address, name: r.name } })),
    attachments: options.attachments?.map(att => ({
      '@odata.type': '#microsoft.graph.fileAttachment',
      name: att.name,
      contentType: att.contentType,
      contentBytes: att.contentBytes,
    })),
  };

  await client.api(`/users/${encodeURIComponent(options.fromEmail)}/sendMail`).post({ message });
}

export function personalize(template: string, data: Record<string, any>): string {
  let out = template;
  Object.entries(data).forEach(([k, v]) => {
    const re = new RegExp(`{{${k}}}`, 'g');
    out = out.replace(re, String(v ?? ''));
  });
  return out;
}
