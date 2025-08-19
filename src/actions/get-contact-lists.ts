'use server';

import mysql from 'mysql2/promise';
import { getDbConnection } from './DBConnection';

interface ContactList {
  id: string;
  name: string;
  count: number;
}

interface PaginatedContactLists {
  lists: ContactList[];
  totalLists: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}


/**
 * Obtiene las listas de contactos existentes con paginación.
 * @param page Página actual (1-basada).
 * @param pageSize Número de elementos por página.
 * @returns Un objeto con las listas paginadas y metadatos de paginación.
 */
export async function getContactLists(
  page: number = 1,
  pageSize: number = 5
): Promise<{ success: boolean; data?: PaginatedContactLists; message?: string }> {
  let connection;
  try {
    connection = await getDbConnection();

    const offset = (page - 1) * pageSize;
    
    // Consulta para obtener las listas de contactos con paginación
    const [rows] = await connection.execute(
      `SELECT id_lista, nombre, total_contactos FROM listas_contactos ORDER BY fecha_creacion DESC LIMIT ${pageSize} OFFSET ${offset}`
    );

    // Consulta para obtener el total de listas
    const [countRows] = await connection.execute(
      `SELECT COUNT(*) as total FROM listas_contactos`
    );
    
    const totalLists = (countRows as any[])[0].total;
    const totalPages = Math.ceil(totalLists / pageSize);

    const lists: ContactList[] = (rows as any[]).map(row => ({
      id: String(row.id_lista),
      name: row.nombre,
      count: row.total_contactos,
    }));

    return {
      success: true,
      data: {
        lists,
        totalLists,
        totalPages,
        currentPage: page,
        pageSize,
      },
    };

  } catch (error) {
    console.error('Error al obtener listas de contactos:', error);
    return { success: false, message: 'Error al obtener listas de contactos: ' + (error as Error).message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
