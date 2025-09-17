import { getApiUrl } from '@/lib/utils';
import { sendCampaign as sendCampaignFn, sendTestEmail as sendTestEmailFn } from '@/service/campaign.send.service';

interface SendCampaignParams {
  templateId: string;
  recipientListId: string;
  subject: string;
  senderEmail?: string;
  customData?: Record<string, any>;
}

interface SendTestEmailParams {
  to: string | string[];
  subject: string;
  htmlBody: string;
  senderEmail?: string;
}

export class CampaignService {
  private static instance: CampaignService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = getApiUrl();
  }

  public static getInstance(): CampaignService {
    if (!CampaignService.instance) {
      CampaignService.instance = new CampaignService();
    }
    return CampaignService.instance;
  }

  /**
   * Envía una campaña de correo electrónico
   * @param params Parámetros para el envío de la campaña
   * @returns Resultado del envío
   */
  public async sendCampaign(params: SendCampaignParams) {
    // Delegamos al servicio canónico para evitar duplicidad y mantener una única lógica
    return await sendCampaignFn(params);
  }

  /**
   * Envía un correo de prueba
   * @param params Parámetros para el correo de prueba
   * @returns Resultado del envío
   */
  public async sendTestEmail(params: SendTestEmailParams) {
    // Delegamos al servicio canónico para evitar duplicidad y mantener una única lógica
    return await sendTestEmailFn(params);
  }

  /**
   * Obtiene el contenido de una plantilla por su ID
   * @param templateId ID de la plantilla
   * @returns Contenido de la plantilla
   */
  public async getTemplateContent(templateId: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/templates/${templateId}`);
    
    if (!response.ok) {
      throw new Error('No se pudo cargar la plantilla');
    }
    
    const data = await response.json();
    return data.content;
  }

  /**
   * Obtiene la lista de contactos para una campaña
   * @param listId ID de la lista de contactos
   * @returns Lista de contactos
   */
  public async getCampaignRecipients(listId: string): Promise<Array<{email: string, name?: string}>> {
    const response = await fetch(`${this.baseUrl}/api/contacts/lists/${listId}`);
    
    if (!response.ok) {
      throw new Error('No se pudo cargar la lista de contactos');
    }
    
    const data = await response.json();
    return data.contacts || [];
  }
}

export const campaignService = CampaignService.getInstance();
