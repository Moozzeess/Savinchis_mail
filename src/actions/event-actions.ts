'use server';

import { revalidatePath } from 'next/cache';
import mysql from 'mysql2/promise';

/**
 * @function getDbConnection
 * @description Establece y retorna una conexión a la base de datos MySQL utilizando las variables de entorno.
 * @returns {Promise<mysql.Connection>} Una promesa que resuelve con un objeto de conexión a la base de datos.
 * @throws {Error} Si alguna de las variables de entorno de la base de datos (MYSQL_HOST, MYSQL_USER, MYSQL_DATABASE) no está configurada.
 * @async
 */
async function getDbConnection() {
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } = process.env;
  if (!MYSQL_HOST || !MYSQL_USER || !!MYSQL_DATABASE) {
    throw new Error('Faltan las variables de entorno de la base de datos. Por favor, configúralas.');
  }

  // Parsea el puerto a un entero, usando 3306 como valor predeterminado si MYSQL_PORT no está definido.
  const port = MYSQL_PORT ? parseInt(MYSQL_PORT, 10) : 3306;

  return await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: port
  });
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
    const [rows] = await connection.execute(`
            SELECT
                e.id_evento,
                e.nombre,
                e.fecha,
                p.nombre as nombre_plantilla,
                CASE
                    WHEN e.fecha < CURDATE() THEN 'Realizado'
                    ELSE 'Próximo'
                END AS estado,
                0 as asistentes
            FROM eventos e
            JOIN plantillas p ON e.id_plantilla_invitacion = p.id_plantilla
            ORDER BY e.fecha DESC
        `);
    return rows as any[];
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
export async function saveEventAction(data: {
  nombre: string;
  fecha: Date;
  id_plantilla_invitacion: number;
  id_plantilla_certificado: number;
}) {
  const { nombre, fecha, id_plantilla_invitacion, id_plantilla_certificado } = data;
  let connection;
  try {
    connection = await getDbConnection();
    await connection.execute(
      'INSERT INTO eventos (nombre, fecha, id_plantilla_invitacion, id_plantilla_certificado) VALUES (?, ?, ?, ?)',
      [nombre, fecha, id_plantilla_invitacion, id_plantilla_certificado]
    );

    // Revalida la caché de la ruta /events para reflejar los cambios.
    revalidatePath('/events');

    return { success: true, message: 'Evento creado con éxito.' };
  } catch (error) {
    console.error('Error al crear el evento:', error);
    return { success: false, message: 'Error al crear el evento.' };
  } finally {
    // Asegura que la conexión a la base de datos se cierre.
    if (connection) await connection.end();
  }
}