'use server';

import 'isomorphic-fetch';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { events } from '@/lib/data';
import { hasPermission, APP_PERMISSIONS, type Role } from '@/lib/permissions';

/**
 * @fileoverview Acción de servidor para enviar un único correo de prueba.
 * Incluye verificación de permisos basada en rol.
 */

/**
 * @interface SendTestEmailPayload
 * @description Define la estructura del objeto de datos necesario para enviar un correo de prueba.
 * @property {string} subject - El asunto del correo electrónico.
 * @property {string} htmlBody - El cuerpo del correo electrónico en formato HTML.
 * @property {string} recipientEmail - La dirección de correo electrónico del destinatario de la prueba.
 * @property {string} senderEmail - La dirección de correo electrónico del remitente.
 * @property {object} [attachment] - Un objeto opcional para adjuntar un archivo.
 * @property {string} attachment.filename - El nombre del archivo adjunto.
 * @property {string} attachment.contentType - El tipo de contenido (MIME type) del adjunto.
 * @property {string} attachment.content - El contenido del archivo en formato Base64.
 * @property {string} [eventId] - El ID opcional de un evento, utilizado para la personalización del cuerpo del correo.
 * @property {Role} role - El rol del usuario que inicia la acción, para la verificación de permisos.
 */
interface SendTestEmailPayload {
  subject: string;
  htmlBody: string;
  recipientEmail: string;
  senderEmail: string;
  attachment?: {
    filename: string;
    contentType: string;
    content: string; // base64 content
  };
  eventId?: string;
  role: Role;
}

/**
 * @function getGraphClient
 * @description Inicializa y retorna un cliente de Microsoft Graph autenticado.
 * Requiere las variables de entorno para la autenticación de Azure AD.
 * @returns {Promise<Client>} Una promesa que resuelve con una instancia del cliente de Microsoft Graph.
 * @throws {Error} Si faltan las variables de entorno de Microsoft Graph (GRAPH_CLIENT_ID, GRAPH_TENANT_ID, GRAPH_CLIENT_SECRET).
 * @async
 */
async function getGraphClient() {
    const { GRAPH_CLIENT_ID, GRAPH_TENANT_ID, GRAPH_CLIENT_SECRET } = process.env;
    if (!GRAPH_CLIENT_ID || !GRAPH_TENANT_ID || !GRAPH_CLIENT_SECRET) {
        throw new Error('Faltan las variables de entorno de Microsoft Graph. Por favor, configúralas en Ajustes.');
    }
    // Crea una credencial basada en el secreto del cliente de Azure AD.
    const credential = new ClientSecretCredential(GRAPH_TENANT_ID, GRAPH_CLIENT_ID, GRAPH_CLIENT_SECRET);
    // Configura el proveedor de autenticación con las credenciales y el ámbito predeterminado de Graph.
    const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: ['https://graph.microsoft.com/.default'] });
    // Inicializa el cliente de Microsoft Graph con el proveedor de autenticación.
    return Client.initWithMiddleware({ authProvider });
}

/**
 * @function sendTestEmailAction
 * @description Acción de servidor para enviar un correo electrónico de prueba a un único destinatario.
 * Personaliza el cuerpo del correo con datos de prueba y un evento si se especifica.
 * Requiere el permiso `APP_PERMISSIONS.SEND_CAMPAIGN` para ejecutarse.
 * @param {SendTestEmailPayload} payload - Los datos necesarios para enviar el correo de prueba.
 * @returns {Promise<{success: boolean}>} Una promesa que resuelve con un objeto indicando si el envío fue exitoso.
 * @throws {Error} Si el usuario no tiene los permisos necesarios, si falta el correo del remitente, o si falla el envío a través de Microsoft Graph.
 * @async
 */
export async function sendTestEmailAction(payload: SendTestEmailPayload): Promise<{ success: boolean }> {
  const { subject, htmlBody, recipientEmail, senderEmail, attachment, eventId, role } = payload;
  
  // Verifica si el rol del usuario tiene el permiso requerido para enviar campañas (incluye correos de prueba).
  if (!hasPermission(role, APP_PERMISSIONS.SEND_CAMPAIGN)) {
    throw new Error('Acceso denegado: No tienes permiso para enviar correos de prueba.');
  }

  // Valida que el correo del remitente esté presente.
  if (!senderEmail) {
    throw new Error('Falta el correo del remitente. Por favor, configúralo.');
  }

  // Busca el evento asociado si se proporcionó un ID de evento.
  const event = eventId ? events.find(e => e.id === eventId) : null;
  
  let finalHtmlBody = htmlBody;
  // Reemplaza el marcador de posición del nombre del contacto con un valor de prueba.
  finalHtmlBody = finalHtmlBody.replace(/{{contact.name}}/g, 'Usuario de Prueba');
  
  // Reemplaza el marcador de posición de la fecha del evento.
  if (event) {
    // Si hay un evento, usa la fecha del evento.
    finalHtmlBody = finalHtmlBody.replace(/{{event.date}}/g, event.date);
  } else {
    // Si no hay evento, usa la fecha actual formateada en español.
    finalHtmlBody = finalHtmlBody.replace(/{{event.date}}/g, format(new Date(), 'PPP', { locale: es }));
  }
  
  // Limpia cualquier otro marcador de posición {{contact.name}} o {{event.date}} que pueda quedar sin reemplazar.
  finalHtmlBody = finalHtmlBody.replace(/{{contact.name}}/g, '');
  finalHtmlBody = finalHtmlBody.replace(/{{event.date}}/g, '');

  // Construye el objeto del mensaje de correo electrónico para la API de Microsoft Graph.
  const message = {
    subject: `[PRUEBA] ${subject}`, // Añade "[PRUEBA]" al asunto.
    body: { contentType: 'HTML', content: finalHtmlBody }, // Define el cuerpo como HTML.
    toRecipients: [{ emailAddress: { address: recipientEmail } }], // Define el destinatario.
    attachments: attachment ? [ // Incluye adjuntos si se proporcionaron.
      {
          '@odata.type': '#microsoft.graph.fileAttachment', // Tipo de adjunto de Graph.
          name: attachment.filename,
          contentType: attachment.contentType,
          contentBytes: attachment.content,
      }
    ] : undefined,
  };

  try {
    // Obtiene el cliente de Microsoft Graph.
    const graphClient = await getGraphClient();
    // Envía el correo electrónico a través de la API de Graph y lo guarda en elementos enviados.
    await graphClient.api(`/users/${senderEmail}/sendMail`).post({ message, saveToSentItems: 'true' });
    return { success: true }; // Retorna éxito si no hay errores.
  } catch (error) {
    // Captura y registra el error al enviar el correo.
    // Extrae el mensaje de error de la respuesta de Graph si está disponible, o usa el mensaje de error general.
    const errorMessage = (error as any)?.body ? JSON.parse((error as any).body).error.message : (error as Error).message;
    console.error(`Error al enviar correo de prueba a ${recipientEmail} usando Graph:`, errorMessage);
    // Lanza un nuevo error con un mensaje descriptivo para el cliente.
    throw new Error(`No se pudo enviar el correo de prueba: ${errorMessage}`);
  }
}