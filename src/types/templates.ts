// types/template.ts
export interface Plantillas {
    id_plantilla: number;
    nombre: string;
    tipo: 'template' | 'certificate' | 'email';
    contenido?: string | { backgroundImage?: string; [key: string]: any };
    asunto_predeterminado?: string;
    fecha_creacion?: string;
    thumbnail?: string;
    enabled?: boolean;
  }