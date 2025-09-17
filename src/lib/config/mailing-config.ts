// Configuración para el servicio de envío de correos
export const MAILING_CONFIG = {
  // URL base de la API de envío de correos
  API_BASE: process.env.NEXT_PUBLIC_MAILING_API_BASE || 'https://events.papalote.org.mx/api',
  
  // Email predeterminado para el remitente
  DEFAULT_FROM: process.env.NEXT_PUBLIC_DEFAULT_FROM_EMAIL || 'no-reply@papalote.org.mx',
  
  // Tiempo máximo de espera para las peticiones (en milisegundos)
  TIMEOUT: parseInt(process.env.MAILING_TIMEOUT || '30000', 10),
  
  // Número máximo de reintentos en caso de error
  MAX_RETRIES: parseInt(process.env.MAILING_MAX_RETRIES || '3', 10),
  
  // Tiempo de espera entre reintentos (en milisegundos)
  RETRY_DELAY: parseInt(process.env.MAILING_RETRY_DELAY || '1000', 10),
  
  // Habilitar/deshabilitar el modo de prueba (no envía correos reales)
  TEST_MODE: process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_MAILING_TEST_MODE === 'true',
};

// Endpoints de la API (relativos a la URL base)
export const MAILING_ENDPOINTS = {
  // Envío de correos individuales
  SEND_INDIVIDUAL: '/mailing/send',
  
  // Envío de correos masivos
  SEND_BULK: '/mailing/send-bulk',
  
  // Verificación del estado de un envío
  CHECK_STATUS: '/mailing/status',
};

// Configuración de reintentos
export const RETRY_CONFIG = {
  maxRetries: 3,
  delay: 1000,
  onRetry: (error: Error, attempt: number) => {
    console.warn(`Intento ${attempt} fallido. Reintentando...`, error.message);
  },
};

// Configuración de CORS
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400', // 24 horas
};

// Tipos de contenido MIME soportados
export const SUPPORTED_CONTENT_TYPES = [
  'text/plain',
  'text/html',
  'application/json',
];

// Tamaño máximo de archivos adjuntos (10MB)
export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB

// Tipos de archivos adjuntos permitidos
export const ALLOWED_ATTACHMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/csv',
  'text/plain',
];

// Configuración de reintentos para peticiones HTTP
export const HTTP_RETRY_CONFIG = {
  retries: MAILING_CONFIG.MAX_RETRIES,
  retryDelay: (retryCount: number) => {
    // Retry con backoff exponencial
    return Math.min(1000 * Math.pow(2, retryCount), 30000); // Máximo 30 segundos
  },
  retryCondition: (error: any) => {
    // Reintentar en errores de red o códigos 5xx
    return error.code === 'ECONNREFUSED' || 
           error.code === 'ETIMEDOUT' || 
           (error.response && error.response.status >= 500);
  },
};
