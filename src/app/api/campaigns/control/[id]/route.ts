import { NextResponse } from 'next/server';
import { progressStore } from '@/lib/progress-store';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { action } = await req.json();

  if (!action || (action !== 'pause' && action !== 'cancel' && action !== 'resume')) {
    return NextResponse.json({ success: false, error: 'Acción no válida. Use "pause", "cancel" o "resume".' }, { status: 400 });
  }

  const currentProgress = progressStore.get(id);

  if (!currentProgress) {
    return NextResponse.json({ success: false, error: 'No hay un envío en progreso para esta campaña.' }, { status: 404 });
  }

  switch (action) {
    case 'pause':
      if (currentProgress.status === 'running') {
        progressStore.update(id, { status: 'paused', message: 'Envío pausado por el usuario.' });
        return NextResponse.json({ success: true, message: 'El envío de la campaña ha sido pausado.' });
      } else {
        return NextResponse.json({ success: false, error: 'La campaña no está en estado "running" para ser pausada.' }, { status: 409 });
      }

    case 'resume':
        if (currentProgress.status === 'paused') {
          progressStore.update(id, { status: 'running', message: 'Reanudando el envío.' });
          return NextResponse.json({ success: true, message: 'El envío de la campaña se ha reanudado.' });
        } else {
          return NextResponse.json({ success: false, error: 'La campaña no está en estado "paused" para ser reanudada.' }, { status: 409 });
        }

    case 'cancel':
      if (currentProgress.status === 'running' || currentProgress.status === 'paused') {
        progressStore.update(id, { status: 'cancelled', message: 'Envío cancelado por el usuario.', finishedAt: new Date().toISOString() });
        return NextResponse.json({ success: true, message: 'El envío de la campaña ha sido cancelado.' });
      } else {
        return NextResponse.json({ success: false, error: 'La campaña no se puede cancelar desde su estado actual.' }, { status: 409 });
      }
  }

  return NextResponse.json({ success: false, error: 'Acción desconocida.' }, { status: 400 });
}
