'use server';

import 'isomorphic-fetch';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import mysql from 'mysql2/promise';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { events } from '@/lib/data';
import { hasPermission, APP_PERMISSIONS, type Role } from '@/lib/permissions';

/**
 * @fileoverview Acción de servidor para enviar una campaña de correo electrónico.
 * Obtiene destinatarios desde una fuente de datos y los envía por lotes
 * para respetar los límites de la API, utilizando Microsoft Graph.
 */

interface SendCampaignPayload {
  subject: string;
  htmlBody: string;
  recipientData: {
    type: 'date' | 'csv' | 'sql' | 'excel' | 'individual';
    value: string;
  };
  senderEmail: string;
  attachment?: {
    filename: string;
    contentType: string;
    content: string; // base64 content
  };
  eventId?: string;
  role: Role;
}

interface Recipient {
  email: string;
  name?: string;
}

/**
 * @function getRecipients
 * @description Obtiene una lista de destinatarios para la campaña de correo electrónico desde varias fuentes (CSV, Excel, SQL, o individual).
 * @param {SendCampaignPayload['recipientData']} recipientData - Objeto que especifica el tipo y el valor de la fuente de destinatarios.
 * @returns {Promise<Recipient[]>} Una promesa que resuelve con un arreglo de objetos `Recipient`, cada uno con `email` y opcionalmente `name`.
 * @throws {Error} Si faltan variables de entorno de la base de datos o si hay errores al procesar los datos (ej. columna 'email' no encontrada, formato inválido).
 * @async
 */
