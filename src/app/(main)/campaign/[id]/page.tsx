import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCampaignById } from '@/actions/Campaings/new-campaign-action';

function mapStatusToUi(estado?: string) {
  switch (estado) {
    case 'programada': return 'scheduled';
    case 'en_progreso': return 'sending';
    case 'completada': return 'completed';
    case 'pausada': return 'paused';
    case 'cancelada': return 'cancelled';
    case 'borrador':
    default: return 'draft';
  }
}

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const idNum = Number(params.id);
  if (Number.isNaN(idNum)) {
    return notFound();
  }

  const result = await getCampaignById(idNum);
  if (!result.success || !result.data) {
    return notFound();
  }

  const c = result.data as any;
  const status = mapStatusToUi(c.estado as string);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{c.nombre_campaign}</h1>
          <p className="text-muted-foreground">Detalle de campaña</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/campaign">
            <Button variant="outline">Volver</Button>
          </Link>
          {/* Placeholder para acción de editar si existe en el futuro */}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm text-muted-foreground">Asunto</div>
            <div className="font-medium">{c.asunto}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Estado</div>
            <Badge>{status}</Badge>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Lista de contactos</div>
            <div className="font-medium">{c.nombre_lista || '—'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Programada para</div>
            <div className="font-medium">{c.fecha_envio ? new Date(c.fecha_envio).toLocaleString('es-ES') : '—'}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contenido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: c.contenido || '' }} />
        </CardContent>
      </Card>
    </div>
  );
}
