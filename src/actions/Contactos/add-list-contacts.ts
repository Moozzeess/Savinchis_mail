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
  contactos: { nombre_completo: string; email: string }[]
): Promise<{ success: boolean; message: string }> {
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
        'INSERT INTO listas_contactos (nombre) VALUES (?)',
        [listaNombre]
      );
      id_lista = (result as any).insertId;
    }

    // 2. Insertar contactos y asociarlos a la lista
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

      // Asociar contacto a la lista (evitar duplicados)
      await conn.execute(
        'INSERT IGNORE INTO contactos_lista (id_contacto, id_lista) VALUES (?, ?)',
        [id_contacto, id_lista]
      );
    }

    await conn.commit();
    return { success: true, message: 'Contactos guardados y asociados correctamente a la lista.' };
  } catch (error) {
    await conn.rollback();
    return { success: false, message: 'Error al guardar contactos: ' + (error as Error).message };
  } finally {
    await conn.end();
  }
}