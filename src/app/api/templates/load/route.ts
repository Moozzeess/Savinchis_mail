import { NextResponse } from 'next/server';
import { getTemplatesAction } from '@/actions/Plantillas/template-actions';
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
      const safePath = path.normalize(pathParam).replace(/^(\.{2}(\/|\\|$))+/, '');
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

  // Si no hay path, listar las plantillas con contenido resuelto
  try {
    // Mapeamos 'email' -> 'template' para mantener compatibilidad con el cliente
    const mappedTipo = tipo === 'email' ? 'template' : tipo;

    const { templates } = await getTemplatesAction({ 
      tipo: (mappedTipo === 'certificate' || mappedTipo === 'template') ? mappedTipo : undefined,
      limit
    });

    // Resolver contenido si viene como ruta (string)
    const templatesWithContent = await Promise.all(templates.slice(0, limit).map(async (tpl) => {
      try {
        if (typeof tpl.contenido === 'string' && tpl.contenido) {
          const safePath = path.normalize(tpl.contenido).replace(/^(\.{2}(\/|\\|$))+/, '');
          const fullPath = path.join(process.cwd(), safePath);
          const fileContent = await fs.readFile(fullPath, 'utf-8');
          const jsonContent = JSON.parse(fileContent);
          return { ...tpl, contenido: jsonContent };
        }
        return tpl;
      } catch (e) {
        console.error('Error resolviendo contenido de plantilla', tpl.id_plantilla, e);
        // Si falla la lectura, devolvemos la plantilla tal cual para no romper la UI
        return tpl;
      }
    }));

    return NextResponse.json({ templates: templatesWithContent });
  } catch (error) {
    console.error('Error al cargar las plantillas:', error);
    return NextResponse.json(
      { error: 'Error al cargar las plantillas' },
      { status: 500 }
    );
  }
}