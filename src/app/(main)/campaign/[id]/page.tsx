import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCampaignById } from '@/actions/Campaings/new-campaign-action';
import { Progress } from '@/components/ui/progress';
import { Mail, Clock, AlertCircle, CheckCircle2, XCircle, PauseCircle, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { generateHtmlFromBlocks } from '@/lib/template-utils';
import { DeleteCampaignButton } from '@/components/campaign/delete-campaign-button';

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

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idNum = Number(id);
  if (Number.isNaN(idNum)) {
    return notFound();
  }

  const result = await getCampaignById(idNum);
  if (!result.success || !result.data) {
    return notFound();
  }

  const c = result.data as any;
  const status = mapStatusToUi(c.estado as string);

  // Convertir contenido almacenado (puede ser HTML directo o JSON de bloques)
  const contenidoRaw: string = c.contenido || '';
  let contenidoHtml: string = '';
  try {
    const maybeJson = JSON.parse(contenidoRaw);
    if (Array.isArray(maybeJson)) {
      contenidoHtml = generateHtmlFromBlocks(maybeJson as any);
    } else {
      // No es arreglo de bloques, mostrar como HTML plano
      contenidoHtml = contenidoRaw;
    }
  } catch {
    // No es JSON, asumir que es HTML
    contenidoHtml = contenidoRaw;
  }

  // Recurrencia (si existe)
  const hasRecurrence = !!c.tipo_recurrencia;
  const recurrenceLabel = hasRecurrence
    ? (() => {
        const tipo = c.tipo_recurrencia as string;
        const intervalo = c.intervalo ? `cada ${c.intervalo} ` : '';
        switch (tipo) {
          case 'diaria':
            return `${intervalo}día(s)`;
          case 'semanal':
            return `${intervalo}semana(s) (${c.dias_semana || '—'})`;
          case 'mensual':
            return `${intervalo}mes(es) (día ${c.dia_mes || '—'})`;
          case 'anual':
            return `${intervalo}año(s)`;
          default:
            return tipo;
        }
      })()
    : '';

  // Mock data - replace with actual data from your API
  const campaignStats = {
    totalEmails: 1245,
    sent: 845,
    pending: 400,
    failed: 15,
    opened: 420,
    clicked: 210,
    progress: 68, // percentage
    timeRemaining: '2 días 5 horas',
    recurrences: {
      total: 5,
      completed: 3,
      remaining: 2
    },
    mailbox: 'soporte@savinchis.com',
    nextScheduled: '2025-09-04T09:00:00'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 p-6 rounded-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-primary-foreground">{c.nombre_campaign}</h1>
          <p className="text-muted-foreground dark:text-primary-foreground/80">Detalle de campaña</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/campaign">
            <Button variant="outline" className="border-primary/20 hover:bg-primary/5 hover:text-primary dark:border-primary/30 dark:text-primary-foreground dark:hover:bg-primary/10">
              Volver
            </Button>
          </Link>
          <Button variant="outline" className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-400/30 dark:hover:bg-amber-900/20 dark:hover:border-amber-400/50">
            <PauseCircle className="w-4 h-4 mr-2" />
            Pausar
          </Button>
          <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-400/30 dark:hover:bg-red-900/20 dark:hover:border-red-400/50">
            <XCircle className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <DeleteCampaignButton campaignId={idNum} />
        </div>
      </div>

      {/* Progress Section */}
      <Card className="border-primary/20 dark:border-primary/30 bg-gradient-to-br from-card to-primary/5 dark:from-card/80 dark:to-primary/10">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <CardTitle className="text-primary dark:text-primary-foreground">Progreso de la campaña</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground bg-primary/5 dark:bg-primary/20 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 mr-1.5 text-primary dark:text-primary-foreground/80" />
              <span className="text-primary dark:text-primary-foreground/80">Tiempo restante: {campaignStats.timeRemaining}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between text-sm text-muted-foreground">
              <span className="font-medium">Progreso: <span className="text-primary dark:text-primary-foreground">{campaignStats.progress}%</span></span>
              <span className="font-medium">{campaignStats.sent} de {campaignStats.totalEmails} correos</span>
            </div>
            <div className="relative">
              <Progress value={campaignStats.progress} className="h-3 bg-primary/10 dark:bg-primary/20" indicatorClassName="bg-gradient-to-r from-primary to-primary/70" />
              <div className="absolute inset-0 flex items-center justify-end pr-2">
                <div className="h-3 w-0.5 bg-primary/30 dark:bg-primary-foreground/50"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Total de correos</CardTitle>
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
              <Mail className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{campaignStats.totalEmails}</div>
            <p className="text-xs text-blue-700/80 dark:text-blue-300/80">
              {campaignStats.sent} enviados • {campaignStats.pending} pendientes
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 dark:border-green-900/50 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Tasa de apertura</CardTitle>
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {Math.round((campaignStats.opened / campaignStats.sent) * 100) || 0}%
            </div>
            <p className="text-xs text-green-700/80 dark:text-green-300/80">
              {campaignStats.opened} de {campaignStats.sent} correos abiertos
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 dark:border-purple-900/50 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">Tasa de clics</CardTitle>
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
              <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {Math.round((campaignStats.clicked / campaignStats.sent) * 100) || 0}%
            </div>
            <p className="text-xs text-purple-700/80 dark:text-purple-300/80">
              {campaignStats.clicked} de {campaignStats.sent} clics registrados
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-rose-200 dark:border-rose-900/50 bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/20 dark:to-rose-900/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-800 dark:text-rose-200">Correos fallidos</CardTitle>
            <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/50">
              <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-900 dark:text-rose-100">{campaignStats.failed}</div>
            <p className="text-xs text-rose-700/80 dark:text-rose-300/80">
              {Math.round((campaignStats.failed / campaignStats.totalEmails) * 100) || 0}% de tasa de error
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-indigo-100 dark:border-indigo-900/30 bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 dark:from-indigo-900/10 dark:to-indigo-900/5">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <CardTitle className="text-indigo-900 dark:text-indigo-100">Información de la campaña</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-white/50 dark:bg-indigo-950/20 border border-indigo-50 dark:border-indigo-900/20">
              <div className="text-xs font-medium text-indigo-700/80 dark:text-indigo-300/80 mb-1">Asunto</div>
              <div className="font-medium text-indigo-900 dark:text-indigo-100">{c.asunto}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/50 dark:bg-indigo-950/20 border border-indigo-50 dark:border-indigo-900/20">
              <div className="text-xs font-medium text-indigo-700/80 dark:text-indigo-300/80 mb-1">Lista de contactos</div>
              <div className="font-medium text-indigo-900 dark:text-indigo-100">{c.nombre_lista || '—'}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/50 dark:bg-indigo-950/20 border border-indigo-50 dark:border-indigo-900/20">
              <div className="text-xs font-medium text-indigo-700/80 dark:text-indigo-300/80 mb-1">Buzón asociado</div>
              <div className="font-medium text-indigo-900 dark:text-indigo-100">{campaignStats.mailbox}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100 dark:border-amber-900/30 bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-900/10 dark:to-amber-900/5">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-300" />
              </div>
              <CardTitle className="text-amber-900 dark:text-amber-100">Programación</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-white/50 dark:bg-amber-950/20 border border-amber-50 dark:border-amber-900/20">
              <div className="text-xs font-medium text-amber-700/80 dark:text-amber-300/80 mb-1">Estado</div>
              <div>
                <Badge className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  status === 'sending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                  status === 'paused' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {status}
                </Badge>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/50 dark:bg-amber-950/20 border border-amber-50 dark:border-amber-900/20">
              <div className="text-xs font-medium text-amber-700/80 dark:text-amber-300/80 mb-1">Inicio programado</div>
              <div className="font-medium text-amber-900 dark:text-amber-100">
                {c.fecha_envio ? new Date(c.fecha_envio).toLocaleString('es-ES') : '—'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/50 dark:bg-amber-950/20 border border-amber-50 dark:border-amber-900/20">
              <div className="text-xs font-medium text-amber-700/80 dark:text-amber-300/80 mb-1">Próximo envío</div>
              <div className="font-medium text-amber-900 dark:text-amber-100 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
                {new Date(campaignStats.nextScheduled).toLocaleString('es-ES')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recurrencia real (si existe) */}
      {hasRecurrence && (
        <Card>
          <CardHeader>
            <CardTitle>Recurrencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60">
                <div className="text-xs text-muted-foreground mb-1">Tipo</div>
                <div className="font-medium">{recurrenceLabel}</div>
              </div>
              <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60">
                <div className="text-xs text-muted-foreground mb-1">Próxima ejecución</div>
                <div className="font-medium">{c.proxima_ejecucion ? new Date(c.proxima_ejecucion).toLocaleString('es-ES') : '—'}</div>
              </div>
              <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60">
                <div className="text-xs text-muted-foreground mb-1">Última ejecución</div>
                <div className="font-medium">{c.ultima_ejecucion ? new Date(c.ultima_ejecucion).toLocaleString('es-ES') : '—'}</div>
              </div>
              <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60">
                <div className="text-xs text-muted-foreground mb-1">Estado</div>
                <div className="font-medium capitalize">{c.estado_recurrencia || 'activa'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <CardTitle className="text-yellow-800 text-lg">Alertas</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm text-yellow-700">
              • {campaignStats.failed} correos no se pudieron enviar. Revisa la configuración SMTP.
            </div>
            <div className="text-sm text-yellow-700">
              • La tasa de apertura es baja. Considera mejorar el asunto del correo.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Contenido del correo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: contenidoHtml }} />
        </CardContent>
      </Card>
    </div>
  );
}
