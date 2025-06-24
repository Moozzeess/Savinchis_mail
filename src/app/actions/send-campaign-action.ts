'use server';

import 'isomorphic-fetch';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import mysql from 'mysql2/promise';
import { parse } from 'csv-parse/sync';

/**
 * @fileoverview Acción de servidor para enviar una campaña de correo electrónico.
 * Obtiene destinatarios desde una consulta a la base de datos MySQL, un archivo CSV,
 * o una consulta SQL manual y envía el correo utilizando la API de Microsoft Graph.
 */

/**
 * Payload para la acción de enviar campaña.
 */
interface SendCampaignPayload {
  subject: string;
  htmlBody: string;
  recipientData: {
    type: 'date' | 'csv' | 'sql';
    value: string; // Contendrá la fecha, el contenido del CSV o la consulta SQL
  };
}

/**
 * Obtiene una lista de destinatarios desde la fuente especificada.
 * @param recipientData - El objeto que define la fuente de los destinatarios.
 * @returns Una promesa que se resuelve con un array de objetos de destinatarios.
 */
async function getRecipients(
  recipientData: SendCampaignPayload['recipientData']
): Promise<{ email: string }[]> {
  const { type, value } = recipientData;

  if (type === 'csv') {
    try {
      const records = parse(value, {
        columns: true,
        skip_empty_lines: true,
      });
      if (records.length === 0 || !('email' in records[0])) {
        throw new Error('La columna "email" no se encontró o el archivo está vacío.');
      }
      return records.map((record: any) => ({ email: record.email })).filter((r: {email: string}) => r.email);
    } catch (error) {
      console.error('Error al procesar el archivo CSV:', error);
      throw new Error(
        `Error al procesar el archivo CSV: ${(error as Error).message}`
      );
    }
  }

  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } =
    process.env;

  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
    throw new Error(
      'Faltan las variables de entorno de la base de datos. Por favor, configúralas.'
    );
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
        SELECT t1.email
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
    return (rows as { email: string }[]).filter(row => row.email);

  } catch (error) {
    console.error('Error al conectar o consultar la base de datos:', error);
    throw new Error('No se pudo obtener los contactos de la base de datos.');
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * Obtiene un cliente de Microsoft Graph autenticado.
 * @returns Un cliente de Graph listo para usar.
 */
async function getGraphClient() {
    const { GRAPH_CLIENT_ID, GRAPH_TENANT_ID, GRAPH_CLIENT_SECRET } = process.env;
    if (!GRAPH_CLIENT_ID || !GRAPH_TENANT_ID || !GRAPH_CLIENT_SECRET) {
        throw new Error('Faltan las variables de entorno de Microsoft Graph. Por favor, configúralas.');
    }

    const credential = new ClientSecretCredential(
        GRAPH_TENANT_ID,
        GRAPH_CLIENT_ID,
        GRAPH_CLIENT_SECRET
    );

    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default'],
    });

    const client = Client.initWithMiddleware({
        authProvider: authProvider,
    });

    return client;
}

/**
 * Envía una campaña de correo utilizando la API de Microsoft Graph.
 * @param payload - Los detalles de la campaña.
 * @returns Un objeto indicando el resultado de la operación.
 * @throws Arrojará un error si la configuración o el proceso de envío fallan.
 */
export async function sendCampaign(payload: SendCampaignPayload) {
  const { subject, htmlBody, recipientData } = payload;
  const startTime = Date.now();

  const { GRAPH_USER_MAIL } = process.env;
  if(!GRAPH_USER_MAIL){
      throw new Error('Falta la variable de entorno GRAPH_USER_MAIL. Por favor, configúrala.');
  }

  const recipients = await getRecipients(recipientData);
  
  if (recipients.length === 0) {
    return { 
        success: true, 
        message: `No se encontraron destinatarios. No se enviaron correos.`,
        stats: {
            sentCount: 0,
            failedCount: 0,
            totalRecipients: 0,
            duration: 0
        } 
    };
  }

  const totalRecipients = recipients.length;
  const graphClient = await getGraphClient();

  let sentCount = 0;
  let failedCount = 0;

  for (const contact of recipients) {
    const message = {
      subject: subject,
      body: {
        contentType: 'HTML',
        content: htmlBody,
      },
      toRecipients: [
        {
          emailAddress: {
            address: contact.email,
          },
        },
      ],
    };
    
    try {
      await graphClient.api(`/users/${GRAPH_USER_MAIL}/sendMail`).post({
          message: message,
          saveToSentItems: 'true',
      });
      sentCount++;
    } catch (error) {
      failedCount++;
      // El error de Graph puede ser muy verboso. Extraemos el mensaje si es posible.
      const errorMessage = (error as any)?.body ? JSON.parse((error as any).body).error.message : (error as Error).message;
      console.error(`Error al enviar correo a ${contact.email} usando Graph:`, errorMessage);
    }
  }
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000; // Duración en segundos

  let message = `Campaña enviada con Microsoft Graph. Enviados: ${sentCount}. Fallidos: ${failedCount}.`;
  if (failedCount > 0) {
     message += ' Revisa la consola del servidor para más detalles sobre los errores.'
  }

  return { 
    success: true, 
    message: message,
    stats: {
        sentCount,
        failedCount,
        totalRecipients,
        duration,
    }
  };
}
