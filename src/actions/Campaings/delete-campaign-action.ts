'use server';

import { revalidatePath } from 'next/cache';
import { getDbConnection } from '../DBConnection';
import { campaignContentService } from '@/service/campaignContentService';

/**
 * @function deleteCampaign
 * @description Elimina una campaña de la base de datos y su archivo de contenido asociado.
 * @param {number} campaignId - El ID de la campaña a eliminar.
 * @returns {Promise<{success: boolean, message: string}>} Una promesa que resuelve con un objeto indicando
 * si la operación fue exitosa y un mensaje descriptivo.
 * @async
 */
export async function deleteCampaign(campaignId: number) {
  let connection;
  
  try {
    connection = await getDbConnection();
    await connection.beginTransaction();
    
    // 1. Obtener la ruta del contenido antes de eliminar la campaña
    const [campaign] = await connection.execute(
      'SELECT ruta_contenido FROM campaigns WHERE id_campaign = ?',
      [campaignId]
    ) as unknown as [any[]];
    
    if (!campaign || campaign.length === 0) {
      throw new Error('Campaña no encontrada');
    }
    
    const rutaContenido = campaign[0].ruta_contenido;
    
    // 2. Eliminar las recurrencias asociadas (si existen)
    await connection.execute(
      'DELETE FROM recurrencias_campana WHERE id_campaign = ?',
      [campaignId]
    );
    
    // 3. Eliminar los envíos asociados (si existen)
    await connection.execute(
      'DELETE FROM envios_campana WHERE id_campana = ?',
      [campaignId]
    );
    
    // 4. Eliminar la campaña
    await connection.execute(
      'DELETE FROM campaigns WHERE id_campaign = ?',
      [campaignId]
    );
    
    // 5. Si la campaña tenía un archivo de contenido, eliminarlo
    if (rutaContenido) {
      try {
        await campaignContentService.deleteCampaignContent(rutaContenido);
      } catch (error) {
        console.error('Error al eliminar el archivo de contenido:', error);
        // No fallar la operación si no se puede eliminar el archivo
      }
    }
    
    await connection.commit();
    
    // Revalidar las rutas relevantes
    revalidatePath('/campaigns');
    revalidatePath(`/campaigns/${campaignId}`);
    revalidatePath(`/campaigns/${campaignId}/edit`);
    
    return {
      success: true,
      message: 'Campaña eliminada exitosamente'
    };
    
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    
    console.error('Error deleting campaign:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error al eliminar la campaña'
    };
    
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
