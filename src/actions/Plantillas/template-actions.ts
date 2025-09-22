'use server';

import mysql from 'mysql2/promise';
import type { Block } from '@/lib/template-utils';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import { getDbConnection } from '../DBConnection';


/**
 * @interface Template
 * @description Define la estructura de una plantilla de correo electrónico o certificado.
 * @property {number} id_plantilla - Identificador único de la plantilla.
 * @property {string} nombre - Nombre descriptivo de la plantilla.
 * @property {string} asunto_predeterminado - Asunto predeterminado para plantillas de correo.
 * @property {any} contenido - El contenido de la plantilla, puede ser un arreglo de bloques (para correos) o una estructura específica para certificados.
 * @property {string} fecha_creacion - Fecha de creación de la plantilla en formato de cadena.
 * @property {'template' | 'certificate' | 'html'} tipo - Tipo de plantilla: 'template' para correos, 'certificate' para certificados, 'html' para contenido HTML.
 * @property {string} [html_content] - Contenido HTML para plantillas de tipo 'html'.
 */
export interface Template {
  id_plantilla: number;
  nombre: string;
  asunto_predeterminado: string;
  contenido: any; // Puede ser Block[] o la estructura del certificado
  fecha_creacion: string;
  tipo: 'template' | 'certificate' | 'html';
  html_content?: string; // Contenido HTML para plantillas de tipo 'html'
}

/**
 * @constant TEMPLATES_STORAGE_PATH
 * @description Ruta absoluta al directorio donde se almacenarán los archivos JSON de contenido de las plantillas.
 * Se construye uniendo el directorio de trabajo actual con 'storage' y 'templates'.
 */
const TEMPLATES_STORAGE_PATH = path.join(process.cwd(), 'storage', 'templates');

/**
 * @function ensureStorageDirectoryExists
 * @description Verifica si el directorio de almacenamiento de plantillas existe. Si no, lo crea de forma recursiva.
 * Esto asegura que el sistema de archivos esté listo para guardar los contenidos de las plantillas.
 * @returns {Promise<void>} Una promesa que se resuelve cuando el directorio existe o ha sido creado.
 * @async
 */
async function ensureStorageDirectoryExists() {
  try {
    await fs.access(TEMPLATES_STORAGE_PATH); // Intenta acceder al directorio.
  } catch {
    await fs.mkdir(TEMPLATES_STORAGE_PATH, { recursive: true }); // Si no existe, lo crea recursivamente.
  }
}

/**
 * @function getTemplatesAction
 * @description Acción de servidor para obtener una lista paginada de plantillas desde la base de datos.
 * Permite filtrar las plantillas por tipo y controlar la paginación de los resultados.
 * @param {object} params - Parámetros para la consulta de plantillas.
 * @param {'template' | 'certificate'} [params.tipo] - Filtra las plantillas por este tipo.
 * @param {number} [params.page=1] - El número de página a recuperar (por defecto 1).
 * @param {number} [params.limit=9] - El número máximo de plantillas por página (por defecto 9).
 * @returns {Promise<{templates: Template[], total: number}>} Una promesa que resuelve con un objeto que contiene
 * un arreglo de objetos `Template` y el número total de plantillas que cumplen el criterio.
 * @throws {Error} Si ocurre un error al conectar o consultar la base de datos.
 * @async
 */
