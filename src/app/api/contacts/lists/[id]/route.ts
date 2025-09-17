import { NextResponse } from 'next/server';
import { getDbConnection } from '@/actions/DBConnection';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Next.js 15: params es una Promise
  const { id: idStr } = await context.params;
  const listId = Number(idStr);

  if (!listId || Number.isNaN(listId)) {
    return NextResponse.json(
      { error: 'Parámetro id inválido' },
      { status: 400 }
    );
  }

  let connection: any;
  try {
    connection = await getDbConnection();

    const [rows] = await connection.execute(
      `SELECT c.id_contacto, c.nombre_completo, c.email, c.telefono, c.empresa, c.datos_adicionales
       FROM contactos_lista cl
       INNER JOIN contactos c ON c.id_contacto = cl.id_contacto
       WHERE cl.id_lista = ? AND cl.estado = 'activo' AND c.estado = 'activo'`,
      [listId]
    );

    const contacts = (rows as any[]).map((r) => {
      let extra: Record<string, any> = {};
      try {
        extra = r.datos_adicionales ? JSON.parse(r.datos_adicionales) : {};
      } catch {
        extra = {};
      }
      return {
        id: r.id_contacto,
        name: r.nombre_completo,
        email: r.email,
        phone: r.telefono ?? null,
        company: r.empresa ?? null,
        ...extra,
      };
    });

    return NextResponse.json({ success: true, contacts });
  } catch (error) {
    console.error('Error en GET /api/contacts/lists/[id]:', error);
    return NextResponse.json(
      { error: 'Error al obtener la lista de contactos' },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
