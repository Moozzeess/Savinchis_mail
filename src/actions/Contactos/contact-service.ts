'use server';

import { getDbConnection } from '../DBConnection';

export interface Contact {
  id_contacto: number;
  nombre_completo: string;
  email: string;
  telefono?: number|string;
  empresa?: string;
  estado: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface ContactInList extends Contact {
  id_lista: number;
  fecha_insercion: string;
  estado_lista: string;
}

export async function getContactsByListId(
  listId: number,
  page: number = 1,
  pageSize: number = 20
) {
  const connection = await getDbConnection();
  try {
    const offsetNum = Number((page - 1) * pageSize);
    const pageSizeNum = Number(pageSize);

    const extractedListId = ((): any => {
      if (listId && typeof listId === 'object') {
        const obj = listId as any;
        if (obj.listId != null) return obj.listId;
        if (obj.id != null) return obj.id;
        if (obj.value != null) return obj.value;
      }
      return listId as any;
    })();

    const listIdNum = Number(extractedListId);

    if (!Number.isFinite(listIdNum)) {
      throw new Error(`listId inválido: ${JSON.stringify(listId)}`);
    }
    if (!Number.isFinite(pageSizeNum) || pageSizeNum < 1) {
      throw new Error(`pageSize inválido: ${pageSize}`);
    }
    if (!Number.isFinite(offsetNum) || offsetNum < 0) {
      throw new Error(`offset inválido: ${offsetNum}`);
    }


    const sql = `SELECT 
        c.id_contacto, c.nombre_completo, c.email, c.telefono, c.empresa,
         c.fecha_creacion, c.fecha_actualizacion,
        cl.id_lista, cl.fecha_insercion, cl.estado AS estado_lista
      FROM contactos c
      INNER JOIN contactos_lista cl ON c.id_contacto = cl.id_contacto
      WHERE cl.id_lista = ?
      ORDER BY c.nombre_completo
      LIMIT ${pageSizeNum} OFFSET ${offsetNum}`;

    const [contacts] = await connection.execute(
      sql,
      [listIdNum]
    );

    // Obtener el total de contactos para la paginación
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total 
       FROM contactos_lista 
       WHERE id_lista = ?`,
      [listIdNum]
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
    console.error('Error obtener contactos de lista:', error);
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
  updates: Partial<Contact & { estado_lista?: string }>
) {
  const connection = await getDbConnection();
  try {
    await connection.beginTransaction();

    // Separar los campos que pertenecen a contactos
    const { estado_lista, ...contactUpdates } = updates;

    // Si se está actualizando el email, verificar que no exista otro contacto con el mismo email
    if (contactUpdates.email) {
      // Primero obtenemos el email actual del contacto
      const [currentContact] = await connection.query(
        'SELECT email FROM contactos WHERE id_contacto = ?',
        [contactId]
      ) as unknown as [any[]];
      
      // Solo verificamos si el email es diferente al actual
      if (!currentContact[0] || currentContact[0].email !== contactUpdates.email) {
        const [rows] = await connection.query(
          'SELECT id_contacto FROM contactos WHERE email = ? AND id_contacto != ?',
          [contactUpdates.email, contactId]
        ) as unknown as [any[]];
        
        if (rows && rows.length > 0) {
          throw new Error('Ya existe un contacto con este correo electrónico');
        }
      }
    }

    // Actualizar el contacto en la tabla contactos
    if (Object.keys(contactUpdates).length > 0) {
      await connection.query(
        `UPDATE contactos 
         SET ? 
         WHERE id_contacto = ?`,
        [contactUpdates, contactId]
      );
    }

    // Si se está actualizando el estado en la lista, actualizar la tabla contactos_lista
    if (estado_lista) {
      await connection.query(
        `UPDATE contactos_lista 
         SET estado = ? 
         WHERE id_contacto = ? AND id_lista = ?`,
        [estado_lista, contactId, listId]
      );
    }

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
