
'use server';

import 'isomorphic-fetch';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import mysql from 'mysql2/promise';
// Importa la función parse del paquete csv-parse/sync para parsear archivos CSV de forma síncrona.
import { parse } from 'csv-parse/sync';
// Importa todas las funciones del paquete xlsx bajo el alias XLSX para trabajar con archivos Excel.
import * as XLSX from 'xlsx';
// Importa la constante 'events' desde el módulo de datos local.
import { events } from '@/lib/data';
import { hasPermission, APP_PERMISSIONS, type Role } from '@/lib/permissions';

/**
 * @fileoverview Acción de servidor para enviar una campaña de correo electrónico.
 * Obtiene destinatarios desde una fuente de datos y los envía por lotes
 * para respetar los límites de la API, utilizando Microsoft Graph.
 *
 * Las acciones de servidor se ejecutan en el lado del servidor y pueden ser llamadas
 * desde el lado del cliente.
 */

// Define una interfaz para el payload que se espera al enviar una campaña.
interface SendCampaignPayload {
  subject: string; // El asunto del correo electrónico.
  // El cuerpo del correo electrónico en formato HTML.
  htmlBody: string;
  recipientData: {
    type: 'date' | 'csv' | 'sql' | 'excel';
    value: string;
  };
  senderEmail: string;
  // Propiedad opcional para adjuntar un archivo al correo.
  attachment?: {
    filename: string; // El nombre del archivo adjunto.
    contentType: string; // El tipo MIME del archivo adjunto.
    // El contenido del archivo adjunto codificado en base64.
    content: string; // base64 content
  };
  // ID opcional de un evento para personalizar el correo (ej: fecha del evento).
  eventId?: string; // ID opcional de un evento.
  role: Role; // Rol del usuario que ejecuta la acción para verificación de permisos
}

interface Recipient {
  email: string;
  name?: string;
}

/**
 * Obtiene una lista de destinatarios desde la fuente especificada.
 */
async function getRecipients(
  recipientData: SendCampaignPayload['recipientData']
): Promise<Recipient[]> {
  const { type, value } = recipientData;
  // Desestructura el tipo y el valor de los datos del destinatario.

  // Función auxiliar para encontrar una clave en un objeto de forma insensible a mayúsculas/minúsculas.
  const findKey = (obj: object, potentialKeys: string[]) => {
    // Itera sobre las claves del objeto.
    const key = Object.keys(obj).find(k => potentialKeys.includes(k.toLowerCase()));
    // Si encuentra una clave que coincide (insensible a mayúsculas/minúsculas), devuelve su valor; de lo contrario, undefined.
    return key ? obj[key as keyof typeof obj] : undefined;
  };

  if (type === 'csv') {
    try {
      const records = parse(value, {
        columns: true,
        // Especifica que la primera fila contiene nombres de columnas.
        skip_empty_lines: true,
        // Omite las líneas vacías del archivo CSV.
      });
      // Parsear el valor del CSV en un array de objetos.
      if (records.length === 0) return [];
      // Si no hay registros, retorna un array vacío.

      const emailKey = Object.keys(records[0]).find(k => k.toLowerCase() === 'email');
      // Busca la clave 'email' (insensible a mayúsculas/minúsculas) en el primer registro.
      if (!emailKey) throw new Error('La columna "email" no se encontró en el archivo CSV.');
      // Si no se encuentra la columna 'email', lanza un error.

      return records.map((record: any) => ({
        email: record[emailKey],
        name: findKey(record, ['name', 'nombre', 'fullname', 'nombre completo']),
      })).filter((r: Recipient) => r.email && r.email.includes('@'));
      // Mapea los registros para crear objetos Recipient y filtra los que no tienen un email válido.
    } catch (error) {
      console.error('Error al procesar el archivo CSV:', error);
      throw new Error(`Error al procesar el archivo CSV: ${(error as Error).message}`);
    }
  }

  if (type === 'excel') {
    try {
      // Decodifica el contenido base64 del archivo Excel a un buffer.
      const buffer = Buffer.from(value, 'base64');
      // Lee el buffer como un libro de trabajo de Excel.
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      // Obtiene el nombre de la primera hoja del libro de trabajo.
      const sheetName = workbook.SheetNames[0];
      // Obtiene la hoja de trabajo por su nombre.
      const worksheet = workbook.Sheets[sheetName];
      // Convierte la hoja de trabajo a un array de objetos JSON.
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
      if (jsonData.length === 0) return [];
      // Si no hay datos JSON, retorna un array vacío.

      const emailKey = Object.keys(jsonData[0]).find(key => key.toLowerCase() === 'email');
      // Busca la clave 'email' (insensible a mayúsculas/minúsculas) en el primer objeto JSON.
      if (!emailKey) throw new Error('La columna "email" no se encontró en el archivo Excel.');
      // Si no se encuentra la columna 'email', lanza un error.

      return jsonData.map(row => ({
        email: row[emailKey],
        name: findKey(row, ['name', 'nombre', 'fullname', 'nombre completo']),
      })).filter(r => r.email && typeof r.email === 'string' && r.email.includes('@'));
    } catch (error) {
      console.error('Error al procesar el archivo Excel:', error);
      throw new Error(`Error al procesar el archivo Excel: ${(error as Error).message}`);
    }
  }

  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } = process.env;
  // Desestructura las variables de entorno para la conexión a la base de datos.
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
    throw new Error('Faltan las variables de entorno de la base de datos. Por favor, configúralas.');
  }
  // Verifica que las variables de entorno necesarias para la base de datos estén configuradas. Si faltan, lanza un error.


  let connection;
  try {
    connection = await mysql.createConnection({
      host: MYSQL_HOST,
      port: MYSQL_PORT ? parseInt(MYSQL_PORT, 10) : 3306,
      user: MYSQL_USER,
      // Convierte el puerto a número si está definido, de lo contrario usa 3306.
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
    });
    // Crea una conexión a la base de datos MySQL utilizando las variables de entorno.

    let sql_query = '';
    let params: any[] = [];
    // Inicializa la variable para la consulta SQL y los parámetros.

    if (type === 'date') {
        const [day, month, year] = value.split('/');
        const formattedDate = `${year}-${month}-${day}`;
        sql_query = `
            SELECT c.email, c.name
            FROM contacts c
            JOIN attendees a ON c.id = a.contact_id
            JOIN events e ON a.event_id = e.id
            WHERE e.event_date = ?;
        `;
        params = [formattedDate];
    } else if (type === 'sql') {
        sql_query = value;
        params = [];
    }


    const [rows] = await connection.execute(sql_query, params);
    return (rows as Recipient[]).filter(row => row.email);
    // Ejecuta la consulta SQL y filtra las filas para asegurarse de que tengan un email.
  } catch (error) {
    console.error('Error al conectar o consultar la base de datos:', error);
    throw new Error('No se pudo obtener los contactos de la base de datos.');
    // Captura y loguea errores de conexión o consulta de la base de datos, luego lanza un nuevo error.
  } finally {
    if (connection) await connection.end();
    // Asegura que la conexión a la base de datos se cierre al finalizar (éxito o error).
  }
}

