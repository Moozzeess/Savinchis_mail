// src/app/api/campaigns/route.ts
import { NextResponse } from 'next/server';
import { getCampaigns } from '@/actions/new-campaign-action';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;

    const result = await getCampaigns(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/campaigns:', error);
    return NextResponse.json(
      { error: 'Error al obtener las campañas' },
      { status: 500 }
    );
  }
}