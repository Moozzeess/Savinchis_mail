'use server';
import { getDbConnection } from '../DBConnection';

interface UpdateContactListParams {
  nombre: string;
  descripcion?: string;
  estado: 'activa' | 'inactiva';
}

export async function updateContactList(
  listId: string | number,
  data: UpdateContactListParams
) {
  const connection = await getDbConnection();
  
  try {
    await connection.beginTransaction();
    
    // Actualizar la lista de contactos
    const [result] = await connection.query(
      `UPDATE listas_contactos 
       SET nombre = ?, descripcion = ?, estado = ?, fecha_actualizacion = NOW() 
       WHERE id_lista = ?`,
      [data.nombre, data.descripcion || null, data.estado, listId]
    );

    await connection.commit();
    
    return {
      success: true,
      message: 'Lista actualizada correctamente',
      data: { id: listId, ...data }
    };
  } catch (error) {
    await connection.rollback();
    console.error('Error al actualizar la lista de contactos:', error);
    return {
      success: false,
      message: 'Error al actualizar la lista de contactos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  } finally {
    if (connection) {
      await connection.end();
    }}
}
