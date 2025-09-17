"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { RowDataPacket } from 'mysql2';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// Types
import type { DBCampaign } from '@/types/campaign-db';

// Actions
import { getCampaignById } from '@/actions/Campaings/new-campaign-action';
import { updateCampaign, UpdateCampaignData } from '@/actions/Campaings/update-campaign-action';

// Components
import { CampaignSteps } from '@/components/campaign/campaign-steps';
import { DetailsStep } from '@/components/campaign/details-step';
import { RecipientStep } from '@/components/campaign/recipient-step';
import { EmailStep } from '@/components/campaign/email-step';
import { SchedulingStep } from '@/components/campaign/scheduling-step';
import ReviewStep from '@/components/campaign/review-step';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Types
import { Campaign, CampaignFormData } from '@/types/campaign';

// Mapeo de objetivos entre inglés y español
const objetivoMap = {
  promotional: 'promocional',
  newsletter: 'boletin',
  announcement: 'anuncio',
  event: 'evento',
  welcome: 'bienvenida',
  other: 'otro',
} as const;

type ObjetivoTipo = typeof objetivoMap[keyof typeof objetivoMap];
type ObjetivoInglesTipo = keyof typeof objetivoMap;

// Esquema de validación
const campaignFormSchema = z.object({
  // Detalles básicos
  id: z.union([z.string(), z.number()]).transform(val => Number(val)).optional(),
  
  // Campos en español
  nombre_campaign: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  objetivo: z.enum(['promocional', 'boletin', 'anuncio', 'evento', 'bienvenida', 'otro'] as const),
  asunto: z.string().min(1, 'El asunto es requerido'),
  contenido: z.any(),
  id_lista: z.coerce.number().min(1, 'Debes seleccionar una lista de contactos'),
  id_plantilla: z.union([z.string(), z.number()])
    .transform(val => val ? Number(val) : undefined)
    .optional(),
  nombre_lista: z.string().optional(),
  total_contactos: z.coerce.number().min(1, 'Debes tener al menos un destinatario'),
  
  // Campos en inglés (para compatibilidad con componentes)
  name: z.string().optional(),
  description: z.string().optional(),
  objective: z.enum(Object.keys(objetivoMap) as [string, ...string[]]).optional(),
  subject: z.string().optional(),
  emailBody: z.any().optional(),
  contactListId: z.union([z.string(), z.number()])
    .transform(val => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    })
    .default(0),
  contactListName: z.string().optional(),
  totalRecipients: z.number().optional(),
  templateId: z.union([z.string(), z.number()])
    .transform(val => {
      if (!val) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .nullable(),
    
  // Programación de envíos
  scheduledSends: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      sendNow: z.boolean(),
      date: z.union([z.string(), z.date()]).transform(val => 
        typeof val === 'string' ? new Date(val) : val
      ).optional(),
      hour: z.string().optional(),
      minute: z.string().optional(),
      timezone: z.string().optional(),
      isRecurring: z.boolean().optional(),
      recurrenceType: z.enum(['diaria', 'semanal', 'mensual', 'anual']).optional(),
      recurrenceInterval: z.number().optional(),
      recurrenceDaysOfWeek: z.string().optional(),
      recurrenceDayOfMonth: z.number().optional(),
      recurrenceStartDate: z.union([z.string(), z.date()]).transform(val => 
        typeof val === 'string' ? new Date(val) : val
      ).optional(),
      recurrenceEndDate: z.union([z.string(), z.date()]).transform(val => 
        typeof val === 'string' ? new Date(val) : val
      ).optional(),
    })
  ).optional(),
  
  // Programación
  enviar_ahora: z.boolean().default(true),
  fecha_envio: z.string().optional(),
  
  // Recurrencia
  es_recurrente: z.boolean().default(false),
  tipo_recurrencia: z.enum(['diaria', 'semanal', 'mensual', 'anual']).optional(),
  intervalo: z.coerce.number().min(1).default(1).optional(),
  dias_semana: z.string().optional(),
  dia_mes: z.coerce.number().min(1).max(31).optional(),
  fecha_fin: z.string().optional(),
  
  // Estado
  estado: z.enum(['borrador', 'programada', 'en_progreso', 'completada', 'pausada', 'cancelada']).default('borrador'),
}).refine(data => !data.es_recurrente || data.tipo_recurrencia, {
  message: 'Debes seleccionar un tipo de recurrencia',
  path: ['tipo_recurrencia']
});

