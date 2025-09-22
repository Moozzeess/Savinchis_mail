// src/lib/progress-store.ts
// Almacenamiento en memoria para progreso de campañas
// Nota: en despliegues serverless, el estado no es compartido entre instancias. Para producción,
// use una base de datos o cache centralizada (Redis). Este store es útil para desarrollo/local.

export type CampaignProgress = {
  campaignId: string;
  status: 'idle' | 'starting' | 'running' | 'paused' | 'cancelled' | 'completed' | 'failed';
  totalRecipients: number;
  totalSent: number;
  totalFailed: number;
  currentBatch: number;
  totalBatches: number;
  startedAt?: string;
  updatedAt?: string;
  finishedAt?: string;
  message?: string;
  error?: string;
};

class ProgressStore {
  private map = new Map<string, CampaignProgress>();

  get(id: string): CampaignProgress | undefined {
    return this.map.get(id);
  }

  init(id: string, totalRecipients: number, totalBatches: number): CampaignProgress {
    const now = new Date().toISOString();
    const value: CampaignProgress = {
      campaignId: id,
      status: 'starting',
      totalRecipients,
      totalSent: 0,
      totalFailed: 0,
      currentBatch: 0,
      totalBatches,
      startedAt: now,
      updatedAt: now,
      message: 'Inicializando envío de campaña',
    };
    this.map.set(id, value);
    return value;
  }

  update(id: string, patch: Partial<CampaignProgress>): CampaignProgress | undefined {
    const prev = this.map.get(id);
    if (!prev) return undefined;
    const next: CampaignProgress = {
      ...prev,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.map.set(id, next);
    return next;
  }

  complete(id: string, message?: string): CampaignProgress | undefined {
    return this.update(id, {
      status: 'completed',
      finishedAt: new Date().toISOString(),
      message: message || 'Campaña completada',
    });
  }

  fail(id: string, error: string): CampaignProgress | undefined {
    return this.update(id, {
      status: 'failed',
      finishedAt: new Date().toISOString(),
      error,
    });
  }
}

// Singleton
export const progressStore = new ProgressStore();
