'use server';

import mysql from 'mysql2/promise';
import type { Block } from '@/lib/template-utils';

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
    contenido: Block[];
    fecha_creacion: string;
}

export async function getTemplatesAction(): Promise<Template[]> {
    let connection;
    try {
        connection = await getDbConnection();
        const [rows] = await connection.execute('SELECT id_plantilla, nombre, asunto_predeterminado, contenido, fecha_creacion FROM plantillas ORDER BY fecha_creacion DESC');
        
        const templates = (rows as any[]).map(row => ({
            ...row,
            contenido: row.contenido ? (typeof row.contenido === 'string' ? JSON.parse(row.contenido) : row.contenido) : [],
        }));
        
        return templates as Template[];
    } catch (error) {
        console.error('Error al obtener las plantillas:', error);
        return [];
    } finally {
        if (connection) await connection.end();
    }
}

export async function getTemplateAction(id: number): Promise<Template | null> {
    let connection;
    try {
        connection = await getDbConnection();
        const [rows] = await connection.execute('SELECT id_plantilla, nombre, asunto_predeterminado, contenido, fecha_creacion FROM plantillas WHERE id_plantilla = ?', [id]);
        
        if ((rows as any[]).length === 0) return null;

        const row = (rows as any[])[0];
        return {
            ...row,
            contenido: row.contenido ? JSON.parse(row.contenido) : [],
        } as Template;

    } catch (error) {
        console.error(`Error al obtener la plantilla ${id}:`, error);
        return null;
    } finally {
        if (connection) await connection.end();
    }
}

export async function saveTemplateAction(data: {
    id?: number,
    nombre: string,
    asunto_predeterminado: string,
    contenido: any
}): Promise<{ success: boolean; message: string, id?: number }> {
    const { id, nombre, asunto_predeterminado, contenido } = data;
    
    // Asegurarse de que el contenido se guarde como un string JSON
    const contenidoJson = typeof contenido === 'object' ? JSON.stringify(contenido) : contenido;

    let connection;
    try {
        connection = await getDbConnection();
        if (id) {
            await connection.execute(
                'UPDATE plantillas SET nombre = ?, asunto_predeterminado = ?, contenido = ? WHERE id_plantilla = ?',
                [nombre, asunto_predeterminado, contenidoJson, id]
            );
            return { success: true, message: 'Plantilla actualizada con éxito.', id };
        } else {
            const [result] = await connection.execute(
                'INSERT INTO plantillas (nombre, asunto_predeterminado, contenido) VALUES (?, ?, ?)',
                [nombre, asunto_predeterminado, contenidoJson]
            );
            const insertId = (result as any).insertId;
            return { success: true, message: 'Plantilla creada con éxito.', id: insertId };
        }
    } catch (error) {
        console.error('Error al guardar la plantilla:', error);
        return { success: false, message: `Error al guardar la plantilla: ${(error as Error).message}` };
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
