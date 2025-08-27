'use server';

import { revalidatePath } from 'next/cache';
import { getDbConnection } from '../DBConnection';

/**
 * @interface CampaignData
 * @description Interfaz para la estructura de datos de la campaña
 */
interface CampaignData {
 name: string;
 description?: string;
 objective: string;
 templateId?: number | null;
 subject: string;
 emailBody: string;
 fromName: string;
 fromEmail: string;
 replyTo?: string;
 scheduleDate?: string | null;
 scheduleTime?: string | null;
 contactListId?: number | null;
 status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled' | 'failed' | 'paused' | 'completed';
 isRecurring?: boolean;
 recurrenceType?: 'diaria' | 'semanal' | 'mensual' | 'anual' | null;
 recurrenceInterval?: number | null;
 recurrenceDaysOfWeek?: string | null;
 recurrenceDayOfMonth?: number | null;
 recurrenceStartDate?: string | null;
 recurrenceEndDate?: string | null;
}

interface DBCampaign extends Record<string, any> {
 id_campaign: number;
 nombre_campaign: string;
 descripcion?: string;
 asunto: string;
 contenido?: string;
 from_email?: string;
 reply_to?: string;
 id_lista_contactos?: number;
 nombre_lista?: string;
 total_recipients?: number;
 fecha_envio?: string | null;
 estado: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled' | 'failed' | 'paused' | 'completed';
 fecha_creacion: string;
 fecha_actualizacion: string;
 total_enviados?: number;
 total_entregados?: number;
 total_aperturas?: number;
 total_clics?: number;
 total_rebotados?: number;
 total_quejas?: number;
 total_fallidos?: number;
}


/**
 * @function createCampaign
 * @description Crea una nueva campaña en la base de datos y la asocia a una plantilla y lista de contactos opcionales.
 * La función maneja una transacción para asegurar la integridad de los datos.
 * Revalida la ruta '/campaigns' después de una inserción exitosa para actualizar el caché.
 * @param {object} campaignData - Objeto con los datos de la campaña a crear.
 * @param {string} campaignData.name - El nombre de la campaña.
 * @param {string} [campaignData.description] - Una descripción opcional de la campaña.
 * @param {string} campaignData.objective - El objetivo de la campaña (campo `objective` en la interfaz, pero no se usa en el SQL).
 * @param {number} [campaignData.templateId] - El ID de la plantilla de correo electrónico asociada.
 * @param {string} campaignData.subject - El asunto del correo electrónico.
 * @param {string} campaignData.emailBody - El cuerpo HTML del correo electrónico.
 * @param {string} campaignData.fromName - El nombre del remitente.
 * @param {string} campaignData.fromEmail - La dirección de correo electrónico del remitente.
 * @param {string} [campaignData.replyTo] - La dirección de correo electrónico para las respuestas. Por defecto, es `fromEmail`.
 * @param {string} [campaignData.scheduleDate] - La fecha de programación de la campaña en formato 'YYYY-MM-DD'.
 * @param {string} [campaignData.scheduleTime] - La hora de programación en formato 'HH:MM'.
 * @param {number} [campaignData.contactListId] - El ID de la lista de contactos asociada.
 * @param {('draft'|'scheduled'|'sending'|'sent'|'cancelled')} [campaignData.status] - El estado inicial de la campaña. Por defecto, es 'draft'.
 * @returns {Promise<{success: boolean, message: string, campaignId?: number}>} Una promesa que resuelve con un objeto indicando
 * si la operación fue exitosa y un mensaje descriptivo. Si es exitosa, incluye el `campaignId`.
 * @async
 */
