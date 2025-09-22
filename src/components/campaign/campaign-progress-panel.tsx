"use client";

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

type Progress = {
  status: 'idle' | 'starting' | 'running' | 'completed' | 'failed';
  totalRecipients: number;
  totalSent: number;
  totalFailed: number;
  currentBatch: number;
  totalBatches: number;
  message?: string;
};

export function CampaignProgressPanel({ campaignId }: { campaignId: string }) {
  const { toast } = useToast();
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    let timer: any;

    const poll = async () => {
      try {
        const res = await fetch(`/api/campaigns/status/${campaignId}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data?.progress) {
            const p = data.progress as Progress;
            setProgress(p);

            if (p.status === 'completed') {
              toast({
                title: 'Campaña completada',
                description: `Enviados: ${p.totalSent}, Fallidos: ${p.totalFailed}`,
              });
              return; // Do not reschedule polling if completed
            }
            if (p.status === 'failed') {
              toast({ title: 'Campaña fallida', description: p.message || 'Error en el envío', variant: 'destructive' });
              return;
            }
          }
        }
      } catch {}
      timer = setTimeout(poll, 2000);
    };

    poll();
    return () => timer && clearTimeout(timer);
  }, [campaignId]);

  if (!progress) return null;

  const pct = progress.totalRecipients > 0
    ? Math.round(((progress.totalSent + progress.totalFailed) * 100) / progress.totalRecipients)
    : 0;

  return (
    <div className="space-y-3 p-4 bg-muted/20 rounded-lg border">
      <h3 className="font-medium">Progreso del envío</h3>
      <div className="text-sm space-y-1">
        <div className="flex justify-between"><span>Estado:</span><span className="font-medium">{progress.status}</span></div>
        <div className="flex justify-between"><span>Enviados:</span><span className="font-medium">{progress.totalSent} / {progress.totalRecipients}</span></div>
        <div className="flex justify-between"><span>Fallidos:</span><span className="font-medium">{progress.totalFailed}</span></div>
        <div className="flex justify-between"><span>Lote:</span><span className="font-medium">{progress.currentBatch} / {progress.totalBatches}</span></div>
        <div className="mt-2">
          <div className="h-2 w-full bg-muted rounded">
            <div className="h-2 bg-primary rounded" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">{pct}% completado</div>
        </div>
        {progress.message && <div className="text-xs text-muted-foreground">{progress.message}</div>}
      </div>

      {(progress.status === 'completed' || progress.status === 'failed') && (
        <Alert className={progress.status === 'completed' ? 'bg-green-50 border-green-200' : ''}>
          <AlertDescription>
            {progress.status === 'completed' ? 'Envío finalizado.' : 'El envío falló. Reintenta o revisa los registros.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
