import { NextResponse } from 'next/server';
import { getTemplateAction } from '@/actions/Plantillas/template-actions';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15: params es una Promise
    const { id: idStr } = await context.params;
    const id = Number(idStr);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        { error: 'Parámetro id inválido' },
        { status: 400 }
      );
    }

    const template = await getTemplateAction(id);
    if (!template) {
      return NextResponse.json(
        { error: 'Plantilla no encontrada' },
        { status: 404 }
      );
    }

    // El contenido ya viene resuelto por getTemplateAction (si era ruta, lee y parsea el JSON)
    return NextResponse.json({
      success: true,
      id: template.id_plantilla,
      name: template.nombre,
      subject: template.asunto_predeterminado,
      type: template.tipo,
      content: template.contenido,
    });
  } catch (error) {
    console.error('Error en GET /api/templates/[id]:', error);
    return NextResponse.json(
      { error: 'Error al obtener la plantilla' },
      { status: 500 }
    );
  }
}
