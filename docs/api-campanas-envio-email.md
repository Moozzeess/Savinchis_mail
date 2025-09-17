# API de Envío de Campañas (Microsoft Graph)

Este documento describe el funcionamiento, activación y estados de la API de envío de correos en Savinchis_mail, integrada con Microsoft Graph para ejecución real.

- Directorio clave: `src/lib/graph-email.ts`
- Endpoints:
  - `POST /api/campaigns/test`
  - `POST /api/campaigns/send`
- Servicio frontend: `src/service/campaign.send.service.ts`
- UI relacionada:
  - Diálogo: `src/components/campaign/send-campaign-dialog.tsx`
  - Página detalle: `src/app/(main)/campaign/[id]/page.tsx`

## 1) Autenticación y dependencias

- La autenticación se realiza con credenciales de aplicación (Client Credentials) contra Microsoft Graph.
- Archivo: `src/lib/graph-email.ts`
- Dependencias:
  - `@azure/identity`
  - `@microsoft/microsoft-graph-client`
  - `isomorphic-fetch`

Variables de entorno requeridas:
- `AZURE_TENANT_ID`: ID del tenant de Azure AD
- `AZURE_CLIENT_ID`: Client ID de la App Registration
- `AZURE_CLIENT_SECRET`: Secreto del cliente

Opcionales para URLs:
- `NEXT_PUBLIC_SITE_URL` | `APP_URL` | `VERCEL_URL` (para construir URL base en SSR)
- `DEFAULT_SENDER_EMAIL` (fallback si no se envía desde el cliente)

Permisos en Azure AD:
- Application permission: `Mail.Send`
- Conceder consentimiento de administrador ("Grant admin consent").
- El buzón (`senderEmail`) debe existir y tener licencia para enviar.

## 2) Flujo general y activación desde la UI

- En la página de detalle de campaña `src/app/(main)/campaign/[id]/page.tsx` existe un botón "Enviar campaña" (paso de revisión).
- Al pulsar, se abre el `SendCampaignDialog` que permite:
  - Enviar correo de prueba (endpoint `/api/campaigns/test`)
  - Envío masivo a todos los destinatarios (endpoint `/api/campaigns/send`)
- La UI actualiza estados de campaña y muestra progreso/acciones (pausar, cancelar, reanudar).

Estados de campaña (BD → UI):
- `borrador` → `draft`
- `programada` → `scheduled`
- `en_progreso` → `sending`
- `completada` → `completed`
- `pausada` → `paused`
- `cancelada` → `cancelled`

Estos estados se mapean en `mapStatusToUi()` dentro de `page.tsx` y se actualizan en BD mediante `updateCampaignStatus()`.

## 3) Endpoint: POST /api/campaigns/test

Uso: enviar uno o varios correos de prueba de forma real via Microsoft Graph.

- Archivo: `src/app/api/campaigns/test/route.ts`
- Llama a: `sendEmailViaGraph()` de `src/lib/graph-email.ts`

Body esperado:
```json
{
  "to": ["usuario@dominio.com"],
  "subject": "Prueba Graph real",
  "htmlBody": "<h1>Hola {{name}}</h1><p>Esto es una prueba real con Microsoft Graph.</p>",
  "senderEmail": "buzon@tu-dominio.com",
  "attachments": [
    {
      "name": "certificado.pdf",
      "contentType": "application/pdf",
      "contentBytes": "BASE64"
    }
  ]
}
```
Notas:
- `to` puede ser `string` o `string[]`. Se envía un mensaje por destinatario.
- `attachments` es opcional. `contentBytes` debe ir en base64.

Respuesta (200):
```json
{
  "success": true,
  "message": "Correos de prueba enviados. Enviados: 1, Fallidos: 0",
  "details": [
    { "email": "usuario@dominio.com", "success": true }
  ]
}
```

## 4) Endpoint: POST /api/campaigns/send

Uso: envío de campaña masivo por lotes con personalización por contacto.

