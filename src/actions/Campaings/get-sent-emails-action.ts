/**
 * @fileoverview Acción de servidor para obtener los correos de la carpeta de Elementos Enviados.
 */
// Declara que este módulo es una acción de servidor, lo que significa que se ejecuta en el servidor y no en el cliente.
'use server'; 

// Importa 'isomorphic-fetch' para que `fetch` esté disponible tanto en el servidor como en el cliente.
import 'isomorphic-fetch'; 
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';


// Define una interfaz para representar la estructura de un correo electrónico enviado.
interface SentEmail {
  id: string; // El ID único del correo.
  subject: string; // El asunto del correo.
  to: string; // Los destinatarios del correo (como una cadena separada por comas).
  sentDateTime: string; // La fecha y hora en que se envió el correo.
}

// Función asíncrona para obtener una instancia configurada del cliente de Microsoft Graph.
async function getGraphClient() {
    // Desestructura las variables de entorno necesarias para la autenticación de Microsoft Graph.
    const { GRAPH_CLIENT_ID, GRAPH_TENANT_ID, GRAPH_CLIENT_SECRET } = process.env;
    
    // Verifica si alguna de las variables de entorno necesarias está faltando.
    if (!GRAPH_CLIENT_ID || !GRAPH_TENANT_ID || !GRAPH_CLIENT_SECRET) {
        // Si faltan variables, lanza un error indicando que la configuración es incompleta.
        throw new Error('Faltan las variables de entorno de Microsoft Graph. Por favor, configúralas en Ajustes.');
    }
    
    // Crea una instancia de ClientSecretCredential utilizando los IDs y el secreto del cliente.
    const credential = new ClientSecretCredential(GRAPH_TENANT_ID, GRAPH_CLIENT_ID, GRAPH_CLIENT_SECRET);
    // Crea un proveedor de autenticación utilizando las credenciales y definiendo los ámbitos (scopes) necesarios.
    const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: ['https://graph.microsoft.com/.default'] });
    // Inicializa el cliente de Microsoft Graph con el proveedor de autenticación.
    return Client.initWithMiddleware({ authProvider });
}

/**
 * Obtiene los últimos correos de la carpeta de Elementos Enviados del usuario configurado.
 * @returns Una promesa que se resuelve con una lista de correos enviados.
 */
export async function getSentEmailsAction(): Promise<SentEmail[]> {
  // Desestructura las variables de entorno, incluyendo el correo del usuario para Graph.
  const { GRAPH_USER_MAIL, GRAPH_CLIENT_ID, GRAPH_TENANT_ID, GRAPH_CLIENT_SECRET } = process.env;

  // Si Graph no está configurado (falta alguna variable de entorno necesaria),
  // devuelve silenciosamente un array vacío.
  // Esto evita que la página falle si el usuario aún no ha configurado el archivo .env.
  if (!GRAPH_USER_MAIL || !GRAPH_CLIENT_ID || !GRAPH_TENANT_ID || !GRAPH_CLIENT_SECRET) {
    return [];
  }
  
  // Inicia un bloque try-catch para manejar posibles errores durante la llamada a la API.
  try {
    // Obtiene una instancia del cliente de Microsoft Graph.
    const graphClient = await getGraphClient();
    // Realiza una solicitud a la API de Microsoft Graph para obtener los mensajes de la carpeta 'sentitems' del usuario especificado.
    const messages = await graphClient
      // Especifica la ruta del recurso: mensajes en la carpeta de elementos enviados del usuario.
      .api(`/users/${GRAPH_USER_MAIL}/mailFolders/sentitems/messages`)
      // Selecciona los campos específicos que queremos obtener de cada mensaje.
      .select('id,subject,toRecipients,sentDateTime')
      // Limita el resultado a los 50 mensajes más recientes.
      .top(50) // Obtener los 50 más recientes
      // Ordena los resultados por fecha de envío en orden descendente (más reciente primero).
      .orderby('sentDateTime desc')
      // Ejecuta la solicitud GET.
      .get();

    // Mapea los resultados obtenidos de la API a la estructura SentEmail definida.
    return messages.value.map((msg: any) => ({
      id: msg.id, // Asigna el ID del mensaje.
      subject: msg.subject, // Asigna el asunto del mensaje.
      // Mapea los destinatarios a una cadena separada por comas con sus direcciones de correo.
      to: msg.toRecipients.map((r: any) => r.emailAddress.address).join(', '), 
      sentDateTime: msg.sentDateTime, // Asigna la fecha y hora de envío del mensaje.
    }));
  } catch (error) {
    console.error('Error fetching sent emails:', error);
    // Devuelve un array vacío en caso de error para no romper la UI
    return [];
  }
}
