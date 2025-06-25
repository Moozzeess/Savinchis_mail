
'use server';

import 'isomorphic-fetch';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import mysql from 'mysql2/promise';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { events } from '@/lib/data';

/**
 * @fileoverview Acción de servidor para enviar una campaña de correo electrónico.
 * Obtiene destinatarios desde una fuente de datos y los envía por lotes
 * para respetar los límites de la API, utilizando Microsoft Graph.
 */

interface SendCampaignPayload {
  subject: string;
  htmlBody: string;
  recipientData: {
    type: 'date' | 'csv' | 'sql' | 'excel';
    value: string;
  };
  batchSize: number;
  emailDelay: number; // ms
  batchDelay: number; // s
  attachment?: {
    filename: string;
    contentType: string;
    content: string; // base64 content
  };
  eventId?: string;
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

  const findKey = (obj: object, potentialKeys: string[]) => {
    const key = Object.keys(obj).find(k => potentialKeys.includes(k.toLowerCase()));
    return key ? obj[key as keyof typeof obj] : undefined;
  };

  if (type === 'csv') {
    try {
      const records = parse(value, {
        columns: true,
        skip_empty_lines: true,
      });
      if (records.length === 0) return [];
      
      const emailKey = Object.keys(records[0]).find(k => k.toLowerCase() === 'email');
      if (!emailKey) throw new Error('La columna "email" no se encontró en el archivo CSV.');
      
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
      const buffer = Buffer.from(value, 'base64');
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
      if (jsonData.length === 0) return [];

      const emailKey = Object.keys(jsonData[0]).find(key => key.toLowerCase() === 'email');
      if (!emailKey) throw new Error('La columna "email" no se encontró en el archivo Excel.');

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
      sql_query = `
        SELECT t1.email, t1.nombre_completo as name
        FROM order_data AS t1 INNER JOIN order_data_online AS t2 ON t1.Ds_Merchant_Order = t2.Ds_Order
        WHERE
            t1.fecha_visita = ?
            AND t2.Ds_ErrorCode = '00'
            AND t2.Ds_ErrorMessage = 'completed'
            AND NOT t1.email IN ('alberto.silva@papalote.org.mx', 'alejandracervantesm@gmail.com')
      `;
      params = [value];
    } else if (type === 'sql') {
      sql_query = value;
    }

    const [rows] = await connection.execute(sql_query, params);
    return (rows as Recipient[]).filter(row => row.email);
  } catch (error) {
    console.error('Error al conectar o consultar la base de datos:', error);
    throw new Error('No se pudo obtener los contactos de la base de datos.');
  } finally {
    if (connection) await connection.end();
  }
}

async function getGraphClient() {
    const { GRAPH_CLIENT_ID, GRAPH_TENANT_ID, GRAPH_CLIENT_SECRET } = process.env;
    if (!GRAPH_CLIENT_ID || !GRAPH_TENANT_ID || !GRAPH_CLIENT_SECRET) {
        throw new Error('Faltan las variables de entorno de Microsoft Graph. Por favor, configúralas.');
    }
    const credential = new ClientSecretCredential(GRAPH_TENANT_ID, GRAPH_CLIENT_ID, GRAPH_CLIENT_SECRET);
    const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: ['https://graph.microsoft.com/.default'] });
    return Client.initWithMiddleware({ authProvider });
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function sendCampaign(payload: SendCampaignPayload) {
  const { subject, htmlBody, recipientData, batchSize, emailDelay, batchDelay, attachment, eventId } = payload;
  const startTime = Date.now();

  const { GRAPH_USER_MAIL } = process.env;
  if (!GRAPH_USER_MAIL) {
    throw new Error('Falta la variable de entorno GRAPH_USER_MAIL. Por favor, configúrala.');
  }

  const recipients = await getRecipients(recipientData);
  if (recipients.length === 0) {
    return { success: true, message: `No se encontraron destinatarios. No se enviaron correos.`, stats: { sentCount: 0, failedCount: 0, totalRecipients: 0, duration: 0 } };
  }

  const event = eventId ? events.find(e => e.id === eventId) : null;
  const totalRecipients = recipients.length;
  const graphClient = await getGraphClient();
  let sentCount = 0;
  let failedCount = 0;

  const recipientBatches = [];
  for (let i = 0; i < recipients.length; i += batchSize) {
    recipientBatches.push(recipients.slice(i, i + batchSize));
  }

  for (const [index, batch] of recipientBatches.entries()) {
    for (const contact of batch) {
        try {
            let finalHtmlBody = htmlBody;
            if (contact.name) {
              finalHtmlBody = finalHtmlBody.replace(/{{contact.name}}/g, contact.name);
            }
            if (event) {
              finalHtmlBody = finalHtmlBody.replace(/{{event.date}}/g, event.date);
            }
            // Clean up any unreplaced placeholders
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
            await graphClient.api(`/users/${GRAPH_USER_MAIL}/sendMail`).post({ message, saveToSentItems: 'true' });
            sentCount++;
        } catch (error) {
            failedCount++;
            const errorMessage = (error as any)?.body ? JSON.parse((error as any).body).error.message : (error as Error).message;
            console.error(`Error al enviar correo a ${contact.email} usando Graph:`, errorMessage);
        }
        
        if(emailDelay > 0) await delay(emailDelay);
    }
    
    if (index < recipientBatches.length - 1) {
      if(batchDelay > 0) await delay(batchDelay * 1000);
    }
  }
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  let message = `Envío completado con Microsoft Graph. Enviados: ${sentCount}. Fallidos: ${failedCount}.`;
  if (failedCount > 0) {
    message += ' Revisa la consola del servidor para más detalles sobre los errores.';
  }

  return { success: true, message, stats: { sentCount, failedCount, totalRecipients, duration } };
}
