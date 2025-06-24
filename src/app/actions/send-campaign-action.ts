'use server';

import nodemailer from 'nodemailer';
import mysql from 'mysql2/promise';

/**
 * @fileoverview Acción de servidor para enviar una campaña de correo electrónico.
 * Obtiene destinatarios desde un archivo CSV o una base de datos MySQL y envía
 * el correo utilizando Nodemailer.
 */

/**
 * Payload para la acción de enviar campaña.
 */
interface SendCampaignPayload {
  subject: string;
  htmlBody: string;
  recipientSource: 'file' | 'query';
  fileContent?: string;
  query?: string;
}

/**
 * Parsea un contenido de texto en formato CSV para extraer direcciones de correo.
 * @param csvContent - El contenido del archivo CSV como una cadena de texto.
 * @returns Un array de objetos, cada uno con una propiedad `email`.
 * @throws Arrojará un error si el CSV no contiene una columna 'email'.
 */
function parseCsv(csvContent: string): { email: string }[] {
  const lines = csvContent.trim().split(/\r?\n/);
  if (lines.length === 0) {
    return [];
  }
  
  const header = lines.shift()!.toLowerCase().split(',').map(h => h.trim());
  const emailIndex = header.indexOf('email');

  if (emailIndex === -1) {
    throw new Error("El archivo CSV debe contener una columna 'email'.");
  }

  return lines
    .map((line) => {
      const values = line.split(',');
      const email = values[emailIndex]?.trim();
      return email ? { email } : null;
    })
    .filter((contact): contact is { email: string } => contact !== null);
}

/**
 * Envía una campaña de correo a una lista de destinatarios obtenida
 * dinámicamente desde un archivo o una consulta a base de datos.
 * @param payload - Los detalles de la campaña, incluyendo asunto, cuerpo y origen de los destinatarios.
 * @returns Un objeto indicando el éxito de la operación.
 * @throws Arrojará un error si la configuración o el proceso de envío fallan.
 */
export async function sendCampaign(payload: SendCampaignPayload) {
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

  let recipients: { email: string }[] = [];

  if (payload.recipientSource === 'file') {
    if (!payload.fileContent) {
      throw new Error('No se proporcionó contenido de archivo CSV.');
    }
    recipients = parseCsv(payload.fileContent);
  } else if (payload.recipientSource === 'query') {
    if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
      throw new Error(
        'Faltan las variables de entorno de la base de datos. Por favor, configúralas.'
      );
    }
    if (!payload.query) {
      throw new Error('No se proporcionó una consulta de base de datos.');
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
      const [rows] = await connection.execute(payload.query);
      recipients = (rows as { email: string }[]).filter((row) => row.email);
    } catch (error) {
      console.error('Error al conectar o consultar la base de datos:', error);
      throw new Error('No se pudo obtener los contactos de la base de datos.');
    } finally {
      if (connection) await connection.end();
    }
  }

  if (recipients.length === 0) {
    throw new Error('No se encontraron destinatarios para enviar la campaña.');
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

  const sendPromises = recipients.map((contact) => {
    return transporter.sendMail({
      from: `"EmailCraft Lite" <${SMTP_USER}>`,
      to: contact.email,
      subject: payload.subject,
      html: payload.htmlBody,
    });
  });

  try {
    await Promise.all(sendPromises);
    return { success: true, message: 'Campaña enviada con éxito.' };
  } catch (error) {
    console.error('Error al enviar la campaña:', error);
    throw new Error('Hubo un problema al enviar los correos electrónicos.');
  }
}
