// src/service/campaign.service.ts
import { Campaign, CampaignFormData } from '@/types/campaign';

interface CreateCampaignResponse {
  success: boolean;
  message: string;
  campaign?: Campaign;
}

interface SendCampaignResponse {
  success: boolean;
  message: string;
  stats?: {
    totalRecipients: number;
    totalSent: number;
    totalFailed: number;
    batchesProcessed: number;
  };
  details?: Array<{
    email: string;
    status: 'sent' | 'failed';
    batch?: number;
    error?: string;
  }>;
}

export const createCampaign = async (
  campaignData: CampaignFormData
): Promise<CreateCampaignResponse> => {
  try {
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaignData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al crear la campaña');
    }

    const result = await response.json();
    
    return {
      success: true,
      message: 'Campaña creada exitosamente',
      campaign: result.data
    };
  } catch (error) {
    console.error('Error creating campaign:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error al crear la campaña'
    };
  }
};

// Función para obtener campañas
export const getCampaigns = async (
  page: number = 1, 
  limit: number = 10
): Promise<{ data: Campaign[]; total: number }> => {
  try {
    const response = await fetch(`/api/campaigns?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Error al obtener las campañas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return { data: [], total: 0 };
  }
};

/**
 * Envía un correo de prueba de la campaña
 * @param payload Datos del correo de prueba
 * @returns Resultado del envío
 */
export const sendTestCampaign = async (payload: {
  subject: string;
  htmlBody: string;
  senderEmail: string;
  templateId: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('/api/campaigns/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al enviar el correo de prueba');
    }

    return {
      success: true,
      message: data.message || 'Correos de prueba enviados exitosamente'
    };
  } catch (error) {
    console.error('Error sending test campaign:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error al enviar el correo de prueba'
    };
  }
};

/**
 * Envía una campaña a los destinatarios
 * @param payload Datos de la campaña a enviar
 * @returns Resultado del envío
 */
export const sendCampaignToRecipients = async (payload: {
  subject: string;
  htmlBody: string;
  senderEmail: string;
  templateId: string;
  recipientListId: string;
  customFields?: Record<string, any>;
}): Promise<SendCampaignResponse> => {
  try {
    const response = await fetch('/api/campaigns/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al enviar la campaña');
    }

    return {
      success: true,
      message: data.message || 'Campaña enviada exitosamente',
      stats: data.stats,
      details: data.details
    };
  } catch (error) {
    console.error('Error sending campaign:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error al enviar la campaña'
    };
  }
};