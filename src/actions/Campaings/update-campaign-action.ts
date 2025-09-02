'use server';

import { revalidatePath } from 'next/cache';
import { RowDataPacket } from 'mysql2';
import { getDbConnection } from '../DBConnection';

export interface UpdateCampaignData {
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
  // Hacer que los campos de recurrencia sean opcionales
  tipo_recurrencia?: 'diaria' | 'semanal' | 'mensual' | 'anual';
  intervalo?: number;
  dias_semana?: string;
  dia_mes?: number;
  fecha_fin?: string;
}

/**
 * @function updateCampaign
 * @description Actualiza una campaña existente en la base de datos.
 * @param {number} campaignId - El ID de la campaña a actualizar
 * @param {object} campaignData - Datos de la campaña a actualizar
 * @returns {Promise<{success: boolean, message: string}>} - Resultado de la operación
 */
export async function updateCampaign(
  campaignId: number, 
  campaignData: UpdateCampaignData
) {
  let connection;
  try {
    connection = await getDbConnection();
    await connection.beginTransaction();

    // 1. Actualizar la campaña principal
    await connection.execute(
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
    // Verificar si ya existe una entrada de recurrencia
    const [existingRecurrence] = await connection.execute<RowDataPacket[]>(
      'SELECT id_recurrencia FROM recurrencias_campana WHERE id_campaign = ?',
      [campaignId]
    ) as [RowDataPacket[], any];

    if (campaignData.es_recurrente && campaignData.tipo_recurrencia) {
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
    } else if (existingRecurrence.length > 0) {
      // Eliminar la recurrencia existente si la campaña ya no es recurrente
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
