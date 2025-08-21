import { NextResponse } from 'next/server';
import { getTemplateListAction } from '@/actions/Plantillas/template-actions';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pathParam = searchParams.get('path');
  const tipo = searchParams.get('tipo') as 'email' | 'certificate' | 'template' | null;
  const limit = Number(searchParams.get('limit')) || 10;

  // Si se proporciona un path, cargar el contenido del archivo
  if (pathParam) {
    try {
      // Asegurarse de que el path sea relativo y no intente acceder a directorios fuera del proyecto
      const safePath = path.normalize(pathParam).replace(/^(\.\.(\/|\\|$))+/, '');
      const fullPath = path.join(process.cwd(), safePath);
      
      const fileContent = await fs.readFile(fullPath, 'utf-8');
      const jsonContent = JSON.parse(fileContent);
      
      return NextResponse.json(jsonContent);
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
      return NextResponse.json(
        { error: 'Error al cargar el archivo de plantilla' },
        { status: 500 }
      );
    }
  }

  // Si no hay path, listar las plantillas (comportamiento original)
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