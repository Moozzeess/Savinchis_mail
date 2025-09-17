// src/lib/mailing-api.ts
// Cliente para consumir la API externa de Papalote Events Mailing
// Documentación OpenAPI: https://events.papalote.org.mx/api-json (endpoint POST /mailing/send)

export interface EmailRecipient {
  email: string;
  name?: string;
  templateData?: Record<string, any>;
}

export async function sendBulkEmail(payload: SendEmailDto): Promise<SendBulkEmailResponse> {
  // Según Swagger: POST /mailing/send-bulk con cuerpo SendEmailDto
  const base = getMailingApiBase();
  const endpoint = `${base}/mailing/send-bulk`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    // Enviar exactamente el esquema SendEmailDto
    body: JSON.stringify({
      recipients: payload.recipients,
      subject: payload.subject,
      htmlContent: payload.htmlContent,
      textContent: payload.textContent,
      fromEmail: payload.fromEmail,
      attachments: payload.attachments,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      success: false,
      statusCode: data?.statusCode || res.status,
      message: data?.message || 'Solicitud rechazada por la API externa',
    };
  }

  return {
    success: Boolean(data?.success ?? true),
    messageId: data?.messageId,
    statusCode: res.status,
    message: data?.message,
  };
}

export interface EmailAttachmentDto {
  name: string;
  contentType: string;
  contentBytes: string; // Base64
}

export interface SendEmailDto {
  recipients: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  fromEmail?: string;
  attachments?: EmailAttachmentDto[];
}

export interface SendEmailResponse {
  success: boolean;
  messageIds?: string[]; // Ej: ["Sent to user1@example.com", ...]
  errors?: Array<{ recipient: string; error: string }>;
  statusCode?: number;
  message?: string;
}

export interface SendBulkEmailResponse {
  success: boolean;
  messageId?: string; // Ej: "Bulk email sent to 5 recipients"
  statusCode?: number;
  message?: string;
}

function getMailingApiBase() {
  // URL base sin documentación
  let base = 'https://events.papalote.org.mx';
  
  // Eliminar cualquier fragmento después de #
  if (process.env.MAILING_API_BASE) {
    base = process.env.MAILING_API_BASE.split('#')[0];
  }
  
  // Asegurar que no termine con /
  base = base.replace(/\/$/, '');
  
  // No forzar /api ya que la ruta completa se maneja en los endpoints
  console.log('Usando URL base de la API:', base);
  return base;
}

function getApiUrl(path: string): string {
  // En el navegador, usar ruta relativa
  if (typeof window !== 'undefined') {
    return path;
  }
  
  // En el servidor, construir URL absoluta
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const fullUrl = `${baseUrl.replace(/\/$/, '')}${path}`;
  console.log('URL base construida:', fullUrl);
  return fullUrl;
}

export async function sendIndividualEmails(payload: SendEmailDto): Promise<SendEmailResponse> {
  // Según Swagger: POST /mailing/send con cuerpo SendEmailDto
  const base = getMailingApiBase();
  const endpoint = `${base}/mailing/send`;
  console.log('Enviando a:', endpoint);
  
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      // Enviar exactamente el esquema SendEmailDto
      body: JSON.stringify({
        recipients: payload.recipients,
        subject: payload.subject,
        htmlContent: payload.htmlContent,
        textContent: payload.textContent,
        fromEmail: payload.fromEmail,
        attachments: payload.attachments,
      }),
    });

    // Intentar parsear JSON aun en errores
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('Error en la respuesta de la API:', {
        status: res.status,
        statusText: res.statusText,
        data
      });
      
      // Normalizar respuesta de error al formato esperado
      const details = (data?.details || data?.errors || []) as Array<{ recipient?: string; error?: string }>;
      return {
        success: false,
        messageIds: [],
        errors: details.map((d) => ({ recipient: d.recipient || 'unknown', error: d.error || data?.message || 'Error desconocido' })),
        statusCode: data?.statusCode || res.status,
        message: data?.message || 'Error al enviar el correo',
      };
    }

    return {
      success: Boolean(data?.success ?? true),
      messageIds: data?.messageIds || [],
      errors: data?.errors || [],
      statusCode: res.status,
      message: data?.message,
    };
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return {
      success: false,
      messageIds: [],
      errors: [{ recipient: 'all', error: 'Error de conexión con el servidor' }],
      statusCode: 500,
      message: 'No se pudo conectar con el servidor de correo',
    };
  }
}
