import { NextResponse } from 'next/server';
import { getTemplateListAction } from '@/actions/template-actions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('tipo') as 'email' | 'certificate' | 'template' | null;
  const limit = Number(searchParams.get('limit')) || 10;

  try {
    const templates = await getTemplateListAction({ 
      tipo: (tipo === 'certificate' || tipo === 'template') ? tipo : undefined
    });
    
    return NextResponse.json({ 
      templates: templates.slice(0, limit) 
    });
  } catch (error) {
    console.error('Error al cargar las plantillas:', error);
    return NextResponse.json(
      { error: 'Error al cargar las plantillas' },
      { status: 500 }
    );
  }
}