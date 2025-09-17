import { useState } from 'react';
import { campaignService } from '@/services/campaignService';

type SendStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseCampaignSenderReturn {
  sendCampaign: (params: {
    templateId: string;
    recipientListId: string;
    subject: string;
    senderEmail?: string;
    customData?: Record<string, any>;
  }) => Promise<void>;
  sendTestEmail: (params: {
    to: string | string[];
    subject: string;
    htmlBody: string;
    senderEmail?: string;
  }) => Promise<void>;
  status: SendStatus;
  error: string | null;
  reset: () => void;
}

export function useCampaignSender(): UseCampaignSenderReturn {
  const [status, setStatus] = useState<SendStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setStatus('idle');
    setError(null);
  };

  const sendCampaign = async (params: {
    templateId: string;
    recipientListId: string;
    subject: string;
    senderEmail?: string;
    customData?: Record<string, any>;
  }) => {
    setStatus('loading');
    setError(null);

    try {
      await campaignService.sendCampaign({
        templateId: params.templateId,
        recipientListId: params.recipientListId,
        subject: params.subject,
        senderEmail: params.senderEmail,
        customData: params.customData,
      });
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al enviar la campaña');
      setStatus('error');
      throw err;
    }
  };

  const sendTestEmail = async (params: {
    to: string | string[];
    subject: string;
    htmlBody: string;
    senderEmail?: string;
  }) => {
    setStatus('loading');
    setError(null);

    try {
      await campaignService.sendTestEmail({
        to: params.to,
        subject: params.subject,
        htmlBody: params.htmlBody,
        senderEmail: params.senderEmail,
      });
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al enviar el correo de prueba');
      setStatus('error');
      throw err;
    }
  };

  return {
    sendCampaign,
    sendTestEmail,
    status,
    error,
    reset,
  };
}
