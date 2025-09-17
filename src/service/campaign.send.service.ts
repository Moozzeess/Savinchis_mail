// src/service/campaign.send.service.ts
// Servicio (ENVÍO) enfocado en pruebas y envío masivo de campañas vía API real (Microsoft Graph en backend).
// Nota: Operaciones CRUD están en `src/service/campaign.crud.service.ts`.

import { getApiUrl } from '@/lib/utils'

interface SendCampaignParams {
  templateId: string
  recipientListId: string
  subject: string
  senderEmail?: string
  customData?: Record<string, any>
}

interface SendTestEmailParams {
  to: string | string[]
  subject: string
  htmlBody: string
  senderEmail?: string
  attachments?: Array<{ name: string; contentType: string; contentBytes: string }>
}

export async function sendCampaign(params: SendCampaignParams) {
  const base = getApiUrl()
  const response = await fetch(`${base}/api/campaigns/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      templateId: params.templateId,
      recipientListId: params.recipientListId,
      subject: params.subject,
      senderEmail: params.senderEmail,
      customData: params.customData || {},
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Error al enviar la campaña')
  }
  return data
}

export async function sendTestEmail(params: SendTestEmailParams) {
  const base = getApiUrl()
  const response = await fetch(`${base}/api/campaigns/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: params.to,
      subject: params.subject,
      htmlBody: params.htmlBody,
      senderEmail: params.senderEmail,
      attachments: params.attachments,
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const details = Array.isArray(data.details) ? ` | details: ${JSON.stringify(data.details)}` : ''
    const code = data.statusCode ? ` [${data.statusCode}]` : ''
    throw new Error((data.error || data.message || 'Error al enviar el correo de prueba') + code + details)
  }
  return data
}
