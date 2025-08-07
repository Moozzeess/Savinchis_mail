'use server';

import { revalidatePath } from 'next/cache';
import mysql from 'mysql2/promise';

/**
 * @interface CampaignData
 * @description Interface for campaign data structure
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
  status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
}

/**
 * @function getDbConnection
 * @description Establishes and returns a connection to the MySQL database
 */
async function getDbConnection() {
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } = process.env;
  
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
    throw new Error('Missing database environment variables');
  }

  const port = MYSQL_PORT ? parseInt(MYSQL_PORT, 10) : 3306;

  return await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: port,
    namedPlaceholders: true
  });
}

/**
 * @function createCampaign
 * @description Creates a new campaign in the database
 * @param {CampaignData} campaignData - The campaign data to save
 * @returns {Promise<{success: boolean, message: string, campaignId?: number}>}
 */
export async function createCampaign(campaignData: CampaignData) {
  let connection;
  
  try {
    connection = await getDbConnection();
    
    // Start transaction
    await connection.beginTransaction();

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
      [
        campaignData.name,
        campaignData.description || null,
        campaignData.templateId || null,
        campaignData.subject,
        campaignData.emailBody,
        campaignData.fromName,
        campaignData.fromEmail,
        campaignData.replyTo || campaignData.fromEmail,
        campaignData.scheduleDate ? new Date(`${campaignData.scheduleDate} ${campaignData.scheduleTime || '00:00'}`) : null,
        campaignData.contactListId || null,
        campaignData.status || 'draft'
      ]
    );

    const campaignId = (result as any).insertId;
    
    // Commit transaction
    await connection.commit();
    
    // Revalidate the campaigns page to show the new campaign
    revalidatePath('/campaigns');
    
    return {
      success: true,
      message: 'Campaña creada exitosamente',
      campaignId
    };
  } catch (error) {
    // Rollback transaction in case of error
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
 * @description Retrieves a list of campaigns with pagination
 * @param {number} page - The page number (1-based)
 * @param {number} limit - Number of items per page
 * @returns {Promise<{success: boolean, data: any[], total: number, message?: string}>}
 */
export async function getCampaigns(page: number = 1, limit: number = 10) {
  let connection;
  
  try {
    connection = await getDbConnection();
    
    const offset = (page - 1) * limit;
    
    // Get total count
    const [countResult] = await connection.query(
      'SELECT COUNT(*) as total FROM campaigns'
    );
    
    const total = (countResult as any)[0].total;
    
    // Get paginated campaigns
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
    );
    
    return {
      success: true,
      data: campaigns,
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
 * @description Retrieves a single campaign by ID
 * @param {number} campaignId - The ID of the campaign to retrieve
 * @returns {Promise<{success: boolean, data?: any, message?: string}>}
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
 * @description Updates the status of a campaign
 * @param {number} campaignId - The ID of the campaign to update
 * @param {string} status - The new status
 * @returns {Promise<{success: boolean, message: string}>}
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