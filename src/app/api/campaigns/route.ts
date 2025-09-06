// src/app/api/campaigns/route.ts
import { NextResponse } from 'next/server';
import { getCampaigns, createCampaign } from '@/actions/Campaings/new-campaign-action';
import { campaignContentService } from '@/service/campaignContentService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  // If path parameter exists, handle content request
  if (path) {
    try {
      // Decodificar la ruta y normalizar las barras
      const decodedPath = decodeURIComponent(path).replace(/\\/g, '/');
      const content = await campaignContentService.getCampaignContent(decodedPath);
      
      if (!content) {
        return NextResponse.json(
          { error: 'Contenido no encontrado' }, 
          { status: 404 }
        );
      }
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    } catch (error) {
      console.error('Error al cargar el contenido:', error);
      return NextResponse.json(
        { error: 'Error al cargar el contenido' },
        { status: 500 }
      );
    }
  }

  // Otherwise, handle the campaigns list request
  try {
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

// Keep the existing POST handler
export async function POST(request: Request) {
  try {
    const campaignData = await request.json();
    const result = await createCampaign(campaignData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in POST /api/campaigns:', error);
    return NextResponse.json(
      { error: 'Error al crear la campaña' },
      { status: 500 }
    );
  }
}