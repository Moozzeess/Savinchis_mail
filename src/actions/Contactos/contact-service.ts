'use server';

import { getDbConnection } from '../DBConnection';

export interface Contact {
  id_contacto: number;
  nombre_completo: string;
  email: string;
  telefono?: string;
  empresa?: string;
  puesto?: string;
  estado: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface ContactInList extends Contact {
  id_lista: number;
  fecha_insercion: string;
  estado_lista: string;
}

/**
 * Obtiene los contactos de una lista específica
 */
export async function getContactsByListId(
  listId: number,
  page: number = 1,
  pageSize: number = 20
) {
  const connection = await getDbConnection();
  try {
    const offset = (page - 1) * pageSize;
    
    // Obtener los contactos de la lista con paginación
    // Obtener los contactos de la lista con paginación
    const [contacts] = await connection.execute(
      `SELECT c.*, cl.id_lista, cl.fecha_insercion, cl.estado as estado_lista
       FROM contactos c
       INNER JOIN contactos_lista cl ON c.id_contacto = cl.id_contacto
       WHERE cl.id_lista = ?
       ORDER BY c.nombre_completo
       LIMIT ? OFFSET ?`,
      [listId, pageSize, offset]
    );

    // Obtener el total de contactos para la paginación
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total 
       FROM contactos_lista 
       WHERE id_lista = ?`,
      [listId]
    );

    const total = Array.isArray(countResult) && countResult.length > 0 
      ? (countResult[0] as any).total 
      : 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      success: true,
      data: {
        contacts: contacts as ContactInList[],
        pagination: {
          total,
          page,
          pageSize,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error('Error getting contacts by list ID:', error);
    return {
      success: false,
      message: 'Error al obtener los contactos de la lista',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

/**
 * Actualiza un contacto en una lista específica
 */
export async function updateContactInList(
  listId: number,
  contactId: number,
  updates: Partial<Contact>
) {
  const connection = await getDbConnection();
  try {
    await connection.beginTransaction();

    // Actualizar el contacto
    await connection.query(
      `UPDATE contactos 
       SET ? 
       WHERE id_contacto = ?`,
      [updates, contactId]
    );

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    console.error('Error updating contact:', error);
    return {
      success: false,
      message: 'Error al actualizar el contacto',
    };
  } finally {
    await connection.end();
  }
}

/**
 * Elimina un contacto de una lista
 */
export async function removeContactFromList(listId: number, contactId: number) {
  const connection = await getDbConnection();
  try {
    await connection.beginTransaction();

    // Eliminar la relación del contacto con la lista
    await connection.execute(
      `DELETE FROM contactos_lista 
       WHERE id_lista = ? AND id_contacto = ?`,
      [listId, contactId]
    );

    // Verificar si el contacto está en otras listas
    const [otherLists] = await connection.execute(
      `SELECT COUNT(*) as count 
       FROM contactos_lista 
       WHERE id_contacto = ?`,
      [contactId]
    );

    // Si el contacto no está en otras listas, eliminarlo de la tabla contactos
    if ((otherLists as any)[0].count === 0) {
      await connection.execute(
        `DELETE FROM contactos 
         WHERE id_contacto = ?`,
        [contactId]
      );
    }

    await connection.commit();
    return { success: true };
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error removing contact from list:', error);
    return {
      success: false,
      message: 'Error al eliminar el contacto de la lista',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

/**
 * Cambia el estado de un contacto en una lista
 */
export async function updateContactStatusInList(
  listId: number,
  contactId: number,
  status: 'activo' | 'inactivo' | 'baja'
) {
  const connection = await getDbConnection();
  try {
    await connection.execute(
      'UPDATE contactos_lista SET estado = ? WHERE id_contacto = ? AND id_lista = ?',
      [status, contactId, listId]
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating contact status:', error);
    return {
      success: false,
      message: 'Error al actualizar el estado del contacto',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