async function getRecipients(
  recipientData: SendCampaignPayload['recipientData']
): Promise<Recipient[]> {
  const { type, value } = recipientData;

  /**
   * @private
   * @function findKey
   * @description Función auxiliar para encontrar una clave en un objeto, ignorando mayúsculas/minúsculas.
   * @param {object} obj - El objeto en el que buscar la clave.
   * @param {string[]} potentialKeys - Un arreglo de posibles nombres de clave a buscar.
   * @returns {any | undefined} El valor asociado a la clave encontrada, o `undefined` si no se encuentra ninguna.
   */
  const findKey = (obj: object, potentialKeys: string[]) => {
    const key = Object.keys(obj).find(k => potentialKeys.includes(k.toLowerCase()));
    return key ? obj[key as keyof typeof obj] : undefined;
  };

  if (type === 'csv') {
    try {
      // Parsea el contenido CSV en un arreglo de objetos.
      const records = parse(value, {
        columns: true, // Interpreta la primera fila como nombres de columna.
        skip_empty_lines: true, // Ignora filas vacías.
      });
      if (records.length === 0) return [];

      // Busca la columna 'email' ignorando mayúsculas/minúsculas.
      const emailKey = Object.keys(records[0]).find(k => k.toLowerCase() === 'email');
      if (!emailKey) throw new Error('La columna "email" no se encontró en el archivo CSV.');

      // Mapea los registros a objetos Recipient y filtra los que no tienen un email válido.
      return records.map((record: any) => ({
        email: record[emailKey],
        name: findKey(record, ['name', 'nombre', 'fullname', 'nombre completo']),
      })).filter((r: Recipient) => r.email && r.email.includes('@'));
    } catch (error) {
      console.error('Error al procesar el archivo CSV:', error);
      throw new Error(`Error al procesar el archivo CSV: ${(error as Error).message}`);
    }
  }

  if (type === 'excel') {
    try {
      // Convierte el contenido Base64 del Excel a un Buffer.
      const buffer = Buffer.from(value, 'base64');
      // Lee el libro de trabajo de Excel desde el Buffer.
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      // Obtiene el nombre de la primera hoja.
      const sheetName = workbook.SheetNames[0];
      // Obtiene la primera hoja de trabajo.
      const worksheet = workbook.Sheets[sheetName];
      // Convierte la hoja de trabajo a un arreglo de objetos JSON.
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
      if (jsonData.length === 0) return [];

      // Busca la columna 'email' ignorando mayúsculas/minúsculas.
      const emailKey = Object.keys(jsonData[0]).find(key => key.toLowerCase() === 'email');
      if (!emailKey) throw new Error('La columna "email" no se encontró en el archivo Excel.');

      // Mapea los datos JSON a objetos Recipient y filtra los que no tienen un email válido.
      return jsonData.map(row => ({
        email: row[emailKey],
        name: findKey(row, ['name', 'nombre', 'fullname', 'nombre completo']),
      })).filter(r => r.email && typeof r.email === 'string' && r.email.includes('@'));
    } catch (error) {
      console.error('Error al procesar el archivo Excel:', error);
      throw new Error(`Error al procesar el archivo Excel: ${(error as Error).message}`);
    }
  }

  if (type === 'individual') {
    // Divide la cadena de valor por varios delimitadores y filtra correos válidos.
    const emails = value.split(/[\s,;]+/).filter(e => e && e.includes('@'));
    return emails.map(email => ({ email }));
  }

  // Si el tipo es 'date' o 'sql', se conecta a la base de datos.
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } = process.env;
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
    throw new Error('Faltan las variables de entorno de la base de datos. Por favor, configúralas.');
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: MYSQL_HOST,
      port: MYSQL_PORT ? parseInt(MYSQL_PORT, 10) : 3306,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
    });

    let sql_query = '';
    let params: any[] = [];

    if (type === 'date') {
      // Consulta SQL para obtener contactos asistentes a eventos en una fecha específica.
      sql_query = `
          SELECT c.email, c.nombre
          FROM contactos c
          JOIN asistentes a ON c.id_contacto = a.id_contacto
          JOIN eventos e ON a.id_evento = e.id_evento
          WHERE e.fecha = ?;
      `;
      params = [value]; // La fecha es el valor para el tipo 'date'.
    } else if (type === 'sql') {
      // Utiliza el valor directamente como la consulta SQL.
      sql_query = value;
      params = []; // No hay parámetros para consultas SQL directas, asumiendo que ya están embebidos o la consulta es segura.
    }

    // Ejecuta la consulta y filtra los resultados para asegurar que tienen email.
    const [rows] = await connection.execute(sql_query, params);
    return (rows as Recipient[]).filter(row => row.email);
  } catch (error) {
    console.error('Error al conectar o consultar la base de datos:', error);
    throw new Error('No se pudo obtener los contactos de la base de datos.');
  } finally {
    // Asegura que la conexión a la base de datos se cierre.
    if (connection) await connection.end();
  }
}

/**
 * @function getGraphClient
 * @description Inicializa y retorna un cliente de Microsoft Graph autenticado.
 * @returns {Promise<Client>} Una promesa que resuelve con un objeto de cliente de Microsoft Graph.
 * @throws {Error} Si faltan las variables de entorno de Microsoft Graph (GRAPH_CLIENT_ID, GRAPH_TENANT_ID, GRAPH_CLIENT_SECRET).
 * @async
 */
async function getGraphClient() {
    const { GRAPH_CLIENT_ID, GRAPH_TENANT_ID, GRAPH_CLIENT_SECRET } = process.env;
    if (!GRAPH_CLIENT_ID || !GRAPH_TENANT_ID || !GRAPH_CLIENT_SECRET) {
        throw new Error('Faltan las variables de entorno de Microsoft Graph. Por favor, configúralas.');
    }
    // Crea credenciales de cliente secreto para la autenticación.
    const credential = new ClientSecretCredential(GRAPH_TENANT_ID, GRAPH_CLIENT_ID, GRAPH_CLIENT_SECRET);
    // Crea un proveedor de autenticación usando las credenciales y el ámbito predeterminado.
    const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: ['https://graph.microsoft.com/.default'] });
    // Inicializa el cliente de Graph con el proveedor de autenticación.
    return Client.initWithMiddleware({ authProvider });
}

