'use server';

import nodemailer from 'nodemailer';
import { contacts } from '@/lib/data';

/**
 * Envía una campaña de correo de prueba a todos los contactos suscritos.
 * @param emailHtml - El contenido HTML del correo a enviar.
 * @returns Un objeto que indica el éxito o fracaso de la operación.
 * @throws Arrojará un error si faltan las variables de entorno SMTP,
 * si no hay contactos suscritos o si falla el envío de correos.
 */
export async function sendTestCampaign(emailHtml: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      'Faltan las variables de entorno SMTP. Por favor, configúralas en el archivo .env.'
    );
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

  const subscribedContacts = contacts.filter(
    (contact) => contact.status === 'Suscrito'
  );

  if (subscribedContacts.length === 0) {
    throw new Error('No hay contactos suscritos para enviar la campaña.');
  }

  const emailSubject = 'Nuestra Campaña de Prueba';

  const sendPromises = subscribedContacts.map((contact) => {
    return transporter.sendMail({
      from: `"EmailCraft Lite" <${SMTP_USER}>`,
      to: contact.email,
      subject: emailSubject,
      html: emailHtml,
    });
  });

  try {
    await Promise.all(sendPromises);
    return { success: true, message: 'Campaña de prueba enviada con éxito.' };
  } catch (error) {
    console.error('Error al enviar la campaña de prueba:', error);
    throw new Error('Hubo un problema al enviar los correos electrónicos.');
  }
}
