'use server';

import nodemailer from 'nodemailer';
import { contacts } from '@/lib/data';

export async function sendTestCampaign() {
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
  const emailHtml = `
    <h1>¡Hola!</h1>
    <p>Esta es una campaña de correo electrónico de prueba desde EmailCraft Lite.</p>
    <p>Gracias por ser parte de nuestra comunidad.</p>
  `;

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
