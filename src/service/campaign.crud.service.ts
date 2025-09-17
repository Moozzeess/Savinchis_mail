// src/service/campaign.crud.service.ts
// Servicio (CRUD) enfocado en creación y consulta de campañas.
// Nota: Las operaciones de envío se encuentran en `src/service/campaign.send.service.ts`.

import type { Campaign } from '@/types/campaign'

interface CreateCampaignResponse {
  success: boolean;
  message: string;
  campaign?: Campaign;
}

export const createCampaign = async (
  campaignData: any
): Promise<CreateCampaignResponse> => {
  try {
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      campaign: result.data,
    };
  } catch (error) {
    console.error('Error creating campaign:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error al crear la campaña',
    };
  }
};

export const getCampaigns = async (
  page: number = 1,
  limit: number = 10
): Promise<{ data: Campaign[]; total: number }> => {
  try {
    const response = await fetch(`/api/campaigns?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Error al obtener las campañas');
    return await response.json();
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return { data: [], total: 0 };
  }
};