export async function getTemplatesAction(params: {
  tipo?: 'template' | 'certificate',
  page?: number,
  limit?: number,
}= {}): Promise<{ templates: Template[], total: number }> {
  
  let connection;
  try {
    connection = await getDbConnection();

    const { tipo, page = 1, limit = 9 } = params;
    const offset = (page - 1) * limit; // Calcula el desplazamiento para la paginación.

    let whereClause = ''; // Inicializa la cláusula WHERE.
    const queryParams: (string | number)[] = []; // Inicializa los parámetros de la consulta.

    // Si se especifica un tipo, añade la condición WHERE.
    if (tipo) {
      whereClause = ' WHERE tipo = ?';
      queryParams.push(tipo);
    }

    // Consulta para obtener el conteo total de plantillas (para la paginación).
    const countQuery = `SELECT COUNT(*) as total FROM plantillas${whereClause}`;
    const [countRows] = await connection.execute(countQuery, queryParams);
    const total = (countRows as any[])[0].total; // Extrae el total del resultado.

    // Consulta para obtener los datos paginados de las plantillas.
    const query = `SELECT id_plantilla, nombre, asunto_predeterminado, contenido, fecha_creacion, tipo FROM plantillas${whereClause} ORDER BY fecha_creacion DESC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await connection.execute(query, queryParams);

    // Mapea las filas de la base de datos a objetos Template.
    const templates = (rows as any[]).map(row => ({
      ...row,
      contenido: row.contenido, // El contenido se maneja como viene de la DB (se asume que es el path o el JSON directo)
      // La línea comentada sugiere una lógica previa para parsear JSON si venía como string.
      // contenido: row.contenido ? (typeof row.contenido === 'string' ? JSON.parse(row.contenido) : row.contenido) : [],
    }));

    return { templates: templates as Template[], total };
  } catch (error) {
    console.error('Error al obtener las plantillas:', error);
    throw error; // Re-lanza el error para que el componente que llama pueda manejarlo.
  } finally {
    // Asegura que la conexión a la base de datos se cierre.
    if (connection) await connection.end();
  }
}

/**
 * @function getTemplateListAction
 * @description Obtiene una lista ligera de plantillas (solo ID y nombre).
 * Es ideal para rellenar selectores o listas donde no se necesita cargar el contenido completo de la plantilla,
 * optimizando el rendimiento.
 * @param {object} [params] - Parámetros opcionales.
 * @param {'template' | 'certificate'} [params.tipo] - Filtra la lista por tipo de plantilla.
 * @returns {Promise<Pick<Template, 'id_plantilla' | 'nombre'>[]>} Una promesa que resuelve con un arreglo de objetos,
 * cada uno conteniendo `id_plantilla` y `nombre` de la plantilla. Retorna un arreglo vacío en caso de error.
 * @async
 */
export async function getTemplateListAction(params?: { tipo: 'template' | 'certificate' }): Promise<Pick<Template, 'id_plantilla' | 'nombre'>[]> {
  let connection;
  try {
    connection = await getDbConnection();

    let query = 'SELECT id_plantilla, nombre FROM plantillas';
    const queryParams: string[] = [];

    // Si se especifica un tipo, añade la condición WHERE.
    if (params?.tipo) {
      query += ' WHERE tipo = ?';
      queryParams.push(params.tipo);
    }

    query += ' ORDER BY nombre ASC'; // Ordena las plantillas por nombre.

    const [rows] = await connection.execute(query, queryParams);
    return rows as Pick<Template, 'id_plantilla' | 'nombre'>[];
  } catch (error) {
    console.error('Error al obtener la lista de plantillas:', error);
    return []; // Retorna un arreglo vacío en caso de error.
  } finally {
    // Asegura que la conexión a la base de datos se cierre.
    if (connection) await connection.end();
  }
}

/**
 * @function getTemplateAction
 * @description Obtiene los detalles completos de una plantilla específica por su ID.
 * Si el contenido está almacenado como una ruta de archivo, lee y parsea el archivo JSON.
 * @param {number} id - El ID de la plantilla a recuperar.
 * @returns {Promise<Template | null>} Una promesa que resuelve con el objeto `Template` completo si se encuentra,
 * o `null` si la plantilla no existe o si ocurre un error.
 * @async
 */
export async function getTemplateAction(id: number): Promise<Template | null> {
  let connection;
  try {
    connection = await getDbConnection();
    // Consulta la base de datos para obtener los metadatos de la plantilla.
    const [rows] = await connection.execute(
      'SELECT id_plantilla, nombre, asunto_predeterminado, contenido, fecha_creacion, tipo FROM plantillas WHERE id_plantilla = ?',
      [id]
    );

    // Si no se encuentra la plantilla, retorna null.
    if ((rows as any[]).length === 0) return null;

    const row = (rows as any[])[0];
    let contenidoReal: object | null = null;

    // Manejo del contenido: si es una cadena, se asume que es una ruta a un archivo JSON.
    if (typeof row.contenido === 'string' && row.contenido) {
      try {
        // Construye la ruta completa al archivo de contenido.
        const filePath = path.join(process.cwd(), row.contenido);
        // Lee el contenido del archivo.
        const fileContent = await fs.readFile(filePath, 'utf-8');
        // Parsea el contenido JSON del archivo.
        contenidoReal = JSON.parse(fileContent);
      } catch (error) {
        console.error(`Error al leer o parsear el archivo de contenido para la plantilla ${id}:`, error);
        // Si hay un error en el archivo, contenidoReal permanece null.
      }
    } else {
      // Si el contenido no es una cadena (ej. ya es un objeto JSON directo de la DB, o es null/undefined), lo asigna directamente.
      contenidoReal = row.contenido;
    }

    // Retorna la plantilla con el contenido real (desde el archivo o directamente de la DB).
    return {
      id_plantilla: row.id_plantilla,
      nombre: row.nombre,
      asunto_predeterminado: row.asunto_predeterminado,
      fecha_creacion: row.fecha_creacion,
      tipo: row.tipo,
      contenido: contenidoReal,
    } as Template;
  } catch (error) {
    console.error(`Error al obtener la plantilla ${id}:`, error);
    return null; // Retorna null en caso de cualquier error general.
  } finally {
    // Asegura que la conexión a la base de datos se cierre.
    if (connection) await connection.end();
  }
}

interface SaveTemplateParams extends Omit<Template, 'id_plantilla' | 'fecha_creacion'> {
  id_plantilla?: number; // Opcional para actualización
}

/**
 * @function saveTemplateAction
 * @description Guarda una nueva plantilla o actualiza una existente en la base de datos y su contenido en un archivo JSON.
 * Implementa una transacción para asegurar la consistencia entre la base de datos y el archivo.
 * @param {SaveTemplateParams} data - Los datos de la plantilla a guardar.
 * @returns {Promise<{success: boolean, message: string, id?: number}>} Una promesa que resuelve con un objeto indicando
 * si la operación fue exitosa, un mensaje descriptivo y el ID de la plantilla.
 * @async
 */
export async function saveTemplateAction(data: SaveTemplateParams) {
  let connection;
  try {
    connection = await getDbConnection();
    await connection.beginTransaction();

    const { id_plantilla, nombre, asunto_predeterminado, contenido, tipo } = data;
    const isUpdate = !!id_plantilla;
    
    // 1. Preparar y guardar el contenido de la plantilla como un archivo JSON en el disco.
    await ensureStorageDirectoryExists();
    
    // Determinar el ID a usar (nuevo o existente)
    let templateId = id_plantilla;
    
    if (isUpdate) {
      // Actualizar plantilla existente
      const [updateResult] = await connection.execute(
        'UPDATE plantillas SET nombre = ?, asunto_predeterminado = ?, tipo = ? WHERE id_plantilla = ?',
        [nombre, asunto_predeterminado, tipo, id_plantilla]
      );
      
      if ((updateResult as any).affectedRows === 0) {
        throw new Error('No se encontró la plantilla para actualizar.');
      }
    } else {
      // Insertar nueva plantilla
      const [insertResult] = await connection.execute(
        'INSERT INTO plantillas (nombre, asunto_predeterminado, contenido, tipo, fecha_creacion) VALUES (?, ?, ?, ?, NOW())',
        [nombre, asunto_predeterminado, 'pending_file_path', tipo]
      );
      
      templateId = (insertResult as any).insertId;
      if (!templateId) {
        throw new Error('No se pudo obtener el ID de la nueva plantilla.');
      }
    }

    // 2. Guardar el contenido en un archivo JSON
    const fileName = `template-${templateId}.json`;
    const filePath = path.join(TEMPLATES_STORAGE_PATH, fileName);
    const fileContent = JSON.stringify(contenido, null, 2);
    await fs.writeFile(filePath, fileContent);

    // 3. Actualizar la ruta del archivo en la base de datos
    const relativePath = path.join('storage', 'templates', fileName).replace(/\\/g, '/');
    await connection.execute(
      'UPDATE plantillas SET contenido = ? WHERE id_plantilla = ?',
      [relativePath, templateId]
    );

    await connection.commit();
    revalidatePath('/templates');
    revalidatePath(`/templates/editor/${templateId}`);
    revalidatePath(`/certificates/editor/${templateId}`);
    
    return { 
      success: true, 
      message: isUpdate ? 'Plantilla actualizada con éxito.' : 'Plantilla guardada con éxito.',
      id: templateId
    };

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error al guardar la plantilla:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al guardar la plantilla.'
    };
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * @function deleteTemplateAction
 * @description Elimina una plantilla de la base de datos por su ID.
 * Nota: Actualmente, solo elimina el registro de la base de datos, no el archivo de contenido asociado.
 * @param {number} id - El ID de la plantilla a eliminar.
 * @returns {Promise<{success: boolean; message: string}>} Una promesa que resuelve con un objeto indicando
 * si la operación fue exitosa y un mensaje descriptivo.
 * @async
 */
export async function deleteTemplateAction(id: number): Promise<{ success: boolean; message: string }> {
  let connection;
  try {
    connection = await getDbConnection();
    // Ejecuta la consulta DELETE para eliminar la plantilla por ID.
    await connection.execute('DELETE FROM plantillas WHERE id_plantilla = ?', [id]);
    return { success: true, message: 'Plantilla eliminada con éxito.' };
  } catch (error) {
    console.error(`Error al eliminar la plantilla ${id}:`, error);
    return { success: false, message: `Error al eliminar la plantilla: ${(error as Error).message}` };
  } finally {
    // Asegura que la conexión a la base de datos se cierre.
    if (connection) await connection.end();
  }
}