/**
 * @private
 * @function delay
 * @description Retrasa la ejecución por un número específico de milisegundos.
 * @param {number} ms - El número de milisegundos a esperar.
 * @returns {Promise<void>} Una promesa que se resuelve después del retraso.
 */
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * @function sendEmailWithRetry
 * @description Intenta enviar un correo electrónico usando Microsoft Graph, implementando reintentos con retroceso exponencial para manejar errores de limitación (HTTP 429).
 * @param {Client} graphClient - El cliente de Microsoft Graph autenticado.
 * @param {any} message - El objeto del mensaje de correo electrónico a enviar, conforme al esquema de Microsoft Graph.
 * @param {string} userMail - La dirección de correo electrónico del usuario remitente.
 * @param {number} [maxRetries=3] - El número máximo de intentos de reenvío en caso de error 429.
 * @returns {Promise<void>} Una promesa que se resuelve si el correo se envía con éxito.
 * @throws {Error} Si el correo no se puede enviar después de los reintentos o si ocurre otro tipo de error.
 * @async
 */
async function sendEmailWithRetry(graphClient: Client, message: any, userMail: string, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            // Intenta enviar el correo.
            await graphClient.api(`/users/${userMail}/sendMail`).post({ message, saveToSentItems: 'true' });
            return; // Si tiene éxito, sale de la función.
        } catch (error: any) {
            // Si el error es 429 (Too Many Requests) y aún quedan reintentos.
            if (error.statusCode === 429 && i < maxRetries - 1) {
                // Obtiene el tiempo de reintento del encabezado 'retry-after' o calcula un retroceso exponencial.
                const retryAfter = error.responseHeaders?.['retry-after'] || Math.pow(2, i);
                console.warn(`Throttled por la API de Graph. Reintentando en ${retryAfter} segundos...`);
                await delay(retryAfter * 1000); // Espera antes de reintentar.
            } else {
                throw error; // Lanza el error si no es 429 o si se agotaron los reintentos.
            }
        }
    }
    throw new Error(`No se pudo enviar el correo después de ${maxRetries} reintentos.`);
}

/**
 * @function sendCampaign
 * @description Acción de servidor principal para enviar una campaña de correo electrónico a múltiples destinatarios.
 * Gestiona la obtención de destinatarios, la personalización del contenido, el envío por lotes y el manejo de errores.
 * Requiere el permiso `APP_PERMISSIONS.SEND_CAMPAIGN`.
 * @param {SendCampaignPayload} payload - El objeto de carga útil que contiene todos los detalles de la campaña.
 * @returns {Promise<{success: boolean, message: string, stats: {sentCount: number, failedCount: number, totalRecipients: number, duration: number}}>}
 * Una promesa que resuelve con un objeto que indica el éxito de la operación, un mensaje y estadísticas de envío.
 * @throws {Error} Si el usuario no tiene los permisos necesarios o si falta el correo del remitente.
 * @async
 */
