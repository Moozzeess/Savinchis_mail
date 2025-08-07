// src/service/campaign.service.ts
import { Campaign, CampaignFormData } from '@/types/campaign';

interface CreateCampaignResponse {
  success: boolean;
  message: string;
  campaign?: Campaign;
}

export const createCampaign = async (
  campaignData: CampaignFormData & { fromEmail: string }
): Promise<CreateCampaignResponse> => {
  try {
    // Aquí iría la llamada real a la API
    const newCampaign: Campaign = {
      ...campaignData,
      id: Date.now().toString(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Simulamos un retraso de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Campaña creada exitosamente',
      campaign: newCampaign
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