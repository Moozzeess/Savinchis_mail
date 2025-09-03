export interface DBCampaign {
  id_campaign: number;
  nombre_campaign: string;
  descripcion: string | null;
  asunto: string;
  contenido: string;
  id_plantilla: number | null;
  id_lista_contactos: number | null;
  fecha_envio: string | null;
  estado: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  datos_adicionales: string | Record<string, any> | null;
  nombre_lista: string | null;
  total_contactos: number;
  nombre_plantilla: string | null;
  tipo_recurrencia: 'diaria' | 'semanal' | 'mensual' | 'anual' | null;
  intervalo: number | null;
  dias_semana: string | null;
  dia_mes: number | null;
  fecha_fin: string | null;
  proxima_ejecucion: string | null;
  ultima_ejecucion: string | null;
  estado_recurrencia: string | null;
}