export async function sendCampaign(payload: SendCampaignPayload) {
  const { subject, htmlBody, recipientData, attachment, eventId, role, senderEmail } = payload;
  
  // Verifica si el usuario tiene permiso para enviar campañas.
  if (!hasPermission(role, APP_PERMISSIONS.SEND_CAMPAIGN)) {
    throw new Error('Acceso denegado: No tienes permiso para enviar campañas.');
  }
  
  // Configuración de tamaños de lote y retrasos para el envío.
  const batchSize = 50; // Número de correos por lote.
  const emailDelay = 100; // Retraso en ms entre el envío de correos individuales dentro de un lote.
  const batchDelay = 5; // Retraso en segundos entre el procesamiento de lotes.

  const startTime = Date.now(); // Marca de tiempo de inicio para calcular la duración.

  // Valida que el correo del remitente esté presente.
  if (!senderEmail) {
    throw new Error('Falta el correo del remitente. Por favor, configúralo.');
  }

  // Obtiene la lista de destinatarios.
  const recipients = await getRecipients(recipientData);
  if (recipients.length === 0) {
    // Si no hay destinatarios, reporta éxito sin enviar correos.
    return { success: true, message: `No se encontraron destinatarios. No se enviaron correos.`, stats: { sentCount: 0, failedCount: 0, totalRecipients: 0, duration: 0 } };
  }

  // Busca el evento asociado si se proporcionó un eventId.
  const event = eventId ? events.find(e => e.id === eventId) : null;
  const totalRecipients = recipients.length;
  // Obtiene el cliente de Microsoft Graph.
  const graphClient = await getGraphClient();
  let sentCount = 0; // Contador de correos enviados exitosamente.
  let failedCount = 0; // Contador de correos que fallaron en el envío.

  // Divide la lista de destinatarios en lotes.
  const recipientBatches = [];
  for (let i = 0; i < recipients.length; i += batchSize) {
    recipientBatches.push(recipients.slice(i, i + batchSize));
  }

  // Itera sobre cada lote de destinatarios.
  for (const [index, batch] of recipientBatches.entries()) {
    // Itera sobre cada contacto dentro del lote.
    for (const contact of batch) {
        try {
            let finalHtmlBody = htmlBody;
            // Personaliza el cuerpo HTML con el nombre del contacto si está disponible.
            if (contact.name) {
              finalHtmlBody = finalHtmlBody.replace(/{{contact.name}}/g, contact.name);
            }
            // Personaliza el cuerpo HTML con la fecha del evento si está disponible.
            if (event) {
              finalHtmlBody = finalHtmlBody.replace(/{{event.date}}/g, event.date);
            }
            // Elimina cualquier marcador de posición no reemplazado para evitar que aparezcan en el correo final.
            finalHtmlBody = finalHtmlBody.replace(/{{contact.name}}/g, '');
            finalHtmlBody = finalHtmlBody.replace(/{{event.date}}/g, '');

            // Construye el objeto del mensaje para Microsoft Graph.
            const message = {
                subject: subject,
                body: { contentType: 'HTML', content: finalHtmlBody },
                toRecipients: [{ emailAddress: { address: contact.email } }],
                attachments: attachment ? [ // Agrega adjuntos si están presentes.
                  {
                      '@odata.type': '#microsoft.graph.fileAttachment',
                      name: attachment.filename,
                      contentType: attachment.contentType,
                      contentBytes: attachment.content,
                  }
                ] : undefined,
            };
            
            // Envía el correo usando la función con reintentos.
            await sendEmailWithRetry(graphClient, message, senderEmail);
            sentCount++; // Incrementa el contador de enviados.
        } catch (error) {
            failedCount++; // Incrementa el contador de fallidos.
            // Extrae el mensaje de error de la respuesta de Graph si está disponible, o el mensaje de error general.
            const errorMessage = (error as any)?.body ? JSON.parse((error as any).body).error.message : (error as Error).message;
            console.error(`Error al enviar correo a ${contact.email} usando Graph:`, errorMessage);
        }
        
        // Espera un pequeño retraso entre cada correo individual dentro del lote.
        if(emailDelay > 0) await delay(emailDelay);
    }
    
    // Si no es el último lote, espera un retraso entre lotes.
    if (index < recipientBatches.length - 1) {
      if(batchDelay > 0) await delay(batchDelay * 1000);
    }
  }

  const endTime = Date.now(); // Marca de tiempo de finalización.
  const duration = (endTime - startTime) / 1000; // Duración total en segundos.

  // Construye el mensaje de resultado final.
  let message = `Envío completado con Microsoft Graph. Enviados: ${sentCount}. Fallidos: ${failedCount}.`;
  if (failedCount > 0) {
    message += ' Revisa la consola del servidor para más detalles sobre los errores.';
  }

  // Retorna el resultado y las estadísticas de la campaña.
  return { success: true, message, stats: { sentCount, failedCount, totalRecipients, duration } };
}