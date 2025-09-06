'use server';

import { revalidatePath } from 'next/cache';
import { RowDataPacket } from 'mysql2';
import { getDbConnection } from '../DBConnection';
import { campaignContentService } from '@/service/campaignContentService';
import { CampaignData } from './new-campaign-action';
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
    
    // Obtener la campaña actual para verificar si hay contenido existente
    const [currentCampaign] = await connection.execute(
      'SELECT ruta_contenido FROM campaigns WHERE id_campaign = ?',
      [campaignId]
    ) as unknown as [RowDataPacket[]];
    
    if (!currentCampaign || currentCampaign.length === 0) {
      throw new Error('Campaña no encontrada');
    }
    
    const currentCampaignData = currentCampaign[0];
    let rutaContenido = currentCampaignData.ruta_contenido;
    
    // Si hay contenido nuevo, guardarlo en el sistema de archivos
    if (campaignData.contenido) {
      // Si ya existe una ruta, actualizamos el archivo existente
      if (rutaContenido) {
        await campaignContentService.saveCampaignContent(campaignId, campaignData.contenido);
      } else {
        // Si no existe una ruta, creamos un nuevo archivo
        rutaContenido = await campaignContentService.saveCampaignContent(campaignId, campaignData.contenido);
      }
    }
    
    // Actualizar los datos de la campaña en la base de datos
    await connection.execute(
      `UPDATE campaigns SET
        nombre_campaign = ?,
        descripcion = ?,
        asunto = ?,
        ruta_contenido = ?,
        id_plantilla = ?,
        id_lista_contactos = ?,
        estado = ?,
        fecha_envio = ?,
        fecha_actualizacion = NOW()
      WHERE id_campaign = ?`,
      [
        campaignData.nombre_campaign,
        campaignData.descripcion || null,
        campaignData.asunto,
        rutaContenido, // Usamos la ruta existente o la nueva
        campaignData.templateId || null,
        campaignData.id_lista_contactos || null,
        campaignData.estado || 'draft',
        campaignData.fecha_envio || null,
        campaignId
      ]
    );
    
    // Manejar la actualización de la recurrencia si es necesario
    if (campaignData.tipo_recurrencia) {
      // Verificar si ya existe una entrada de recurrencia
      const [recurrence] = await connection.execute(
        'SELECT id_recurrencia FROM recurrencias_campana WHERE id_campaign = ?',
        [campaignId]
      ) as unknown as [RowDataPacket[]];
      
      if (recurrence && recurrence.length > 0) {
        // Actualizar recurrencia existente
        await connection.execute(
          `UPDATE recurrencias_campana SET
            tipo_recurrencia = ?,
            intervalo = ?,
            dias_semana = ?,
            dia_mes = ?,
            fecha_fin = ?,
            estado = ?,
            fecha_actualizacion = NOW()
          WHERE id_campaign = ?`,
          [
            campaignData.tipo_recurrencia,
            campaignData.intervalo || 1,
            campaignData.dias_semana || null,
            campaignData.dia_mes || null,
            campaignData.fecha_fin || null,
            'activa',
            campaignId
          ]
        );
      } else {
        // Crear nueva entrada de recurrencia
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
            campaignData.tipo_recurrencia,
            campaignData.intervalo || 1,
            campaignData.dias_semana || null,
            campaignData.dia_mes || null,
            new Date().toISOString().split('T')[0], // Fecha actual como fecha de inicio
            campaignData.fecha_fin || null,
            'activa'
          ]
        );
      }
    } else {
      // Si no hay tipo de recurrencia, eliminar la entrada si existe
      await connection.execute(
        'DELETE FROM recurrencias_campana WHERE id_campaign = ?',
        [campaignId]
      );
    }
    
    await connection.commit();
    
    // Revalidar las rutas relevantes
    revalidatePath('/campaigns');
    revalidatePath(`/campaigns/${campaignId}`);
    revalidatePath(`/campaigns/${campaignId}/edit`);
    
    return {
      success: true,
      message: 'Campaña actualizada exitosamente'
    };
    
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    
    console.error('Error updating campaign:', error);
    
    return {
      success: false,
      message: 'Error al actualizar la campaña: ' + (error as Error).message
    };
    
  }finally {
    if (connection) {
      await connection.end();
    }
  }
}