- Archivo: `src/app/api/campaigns/send/route.ts`
- Llama a: `sendEmailViaGraph()` de `src/lib/graph-email.ts`
- Obtiene datos auxiliares de:
  - `GET /api/templates/:id` → contenido HTML
  - `GET /api/contacts/lists/:id` → `{ contacts: [{ email, name? }, ...] }`
- Lógica de lotes: `BATCH_SIZE = 100`, `10s` entre lotes.

Body esperado:
```json
{
  "templateId": "template-1",
  "recipientListId": "lista-123",
  "subject": "Campaña real con Graph",
  "senderEmail": "buzon@tu-dominio.com",
  "customData": { "eventName": "Conferencia 2025" }
}
```

Personalización de plantilla:
- `src/lib/graph-email.ts` expone `personalize(template, data)`.
- Reemplaza `{{clave}}` con el valor de `data[clave]`.
- En el envío masivo, `data = { ...customData, ...contact }`.
- Ejemplos de variables soportadas: `{{name}}`, `{{email}}`, y cualquier campo extra del contacto o de `customData`.

Respuesta (200):
```json
{
  "success": true,
  "message": "Campaña enviada exitosamente. Enviados: N, Fallidos: M",
  "stats": {
    "totalRecipients": 250,
    "totalSent": 240,
    "totalFailed": 10,
    "batchesProcessed": 3
  },
  "details": [
    { "email": "a@dominio.com", "status": "sent", "batch": 1 },
    { "email": "b@dominio.com", "status": "failed", "error": "...", "batch": 1 }
  ]
}
```

## 5) Servicio frontend (`campaignService`)

Archivo: `src/services/campaignService.ts`

- `sendCampaign({ templateId, recipientListId, subject, senderEmail?, customData? })`
  - Llama a `POST /api/campaigns/send`
- `sendTestEmail({ to, subject, htmlBody, senderEmail? })`
  - Llama a `POST /api/campaigns/test`
- `getTemplateContent(templateId)` y `getCampaignRecipients(listId)` consumen los endpoints internos de plantillas y contactos.

## 6) UI de envío (`SendCampaignDialog`)

Archivo: `src/components/campaign/send-campaign-dialog.tsx`

- Envío de prueba → `campaignService.sendTestEmail()`
- Envío masivo → `campaignService.sendCampaign()`
- Muestra toasts de éxito/error con `useToast()`.
- Integrado en `src/app/(main)/campaign/[id]/page.tsx`.

## 7) Plantillas, imágenes y certificados

- Compatibilidad con el manejo de imágenes descrito para certificados:
  - Almacenar `content.src` con nombre de archivo y `content.imageData` con los datos completos.
  - `TemplatePreview` soporta Data URLs y rutas.
  - Las imágenes por ruta se cargan vía `/api/templates/load`.
- El endpoint `/api/campaigns/send` obtiene el HTML de plantilla desde `/api/templates/:id`, por lo que el mismo flujo de imágenes aplica.

## 8) Comprobaciones y errores comunes

- 401/`invalid_client`: Revisar `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` y consent.
- 403/`forbidden`: Verificar que el buzón `senderEmail` existe y tiene licencia; la app tiene `Mail.Send` con admin consent.
- 404 de plantilla/lista: Asegurar que existen los endpoints internos y que devuelven contenido `content` y `contacts` respectivamente.
- Adjuntos: `test` soporta adjuntos. Para adjuntos en envío masivo, puede extenderse el endpoint.

## 9) Ejemplos de prueba (curl)

- Enviar prueba:
```bash
curl -X POST "$BASE_URL/api/campaigns/test" \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["usuario@dominio.com"],
    "subject": "Prueba Graph real",
    "htmlBody": "<h1>Hola {{name}}</h1><p>Esto es una prueba real con Microsoft Graph.</p>",
    "senderEmail": "buzon@tu-dominio.com"
  }'
```

- Enviar masivo:
```bash
curl -X POST "$BASE_URL/api/campaigns/send" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "template-1",
    "recipientListId": "lista-123",
    "subject": "Campaña real con Graph",
    "senderEmail": "buzon@tu-dominio.com",
    "customData": { "eventName": "Conferencia 2025" }
  }'
```
