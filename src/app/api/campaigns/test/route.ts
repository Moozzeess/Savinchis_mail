import { NextResponse } from 'next/server';
import { sendEmailViaGraph } from '@/lib/graph-email';
import { sendIndividualEmails } from '@/lib/mailing-api';
import fs from 'node:fs/promises';
import path from 'node:path';

// Conversión simple de HTML a texto plano para textContent (evita dependencias externas)
function htmlToText(html: string): string {
  if (!html) return '';
  // Quitar scripts y estilos
  let text = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
                 .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
  // Reemplazar saltos básicos
  text = text.replace(/<br\s*\/?>(?=\s*\n?)/gi, '\n')
             .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n');
  // Quitar el resto de etiquetas
  text = text.replace(/<[^>]+>/g, '');
  // Decodificación mínima de entidades comunes
  text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  // Normalizar espacios
  return text.replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export async function POST(request: Request) {
  try {
    const { to, subject, htmlBody, senderEmail, attachments, campaignPath } = await request.json();

    // Fallback a DEFAULT_SENDER_EMAIL si no se envía desde el cliente
    const fromEmail = senderEmail || process.env.DEFAULT_SENDER_EMAIL || '';
    if (!fromEmail) {
      return NextResponse.json(
        { success: false, error: 'senderEmail es requerido (o configure DEFAULT_SENDER_EMAIL en el entorno)' },
        { status: 400 }
      );
    }

    const recipients: string[] = Array.isArray(to) ? to : (to ? [to] : []);
    if (recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Debe especificar al menos un destinatario en to' },
        { status: 400 }
      );
    }

    // Si está habilitado el uso de la API externa, usarla
    if (process.env.USE_EXTERNAL_MAILING_API === 'true') {
      // Validar/normalizar remitente: la API externa espera dominio papalote.org.mx
      let extFrom = fromEmail;
      const requiredDomain = '@papalote.org.mx';
      if (!extFrom.endsWith(requiredDomain)) {
        if (process.env.DEFAULT_SENDER_EMAIL?.endsWith(requiredDomain)) {
          extFrom = process.env.DEFAULT_SENDER_EMAIL as string;
        } else {
          return NextResponse.json({ success: false, error: `senderEmail debe pertenecer al dominio ${requiredDomain}` }, { status: 400 });
        }
      }

      // Validar formato de correos
      const emailRe = /[^\s@]+@[^\s@]+\.[^\s@]+/;
      
      // Normalizar correos y remover duplicados
      const normalizedRecipients = recipients
        .map(email => email?.trim().toLowerCase())
        .filter(email => emailRe.test(email));
      
      if (normalizedRecipients.length === 0) {
        return NextResponse.json({ 
          success: false, 
          error: 'No hay direcciones de correo válidas para enviar.' 
        }, { status: 400 });
      }
      
      // Para pruebas, permitir que el remitente sea el destinatario
      const validRecipients = [...new Set(normalizedRecipients)]; // Eliminar duplicados

      // Si no se proporcionó htmlBody, intentar cargar HTML desde archivo de campaña
      let finalHtmlBody = htmlBody || '';
      let usedCampaignFile: string | undefined;
      if (!finalHtmlBody && campaignPath) {
        try {
          const campaignsDir = path.join(process.cwd(), 'storage', 'campaigns');
          // Normalizar y asegurar que el archivo está bajo storage/campaigns
          const normalized = path.normalize(campaignPath).replace(/^([./\\])+/, '');
          const resolvedPath = path.join(campaignsDir, normalized);
          if (!resolvedPath.startsWith(campaignsDir)) {
            return NextResponse.json({ success: false, error: 'Ruta de campaña inválida' }, { status: 400 });
          }
          finalHtmlBody = await fs.readFile(resolvedPath, 'utf8');
          usedCampaignFile = path.relative(process.cwd(), resolvedPath);
        } catch (e) {
          return NextResponse.json({ success: false, error: 'No se pudo leer el archivo de campaña especificado' }, { status: 400 });
        }
      }

      // textContent como respaldo (texto plano)
      const textContent = htmlToText(finalHtmlBody || '');

      const externalPayload = {
        recipients: validRecipients.map((email) => {
          // Asegurar que el correo esté en minúsculas
          const normalizedEmail = email.toLowerCase().trim();
          return {
            email: normalizedEmail,
            name: 'Prueba',
            templateData: {
              isTestEmail: true,
              testRecipient: normalizedEmail === extFrom.toLowerCase() ? 'sender' : 'external',
              // Incluir datos adicionales para depuración
              _debug: {
                sender: extFrom,
                subject: subject || 'Sin asunto',
                timestamp: new Date().toISOString()
              }
            },
          };
        }),
        subject: subject || 'Sin asunto',
        htmlContent: finalHtmlBody || '',
        textContent: textContent || '', // No usar undefined para evitar problemas de serialización
        fromEmail: extFrom,
        attachments: Array.isArray(attachments) ? attachments : [],
        // Añadir metadatos adicionales para la API
        metadata: {
          source: 'savinchis-mail',
          testMode: true,
          clientVersion: process.env.npm_package_version || '1.0.0'
        }
      };

      console.log('Enviando correo de prueba a la API externa:', {
        from: externalPayload.fromEmail,
        to: externalPayload.recipients.map(r => r.email),
        subject: externalPayload.subject,
        hasHtml: !!finalHtmlBody,
        hasText: !!textContent,
        hasAttachments: externalPayload.attachments?.length > 0,
        campaignFile: usedCampaignFile || null
      });

      let resp;
      try {
        resp = await sendIndividualEmails(externalPayload);
        
        console.log('Respuesta de la API externa:', {
          success: resp.success,
          statusCode: resp.statusCode,
          message: resp.message,
          errorCount: resp.errors?.length || 0
        });

        if (!resp.success) {
          console.error('Error en la API externa:', {
            errors: resp.errors,
            statusCode: resp.statusCode,
            requestPayload: {
              from: externalPayload.fromEmail,
              to: externalPayload.recipients.map(r => r.email),
              subject: externalPayload.subject
            }
          });

          return NextResponse.json(
            {
              success: false,
              error: resp.message || 'Error al enviar el correo de prueba vía API externa',
              details: resp.errors || [],
              statusCode: resp.statusCode || 500
            },
            { status: resp.statusCode || 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: `Correo de prueba enviado correctamente a ${resp.messageIds?.length ?? 1} destinatario(s)`,
          messageIds: resp.messageIds
        });

      } catch (error) {
        console.error('Error inesperado al enviar correo de prueba:', error);
        return NextResponse.json(
          {
            success: false,
            error: 'Error inesperado al procesar la solicitud',
            details: error instanceof Error ? error.message : String(error)
          },
          { status: 500 }
        );
      }

    }

    // En caso contrario, fallback al envío directo vía Microsoft Graph
    const results: Array<{ email: string; success: boolean; error?: string }> = [];
    for (const email of recipients) {
      try {
        await sendEmailViaGraph({
          fromEmail,
          to: [{ address: email }],
          subject: subject || 'Sin asunto',
          htmlContent: htmlBody || '',
          attachments,
        });
        results.push({ email, success: true });
      } catch (e) {
        results.push({ email, success: false, error: e instanceof Error ? e.message : 'Error desconocido' });
      }
    }

    const sent = results.filter(r => r.success).length;
    const failed = results.length - sent;

    return NextResponse.json({
      success: true,
      message: `Correos de prueba enviados. Enviados: ${sent}, Fallidos: ${failed}`,
      details: results,
    });
    
  } catch (error) {
    console.error('Error al enviar el correo de prueba:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al enviar el correo de prueba',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405 }
  );
}
