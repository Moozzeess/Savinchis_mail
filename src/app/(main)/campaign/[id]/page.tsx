'use client';

import { useState, useEffect, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCampaignById, updateCampaignStatus } from '@/actions/Campaings/new-campaign-action';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Mail, Users, FileText, Zap, ExternalLink, ArrowLeft, Loader2, Trash2, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, BadgeCheck, BarChart2, Send, RefreshCw, Info, Pencil, PauseCircle, Play, RotateCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { generateHtmlFromBlocks } from '@/lib/template-utils';
import { DeleteCampaignButton } from '@/components/campaign/delete-campaign-button';
import EmailPreview from '@/components/campaign/email-preview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressCard } from '@/components/Analisis/progress-card';
import { StatsGrid } from '@/components/Analisis/stats-grid';
import { useToast } from '@/components/ui/use-toast';
import { SendCampaignDialog } from '@/components/campaign/send-campaign-dialog';

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
  const statusMap: Record<string, { variant: 'success' | 'warning' | 'info'; pulse?: boolean; label: string }> = {
    'completed': { variant: 'success', label: 'completada' },
    'sending': { variant: 'warning', pulse: true, label: 'en progreso' },
    'scheduled': { variant: 'info', label: 'programada' },
    'paused': { variant: 'info', label: 'pausada' },
    'cancelled': { variant: 'warning', label: 'cancelada' },
    'draft': { variant: 'info', label: 'borrador' }
  };

  return statusMap[status] || statusMap['draft'];
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
        const intervalo = c.intervalo ? `cada ${c.intervalo} ` : 'cada ';
        switch (tipo) {
          case 'diaria':
            return `${intervalo}día(s) a las ${new Date(c.fecha_envio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
          case 'semanal':
            return `${intervalo}semana(s) los ${c.dias_semana || 'días seleccionados'}`;
          case 'mensual':
            return `${intervalo}mes(es) el día ${c.dia_mes || new Date(c.fecha_envio).getDate()}`;
          case 'anual':
            return `${intervalo}año(s) el ${new Date(c.fecha_envio).toLocaleString('es-ES', { day: 'numeric', month: 'long' })}`;
          default:
            return tipo;
        }
      })()
    : 'No recurrente';

  // Verificar si se activó "Enviar ahora"
  const isSendNow = c.fecha_envio && new Date(c.fecha_envio) <= new Date();

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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                    </div>
                    <CardTitle className="text-amber-900 dark:text-amber-100">
                      {hasRecurrence ? 'Programación Recurrente' : 'Programación'}
                    </CardTitle>
                  </div>
                  {isSendNow && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                      Envío Inmediato
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Estado de la campaña */}
                <div className="p-3 rounded-lg bg-white/50 dark:bg-amber-950/20 border border-amber-50 dark:border-amber-900/20">
                  <div className="text-xs font-medium text-amber-700/80 dark:text-amber-300/80 mb-1">Estado</div>
                  <div>
                    {(() => {
                      const b = mapStatusToBadge(status);
                      return (
                        <Badge
                          variant={b.variant}
                          pulse={b.pulse}
                          className="px-2.5 py-1 text-xs font-medium rounded-full capitalize"
                        >
                          {b.label}
                        </Badge>
                      )
                    })()}
                  </div>
                </div>

                {/* Notificación de envío inmediato */}
                {isSendNow && (
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/20">
                    <div className="flex items-start">
                      <Info className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-300 mr-2 flex-shrink-0" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Esta campaña se enviará inmediatamente{hasRecurrence ? ' y luego continuará según la programación de recurrencia.' : '.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Fecha de envío principal */}
                <div className="p-3 rounded-lg bg-white/50 dark:bg-amber-950/20 border border-amber-50 dark:border-amber-900/20">
                  <div className="text-xs font-medium text-amber-700/80 dark:text-amber-300/80 mb-1">
                    {hasRecurrence ? 'Próximo envío programado' : 'Fecha de envío'}
                  </div>
                  <div className="font-medium text-amber-900 dark:text-amber-100">
                    {campaignStats.nextScheduled ? (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <div>
                          <div>{new Date(campaignStats.nextScheduled).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</div>
                          <div className="text-sm text-amber-700/80 dark:text-amber-300/70">
                            a las {new Date(campaignStats.nextScheduled).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    ) : c.fecha_envio ? (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <div>
                          <div>Programado para {new Date(c.fecha_envio).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</div>
                          <div className="text-sm text-amber-700/80 dark:text-amber-300/70">
                            a las {new Date(c.fecha_envio).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-amber-600/70 dark:text-amber-400/70 flex-shrink-0" />
                        <div>
                          <div>Guardado el {new Date(c.fecha_creacion).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</div>
                          <div className="text-sm text-amber-700/70 dark:text-amber-300/50">
                            a las {new Date(c.fecha_creacion).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Detalles de la Recurrencia (sección unificada y reorganizada) */}
                {hasRecurrence && (
                  <div className="p-4 rounded-lg bg-white/50 dark:bg-amber-950/20 border border-amber-50 dark:border-amber-900/20">
                    <div className="text-xs font-medium text-amber-700/80 dark:text-amber-300/80 mb-4">
                      Detalles de la Recurrencia
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-sm">

                      {/* Tipo de recurrencia */}
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Tipo</div>
                        <div className="font-medium flex items-center text-amber-900 dark:text-amber-100">
                          <RefreshCw className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                          <div>
                            <span className="capitalize">
                              {c.tipo_recurrencia === 'diaria' && 'Diaria'}
                              {c.tipo_recurrencia === 'semanal' && 'Semanal'}
                              {c.tipo_recurrencia === 'mensual' && 'Mensual'}
                              {c.tipo_recurrencia === 'anual' && 'Anual'}
                            </span>
                            {c.intervalo > 1 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                (cada {c.intervalo} {c.tipo_recurrencia === 'diaria' ? 'días' : c.tipo_recurrencia === 'semanal' ? 'semanas' : c.tipo_recurrencia === 'mensual' ? 'meses' : 'años'})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Próxima ejecución */}
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Próxima ejecución</div>
                        <div className="font-medium text-amber-900 dark:text-amber-100">{c.proxima_ejecucion ? new Date(c.proxima_ejecucion).toLocaleString('es-ES') : '—'}</div>
                      </div>

                      {/* Última ejecución */}
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Última ejecución</div>
                        <div className="font-medium text-amber-900 dark:text-amber-100">{c.ultima_ejecucion ? new Date(c.ultima_ejecucion).toLocaleString('es-ES') : '—'}</div>
                      </div>
                      
                      {/* Día del mes (solo para recurrencia mensual) */}
                      {c.tipo_recurrencia === 'mensual' && c.dia_mes && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Día del mes</div>
                          <div className="font-medium text-amber-900 dark:text-amber-100">Día {c.dia_mes}</div>
                        </div>
                      )}

                      {/* Días de la semana (solo para recurrencia semanal) */}
                      {c.tipo_recurrencia === 'semanal' && c.dias_semana && (
                        <div className="md:col-span-2">
                          <div className="text-xs text-muted-foreground mb-2">Días de la semana</div>
                          <div className="flex flex-wrap gap-2">
                            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia, index) => {
                              const diasSeleccionados = c.dias_semana?.split(',').map((d: string) => d.trim()) || [];
                              const diaNum = (index + 1).toString();
                              const estaSeleccionado = diasSeleccionados.includes(diaNum);
                              return (
                                <span
                                  key={dia}
                                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                    estaSeleccionado
                                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                                      : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                                  }`}
                                >
                                  {dia}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Fecha de finalización (si existe) */}
                      {c.fecha_fin && (
                        <div className="md:col-span-2">
                          <div className="text-xs text-muted-foreground mb-1">Finaliza el</div>
                          <div className="font-medium text-amber-900 dark:text-amber-100">
                            {new Date(c.fecha_fin).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Columna derecha - Plantilla completa con Tabs */}
        <div className="h-[calc(100vh-10rem)]">
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
