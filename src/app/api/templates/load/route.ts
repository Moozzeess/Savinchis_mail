import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json(
      { error: 'Ruta de archivo no proporcionada' },
      { status: 400 }
    );
  }

  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = await fs.readFile(fullPath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al cargar la plantilla:', error);
    return NextResponse.json(
      { error: 'Error al cargar la plantilla' },
      { status: 500 }
    );
  }
}
