'use server';

import 'isomorphic-fetch';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { events } from '@/lib/data';

/**
 * @fileoverview Acción de servidor para enviar un único correo de prueba.
 */

interface SendTestEmailPayload {
  subject: string;
  htmlBody: string;
  recipientEmail: string;
  attachment?: {
    filename: string;
    contentType: string;
    content: string; // base64 content
  };
  eventId?: string;
}

async function getGraphClient() {
    const { GRAPH_CLIENT_ID, GRAPH_TENANT_ID, GRAPH_CLIENT_SECRET } = process.env;
    if (!GRAPH_CLIENT_ID || !GRAPH_TENANT_ID || !GRAPH_CLIENT_SECRET) {
        throw new Error('Faltan las variables de entorno de Microsoft Graph. Por favor, configúralas en Ajustes.');
    }
    const credential = new ClientSecretCredential(GRAPH_TENANT_ID, GRAPH_CLIENT_ID, GRAPH_CLIENT_SECRET);
    const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: ['https://graph.microsoft.com/.default'] });
    return Client.initWithMiddleware({ authProvider });
}

export async function sendTestEmailAction(payload: SendTestEmailPayload): Promise<{ success: boolean }> {
  const { subject, htmlBody, recipientEmail, attachment, eventId } = payload;
  
  const { GRAPH_USER_MAIL } = process.env;
  if (!GRAPH_USER_MAIL) {
    throw new Error('Falta la variable de entorno GRAPH_USER_MAIL. Por favor, configúrala.');
  }

  const event = eventId ? events.find(e => e.id === eventId) : null;
  
  let finalHtmlBody = htmlBody;
  // Replace placeholders with test data
  finalHtmlBody = finalHtmlBody.replace(/{{contact.name}}/g, 'Usuario de Prueba');
  if (event) {
    finalHtmlBody = finalHtmlBody.replace(/{{event.date}}/g, event.date);
  } else {
    // If no event, use today's date for placeholder
    finalHtmlBody = finalHtmlBody.replace(/{{event.date}}/g, format(new Date(), 'PPP', { locale: es }));
  }
  // Clean up any other unreplaced placeholders
  finalHtmlBody = finalHtmlBody.replace(/{{contact.name}}/g, '');
  finalHtmlBody = finalHtmlBody.replace(/{{event.date}}/g, '');


  const message = {
    subject: `[PRUEBA] ${subject}`,
    body: { contentType: 'HTML', content: finalHtmlBody },
    toRecipients: [{ emailAddress: { address: recipientEmail } }],
    attachments: attachment ? [
      {
          '@odata.type': '#microsoft.graph.fileAttachment',
          name: attachment.filename,
          contentType: attachment.contentType,
          contentBytes: attachment.content,
      }
    ] : undefined,
  };

  try {
    const graphClient = await getGraphClient();
    await graphClient.api(`/users/${GRAPH_USER_MAIL}/sendMail`).post({ message, saveToSentItems: 'true' });
    return { success: true };
  } catch (error) {
    const errorMessage = (error as any)?.body ? JSON.parse((error as any).body).error.message : (error as Error).message;
    console.error(`Error al enviar correo de prueba a ${recipientEmail} usando Graph:`, errorMessage);
    throw new Error(`No se pudo enviar el correo de prueba: ${errorMessage}`);
  }
}
