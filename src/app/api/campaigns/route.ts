// src/app/api/campaigns/route.ts
import { NextResponse } from 'next/server';
import { getCampaigns, createCampaign } from '@/actions/Campaings/new-campaign-action';

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

export async function POST(request: Request) {
  try {
    const campaignData = await request.json();
    const result = await createCampaign(campaignData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Error al crear la campaña' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Campaña creada exitosamente',
      data: result.campaignId ? { id: result.campaignId } : null
    });
  } catch (error) {
    console.error('Error in POST /api/campaigns:', error);
    return NextResponse.json(
      { error: 'Error al crear la campaña' },
      { status: 500 }
    );
  }
}