// types/template.ts
import { Block } from '@/lib/template-utils';

export interface TemplateContent {
  backgroundImage?: string;
  blocks?: Block[];
  isHtmlTemplate?: boolean;
  htmlContent?: string;
  [key: string]: any;
}

export interface Plantillas {
  id_plantilla: number;
  nombre: string;
  tipo: 'template' | 'certificate' | 'email' | 'html';
  contenido?: string | TemplateContent;
  html_content?: string;
  asunto_predeterminado?: string;
  fecha_creacion?: string;
  thumbnail?: string;
  enabled?: boolean;
}

// Alias para compatibilidad
export type Template = Plantillas;