export async function createCampaign(campaignData: CampaignData) {
  let connection;
  
  try {
    connection = await getDbConnection();
    
    // Validate required fields
    if (!campaignData.name || !campaignData.subject || !campaignData.emailBody || 
        !campaignData.fromName || !campaignData.fromEmail) {
      throw new Error('Faltan campos requeridos para crear la campaña');
    }
    
    // Log the incoming data for debugging
    console.log('Creating campaign with data:', {
      ...campaignData,
      emailBody: campaignData.emailBody ? '[CONTENT]' : 'EMPTY'
    });
    
    // Start transaction
    await connection.beginTransaction();

  // Prepare the data for the database
  const dbData = {
    nombre_campaign: campaignData.name,
    descripcion: campaignData.description || null,
    id_plantilla: campaignData.templateId ? Number(campaignData.templateId) : null,
    asunto: campaignData.subject,
    contenido: campaignData.emailBody,
    remitente_nombre: campaignData.fromName,
    remitente_email: campaignData.fromEmail,
    responder_a: campaignData.replyTo || campaignData.fromEmail,
    fecha_programada: campaignData.scheduleDate 
      ? new Date(`${campaignData.scheduleDate} ${campaignData.scheduleTime || '00:00'}`)
      : null,
    id_lista_contactos: campaignData.contactListId ? Number(campaignData.contactListId) : null,
    estado: campaignData.status || 'draft'
  };

  // Convert undefined to null to avoid SQL errors
  const values = Object.values(dbData).map(value => value === undefined ? null : value);

  const [result] = await connection.execute(
   `INSERT INTO campaigns (
    nombre_campaign, 
    descripcion, 
    id_plantilla, 
    asunto, 
    contenido, 
    remitente_nombre, 
    remitente_email, 
    responder_a, 
    fecha_programada, 
    id_lista_contactos,
    estado
   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
   values
  );

  const campaignId = (result as any).insertId;

  // Inserta datos de recurrencia si la campaña es recurrente
  if (campaignData.isRecurring) {
   await connection.execute(
    `INSERT INTO recurrencias_campana (
     id_campaign,
     tipo_recurrencia,
     intervalo,
     dias_semana,
     dia_mes,
     fecha_inicio,
     fecha_fin,
     estado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
     campaignId,
     campaignData.recurrenceType || null,
     campaignData.recurrenceInterval || null,
     campaignData.recurrenceDaysOfWeek || null,
     campaignData.recurrenceDayOfMonth || null,
     campaignData.recurrenceStartDate ? new Date(campaignData.recurrenceStartDate) : null,
     campaignData.recurrenceEndDate ? new Date(campaignData.recurrenceEndDate) : null,
     'activa' // Estado inicial de la recurrencia
    ]
   );
  }
   
  // Commit transacción
  await connection.commit();
   
  // Revalida la página de campañas para mostrar la nueva campaña
  revalidatePath('/campaigns');
  
  return {
   success: true,
   message: 'Campaña creada exitosamente',
   campaignId
  };
 } catch (error) {
  // Rollback en caso de error
  if (connection) {
   await connection.rollback();
  }
  
  console.error('Error creating campaign:', error);
  return {
   success: false,
   message: 'Error al crear la campaña: ' + (error as Error).message
  };
 } finally {
  if (connection) {
   await connection.end();
  }
 }
}

/**
 * @function getCampaigns
 * @description Recupera una lista de campañas de la base de datos con soporte para paginación.
 * @param {number} [page=1] - El número de página a recuperar (base 1).
 * @param {number} [limit=10] - El número de campañas por página.
 * @returns {Promise<{success: boolean, data: any[], total: number, message?: string}>} Una promesa que resuelve
 * con un objeto que contiene el estado de la operación, los datos de las campañas, el número total de campañas
 * y un mensaje descriptivo en caso de error.
 * @async
 */
