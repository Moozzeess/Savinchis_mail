import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { bulk = false } = await request.json();
    const targetPath = bulk ? '/api/mailing/send-bulk' : '/api/mailing/send';
    return NextResponse.redirect(new URL(targetPath, request.url), 308);
  } catch (error) {
    console.error('Error en el enrutamiento de correo:', error);
    return NextResponse.json(
      { success: false, message: 'Error al procesar la solicitud' },
      { status: 400 }
    );
  }
}

export const dynamic = 'force-dynamic';
