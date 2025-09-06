// src/service/campaignContentService.ts
import path from 'path';
import { promisify } from 'util';

// Only import fs/promises on the server side
let fs: any;
let mkdirAsync: any;

if (typeof window === 'undefined') {
  // Server-side only imports
  fs = require('fs/promises');
  mkdirAsync = promisify(require('fs').mkdir);
}

class CampaignContentService {
  private readonly baseDir: string='';
  
  constructor() {
    if (typeof window === 'undefined') {
      this.baseDir = path.join(process.cwd(), 'storage', 'campaigns');
      this.ensureBaseDirExists().catch(console.error);
    }
  }

  private async ensureBaseDirExists(): Promise<void> {
    try {
      await fs.access(this.baseDir);
    } catch (error) {
      await mkdirAsync(this.baseDir, { recursive: true });
    }
  }

  private getCampaignContentPath(campaignId: number | string): string {
    return path.join(this.baseDir, `campaign_${campaignId}.html`);
  }

  public async saveCampaignContent(campaignId: number | string, content: string): Promise<string> {
    if (typeof window !== 'undefined') {
      throw new Error('This operation is only available on the server side');
    }
    
    const filePath = this.getCampaignContentPath(campaignId);
    await fs.writeFile(filePath, content, 'utf-8');
    return path.relative(process.cwd(), filePath);
  }

  public async getCampaignContent(identifier: number | string): Promise<string | null> {
    if (typeof window !== 'undefined') {
      throw new Error('No se puede obtener el contenido de la plantilla en el cliente');
    }
  
    try {
      // Si el identificador es una ruta completa, usarla directamente
      if (typeof identifier === 'string' && identifier.endsWith('.html')) {
        const fullPath = path.isAbsolute(identifier) 
          ? identifier 
          : path.join(process.cwd(), identifier);
        return await fs.readFile(fullPath, 'utf-8');
      }
      
      // Si es un ID, usar la ruta estándar
      const filePath = this.getCampaignContentPath(identifier);
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  public async deleteCampaignContent(campaignId: number | string): Promise<void> {
    if (typeof window !== 'undefined') {
      throw new Error('No se puede eliminar el contenido de la plantilla en el cliente');
    }

    try {
      const filePath = typeof campaignId === 'string' && campaignId.includes(path.sep) 
        ? path.resolve(process.cwd(), campaignId)
        : this.getCampaignContentPath(campaignId);
      
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

export const campaignContentService = new CampaignContentService();