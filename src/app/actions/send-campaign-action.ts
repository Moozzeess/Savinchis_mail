'use server';

import nodemailer from 'nodemailer';
import mysql from 'mysql2/promise';
import { parse } from 'csv-parse/sync';

/**
 * @fileoverview Acción de servidor para enviar una campaña de correo electrónico.
 * Obtiene destinatarios desde una consulta a la base de datos MySQL, un archivo CSV,
 * o una consulta SQL manual y envía el correo utilizando Nodemailer.
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
      // Nota: Ejecutar SQL directamente del usuario es un riesgo de seguridad.
      // En una aplicación real, esto debería ser validado o restringido.
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
 * Envía una campaña de correo a una lista de destinatarios obtenida
 * dinámicamente desde la fuente especificada.
 * @param payload - Los detalles de la campaña.
 * @returns Un objeto indicando el resultado de la operación.
 * @throws Arrojará un error si la configuración o el proceso de envío fallan.
 */
export async function sendCampaign(payload: SendCampaignPayload) {
  const { subject, htmlBody, recipientData } = payload;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      'Faltan las variables de entorno SMTP. Por favor, configúralas.'
    );
  }
  
  const recipients = await getRecipients(recipientData);
  
  if (recipients.length === 0) {
    return { success: true, message: `No se encontraron destinatarios. No se enviaron correos.` };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: parseInt(SMTP_PORT, 10) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  let sentCount = 0;
  let failedCount = 0;

  for (const contact of recipients) {
    try {
      await transporter.sendMail({
        from: `"EmailCraft Lite" <${SMTP_USER}>`,
        to: contact.email,
        subject: subject,
        html: htmlBody,
      });
      sentCount++;
    } catch (error) {
      failedCount++;
      console.error(`Error al enviar correo a ${contact.email}:`, error);
    }
  }
  
  let message = `Campaña enviada. Enviados: ${sentCount}. Fallidos: ${failedCount}.`;
  if (failedCount > 0) {
     message += ' Revisa la consola del servidor para más detalles sobre los errores.'
  }

  return { success: true, message: message };
}
