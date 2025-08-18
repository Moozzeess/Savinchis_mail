'use server';

import { revalidatePath } from 'next/cache';
import mysql from 'mysql2/promise';

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
 status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
 isRecurring?: boolean;
 recurrenceType?: 'diaria' | 'semanal' | 'mensual' | 'anual' | null;
 recurrenceInterval?: number | null;
 recurrenceDaysOfWeek?: string | null;
 recurrenceDayOfMonth?: number | null;
 recurrenceStartDate?: string | null;
 recurrenceEndDate?: string | null;
}

/**
 * @function getDbConnection
 * @description Establece y retorna una conexión a la base de datos MySQL
 */
async function getDbConnection() {
 const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } = process.env;
 
 if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
  throw new Error('Faltan las variables de entorno de la base de datos');
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
  
  // Inicia transacción
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
export async function getCampaigns(page: number = 1, limit: number = 10) {
 let connection;
 
 try {
  connection = await getDbConnection();
  
  const offset = (page - 1) * limit;
  
  // Obtine el total de campañas
  const [countResult] = await connection.query(
   'SELECT COUNT(*) as total FROM campaigns'
  );
  
  const total = (countResult as any)[0].total;
  
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