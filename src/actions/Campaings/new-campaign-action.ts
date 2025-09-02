'use server';

import { revalidatePath } from 'next/cache';
import { getDbConnection } from '../DBConnection';
import { RowDataPacket } from 'mysql2';

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
  emailBody?: string;
  // When a template is used, this should contain the raw blocks JSON
  templateBlocks?: unknown;
  fromName?: string; // illustrative only, not persisted
  fromEmail?: string; // illustrative only, not persisted
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
 * @param {string} [campaignData.emailBody] - El cuerpo HTML del correo electrónico.
 * @param {unknown} [campaignData.templateBlocks] - Los bloques de plantilla en formato JSON.
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
    
    // Validate required fields (do not require sender fields)
    // Allow either emailBody (HTML) or templateBlocks (raw JSON blocks)
    if (!campaignData.name || !campaignData.subject || (!campaignData.emailBody && !campaignData.templateBlocks)) {
      throw new Error('Faltan campos requeridos para crear la campaña');
    }
    
    // Log the incoming data for debugging
    console.log('Creating campaign with data:', {
      ...campaignData,
      emailBody: campaignData.emailBody ? '[CONTENT]' : 'EMPTY',
      templateBlocks: campaignData.templateBlocks ? '[BLOCKS]' : 'EMPTY'
    });
    
    // Start transaction
    await connection.beginTransaction();

  // Map app status to DB enum (Spanish)
  const mapStatusToDb = (status?: string) => {
    switch (status) {
      case 'scheduled': return 'programada';
      case 'sending': return 'en_progreso';
      case 'sent': return 'completada';
      case 'paused': return 'pausada';
      case 'cancelled': return 'cancelada';
      // 'draft' or unknown
      default: return 'borrador';
    }
  };

  // Prepare the data for the database (columns must exist in schema)
  const dbData = {
    nombre_campaign: campaignData.name,
    descripcion: campaignData.description || null,
    id_plantilla: campaignData.templateId ? Number(campaignData.templateId) : null,
    asunto: campaignData.subject,
    // Prefer raw template blocks JSON if provided, else fallback to HTML body
    contenido: campaignData.templateBlocks
      ? JSON.stringify(campaignData.templateBlocks)
      : (campaignData.emailBody || null),
    fecha_envio: campaignData.scheduleDate
      ? new Date(`${campaignData.scheduleDate} ${campaignData.scheduleTime || '00:00'}`)
      : null,
    id_lista_contactos: campaignData.contactListId ? Number(campaignData.contactListId) : null,
    estado: mapStatusToDb(campaignData.status)
  } as const;

  // Convert undefined to null to avoid SQL errors
  const values = Object.values(dbData).map(value => value === undefined ? null : value);

  const [result] = await connection.execute(
    `INSERT INTO campaigns (
      nombre_campaign,
      descripcion,
      id_plantilla,
      asunto,
      contenido,
      fecha_envio,
      id_lista_contactos,
      estado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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
  revalidatePath('/campaign');
  
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
  
  // Mapear estado de BD (es) a estado UI (en)
  const mapStatusToUi = (estado: string) => {
    switch (estado) {
      case 'programada': return 'scheduled';
      case 'en_progreso': return 'sending';
      case 'completada': return 'completed';
      case 'pausada': return 'paused';
      case 'cancelada': return 'cancelled';
      case 'borrador':
      default: return 'draft';
    }
  };

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
    status: mapStatusToUi(campaign.estado as string),
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
     c.id_campaign,
     c.nombre_campaign,
     c.descripcion,
     c.objetivo,
     c.asunto,
     c.contenido,
     c.id_lista_contactos,
     c.fecha_envio,
     c.estado,
     c.fecha_creacion,
     c.fecha_actualizacion,
     l.nombre as nombre_lista,
     l.total_contactos,
     p.nombre as nombre_plantilla,
     rc.tipo_recurrencia,
     rc.intervalo,
     rc.dias_semana,
     rc.dia_mes,
     rc.fecha_fin,
     rc.proxima_ejecucion,
     rc.ultima_ejecucion,
     rc.estado as estado_recurrencia
    FROM campaigns c
    LEFT JOIN listas_contactos l ON c.id_lista_contactos = l.id_lista
    LEFT JOIN plantillas p ON c.id_plantilla = p.id_plantilla
    LEFT JOIN recurrencias_campana rc ON rc.id_campaign = c.id_campaign
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
/**
 * @function updateCampaign
 * @description Actualiza una campaña existente en la base de datos.
 * @param {number} campaignId - El ID de la campaña a actualizar
 * @param {object} campaignData - Datos de la campaña a actualizar
 * @returns {Promise<{success: boolean, message: string}>} - Resultado de la operación
 */
export async function updateCampaign(
  campaignId: number, 
  campaignData: Partial<CampaignData> & { 
    id_campaign?: number;
    nombre_campaign: string;
    descripcion?: string | null;
    objetivo: string;
    asunto: string;
    contenido: string;
    id_lista_contactos: number;
    nombre_lista?: string;
    total_contactos: number;
    fecha_envio?: string | null;
    estado: string;
    es_recurrente?: boolean;
    tipo_recurrencia?: 'diaria' | 'semanal' | 'mensual' | 'anual' | null;
    intervalo?: number | null;
    dias_semana?: string | null;
    dia_mes?: number | null;
    fecha_fin?: string | null;
  }
) {
  let connection;
  try {
    connection = await getDbConnection();
    await connection.beginTransaction();

    // 1. Actualizar la campaña principal
    const [campaignResult] = await connection.execute(
      `UPDATE campaigns 
       SET nombre_campaign = ?, 
           descripcion = ?, 
           objetivo = ?, 
           asunto = ?, 
           contenido = ?, 
           id_lista_contactos = ?, 
           fecha_envio = ?, 
           estado = ?,
           fecha_actualizacion = NOW()
       WHERE id_campaign = ?`,
      [
        campaignData.nombre_campaign,
        campaignData.descripcion || null,
        campaignData.objetivo,
        campaignData.asunto,
        campaignData.contenido,
        campaignData.id_lista_contactos,
        campaignData.fecha_envio || null,
        campaignData.estado,
        campaignId
      ]
    );

    // 2. Manejar la recurrencia
    if (campaignData.es_recurrente && campaignData.tipo_recurrencia) {
      // Verificar si ya existe una entrada de recurrencia
      const [existingRecurrence] = await connection.execute<RowDataPacket[]>(
        'SELECT id_recurrencia FROM recurrencias_campana WHERE id_campaign = ?',
        [campaignId]
      ) as [RowDataPacket[], any];

      if (existingRecurrence.length > 0) {
        // Actualizar recurrencia existente
        await connection.execute(
          `UPDATE recurrencias_campana 
           SET tipo_recurrencia = ?, 
               intervalo = ?, 
               dias_semana = ?, 
               dia_mes = ?, 
               fecha_fin = ?,
               fecha_actualizacion = NOW()
           WHERE id_campaign = ?`,
          [
            campaignData.tipo_recurrencia,
            campaignData.intervalo || 1,
            campaignData.dias_semana || null,
            campaignData.dia_mes || null,
            campaignData.fecha_fin || null,
            campaignId
          ]
        );
      } else {
        // Crear nueva entrada de recurrencia
        await connection.execute(
          `INSERT INTO recurrencias_campana 
           (id_campaign, tipo_recurrencia, intervalo, dias_semana, dia_mes, fecha_fin, fecha_creacion, fecha_actualizacion)
           VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            campaignId,
            campaignData.tipo_recurrencia,
            campaignData.intervalo || 1,
            campaignData.dias_semana || null,
            campaignData.dia_mes || null,
            campaignData.fecha_fin || null
          ]
        );
      }
    } else {
      // Eliminar recurrencia si existe
      await connection.execute(
        'DELETE FROM recurrencias_campana WHERE id_campaign = ?',
        [campaignId]
      );
    }

    await connection.commit();
    
    // Revalidar las rutas relevantes
    revalidatePath('/campaign');
    revalidatePath(`/campaign/${campaignId}`);
    
    return {
      success: true,
      message: 'Campaña actualizada exitosamente'
    };
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error al actualizar la campaña:', error);
    return {
      success: false,
      message: 'Error al actualizar la campaña: ' + (error as Error).message
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function updateCampaignStatus(campaignId: number, status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled') {
 let connection;
 
 try {
  connection = await getDbConnection();
  
  // Map English status to Spanish DB enum (same mapping used on create)
  const mapStatusToDb = (s: string) => {
    switch (s) {
      case 'scheduled': return 'programada';
      case 'sending': return 'en_progreso';
      case 'sent': return 'completada';
      case 'paused': return 'pausada';
      case 'cancelled': return 'cancelada';
      default: return 'borrador';
    }
  };

  await connection.execute(
    'UPDATE campaigns SET estado = ? WHERE id_campaign = ?',
    [mapStatusToDb(status), campaignId]
  );
  
  revalidatePath('/campaign');
  
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