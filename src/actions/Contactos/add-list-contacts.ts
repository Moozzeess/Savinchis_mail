'use server'
import { getDbConnection } from '../DBConnection';
//import mysql from 'mysql2/promise';

/**
 * Inserta una lista y sus contactos asociados en la base de datos.
 * @param listaNombre Nombre de la lista.
 * @param contactos Array de objetos { nombre, email }.
 * @returns Mensaje de éxito o error.
 */
export async function addListContacts(
  listaNombre: string, 
  contactos: { nombre_completo: string; email: string; }[], 
  listDescription?: string
): Promise<{ success: boolean; message: string; total_contactos?: number }> {
  const conn = await getDbConnection();
  try {
    await conn.beginTransaction();

    // 1. Insertar o recuperar la lista
    let [rows] = await conn.execute(
      'SELECT id_lista FROM listas_contactos WHERE nombre = ?',
      [listaNombre]
    );

    let id_lista;
    if ((rows as any[]).length > 0) {
      id_lista = (rows as any[])[0].id_lista;
    } else {
      const [result] = await conn.execute(
        'INSERT INTO listas_contactos (nombre, datos_adicionales) VALUES (?, ?)',
        [listaNombre, listDescription || null]
      );
      id_lista = (result as any).insertId;
    }

    // 2. Insertar contactos y asociarlos a la lista
    const uniqueContactIds = new Set<number>();
    
    for (const contacto of contactos) {
      // Insertar contacto si no existe (por email)
      let [contactRows] = await conn.execute(
        'SELECT id_contacto FROM contactos WHERE email = ?',
        [contacto.email]
      );
      let id_contacto;
      if ((contactRows as any[]).length > 0) {
        id_contacto = (contactRows as any[])[0].id_contacto;
      } else {
        const [insertResult] = await conn.execute(
          'INSERT INTO contactos (nombre_completo, email) VALUES (?, ?)',
          [contacto.nombre_completo, contacto.email]
        );
        id_contacto = (insertResult as any).insertId;
      }
      
      // Agregar a la relación muchos a muchos (solo una vez)
      await conn.execute(
        'INSERT IGNORE INTO contactos_lista (id_lista, id_contacto, estado) VALUES (?, ?, ?)',
        [id_lista, id_contacto, 'activo']
      );
      
      uniqueContactIds.add(id_contacto);
    }

    // 3. Calcular el total de contactos únicos para esta lista
    const [countResult] = await conn.execute(
      'SELECT COUNT(DISTINCT id_contacto) as total FROM contactos_lista WHERE id_lista = ?',
      [id_lista]
    );
    
    const total_contactos = (countResult as any[])[0].total;
    
    // 4. Actualizar el contador total_contactos en la tabla listas_contactos
    await conn.execute(
      'UPDATE listas_contactos SET total_contactos = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id_lista = ?',
      [total_contactos, id_lista]
    );
    
    await conn.commit();
    return { 
      success: true, 
      message: `Lista y contactos guardados exitosamente. Total: ${total_contactos} contactos`,
      total_contactos
    };
  } catch (error) {
    await conn.rollback();
    return {
      success: false,
      message: 'Error al guardar contactos: ' + (error as Error).message
    };
  } finally {
    await conn.end();
  }
}