export async function getCampaigns(page: number = 1, limit: number = 10): Promise<{
  success: boolean;
  data: any[];
  total: number;
  message?: string;
}> {
 let connection;
 
 try {
  connection = await getDbConnection();
  
  const offset = (page - 1) * limit;
  
  // Obtiene el total de campañas
  const [countResult] = await connection.query(
   'SELECT COUNT(*) as total FROM campaigns'
  ) as unknown as [{ total: number }[]];
  
  const total = countResult[0].total;
  
  // Obtiene las campañas paginadas
  const [campaigns] = await connection.query(
   `SELECT 
    c.*,
    l.nombre as nombre_lista,
    p.nombre as nombre_plantilla
   FROM campaigns c
   LEFT JOIN listas_contactos l ON c.id_lista_contactos = l.id_lista
   LEFT JOIN plantillas p ON c.id_plantilla = p.id_plantilla
   ORDER BY c.fecha_creacion DESC
   LIMIT ? OFFSET ?`,
   [limit, offset]
  ) as unknown as [DBCampaign[]];
  
  // Mapear los resultados al tipo Campaign
  const formattedCampaigns = campaigns.map((campaign: DBCampaign) => ({
    id: campaign.id_campaign,
    name: campaign.nombre_campaign,
    description: campaign.descripcion,
    objective: 'promotional', // Valor por defecto
    subject: campaign.asunto,
    emailBody: campaign.contenido || '',
    fromEmail: campaign.from_email || 'no-reply@example.com',
    replyTo: campaign.reply_to,
    contactListId: campaign.id_lista_contactos,
    contactListName: campaign.nombre_lista,
    totalRecipients: campaign.total_recipients || 0,
    scheduledAt: campaign.fecha_envio,
    status: campaign.estado,
    createdAt: campaign.fecha_creacion,
    updatedAt: campaign.fecha_actualizacion,
    stats: {
      sent: campaign.total_enviados || 0,
      delivered: campaign.total_entregados || 0,
      opened: campaign.total_aperturas || 0,
      clicked: campaign.total_clics || 0,
      bounced: campaign.total_rebotados || 0,
      complained: campaign.total_quejas || 0,
      failed: campaign.total_fallidos || 0
    }
  }));
  
  return {
   success: true,
   data: formattedCampaigns,
   total
  };
 } catch (error) {
  console.error('Error fetching campaigns:', error);
  return {
   success: false,
   data: [],
   total: 0,
   message: 'Error al obtener las campañas: ' + (error as Error).message
  };
 } finally {
  if (connection) {
   await connection.end();
  }
 }
}

/**
 * @function getCampaignById
 * @description Recupera una sola campaña de la base de datos por su ID único.
 * @param {number} campaignId - El ID de la campaña a recuperar.
 * @returns {Promise<{success: boolean, data?: any, message?: string}>} Una promesa que resuelve con un objeto que
 * contiene el estado de la operación, los datos de la campaña si se encuentra, y un mensaje descriptivo.
 * @async
 */
export async function getCampaignById(campaignId: number) {
 let connection;
 
 try {
  connection = await getDbConnection();
  
  const [campaigns] = await connection.query(
   `SELECT 
    c.*,
    l.nombre as nombre_lista,
    p.nombre as nombre_plantilla
   FROM campaigns c
   LEFT JOIN listas_contactos l ON c.id_lista_contactos = l.id_lista
   LEFT JOIN plantillas p ON c.id_plantilla = p.id_plantilla
   WHERE c.id_campaign = ?`,
   [campaignId]
  );
  
  if (!Array.isArray(campaigns) || campaigns.length === 0) {
   return {
    success: false,
    message: 'Campaña no encontrada'
   };
  }
  
  return {
   success: true,
   data: campaigns[0]
  };
 } catch (error) {
  console.error('Error fetching campaign:', error);
  return {
   success: false,
   message: 'Error al obtener la campaña: ' + (error as Error).message
  };
 } finally {
  if (connection) {
   await connection.end();
  }
 }
}

/**
 * @function updateCampaignStatus
 * @description Actualiza el estado de una campaña específica en la base de datos.
 * Revalida las rutas '/campaigns' y '/campaigns/[campaignId]' después de una actualización exitosa.
 * @param {number} campaignId - El ID de la campaña a actualizar.
 * @param {('draft'|'scheduled'|'sending'|'sent'|'cancelled')} status - El nuevo estado de la campaña.
 * @returns {Promise<{success: boolean, message: string}>} Una promesa que resuelve con un objeto indicando
 * si la operación fue exitosa y un mensaje descriptivo.
 * @async
 */
export async function updateCampaignStatus(campaignId: number, status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled') {
 let connection;
 
 try {
  connection = await getDbConnection();
  
  await connection.execute(
   'UPDATE campaigns SET estado = ? WHERE id_campaign = ?',
   [status, campaignId]
  );
  
  revalidatePath('/campaigns');
  revalidatePath(`/campaigns/${campaignId}`);
  
  return {
   success: true,
   message: 'Estado de la campaña actualizado exitosamente'
  };
 } catch (error) {
  console.error('Error updating campaign status:', error);
  return {
   success: false,
   message: 'Error al actualizar el estado de la campaña: ' + (error as Error).message
  };
 } finally {
  if (connection) {
   await connection.end();
  }
 }
}