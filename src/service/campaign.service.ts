// src/services/campaign.service.ts
import { Campaign } from '@/types/campaign';

export const createCampaign = async (campaign: Campaign): Promise<Campaign> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...campaign,
        id: campaign.id || Date.now().toString(),
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }, 1000);
  });
};