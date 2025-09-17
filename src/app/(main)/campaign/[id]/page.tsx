'use client';

import { useState, useEffect, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCampaignById, updateCampaignStatus } from '@/actions/Campaings/new-campaign-action';
import { Progress } from '@/components/ui/progress';
import { Mail, Clock, AlertCircle, CheckCircle2, XCircle, PauseCircle, Calendar, Send, Play, RotateCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { generateHtmlFromBlocks } from '@/lib/template-utils';
import { DeleteCampaignButton } from '@/components/campaign/delete-campaign-button';
import EmailPreview from '@/components/campaign/email-preview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressCard } from '@/components/Analisis/progress-card';
import { StatsGrid } from '@/components/Analisis/stats-grid';
import { useToast } from '@/components/ui/use-toast';
import { SendCampaignDialog } from '@/components/campaign/send-campaign-dialog';
import { Pencil } from 'lucide-react';

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

function mapStatusToBadge(status: string): { variant: 'success' | 'warning' | 'info'; pulse?: boolean; label: string } {
  switch (status) {
    case 'completed':
      return { variant: 'success', label: 'completed' }
    case 'sending':
      return { variant: 'warning', pulse: true, label: 'sending' }
    case 'scheduled':
      return { variant: 'info', label: 'scheduled' }
    case 'paused':
      return { variant: 'info', label: 'paused' }
    case 'cancelled':
      return { variant: 'warning', label: 'cancelled' }
    case 'draft':
    default:
      return { variant: 'info', label: 'draft' }
  }
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15: params es una Promise, se debe desempaquetar con React.use()
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState<any>(null);
  const [status, setStatus] = useState('draft');
  
  // Constante para el modo de pruebas (siempre true para permitir reenvíos en pruebas)
  const isTestEnvironment = true;
  
  // Cargar datos de la campaña
  const loadCampaign = async () => {
    try {
      const idNum = Number(id);
      if (Number.isNaN(idNum)) {
        notFound();
        return;
      }

      const result = await getCampaignById(idNum);
      if (!result.success || !result.data) {
        notFound();
        return;
      }

      setCampaign(result.data);
      setStatus(mapStatusToUi((result.data as any).estado as string));
    } catch (error) {
      console.error('Error loading campaign:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la campaña',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Manejar cambio de estado
  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsLoading(true);
      const result = await updateCampaignStatus(Number(id), newStatus as any);
      if (result.success) {
        setStatus(mapStatusToUi(newStatus));
        toast({
          title: 'Estado actualizado',
          description: `La campaña ha sido actualizada a: ${newStatus}`,
        });
        loadCampaign(); // Recargar datos
      } else {
        throw new Error(result.message || 'Error al actualizar el estado');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar el estado',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar envío exitoso
  const handleSendSuccess = () => {
    handleStatusChange('sending');
  };

  if (isLoading || !campaign) {
    return (
      <div className="flex items-center justify-center h-64">
        <RotateCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const c = campaign;
  const statusBadge = mapStatusToBadge(status);

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

  // Datos de la campaña
  const campaignStats = {
    totalEmails: c.total_destinatarios || 0,
    sent: c.enviados || 0,
    pending: (c.total_destinatarios || 0) - (c.enviados || 0),
    failed: c.fallidos || 0,
    opened: c.abiertos || 0,
    clicked: c.clicks || 0,
    progress: c.total_destinatarios ? Math.round(((c.enviados || 0) / c.total_destinatarios) * 100) : 0,
    timeRemaining: c.tiempo_restante || 'Calculando...',
    recurrences: {
      total: c.total_recurrencias || 0,
      completed: c.recurrencias_completadas || 0,
      remaining: (c.total_recurrencias || 0) - (c.recurrencias_completadas || 0)
    },
    mailbox: c.email_remitente || 'servicio.sistemas@papalote.org.mx',
    nextScheduled: c.proximo_envio || ''
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
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
          {/* Mostrar botones según el estado actual */}
          {/* Botón de editar campaña */}
          <Link href={`/campaign/${id}/edit`}>
            <Button variant="outline" className="border-primary/20 hover:bg-primary/5 hover:text-primary dark:border-primary/30 dark:text-primary-foreground dark:hover:bg-primary/10">
              <Pencil className="w-4 h-4 mr-2" />
              Editar campaña
            </Button>
          </Link>

          {/* Mostrar botón de enviar en modo de pruebas para todos los estados excepto "enviando" */}
          {(isTestEnvironment && (status === 'draft' || status === 'cancelled' || status === 'paused' || status === 'completed')) && (
            <Button 
              onClick={() => setIsSendDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {status === 'completed' ? 'Reenviar campaña' : 'Enviar campaña'}
            </Button>
          )}

          {status === 'sending' && (
            <>
              <Button 
                onClick={() => handleStatusChange('paused')}
                variant="outline" 
                className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-400/30 dark:hover:bg-amber-900/20"
              >
                <PauseCircle className="w-4 h-4 mr-2" />
                Pausar envío
              </Button>
              <Button 
                onClick={() => handleStatusChange('cancelled')}
                variant="outline" 
                className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-400/30 dark:hover:bg-red-900/20"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancelar envío
              </Button>
            </>
          )}

          {status === 'paused' && (
            <>
              <Button 
                onClick={() => handleStatusChange('sending')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Reanudar envío
              </Button>
              <Button 
                onClick={() => handleStatusChange('cancelled')}
                variant="outline" 
                className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-400/30 dark:hover:bg-red-900/20"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancelar campaña
              </Button>
            </>
          )}

          {status === 'completed' && (
            <Button 
              onClick={() => setIsSendDialogOpen(true)}
              variant="outline"
              className="border-primary/20 hover:bg-primary/5 hover:text-primary"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Reenviar campaña
            </Button>
          )}

          <DeleteCampaignButton campaignId={Number(id)} />
        </div>
      </div>

      {/* Distribución principal: izquierda (progreso + detalles) / derecha (plantilla completa) */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_640px]">
        {/* Columna izquierda */}
        <div className="space-y-6">
          {/* Alertas al inicio */}
          <Card role="alert" className="border-yellow-300 bg-yellow-50/90 dark:border-yellow-700 dark:bg-yellow-950/30">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-yellow-700 dark:text-yellow-300" />
                <CardTitle className="text-lg text-yellow-900 dark:text-yellow-200">Modo de Pruebas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  • Estás en modo de pruebas. Los correos se pueden reenviar en cualquier estado.
                </div>
                {campaignStats.failed > 0 && (
                  <div className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    • {campaignStats.failed} correos no se pudieron enviar. Revisa la configuración SMTP.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progreso de campaña (componente de análisis) */}
          <ProgressCard
            stats={{
              progress: Math.min(100, Math.max(0, campaignStats.progress)), // Asegurar que esté entre 0 y 100
              timeRemaining: campaignStats.timeRemaining,
              sent: Math.max(0, campaignStats.sent),
              total: Math.max(1, campaignStats.totalEmails), // Evitar división por cero
            }}
          />

          {/* Grid de métricas (componente de análisis) */}
          <StatsGrid stats={campaignStats} />


          <div className="grid gap-6 md:grid-cols-2">
            {/* Información de la campaña */}
            <Card hoverable className="border-indigo-100 dark:border-indigo-900/30 bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 dark:from-indigo-900/10 dark:to-indigo-900/5">
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

            {/* Programación */}
            <Card hoverable className="border-amber-100 dark:border-amber-900/30 bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-900/10 dark:to-amber-900/5">
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
                    {(() => {
                      const b = mapStatusToBadge(status)
                      return (
                        <Badge variant={b.variant} pulse={b.pulse} className="px-2.5 py-1 text-xs font-medium rounded-full capitalize">
                          {b.label}
                        </Badge>
                      )
                    })()}
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

          
        </div>

        {/* Columna derecha - Plantilla completa con Tabs */}
        <div className="h-fit">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center">Plantilla</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="vista" className="w-full">
                <TabsContent value="vista" className="mt-4">
                <EmailPreview 
                  content={c.ruta_contenido || ''} 
                  isPath={!!c.ruta_contenido} 
                  maxWidth={640} 
                />
                </TabsContent>
                <TabsContent value="html" className="mt-4">
                  <div className="max-h-[60vh] overflow-auto rounded-md border bg-muted/40 p-3">
                    <textarea
                      readOnly
                      className="w-full h-[55vh] resize-none bg-transparent outline-none font-mono text-xs leading-5"
                      value={contenidoHtml}
                    />
                  </div>
                </TabsContent>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="vista">Vista</TabsTrigger>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Diálogo de envío */}
      {campaign && (
        <SendCampaignDialog
          open={isSendDialogOpen}
          onOpenChange={setIsSendDialogOpen}
          campaignId={String(id)}
          subject={campaign.asunto}
          htmlBody={contenidoHtml}
          recipientListId={String(c.id_lista_contactos)}
          onSuccess={handleSendSuccess}
          defaultSenderEmail={campaignStats.mailbox}
        />
      )}
    </div>
  );
}
