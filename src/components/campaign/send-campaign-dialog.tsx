'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { sendCampaign, sendTestEmail } from '@/service/campaign.send.service';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Send, TestTube, Info, Megaphone } from 'lucide-react';

export function SendCampaignDialog({
  open,
  onOpenChange,
  campaignId,
  subject,
  htmlBody,
  recipientListId,
  onSuccess,
  defaultSenderEmail,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  subject: string;
  htmlBody: string;
  recipientListId: string;
  onSuccess: () => void;
  defaultSenderEmail?: string;
}) {
  const [isSending, setIsSending] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const { toast } = useToast();
  const [testEmail, setTestEmail] = useState(defaultSenderEmail || '');
  const [testEmailError, setTestEmailError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<{
    title: string;
    message: string;
    details?: any;
  } | null>(null);
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(null);
  const [progress, setProgress] = useState<{
    status: 'idle' | 'starting' | 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
    totalRecipients: number;
    totalSent: number;
    totalFailed: number;
    currentBatch: number;
    totalBatches: number;
    message?: string;
  } | null>(null);

  // Polling de progreso cuando está enviando (estabilizado)
  useEffect(() => {
    let timer: any;
    
    if (isSending || progress) {
      const poll = async () => {
        try {
          const res = await fetch(`/api/campaigns/status/${campaignId}`, { cache: 'no-store' });
          
          if (res.status === 404) {
            // Si no estamos enviando, detener polling
            if (!isSending) return;
          } else if (res.ok) {
            const data = await res.json();
            
            if (data?.success) {
              type ProgressType = {
                status: 'idle' | 'starting' | 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
                totalRecipients: number;
                totalSent: number;
                totalFailed: number;
                currentBatch: number;
                totalBatches: number;
                message?: string;
              } | null;

              const p = data.progress as ProgressType;
              
              // Si no hay progreso, salir temprano
              if (!p) {
                timer = setTimeout(poll, 3000);
                return;
              }

              // Actualizar solo si hay cambios en métricas clave
              setProgress(prev => {
                if (!prev) return p;
                const changed = prev.status !== p.status
                  || prev.totalSent !== p.totalSent
                  || prev.totalFailed !== p.totalFailed
                  || prev.currentBatch !== p.currentBatch;
                return changed ? p : prev;
              });

              // Manejar estados finales
              if (p.status === 'completed') {
                toast({ 
                  title: 'Campaña completada', 
                  description: `Enviados: ${p.totalSent}, Fallidos: ${p.totalFailed}` 
                });
                setSuccess({ 
                  title: '✅ Campaña completada', 
                  message: 'El envío ha finalizado exitosamente.' 
                });
                setIsSending(false);
                setTimeout(() => {
                  onSuccess();
                  onOpenChange(false);
                }, 1500);
                return; // no reprogramar
              }

              if (p.status === 'failed' || p.status === 'cancelled') {
                const message = p.status === 'cancelled' 
                  ? 'El envío ha sido cancelado' 
                  : p.message || 'Error en el envío';
                  
                toast({ 
                  title: p.status === 'cancelled' ? 'Campaña cancelada' : 'Campaña fallida', 
                  description: message, 
                  variant: p.status === 'cancelled' ? 'default' : 'destructive' 
                });
                
                setApiError({ 
                  title: p.status === 'cancelled' ? 'Campaña cancelada' : 'Campaña fallida', 
                  message 
                });
                
                setIsSending(false);
                return; // no reprogramar
              }
            }
          }
        } catch (error) {
          console.error('Error en polling de progreso:', error);
        } finally {
          // Siempre reprogramar el siguiente poll a menos que se haya retornado antes
          timer = setTimeout(poll, 3000);
        }
      };
      
      poll();
    }
    return () => timer && clearTimeout(timer);
  }, [isSending, campaignId, !!progress]);

  // Si cambia el remitente por defecto desde arriba, y el usuario no ha escrito nada, sincronizar.
  // Esto garantiza que por defecto el correo de prueba sea el remitente (usuario activo).
  // No sobreescribe si el usuario ya escribió manualmente algo distinto.
  // Se considera "no escrito" cuando testEmail está vacío.
  useEffect(() => {
    if (!testEmail && defaultSenderEmail) {
      setTestEmail(defaultSenderEmail);
    }
  }, [defaultSenderEmail]);

  const validateEmail = (email: string) => {
    // Validación simple de email
    const re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return re.test(email);
  };

  const handleSendTest = async () => {
    setApiError(null);
    setSuccess(null);
    setIsSendingTest(true);
    
    try {
      const toEmail = (testEmail && testEmail.trim().length > 0) ? testEmail.trim() : (defaultSenderEmail || '');
      
      if (!toEmail || !validateEmail(toEmail)) {
        setTestEmailError('Ingresa un correo válido para la prueba.');
        return;
      }

      setTestEmailError(null);

      const response = await sendTestEmail({
        to: toEmail,
        subject,
        htmlBody,
        senderEmail: defaultSenderEmail,
      });

      setSuccess({
        title: '¡Correo de prueba enviado!',
        message: `Se envió una copia de prueba a ${toEmail}. Verifica tu bandeja de entrada.`
      });
      
      toast({
        title: 'Correo de prueba enviado',
        description: `Se envió un correo de prueba a ${toEmail}. Revisa tu bandeja de entrada.`,
      });
    } catch (error: any) {
      const errorTitle = error?.statusCode === 422 
        ? 'Error de validación' 
        : 'Error al enviar el correo de prueba';
      
      const errorMessage = error?.details?.join?.('\n') || error?.message || 'Error desconocido';
      
      setApiError({
        title: errorTitle,
        message: errorMessage,
        details: error.details
      });
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSendCampaign = async () => {
    setApiError(null);
    setSuccess(null);
    setIsSending(true);
    
    try {
      const response = await sendCampaign({
        templateId: campaignId,
        recipientListId,
        subject,
        senderEmail: defaultSenderEmail,
      });

      // Al iniciar el envío, dejamos el diálogo abierto y mostramos progreso por polling
      setSuccess({ title: '🚀 Envío iniciado', message: 'La campaña se está enviando. Mostrando progreso...' });
      toast({ title: 'Campaña iniciada', description: 'Mostrando progreso del envío...' });
      
    } catch (error: any) {
      const errorTitle = error?.statusCode === 422 
        ? 'Error de validación' 
        : 'Error al enviar la campaña';
      
      const errorMessage = error?.details?.join?.('\n') || error?.message || 'Error desconocido';
      
      setApiError({
        title: errorTitle,
        message: errorMessage,
        details: error.details
      });
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      // No desactivamos isSending aquí; lo hará el polling cuando termine
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] bg-card text-card-foreground border border-border shadow-2xl">
        <DialogHeader className="pb-2 border-b">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            <DialogTitle>Enviar campaña</DialogTitle>
          </div>
          <DialogDescription>
            Selecciona cómo deseas enviar esta campaña. Puedes enviar un correo de prueba o iniciar el envío masivo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          {/* Sección de prueba */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Enviar prueba
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="test-email" className="text-sm">Correo de prueba</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="nombre@empresa.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    disabled={isSending || isSendingTest}
                    className={testEmailError ? 'border-destructive' : ''}
                  />
                  {testEmailError && (
                    <p className="mt-1 text-xs text-destructive">{testEmailError}</p>
                  )}
                </div>
                <Button
                  onClick={handleSendTest}
                  disabled={isSending || isSendingTest}
                  variant="outline"
                  className="min-w-[180px]"
                >
                  {isSendingTest ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Send className="h-4 w-4" /> Enviar prueba
                    </span>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Se enviará una copia con el asunto y contenido actuales.
              </p>
            </div>
            
            {/* Estado de éxito/error para prueba */}
            {success && success.title.includes('prueba') && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  <div className="font-medium">{success.title}</div>
                  <div className="text-sm">{success.message}</div>
                </AlertDescription>
              </Alert>
            )}
            
            {apiError && apiError.title.includes('prueba') && (
              <Alert variant="destructive" className="text-left">
                <AlertDescription>
                  <div className="font-medium">{apiError.title}</div>
                  <div className="text-sm">{apiError.message}</div>
                  {apiError.details && (
                    <pre className="mt-2 text-xs bg-black/5 p-2 rounded overflow-auto">
                      {JSON.stringify(apiError.details, null, 2)}
                    </pre>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator className="my-2" />

          {/* Vista previa */}
          <div className="space-y-2">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <Info className="h-4 w-4" />
              Vista previa del envío
            </h3>
            
            <Alert>
              <AlertDescription className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span><strong>Asunto:</strong> {subject || 'Sin asunto'}</span>
                </div>
                <div className="flex items-baseline gap-2 text-xs text-muted-foreground">
                  <span className="opacity-0 w-4">•</span>
                  <span>Se enviará desde: <span className="font-medium">{defaultSenderEmail || 'No especificado'}</span></span>
                </div>
              </AlertDescription>
            </Alert>
          </div>

          <Separator className="my-2" />

          {/* Sección de envío masivo */}
          <div className="space-y-3 p-4 bg-muted/10 rounded-lg border">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Envío masivo
            </h3>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                <p>Se enviará a todos los contactos de la lista seleccionada.</p>
                <p className="text-xs mt-1">Recomendamos enviar una prueba primero.</p>
              </div>
              
              <Button
                onClick={handleSendCampaign}
                disabled={isSending || isSendingTest}
                className="w-full sm:w-auto"
              >
                {isSending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Procesando...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Send className="h-4 w-4" /> Iniciar envío masivo
                  </span>
                )}
              </Button>
            </div>
            
            {/* Estado de éxito/error para envío masivo */}
            {success && !success.title.includes('prueba') && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  <div className="font-medium">{success.title}</div>
                  <div className="text-sm">{success.message}</div>
                </AlertDescription>
              </Alert>
            )}

            {/* Progreso en tiempo real */}
            {progress && (
              <div className="text-sm space-y-1">
                <div className="flex justify-between"><span>Estado:</span><span className="font-medium">{progress.status}</span></div>
                <div className="flex justify-between"><span>Enviados:</span><span className="font-medium">{progress.totalSent} / {progress.totalRecipients}</span></div>
                <div className="flex justify-between"><span>Fallidos:</span><span className="font-medium">{progress.totalFailed}</span></div>
                <div className="flex justify-between"><span>Lote:</span><span className="font-medium">{progress.currentBatch} / {progress.totalBatches}</span></div>
                {(() => {
                  const pct = progress.totalRecipients > 0 ? Math.round((progress.totalSent + progress.totalFailed) * 100 / progress.totalRecipients) : 0;
                  return (
                    <div className="mt-2">
                      <div className="h-2 w-full bg-muted rounded">
                        <div className="h-2 bg-primary rounded" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{pct}% completado</div>
                    </div>
                  );
                })()}
                {progress.message && <div className="text-xs text-muted-foreground">{progress.message}</div>}
              </div>
            )}
            
            {apiError && !apiError.title.includes('prueba') && (
              <Alert variant="destructive" className="text-left">
                <AlertDescription>
                  <div className="font-medium">{apiError.title}</div>
                  <div className="text-sm">{apiError.message}</div>
                  {apiError.details && (
                    <pre className="mt-2 text-xs bg-black/5 p-2 rounded overflow-auto">
                      {JSON.stringify(apiError.details, null, 2)}
                    </pre>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