// Función asíncrona para obtener una instancia del cliente de Microsoft Graph.
async function getGraphClient() {
    // Desestructura las variables de entorno necesarias para la autenticación con Microsoft Graph.
    const { GRAPH_CLIENT_ID, GRAPH_TENANT_ID, GRAPH_CLIENT_SECRET } = process.env;
    if (!GRAPH_CLIENT_ID || !GRAPH_TENANT_ID || !GRAPH_CLIENT_SECRET) {
        throw new Error('Faltan las variables de entorno de Microsoft Graph. Por favor, configúralas.');
    }
    const credential = new ClientSecretCredential(GRAPH_TENANT_ID, GRAPH_CLIENT_ID, GRAPH_CLIENT_SECRET);
    const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: ['https://graph.microsoft.com/.default'] });
    return Client.initWithMiddleware({ authProvider });
}

// Función de utilidad para crear un retraso basado en un número de milisegundos.
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


/**
 * Envía un correo electrónico utilizando Microsoft Graph con una política de reintentos.
 * @param graphClient - El cliente de Microsoft Graph.
 * @param message - El objeto de mensaje a enviar.
 * @param userMail - El correo del usuario remitente.
 * @param maxRetries - El número máximo de reintentos.
 * @throws Si el envío falla después de todos los reintentos.
 */
async function sendEmailWithRetry(graphClient: Client, message: any, userMail: string, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await graphClient.api(`/users/${userMail}/sendMail`).post({ message, saveToSentItems: 'true' });
            return; // Éxito
        } catch (error: any) {
            // Verifica si es un error de throttling (demasiadas solicitudes)
            if (error.statusCode === 429 && i < maxRetries - 1) {
                // Obtiene el tiempo de espera del encabezado 'retry-after' o usa un backoff exponencial.
                const retryAfter = error.responseHeaders?.['retry-after'] || Math.pow(2, i);
                console.warn(`Throttled por la API de Graph. Reintentando en ${retryAfter} segundos...`);
                await delay(retryAfter * 1000);
            } else {
                // Si es otro tipo de error, lo relanza para que sea manejado más arriba.
                throw error;
            }
        }
    }
    // Si todos los reintentos fallan, lanza un error.
    throw new Error(`No se pudo enviar el correo después de ${maxRetries} reintentos.`);
}


