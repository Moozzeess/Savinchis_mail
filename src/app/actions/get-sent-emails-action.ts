'use server';

import 'isomorphic-fetch';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

/**
 * @fileoverview Acción de servidor para obtener los correos de la carpeta de Elementos Enviados.
 */

interface SentEmail {
  id: string;
  subject: string;
  to: string;
  sentDateTime: string;
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

/**
 * Obtiene los últimos correos de la carpeta de Elementos Enviados del usuario configurado.
 * @returns Una promesa que se resuelve con una lista de correos enviados.
 */
export async function getSentEmailsAction(): Promise<SentEmail[]> {
  const { GRAPH_USER_MAIL, GRAPH_CLIENT_ID, GRAPH_TENANT_ID, GRAPH_CLIENT_SECRET } = process.env;

  // If Graph is not configured, silently return an empty array.
  // This prevents the page from crashing if the user hasn't set up the .env file yet.
  if (!GRAPH_USER_MAIL || !GRAPH_CLIENT_ID || !GRAPH_TENANT_ID || !GRAPH_CLIENT_SECRET) {
    return [];
  }
  
  try {
    const graphClient = await getGraphClient();
    const messages = await graphClient
      .api(`/users/${GRAPH_USER_MAIL}/mailFolders/sentitems/messages`)
      .select('id,subject,toRecipients,sentDateTime')
      .top(50) // Obtener los 50 más recientes
      .orderby('sentDateTime desc')
      .get();

    return messages.value.map((msg: any) => ({
      id: msg.id,
      subject: msg.subject,
      to: msg.toRecipients.map((r: any) => r.emailAddress.address).join(', '),
      sentDateTime: msg.sentDateTime,
    }));
  } catch (error) {
    console.error('Error fetching sent emails:', error);
    // Devuelve un array vacío en caso de error para no romper la UI
    return [];
  }
}
