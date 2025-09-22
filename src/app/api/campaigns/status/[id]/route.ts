import { NextResponse } from 'next/server';
import { progressStore } from '@/lib/progress-store';

// En Next.js 15, los parámetros dinámicos llegan como Promise y deben esperarse
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const progress = progressStore.get(id);
  if (!progress) {
    return NextResponse.json({ success: false, error: 'No hay progreso para esta campaña' }, { status: 404 });
  }
  return NextResponse.json({ success: true, progress });
}
