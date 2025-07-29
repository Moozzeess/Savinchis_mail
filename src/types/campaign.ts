export interface Campaign {
    id?: string;
    name: string;
    description?: string;
    objective: 'promotional' | 'newsletter' | 'announcement' | 'event' | 'welcome' | 'other';
    subject: string;
    emailBody: string;
    fromName: string;
    fromEmail: string;
    replyTo?: string;
    contactList: string;
    contactListName?: string;
    totalRecipients?: number;
    scheduledAt?: string | null;
    timeZone?: string;
    useOptimalTime?: boolean;
    status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    createdAt?: string;
    updatedAt?: string;
  }
  
  export type CampaignFormData = Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>;