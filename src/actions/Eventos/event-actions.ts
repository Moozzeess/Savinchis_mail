'use server';

import { revalidatePath } from 'next/cache';
import { getDbConnection } from '../DBConnection';
import { RowDataPacket } from 'mysql2';

interface Event extends RowDataPacket {
  id_evento: number;
  nombre: string;
  fecha: Date;
  nombre_plantilla: string;
  estado: 'Realizado' | 'Próximo';
  asistentes: number;
}

/**
 * @function getEventsAction
 * @description Acción de servidor para obtener una lista de eventos desde la base de datos.
 * @returns {Promise<any[]>} Una promesa que resuelve con un arreglo de objetos que representan los eventos,
 * incluyendo su ID, nombre, fecha, nombre de la plantilla asociada y estado (Realizado/Próximo).
 * Retorna un arreglo vacío en caso de error.
 * @async
 */
export async function getEventsAction() {
  let connection;
  try {
    connection = await getDbConnection();
    const [rows] = await connection.execute<Event[]>(`
      SELECT
        e.id_evento,
        e.nombre,
        e.fecha,
        p.nombre as nombre_plantilla,
        CASE
          WHEN e.fecha < CURDATE() THEN 'Realizado'
          ELSE 'Próximo'
        END AS estado,
        COALESCE((SELECT COUNT(*) FROM asistentes_evento WHERE id_evento = e.id_evento), 0) as asistentes
      FROM eventos e
      JOIN plantillas p ON e.id_plantilla_invitacion = p.id_plantilla
      ORDER BY e.fecha DESC
    `);
    return rows;
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    return [];
  } finally {
    // Asegura que la conexión a la base de datos se cierre.
    if (connection) await connection.end();
  }
}

/**
 * @function saveEventAction
 * @description Acción de servidor para guardar un nuevo evento en la base de datos.
 * Revalida la ruta '/events' después de una inserción exitosa para actualizar el caché.
 * @param {object} data - Objeto con los datos del evento a guardar.
 * @param {string} data.nombre - El nombre del evento.
 * @param {Date} data.fecha - La fecha del evento.
 * @param {number} data.id_plantilla_invitacion - El ID de la plantilla de invitación asociada al evento.
 * @param {number} data.id_plantilla_certificado - El ID de la plantilla de certificado asociada al evento.
 * @returns {Promise<{success: boolean, message: string}>} Una promesa que resuelve con un objeto indicando
 * si la operación fue exitosa y un mensaje descriptivo.
 * @async
 */
interface SaveEventData {
  nombre: string;
  fecha: Date;
  id_plantilla_invitacion: number;
  id_plantilla_certificado: number;
  ubicacion?: string;
  descripcion?: string;
}

export async function saveEventAction(data: SaveEventData) {
  const { 
    nombre, 
    fecha, 
    id_plantilla_invitacion, 
    id_plantilla_certificado,
    ubicacion = '',
    descripcion = ''
  } = data;
  
  let connection;
  try {
    connection = await getDbConnection();
    
    // Verificar que las plantillas existan
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM plantillas WHERE id_plantilla IN (?, ?) AND tipo IN ("template", "certificate")',
      [id_plantilla_invitacion, id_plantilla_certificado]
    );
    
    const templateCount = rows[0]?.count as number;
    if (templateCount !== 2) {
      return { success: false, message: 'Una o ambas plantillas no existen o son de tipo incorrecto.' };
    }

    // Insertar el nuevo evento
    await connection.execute(
      `INSERT INTO eventos 
        (nombre, fecha, id_plantilla_invitacion, id_plantilla_certificado, ubicacion, descripcion, fecha_creacion)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [nombre, fecha, id_plantilla_invitacion, id_plantilla_certificado, ubicacion, descripcion]
    );

    // Revalidar las rutas relevantes
    revalidatePath('/eventos');
    revalidatePath('/dashboard');

    return { success: true, message: 'Evento creado con éxito.' };
  } catch (error: any) {
    console.error('Error al crear el evento:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, message: 'Ya existe un evento con ese nombre.' };
    }
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al crear el evento.' 
    };
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * @function getEventByIdAction
 * @description Obtiene un evento por su ID
 */
export async function getEventByIdAction(id: number) {
  let connection;
  try {
    connection = await getDbConnection();
    const [rows] = await connection.execute<Event[]>(
      `SELECT 
        e.*, 
        p.nombre as nombre_plantilla,
        (SELECT COUNT(*) FROM asistentes_evento WHERE id_evento = e.id_evento) as asistentes
       FROM eventos e
       JOIN plantillas p ON e.id_plantilla_invitacion = p.id_plantilla
       WHERE e.id_evento = ?`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error al obtener el evento:', error);
    return null;
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * @function updateEventAction
 * @description Actualiza un evento existente
 */
export async function updateEventAction(id: number, data: Partial<SaveEventData>) {
  let connection;
  try {
    connection = await getDbConnection();
    
    const fields = [];
    const values = [];
    
    // Construir dinámicamente la consulta
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (fields.length === 0) {
      return { success: false, message: 'No se proporcionaron datos para actualizar.' };
    }
    
    values.push(id);
    
    await connection.execute(
      `UPDATE eventos SET ${fields.join(', ')} WHERE id_evento = ?`,
      values
    );
    
    revalidatePath('/eventos');
    revalidatePath(`/eventos/${id}`);
    
    return { success: true, message: 'Evento actualizado con éxito.' };
  } catch (error: any) {
    console.error('Error al actualizar el evento:', error);
    return { 
      success: false, 
      message: error?.message || 'Error al actualizar el evento.'
    };
  } finally {
    // Asegura que la conexión a la base de datos se cierre.
    if (connection) await connection.end();
  }
}