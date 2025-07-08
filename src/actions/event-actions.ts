'use server';

import { revalidatePath } from 'next/cache';
import { getDbConnection } from '@/lib/db/index';

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
            JOIN plantillas p ON e.id_plantilla = p.id_plantilla
            ORDER BY e.fecha DESC
        `);
        return rows as any[];
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        return [];
    } finally {
        if (connection) await connection.end();
    }
}

export async function saveEventAction(data: {
    nombre: string;
    fecha: Date;
    id_plantilla: number;
}) {
    const { nombre, fecha, id_plantilla } = data;
    let connection;
    try {
        connection = await getDbConnection();
        await connection.execute(
            'INSERT INTO eventos (nombre, fecha, id_plantilla) VALUES (?, ?, ?)',
            [nombre, fecha, id_plantilla]
        );

        revalidatePath('/events');

        return { success: true, message: 'Evento creado con éxito.' };
    } catch (error) {
        console.error('Error al crear el evento:', error);
        return { success: false, message: 'Error al crear el evento.' };
    } finally {
        if (connection) await connection.end();
    }
}