// Acción de servidor principal para enviar la campaña de correo electrónico.
export async function sendCampaign(payload: SendCampaignPayload) {
  const { subject, htmlBody, recipientData, attachment, eventId, role, senderEmail } = payload;
  
  if (!hasPermission(role, APP_PERMISSIONS.SEND_CAMPAIGN)) {
    throw new Error('Acceso denegado: No tienes permiso para enviar campañas.');
  }
  
  // Estos ajustes ahora están configurados globalmente (ej: en la página de Ajustes).
  // Para esta acción, usaremos valores por defecto. En una aplicación real, se obtendrían de una base de datos o servicio de configuración.
  const batchSize = 50;
  const emailDelay = 100; // milisegundos
  const batchDelay = 5; // segundos

  const startTime = Date.now();
  // Registra el tiempo de inicio para calcular la duración total.

  if (!senderEmail) {
    throw new Error('Falta el correo del remitente. Por favor, configúralo.');
  }

  const recipients = await getRecipients(recipientData);
  // Obtiene la lista de destinatarios utilizando la función getRecipients.
  if (recipients.length === 0) {
    return { success: true, message: `No se encontraron destinatarios. No se enviaron correos.`, stats: { sentCount: 0, failedCount: 0, totalRecipients: 0, duration: 0 } };
  }
  // Si no se encontraron destinatarios, retorna un resultado exitoso con estadísticas de cero envíos.

  // Busca el evento correspondiente si se proporcionó un eventId.
  const event = eventId ? events.find(e => e.id === eventId) : null;
  // Obtiene el número total de destinatarios.
  const totalRecipients = recipients.length;
  // Obtiene una instancia del cliente de Microsoft Graph.
  const graphClient = await getGraphClient();
  let sentCount = 0;
  let failedCount = 0;

  const recipientBatches = [];
  for (let i = 0; i < recipients.length; i += batchSize) {
    recipientBatches.push(recipients.slice(i, i + batchSize));
  }
  // Divide la lista de destinatarios en lotes según el tamaño de lote especificado.

  // Itera sobre cada lote de destinatarios.
  for (const [index, batch] of recipientBatches.entries()) {
    // Itera sobre cada contacto dentro del lote actual.
    for (const contact of batch) {
        try {
            // Inicializa el cuerpo final del correo con el cuerpo HTML original.
            let finalHtmlBody = htmlBody;
            // Reemplaza el placeholder {{contact.name}} si existe el nombre del contacto.
            if (contact.name) {
              finalHtmlBody = finalHtmlBody.replace(/{{contact.name}}/g, contact.name);
            }
            // Reemplaza el placeholder {{event.date}} si existe la fecha del evento.
            if (event) {
              finalHtmlBody = finalHtmlBody.replace(/{{event.date}}/g, event.date);
            }
            // Limpia cualquier marcador de posición que no haya sido reemplazado.
            finalHtmlBody = finalHtmlBody.replace(/{{contact.name}}/g, '');
            finalHtmlBody = finalHtmlBody.replace(/{{event.date}}/g, '');

            const message = {
                subject: subject,
                body: { contentType: 'HTML', content: finalHtmlBody },
                toRecipients: [{ emailAddress: { address: contact.email } }],
                attachments: attachment ? [
                  {
                      '@odata.type': '#microsoft.graph.fileAttachment',
                      name: attachment.filename,
                      contentType: attachment.contentType,
                      contentBytes: attachment.content,
                  }
                ] : undefined,
            };
            
            // Envía el correo usando la función con lógica de reintentos.
            await sendEmailWithRetry(graphClient, message, senderEmail);

            sentCount++;
            // Incrementa el contador de correos enviados exitosamente.
        } catch (error) {
            failedCount++;
            const errorMessage = (error as any)?.body ? JSON.parse((error as any).body).error.message : (error as Error).message;
            console.error(`Error al enviar correo a ${contact.email} usando Graph:`, errorMessage);
            // Incrementa el contador de correos fallidos.
            // Loguea el error detallado al enviar el correo a un contacto específico.
        }
        
        if(emailDelay > 0) await delay(emailDelay);
    }
    
    if (index < recipientBatches.length - 1) {
      if(batchDelay > 0) await delay(batchDelay * 1000);
      // Si no es el último lote y hay un retraso de lote configurado, espera antes de procesar el siguiente lote.
    }
  }

  // Registra el tiempo de finalización.
  const endTime = Date.now();
  // Calcula la duración total del proceso de envío en segundos.
  const duration = (endTime - startTime) / 1000;

  let message = `Envío completado con Microsoft Graph. Enviados: ${sentCount}. Fallidos: ${failedCount}.`;
  if (failedCount > 0) {
    message += ' Revisa la consola del servidor para más detalles sobre los errores.';
  }

  // Retorna un objeto con el estado de éxito, un mensaje resumen y estadísticas del envío.
  return { success: true, message, stats: { sentCount, failedCount, totalRecipients, duration } };
}
