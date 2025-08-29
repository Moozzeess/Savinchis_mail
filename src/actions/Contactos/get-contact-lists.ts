'use server';

import mysql from 'mysql2/promise';
import { getDbConnection } from '../DBConnection';

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

interface DetailedContactList {
  id_lista: number;
  nombre: string;
  descripcion: string | null;
  total_contactos: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  estado: string;
}

/**
 * Obtiene una lista de contactos por su ID
 */
export async function getContactListById(listId: number) {
  const connection = await getDbConnection();
  try {
    const [rows] = await connection.query(
      `SELECT 
        lc.*,
        COALESCE(
          (SELECT COUNT(DISTINCT cl.id_contacto) 
           FROM contactos_lista cl 
           WHERE cl.id_lista = lc.id_lista 
           AND cl.estado = 'activo'), 
          0
        ) as total_contactos
      FROM listas_contactos lc
      WHERE lc.id_lista = ?`,
      [listId]
    );

    const list = (rows as any[])[0];
    if (!list) {
      return { success: false, message: 'Lista no encontrada' };
    }

    return {
      success: true,
      data: {
        id_lista: list.id_lista,
        nombre: list.nombre,
        descripcion: list.descripcion,
        total_contactos: list.total_contactos,
        fecha_creacion: list.fecha_creacion,
        fecha_actualizacion: list.fecha_actualizacion,
        estado: list.estado
      }
    };
  } catch (error) {
    console.error('Error getting contact list by ID:', error);
    return {
      success: false,
      message: 'Error al obtener la lista de contactos',
    };
  } finally {
    await connection.end();
  }
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
    const [rows] = await connection.execute(`
      SELECT 
        lc.id_lista, 
        lc.nombre, 
        COALESCE(
          (SELECT COUNT(DISTINCT cl.id_contacto) 
           FROM contactos_lista cl 
           WHERE cl.id_lista = lc.id_lista 
           AND cl.estado = 'activo'), 
          0
        ) as total_contactos
      FROM listas_contactos lc
      ORDER BY lc.fecha_creacion DESC 
      LIMIT ${pageSize} OFFSET ${offset}
    `);

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
