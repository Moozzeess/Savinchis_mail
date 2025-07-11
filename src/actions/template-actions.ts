'use server';

import mysql from 'mysql2/promise';
import type { Block } from '@/lib/template-utils';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

async function getDbConnection() {
    const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } = process.env;
    if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
        throw new Error('Faltan las variables de entorno de la base de datos. Por favor, configúralas.');
    }
    return mysql.createConnection({
        host: MYSQL_HOST,
        port: MYSQL_PORT ? parseInt(MYSQL_PORT, 10) : 3306,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
    });
}

export interface Template {
    id_plantilla: number;
    nombre: string;
    asunto_predeterminado: string;
    contenido: any; // Puede ser Block[] o la estructura del certificado
    fecha_creacion: string;
    tipo: 'template' | 'certificate';
}

const TEMPLATES_STORAGE_PATH = path.join(process.cwd(), 'storage', 'templates');

async function ensureStorageDirectoryExists() {
    try {
        await fs.access(TEMPLATES_STORAGE_PATH);
    } catch {
        await fs.mkdir(TEMPLATES_STORAGE_PATH, { recursive: true });
    }
}

export async function getTemplatesAction(params: { 
    tipo?: 'template' | 'certificate',
    page?: number,
    limit?: number,
}): Promise<{templates: Template[], total: number}> {
    let connection;
    try {
        connection = await getDbConnection();
        
        const { tipo, page = 1, limit = 9 } = params;
        const offset = (page - 1) * limit;

        let whereClause = '';
        const queryParams: (string | number)[] = [];

        if (tipo) {
            whereClause = ' WHERE tipo = ?';
            queryParams.push(tipo);
        }

        // Query for total count
        const countQuery = `SELECT COUNT(*) as total FROM plantillas${whereClause}`;
        const [countRows] = await connection.execute(countQuery, queryParams);
        const total = (countRows as any[])[0].total;

        // Query for paginated data
        const query = `SELECT id_plantilla, nombre, asunto_predeterminado, contenido, fecha_creacion, tipo FROM plantillas${whereClause} ORDER BY fecha_creacion DESC LIMIT ${limit} OFFSET ${offset}`;

        const [rows] = await connection.execute(query, queryParams);
        
        const templates = (rows as any[]).map(row => ({
            ...row,
            contenido: row.contenido ? (typeof row.contenido === 'string' ? JSON.parse(row.contenido) : row.contenido) : [],
        }));
        
        return { templates: templates as Template[], total };
    } catch (error) {
        console.error('Error al obtener las plantillas:', error);
        throw error; // Re-lanza el error para que el componente que llama pueda manejarlo.
    } finally {
        if (connection) await connection.end();
    }
}

/**
 * Obtiene una lista ligera de plantillas (solo ID y nombre).
 * Ideal para rellenar selectores y listas sin cargar datos pesados como el `contenido`.
 */
export async function getTemplateListAction(params?: { tipo: 'template' | 'certificate' }): Promise<Pick<Template, 'id_plantilla' | 'nombre'>[]> {
    let connection;
    try {
        connection = await getDbConnection();
        
        let query = 'SELECT id_plantilla, nombre FROM plantillas';
        const queryParams: string[] = [];

        if (params?.tipo) {
            query += ' WHERE tipo = ?';
            queryParams.push(params.tipo);
        }

        query += ' ORDER BY nombre ASC';

        const [rows] = await connection.execute(query, queryParams);
        return rows as Pick<Template, 'id_plantilla' | 'nombre'>[];
    } catch (error) {
        console.error('Error al obtener la lista de plantillas:', error);
        return [];
    } finally {
        if (connection) await connection.end();
    }
}

export async function getTemplateAction(id: number): Promise<Template | null> {
    let connection;
    try {
        connection = await getDbConnection();
        const [rows] = await connection.execute('SELECT id_plantilla, nombre, asunto_predeterminado, contenido, fecha_creacion, tipo FROM plantillas WHERE id_plantilla = ?', [id]);
        
        if ((rows as any[]).length === 0) return null;

        const row = (rows as any[])[0];
        return {
            ...row,
            contenido: row.contenido ? (typeof row.contenido === 'string' ? JSON.parse(row.contenido) : row.contenido) : [],
        } as Template;

    } catch (error) {
        console.error(`Error al obtener la plantilla ${id}:`, error);
        return null;
    } finally {
        if (connection) await connection.end();
    }
}

export async function saveTemplateAction(data: Omit<Template, 'id_plantilla' | 'fecha_creacion'>) {
    let connection;
    try {
        connection = await getDbConnection();
        await connection.beginTransaction();

        // 1. Insertar los metadatos con un contenido temporal para obtener el ID
        const { nombre, asunto_predeterminado, contenido, tipo } = data;
        const placeholderContent = 'pending_file_path';
        
        const [insertResult] = await connection.execute(
            'INSERT INTO plantillas (nombre, asunto_predeterminado, contenido, tipo, fecha_creacion) VALUES (?, ?, ?, ?, NOW())',
            [nombre, asunto_predeterminado, placeholderContent, tipo]
        );

        const newTemplateId = (insertResult as any).insertId;
        if (!newTemplateId) {
            throw new Error('No se pudo obtener el ID de la nueva plantilla.');
        }

        // 2. Preparar y guardar el archivo JSON en el disco
        await ensureStorageDirectoryExists();
        const fileName = `template-${newTemplateId}.json`;
        const filePath = path.join(TEMPLATES_STORAGE_PATH, fileName);
        const fileContent = JSON.stringify(contenido, null, 2); // Formateado para legibilidad

        await fs.writeFile(filePath, fileContent);

        // 3. Actualizar el registro con la ruta real del archivo
        const relativePath = path.join('storage', 'templates', fileName).replace(/\\/g, '/'); // Guardar con slashes
        await connection.execute(
            'UPDATE plantillas SET contenido = ? WHERE id_plantilla = ?',
            [relativePath, newTemplateId]
        );

        await connection.commit();

        revalidatePath('/templates');
        return { success: true, message: 'Plantilla guardada con éxito.' };

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error al guardar la plantilla:', error);
        return { success: false, message: 'Error al guardar la plantilla.' };
    } finally {
        if (connection) await connection.end();
    }
}

export async function deleteTemplateAction(id: number): Promise<{ success: boolean; message: string }> {
    let connection;
    try {
        connection = await getDbConnection();
        await connection.execute('DELETE FROM plantillas WHERE id_plantilla = ?', [id]);
        return { success: true, message: 'Plantilla eliminada con éxito.' };
    } catch (error) {
        console.error(`Error al eliminar la plantilla ${id}:`, error);
        return { success: false, message: `Error al eliminar la plantilla: ${(error as Error).message}` };
    } finally {
        if (connection) await connection.end();
    }
}
