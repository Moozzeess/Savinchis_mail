'use server';

import nodemailer from 'nodemailer';
import mysql from 'mysql2/promise';

/**
 * @fileoverview Acción de servidor para enviar una campaña de correo electrónico.
 * Obtiene destinatarios desde una consulta a la base de datos MySQL basada en una fecha
 * y envía el correo utilizando Nodemailer.
 */

/**
 * Payload para la acción de enviar campaña.
 */
interface SendCampaignPayload {
  subject: string;
  htmlBody: string;
  sendDate: string;
}

/**
 * Envía una campaña de correo a una lista de destinatarios obtenida
 * dinámicamente desde una consulta a base de datos basada en una fecha.
 * @param payload - Los detalles de la campaña, incluyendo asunto, cuerpo y fecha de visita.
 * @returns Un objeto indicando el resultado de la operación.
 * @throws Arrojará un error si la configuración o el proceso de envío fallan.
 */
export async function sendCampaign(payload: SendCampaignPayload) {
  const { subject, htmlBody, sendDate } = payload;

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
    MYSQL_PORT,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      'Faltan las variables de entorno SMTP. Por favor, configúralas.'
    );
  }

  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
    throw new Error(
      'Faltan las variables de entorno de la base de datos. Por favor, configúralas.'
    );
  }

  let connection;
  let recipients: { email: string }[] = [];

  try {
    connection = await mysql.createConnection({
      host: MYSQL_HOST,
      port: MYSQL_PORT ? parseInt(MYSQL_PORT, 10) : 3306,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
    });

    const sql_query = `
      SELECT t1.email
      FROM order_data AS t1 INNER JOIN order_data_online AS t2 ON t1.Ds_Merchant_Order = t2.Ds_Order
      WHERE
          t1.fecha_visita = ?
          AND t2.Ds_ErrorCode = '00'
          AND t2.Ds_ErrorMessage = 'completed'
          AND NOT t1.email IN ('alberto.silva@papalote.org.mx', 'alejandracervantesm@gmail.com')
    `;

    const [rows] = await connection.execute(sql_query, [sendDate]);
    recipients = (rows as { email: string }[]).filter((row) => row.email);
    console.log(`Se encontraron ${recipients.length} destinatarios para la fecha ${sendDate}.`);
  } catch (error) {
    console.error('Error al conectar o consultar la base de datos:', error);
    throw new Error('No se pudo obtener los contactos de la base de datos.');
  } finally {
    if (connection) await connection.end();
  }

  if (recipients.length === 0) {
    return { success: true, message: `No se encontraron destinatarios para enviar en la fecha ${sendDate}. No se enviaron correos.` };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
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
