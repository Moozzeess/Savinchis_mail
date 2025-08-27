export interface CampaignStats {
  sent?: number;
  delivered?: number;
  opened?: number;
  clicked?: number;
  bounced?: number;
  complained?: number;
  failed?: number;
}

export interface Campaign {
  id: string | number;
  name: string;
  description?: string;
  objective: 'promotional' | 'newsletter' | 'announcement' | 'event' | 'welcome' | 'other';
  subject: string;
  emailBody: string;
  fromEmail: string;
  replyTo?: string;
  contactListId?: string | number | null;
  contactListName?: string;
  totalRecipients: number;
  scheduledAt?: string | null;
  timeZone?: string;
  useOptimalTime?: boolean;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'paused' | 'completed';
  stats?: CampaignStats;
  createdAt: string;
  updatedAt?: string;
}

export type CampaignFormData = Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>;