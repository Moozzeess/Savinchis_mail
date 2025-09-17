import { NextResponse } from 'next/server';
import { 
  MAILING_CONFIG, 
  MAILING_ENDPOINTS, 
  CORS_HEADERS,
  HTTP_RETRY_CONFIG
} from '@/lib/config/mailing-config';

// Interfaces para los tipos de datos
interface EmailRecipient {
  email: string;
  name?: string;
  templateData?: Record<string, unknown>;
}

interface EmailAttachment {
  name: string;
  contentType: string;
  contentBytes: string; // Base64
  contentId?: string;
  disposition?: 'inline' | 'attachment';
}

interface EmailPayload {
  fromEmail?: string;
  recipients: EmailRecipient[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  attachments?: EmailAttachment[];
}

// Forzar que esta ruta se ejecute en el servidor
export const dynamic = 'force-dynamic';

// Configuración de la ruta para Next.js 13+
export const runtime = 'nodejs';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
    responseLimit: '10mb',
  },
};

// Obtener la URL completa del endpoint
function getFullEndpoint(endpoint: string): string {
  const base = MAILING_CONFIG.API_BASE.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

console.log('Ruta /api/mailing/send cargada correctamente');

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: new Headers(CORS_HEADERS)
  });
}

export async function POST(req: Request) {
  // Configurar CORS
  const headers = new Headers(CORS_HEADERS);

  try {
    // Leer y validar el cuerpo de la petición
    const body = await req.json().catch(() => ({}));
    const payload: EmailPayload = {
      ...body,
      recipients: Array.isArray(body.recipients) ? body.recipients : [],
      attachments: Array.isArray(body.attachments) ? body.attachments : []
    };
    
    console.log('Recibida petición a /api/mailing/send con datos:', {
      from: payload.fromEmail,
      to: payload.recipients.map(r => r.email),
      subject: payload.subject,
      hasHtml: !!payload.htmlContent,
      hasText: !!payload.textContent,
      hasAttachments: (payload.attachments?.length ?? 0) > 0
    });

    // Preparar el payload para la API de Papalote
    // Validar datos requeridos
    if (!payload.recipients || !Array.isArray(payload.recipients) || payload.recipients.length === 0) {
      throw new Error('Se requiere al menos un destinatario');
    }

    // Preparar el payload según la documentación de la API
    const papapalotePayload = {
      from: payload.fromEmail || process.env.DEFAULT_FROM_EMAIL || 'no-reply@papalote.org.mx',
      recipients: payload.recipients.map((r) => ({
        email: r.email,
        name: r.name || r.email.split('@')[0],
        templateData: r.templateData || {}
      })),
      subject: payload.subject || 'Sin asunto',
      htmlContent: payload.htmlContent || '',
      textContent: payload.textContent || '',
      // Incluir attachments si están presentes
      ...(payload.attachments && payload.attachments.length > 0 && { 
        attachments: payload.attachments 
      })
    };

    // Determinar el endpoint a utilizar
    const useBulk = payload.recipients.length > 1;
    const endpoint = useBulk ? MAILING_ENDPOINTS.SEND_BULK : MAILING_ENDPOINTS.SEND_INDIVIDUAL;
    const apiUrl = getFullEndpoint(endpoint);
    
    console.log(`Enviando correo ${useBulk ? 'masivo' : 'individual'} a la API externa:`, {
      from: papapalotePayload.from,
      to: papapalotePayload.recipients.map(r => r.email),
      subject: papapalotePayload.subject,
      hasHtml: !!papapalotePayload.htmlContent,
      hasText: !!papapalotePayload.textContent,
hasAttachments: (papapalotePayload.attachments?.length ?? 0) > 0
    });
    
    // No se requiere validación de API_KEY ya que la autenticación se maneja desde el navegador
    
    console.log(`Enviando a: ${apiUrl}`, papapalotePayload);
    
    console.log(`Enviando a: ${apiUrl}`, papapalotePayload);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Client-Version': '1.0.0',
        'X-Request-ID': crypto.randomUUID()
      },
      // Usar AbortController para manejar timeouts
      signal: AbortSignal.timeout(MAILING_CONFIG.TIMEOUT),
      body: JSON.stringify(papapalotePayload),
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      console.error('Error al analizar la respuesta de la API:', e);
      throw new Error('Respuesta inválida del servidor de correo');
    }

    // Log de depuración
    console.log('Respuesta de la API externa:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });

    if (!response.ok) {
      console.error('Error en la respuesta de la API:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      
      // Intentar extraer mensaje de error de la respuesta
      const errorMessage = responseData?.message || 
                          responseData?.error?.message || 
                          'Error desconocido al enviar el correo';
      
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }

    if (!response.ok) {
      console.error('Error al enviar el correo:', responseData);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error al enviar el correo',
          error: responseData.message || 'Error desconocido',
          statusCode: response.status
        },
        { status: response.status }
      );
    }

    // Retornar la respuesta de la API de Papalote
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: 'Correo enviado exitosamente',
        ...responseData
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS
        }
      }
    );

  } catch (error) {
    console.error('Error en /api/mailing/send:', error);
    
    // Determinar el código de estado y mensaje de error apropiados
    let status = 500;
    let message = 'Error interno del servidor';
    
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        status = 504; // Gateway Timeout
        message = 'La solicitud ha excedido el tiempo de espera';
      } else if (error.message.includes('clave de API')) {
        status = 500; // Internal Server Error
        message = 'Error de configuración del servidor';
      } else {
        message = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message,
        error: error instanceof Error ? error.message : 'Error desconocido',
        statusCode: status
      },
      { 
        status,
        headers: new Headers({
          ...CORS_HEADERS,
          'Cache-Control': 'no-store, max-age=0',
          'X-Error-Type': 'mailing_error'
        })
      }
    );
  }
}
