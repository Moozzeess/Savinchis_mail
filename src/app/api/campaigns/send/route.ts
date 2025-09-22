import { NextResponse } from 'next/server';
import { sendEmailViaGraph, personalize } from '@/lib/graph-email';
import { sendIndividualEmails } from '@/lib/mailing-api';
import { generateHtmlFromBlocks } from '@/lib/template-utils';
import { progressStore } from '@/lib/progress-store';

// Conversión simple de HTML a texto plano para textContent
function htmlToText(html: string): string {
  if (!html) return '';
  let text = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
                 .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<br\s*\/?>(?=\s*\n?)/gi, '\n')
             .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n');
  text = text.replace(/<[^>]+>/g, '');
  text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return text.replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

// Configuración de envío por lotes
const BATCH_SIZE = 100; // Número de correos por lote
const DELAY_BETWEEN_BATCHES = 10000; // 10 segundos entre lotes

function getBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || process.env.VERCEL_URL;
  if (fromEnv) {
    const url = fromEnv.startsWith('http') ? fromEnv : `https://${fromEnv}`;
    return url.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Validar los datos de entrada
    if (!payload.templateId || !payload.recipientListId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: templateId y recipientListId son obligatorios' },
        { status: 400 }
      );
    }

    // Obtener la lista de contactos (API real interna)
    const contacts = await getRecipientsFromList(payload.recipientListId);
    
    if (!contacts || contacts.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron destinatarios para la lista proporcionada' },
        { status: 400 }
      );
    }

    // Obtener el contenido de la plantilla (API real interna)
    const templateContent = await getTemplateContent(payload.templateId);
    
    if (!templateContent) {
      return NextResponse.json(
        { error: 'No se pudo cargar el contenido de la plantilla' },
        { status: 400 }
      );
    }

    // Normalizar el cuerpo HTML de la plantilla: puede venir como HTML string o como JSON de bloques
    let htmlBodyStr: string = '';
    if (Array.isArray(templateContent)) {
      htmlBodyStr = generateHtmlFromBlocks(templateContent as any);
    } else if (typeof templateContent === 'string') {
      // Intentar parsear si es JSON de bloques
      try {
        const maybeJson = JSON.parse(templateContent);
        htmlBodyStr = Array.isArray(maybeJson) ? generateHtmlFromBlocks(maybeJson as any) : templateContent;
      } catch {
        htmlBodyStr = templateContent;
      }
    } else if (templateContent && typeof templateContent === 'object') {
      // Caso raro: objeto ya parseado
      const maybeBlocks = (templateContent as any).blocks || templateContent;
      htmlBodyStr = Array.isArray(maybeBlocks) ? generateHtmlFromBlocks(maybeBlocks as any) : String(templateContent);
    } else {
      htmlBodyStr = '';
    }

    // Si está habilitado el uso de la API externa, enviar mediante Papalote Mailing API
    if (process.env.USE_EXTERNAL_MAILING_API === 'true') {
      let fromEmail = payload.senderEmail || process.env.DEFAULT_SENDER_EMAIL || '';
      if (!fromEmail) {
        return NextResponse.json(
          { error: 'senderEmail es requerido (o configure DEFAULT_SENDER_EMAIL en el entorno)' },
          { status: 400 }
        );
      }

      // Asegurar dominio permitido para la API externa
      const requiredDomain = '@papalote.org.mx';
      if (!fromEmail.endsWith(requiredDomain) && process.env.DEFAULT_SENDER_EMAIL?.endsWith(requiredDomain)) {
        fromEmail = process.env.DEFAULT_SENDER_EMAIL as string;
      }

      // Validar que hay contactos
      if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
        return NextResponse.json(
          { success: false, error: 'La lista de contactos está vacía o no es válida' },
          { status: 400 }
        );
      }

      // Validar y normalizar correos
      const emailRe = /[^\s@]+@[^\s@]+\.[^\s@]+/;
      
      // Mapear y validar correos, manteniendo la estructura esperada
      const validContacts = contacts
        .filter(contact => {
          // Verificar que el contacto tenga email
          if (!contact || !contact.email) return false;
          
          // Normalizar email
          const email = contact.email.trim().toLowerCase();
          return emailRe.test(email);
        })
        .map(contact => ({
          ...contact,
          email: contact.email.trim().toLowerCase(),
          name: contact.name || contact.nombre_completo || ''
        }));
      
      if (validContacts.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No se encontraron correos electrónicos válidos en la lista de contactos.' 
          }, 
          { status: 400 }
        );
      }

      const recipients = validContacts.map((c: any) => ({
        email: c.email,
        name: c.name,
        templateData: { ...(payload.customData || payload.customFields || {}), ...c },
      }));
      // Enviar en lotes para poder reportar progreso
      const totalRecipients = recipients.length;
      const batches: typeof recipients[] = [];
      for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
        batches.push(recipients.slice(i, i + BATCH_SIZE));
      }

      const campaignId = String(payload.templateId || 'campaign');
      progressStore.init(campaignId, totalRecipients, batches.length);
      progressStore.update(campaignId, { status: 'running', message: 'Envío iniciado (API externa)' });

      let totalSent = 0;
      let totalFailed = 0;
      const details: Array<{ email: string; status: 'sent' | 'failed'; batch: number; error?: string }> = [];

      for (let i = 0; i < batches.length; i++) {
        // Verificar estado antes de procesar cada lote
        let currentProgress = progressStore.get(campaignId);
        while (currentProgress?.status === 'paused') {
          await new Promise(res => setTimeout(res, 5000)); // Esperar 5s y volver a verificar
          currentProgress = progressStore.get(campaignId);
        }

        if (currentProgress?.status === 'cancelled') {
          break; // Salir del bucle si se cancela
        }

        const batch = batches[i];
        try {
          const resp = await sendIndividualEmails({
            recipients: batch,
            subject: payload.subject || 'Sin asunto',
            htmlContent: htmlBodyStr,
            textContent: htmlToText(htmlBodyStr),
            fromEmail,
          });

          if (resp.success) {
            totalSent += batch.length;
            for (const r of batch) details.push({ email: r.email, status: 'sent', batch: i + 1 });
          } else {
            const failed = batch.length;
            totalFailed += failed;
            const errorsMap = new Map<string, string>();
            resp.errors?.forEach(e => errorsMap.set(e.recipient, e.error));
            for (const r of batch) {
              details.push({ email: r.email, status: 'failed', batch: i + 1, error: errorsMap.get(r.email) });
            }
          }
        } catch (e: any) {
          const failed = batch.length;
          totalFailed += failed;
          for (const r of batch) details.push({ email: r.email, status: 'failed', batch: i + 1, error: e?.message || 'Error desconocido' });
        }

        progressStore.update(campaignId, {
          totalSent,
          totalFailed,
          currentBatch: i + 1,
          message: `Procesado lote ${i + 1} de ${batches.length}`,
        });

        if (i < batches.length - 1) {
          await new Promise(res => setTimeout(res, DELAY_BETWEEN_BATCHES));
        }
      }

      progressStore.complete(campaignId, 'Campaña completada (API externa)');

      return NextResponse.json({
        success: true,
        message: `Campaña enviada exitosamente vía API externa. Enviados: ${totalSent}, Fallidos: ${totalFailed}`,
        stats: {
          totalRecipients,
          totalSent,
          totalFailed,
          batchesProcessed: batches.length,
        },
        details,
      });
    }

    // Dividir los contactos en lotes
    const batches = [] as Array<any[]>;
    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
      batches.push(contacts.slice(i, i + BATCH_SIZE));
    }

    const results = [];
    let totalSent = 0;
    let totalFailed = 0;

    // Inicializar progreso
    const campaignId = String(payload.templateId || 'campaign');
    progressStore.init(campaignId, contacts.length, batches.length);
    progressStore.update(campaignId, { status: 'running', message: 'Envío iniciado' });

    // Procesar cada lote con un retraso entre ellos
    for (let i = 0; i < batches.length; i++) {
      // Verificar estado antes de procesar cada lote
      let currentProgress = progressStore.get(campaignId);
      while (currentProgress?.status === 'paused') {
        await new Promise(res => setTimeout(res, 5000)); // Esperar 5s y volver a verificar
        currentProgress = progressStore.get(campaignId);
      }

      if (currentProgress?.status === 'cancelled') {
        break; // Salir del bucle si se cancela
      }

      const batch = batches[i];
      const batchResults = await processBatch(
        batch,
        {
          subject: payload.subject || 'Sin asunto',
          htmlBody: templateContent,
          senderEmail: payload.senderEmail || process.env.DEFAULT_SENDER_EMAIL || '',
          customFields: payload.customData || payload.customFields || {}
        },
        i + 1,
        batches.length
      );

      // Actualizar contadores
      totalSent += batchResults.sent;
      totalFailed += batchResults.failed;
      results.push(...batchResults.details);

      // Actualizar progreso por lote
      progressStore.update(campaignId, {
        totalSent,
        totalFailed,
        currentBatch: i + 1,
        message: `Procesado lote ${i + 1} de ${batches.length}`,
      });

      // Esperar antes del siguiente lote (excepto en el último)
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }
    
    // Completar progreso
    progressStore.complete(campaignId, 'Campaña completada');

    return NextResponse.json({
      success: true,
      message: `Campaña enviada exitosamente. Enviados: ${totalSent}, Fallidos: ${totalFailed}`,
      stats: {
        totalRecipients: contacts.length,
        totalSent,
        totalFailed,
        batchesProcessed: batches.length
      },
      details: results
    });
    
  } catch (error) {
    console.error('Error al enviar la campaña:', error);
    try {
      const campaignId = String((await request.json())?.templateId || 'campaign');
      progressStore.fail(campaignId, error instanceof Error ? error.message : 'Error desconocido');
    } catch {}
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al enviar la campaña',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Función para obtener los destinatarios de una lista
async function getRecipientsFromList(listId: string): Promise<Array<{email: string, name?: string, [key: string]: any}>> {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/contacts/lists/${listId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo obtener la lista de contactos');
    const data = await res.json();
    return data.contacts || [];
  } catch (error) {
    console.error('Error al obtener la lista de contactos:', error);
    return [];
  }
}

// Función para obtener el contenido de una plantilla
async function getTemplateContent(templateId: string): Promise<string | null> {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/templates/${templateId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo obtener la plantilla');
    const data = await res.json();
    return data.content || null;
  } catch (error) {
    console.error('Error al cargar la plantilla:', error);
    return null;
  }
}

// Función para procesar un lote de correos
async function processBatch(
  batch: Array<{email: string, name?: string, [key: string]: any}>,
  campaignData: {
    subject: string;
    htmlBody: string;
    senderEmail: string;
    customFields: Record<string, any>;
  },
  batchNumber: number,
  totalBatches: number
) {
  const results = [];
  let sentCount = 0;
  let failedCount = 0;

  for (const contact of batch) {
    try {
      // Personalizar el contenido para cada contacto (evitar claves duplicadas)
      const dataForTemplate: Record<string, any> = {
        ...campaignData.customFields,
        ...contact,
      };
      if (!dataForTemplate.name) dataForTemplate.name = 'Estimado/a';
      const personalizedBody = personalize(campaignData.htmlBody, dataForTemplate);

      // Enviar el correo individual vía Microsoft Graph
      await sendEmailViaGraph({
        fromEmail: campaignData.senderEmail,
        to: [{ address: contact.email, name: contact.name }],
        subject: campaignData.subject,
        htmlContent: personalizedBody,
      });

      sentCount++;
      results.push({
        email: contact.email,
        status: 'sent',
        batch: batchNumber
      });
    } catch (error) {
      failedCount++;
      results.push({
        email: contact.email,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Error desconocido',
        batch: batchNumber
      });
    }
  }

  console.log(`Lote ${batchNumber} de ${totalBatches} completado. Enviados: ${sentCount}, Fallidos: ${failedCount}`);
  
  return {
    sent: sentCount,
    failed: failedCount,
    details: results
  };
}

export async function GET() {
  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405 }
  );
}
