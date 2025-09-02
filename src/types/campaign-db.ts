export interface DBCampaign {
  id_campaign: number;
  nombre_campaign: string;
  descripcion: string | null;
  objetivo: string;
  asunto: string;
  contenido: string;
  id_lista_contactos: number;
  fecha_envio: string | null;
  estado: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  nombre_lista: string | null;
  total_contactos: number;
  tipo_recurrencia: 'diaria' | 'semanal' | 'mensual' | 'anual' | null;
  intervalo: number | null;
  dias_semana: string | null;
  dia_mes: number | null;
  fecha_fin: string | null;
  proxima_ejecucion: string | null;
  ultima_ejecucion: string | null;
  estado_recurrencia: string | null;
}