type CampaignFormValues = z.infer<typeof campaignFormSchema>;

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = Number(params.id);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      enviar_ahora: true,
      es_recurrente: false,
      estado: 'borrador',
    },
  });

  // Interfaz para los datos de la campaña
  interface CampaignData extends RowDataPacket {
    id_campaign: number;
    nombre_campaign: string;
    descripcion: string | null;
    objetivo: string;
    asunto: string;
    contenido: string;
    id_lista_contactos: number;
    nombre_lista: string;
    total_contactos: number;
    fecha_envio: string | null;
    estado: string;
    tipo_recurrencia: 'diaria' | 'semanal' | 'mensual' | 'anual' | null;
    intervalo: number | null;
    dias_semana: string | null;
    dia_mes: number | null;
    fecha_fin: string | null;
  }

  // Cargar datos de la campaña
  useEffect(() => {
    const loadCampaign = async () => {
      if (!campaignId) return;
      
      try {
        const result = await getCampaignById(campaignId);
        if (result.success && result.data) {
          const campaign = result.data as unknown as DBCampaign;
          
          // Asegurarse de que el ID sea un número
          const campaignWithNumberId = {
            ...campaign,
            id_campaign: Number(campaign.id_campaign)
          };
          
          // Formatear fechas para el input datetime-local
          const formatDateForInput = (dateString: string | null) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toISOString().slice(0, 16);
          };
          
          // Asegurarse de que los campos numéricos sean números
          const formatNumericFields = (obj: any) => {
            if (!obj) return obj;
            return {
              ...obj,
              id_campaign: Number(obj.id_campaign),
              id_lista_contactos: obj.id_lista_contactos ? Number(obj.id_lista_contactos) : null,
              total_contactos: obj.total_contactos ? Number(obj.total_contactos) : 0,
              id_plantilla: obj.id_plantilla ? Number(obj.id_plantilla) : null,
              intervalo: obj.intervalo ? Number(obj.intervalo) : null,
              dia_mes: obj.dia_mes ? Number(obj.dia_mes) : null
            };
          };

          // Obtener el objetivo de datos_adicionales o usar un valor por defecto
          const campaignWithNumericFields = formatNumericFields(campaign);
          const datosAdicionales = typeof campaignWithNumericFields.datos_adicionales === 'string' 
            ? JSON.parse(campaignWithNumericFields.datos_adicionales) 
            : campaignWithNumericFields.datos_adicionales || {};
          
          // Definir el tipo para los valores permitidos de objetivo
          type ObjetivoTipo = 'promocional' | 'boletin' | 'anuncio' | 'evento' | 'bienvenida' | 'otro';
          
          // Obtener el objetivo de los datos adicionales o usar un valor por defecto
          const objetivo = typeof datosAdicionales === 'object' && datosAdicionales !== null 
            ? datosAdicionales.objetivo || 'promocional'
            : 'promocional';
            
          // Asegurar que el objetivo sea uno de los permitidos
          const objetivoValido: ObjetivoTipo = 
            ['promocional', 'boletin', 'anuncio', 'evento', 'bienvenida', 'otro'].includes(objetivo)
              ? (objetivo as ObjetivoTipo)
              : 'promocional';  // Valor por defecto si no es válido
              
          // Mapear los datos de la campaña al formulario
          methods.reset({
            // Detalles básicos
            id: Number(campaign.id_campaign),
            
            // Campos en español
            nombre_campaign: campaign.nombre_campaign,
            descripcion: campaign.descripcion || '',
            objetivo: objetivoValido,
            asunto: campaign.asunto,
            // El backend no expone 'contenido' directo en DBCampaign; usar fallback seguro
            contenido: '',
            id_lista: Number(campaign.id_lista_contactos || 0),
            id_plantilla: campaign.id_plantilla ?? undefined,
            nombre_lista: campaign.nombre_lista || '',
            total_contactos: campaign.total_contactos,
            
            // Programación
            enviar_ahora: !campaign.fecha_envio,
            fecha_envio: campaign.fecha_envio || '',
            
            // Recurrencia
            es_recurrente: !!campaign.tipo_recurrencia,
            tipo_recurrencia: campaign.tipo_recurrencia || undefined,
            intervalo: campaign.intervalo || 1,
            dias_semana: campaign.dias_semana || '',
            dia_mes: campaign.dia_mes || undefined,
            fecha_fin: campaign.fecha_fin || '',
            
            // Campos en inglés (para compatibilidad con componentes)
            name: campaign.nombre_campaign,
            description: campaign.descripcion || '',
            objective: (() => {
              const map: Record<ObjetivoTipo, ObjetivoInglesTipo> = {
                promocional: 'promotional',
                boletin: 'newsletter',
                anuncio: 'announcement',
                evento: 'event',
                bienvenida: 'welcome',
                otro: 'other'
              };
              return map[objetivoValido];
            })(),
            subject: campaign.asunto,
            emailBody: '',
            contactListId: Number(campaign.id_lista_contactos || 0),
            contactListName: campaign.nombre_lista || '',
            totalRecipients: campaign.total_contactos,
            templateId: campaign.id_plantilla || null,
            
            // Programación de envíos
            scheduledSends: [
              {
                id: '1',
                name: 'Envío Principal',
                sendNow: !campaign.fecha_envio,
                date: campaign.fecha_envio ? new Date(campaign.fecha_envio) : new Date(),
                hour: campaign.fecha_envio ? new Date(campaign.fecha_envio).getHours().toString().padStart(2, '0') : '12',
                minute: campaign.fecha_envio ? new Date(campaign.fecha_envio).getMinutes().toString().padStart(2, '0') : '00',
                timezone: 'America/Mexico_City',
                isRecurring: !!campaign.tipo_recurrencia,
                recurrenceType: campaign.tipo_recurrencia || undefined,
                recurrenceInterval: campaign.intervalo || 1,
                recurrenceDaysOfWeek: campaign.dias_semana || '',
                recurrenceDayOfMonth: campaign.dia_mes || undefined,
                recurrenceStartDate: campaign.fecha_envio ? new Date(campaign.fecha_envio) : new Date(),
                recurrenceEndDate: campaign.fecha_fin ? new Date(campaign.fecha_fin) : undefined,
              }
            ],
            
            // Otros campos
            estado: (['borrador','programada','en_progreso','completada','pausada','cancelada'] as const).includes((campaign.estado as any))
              ? (campaign.estado as any)
              : 'borrador',
          });
        } else {
          setError('No se pudo cargar la campaña');
        }
      } catch (err) {
        console.error('Error al cargar la campaña:', err);
        setError('Error al cargar la campaña');
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId, methods]);

  // Función para obtener valores del formulario con soporte para campos en inglés y español
  const getValue = <T = any>(field: keyof CampaignFormValues | string, defaultValue: T = '' as any): T => {
        // Primero intentar con el campo exacto
        try {
          const value = methods.getValues(field as any);
          if (value !== undefined && value !== null) return value as T;
        } catch (e) {
          // Si falla, continuar con los valores alternativos
        }
        
        // Mapeo de campos en inglés a español para compatibilidad
        const fieldMap: Record<string, keyof CampaignFormValues> = {
          // Mapeo de inglés a español
          'name': 'nombre_campaign',
          'description': 'descripcion',
          'subject': 'asunto',
          'emailBody': 'contenido',
          'contactListId': 'id_lista',
          'contactListName': 'nombre_lista',
          'totalRecipients': 'total_contactos',
          'templateId': 'id_plantilla',
          
          // Mapeo inverso (español a inglés)
          'nombre_campaign': 'name',
          'descripcion': 'description',
          'asunto': 'subject',
          'contenido': 'emailBody',
          'id_lista': 'contactListId',
          'nombre_lista': 'contactListName',
          'total_contactos': 'totalRecipients',
          'id_plantilla': 'templateId'
        };
        
        // Si el campo está en el mapa, intentar obtener el valor mapeado
        if (field in fieldMap) {
          const mappedField = fieldMap[field as keyof typeof fieldMap];
          try {
            const mappedValue = methods.getValues(mappedField as any);
            if (mappedValue !== undefined && mappedValue !== null) {
              return mappedValue as T;
            }
          } catch (e) {
            // Si falla, continuar con el valor por defecto
          }
        }
        
        // Si todo falla, devolver el valor por defecto
        return defaultValue;
      };

  // Handler de envío: encapsula la lógica de actualización
  const onSubmit = async (formData: CampaignFormValues) => {
    // Mapear objetivo de inglés a español si es necesario
    let objetivo = getValue<string>('objetivo', '');
    if (!objetivo) {
      const obj = methods.getValues('objective');
        const mapReverse: Record<string, 'promocional' | 'boletin' | 'anuncio' | 'evento' | 'bienvenida' | 'otro'> = {
          promotional: 'promocional',
          newsletter: 'boletin',
          announcement: 'anuncio',
          event: 'evento',
          welcome: 'bienvenida',
          other: 'otro',
        };
      objetivo = obj ? mapReverse[obj] : 'promocional';
    }

      // Formatear fechas correctamente
      const formatDateForDB = (dateString: string | null | undefined): string | null => {
        if (!dateString) return null;
        try {
          const date = new Date(dateString);
          return date.toISOString().slice(0, 19).replace('T', ' ');
        } catch (e) {
          console.error('Error al formatear fecha:', e);
          return null;
        }
      };

      // Obtener valores de los campos
      const nombre_campaign = getValue('nombre_campaign') || getValue('name');
      const descripcion = getValue('descripcion') || getValue('description') || null;
      const asunto = getValue('asunto') || getValue('subject');
      const contenido = getValue('contenido') || getValue('emailBody') || '';
      const id_lista_contactos = getValue<number>('id_lista') || getValue<number>('contactListId') || 0;
      const nombre_lista = getValue('nombre_lista') || getValue('contactListName') || '';
      const total_contactos = Number(getValue('total_contactos') || getValue('totalRecipients') || 0);
      const id_plantilla = Number(getValue('id_plantilla') || getValue('templateId') || 0) || null;
      
      // Manejo de fechas
      let fecha_envio = null;
      if (!formData.enviar_ahora) {
        const fecha = getValue('fecha_envio') || getValue('scheduledSends')?.[0]?.date;
        fecha_envio = formatDateForDB(fecha);
      }

      // Preparar datos adicionales
      const datos_adicionales = {
        objetivo,
        // Agregar cualquier otro dato adicional que necesites
      };

      // Construir objeto de datos para la actualización
      const campaignData: UpdateCampaignData = {
        id_campaign: campaignId, // Asegurar que el ID esté incluido
        nombre_campaign,
        descripcion,
        objetivo,
        asunto,
        contenido,
        id_lista_contactos,
        nombre_lista,
        total_contactos,
        id_plantilla,
        fecha_envio,
        estado: formData.estado || 'borrador',
        es_recurrente: formData.es_recurrente || false,
        datos_adicionales: JSON.stringify(datos_adicionales),
      };

      // Agregar campos de recurrencia si es necesario
      if (formData.es_recurrente) {
        campaignData.tipo_recurrencia = formData.tipo_recurrencia || null;
        campaignData.intervalo = formData.intervalo || 1;
        campaignData.dias_semana = formData.dias_semana || null;
        campaignData.dia_mes = formData.dia_mes || null;
        campaignData.fecha_fin = formatDateForDB(formData.fecha_fin);
      }

    console.log('Datos a actualizar:', campaignData);

    // Mostrar feedback claro de carga/éxito/error
    const loadingId = toast.loading('Guardando cambios...');
    try {
      const result = await updateCampaign(campaignId, campaignData);

      if (result.success) {
        toast.success('Campaña actualizada correctamente', { id: loadingId });
        // Redirigir al detalle de la campaña actualizada
        router.push(`/campaign/${campaignId}`);
        router.refresh();
      } else {
        const errorMessage = result.message || 'Error al actualizar la campaña';
        setError(errorMessage);
        toast.error(errorMessage, { id: loadingId });
      }
    } catch (e: any) {
      const errorMessage = e?.message || 'Error inesperado al actualizar la campaña';
      setError(errorMessage);
      toast.error(errorMessage, { id: loadingId });
    }
  };

  const onNext = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      setCurrentStep((prev) => (prev < 5 ? prev + 1 : prev));
    }
  };

  const onBack = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <Link href="/campaign">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/campaign">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar campaña</h1>
        <p className="text-muted-foreground">
          Actualiza los detalles de la campaña y guarda los cambios.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <CampaignSteps currentStep={currentStep} onStepClick={setCurrentStep} />
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-card rounded-lg border p-6">
            {currentStep === 1 && <DetailsStep />}
            {currentStep === 2 && <RecipientStep />}
            {currentStep === 3 && <EmailStep />}
            {currentStep === 4 && <SchedulingStep />}
            {currentStep === 5 && <ReviewStep />}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={currentStep === 1 || isSubmitting}
            >
              Anterior
            </Button>
            
            <div className="space-x-2">
              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={onNext}
                  disabled={isSubmitting}
                >
                  Siguiente
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
