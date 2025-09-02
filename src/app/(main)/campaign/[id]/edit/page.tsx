"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { RowDataPacket } from 'mysql2';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

// Esquema de validación
const campaignFormSchema = z.object({
  // Detalles básicos
  id: z.number().optional(),
  nombre_campaign: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  objetivo: z.enum(['promocional', 'boletin', 'anuncio', 'evento', 'bienvenida', 'otro']),
  
  // Contenido del correo
  asunto: z.string().min(1, 'El asunto es requerido'),
  contenido: z.any(),
  
  // Destinatarios
  id_lista: z.coerce.number().min(1, 'Debes seleccionar una lista de contactos'),
  nombre_lista: z.string().optional(),
  total_contactos: z.coerce.number().min(1, 'Debes tener al menos un destinatario'),
  
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
          
          // Formatear fechas para el input datetime-local
          const formatDateForInput = (dateString: string | null) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toISOString().slice(0, 16);
          };

          // Definir el tipo para los valores permitidos de objetivo
          type ObjetivoTipo = 'promocional' | 'boletin' | 'anuncio' | 'evento' | 'bienvenida' | 'otro';
          
          // Asegurar que el objetivo sea uno de los permitidos
          const objetivoValido: ObjetivoTipo = 
            ['promocional', 'boletin', 'anuncio', 'evento', 'bienvenida', 'otro'].includes(campaign.objetivo as string)
              ? (campaign.objetivo as ObjetivoTipo)
              : 'promocional';
          
          // Definir el tipo para los valores permitidos de estado
          type EstadoTipo = 'borrador' | 'programada' | 'en_progreso' | 'completada' | 'pausada' | 'cancelada';
          
          // Asegurar que el estado sea uno de los permitidos
          const estadoValido: EstadoTipo = 
            ['borrador', 'programada', 'en_progreso', 'completada', 'pausada', 'cancelada'].includes(campaign.estado as string)
              ? (campaign.estado as EstadoTipo)
              : 'borrador';
          
          // Preparar los datos para el formulario
          const formData = {
            id: campaign.id_campaign,
            nombre_campaign: campaign.nombre_campaign || '',
            descripcion: campaign.descripcion || '',
            objetivo: objetivoValido,
            asunto: campaign.asunto || '',
            contenido: campaign.contenido || '',
            id_lista: campaign.id_lista_contactos || 0,
            nombre_lista: campaign.nombre_lista || '',
            total_contactos: campaign.total_contactos || 0,
            enviar_ahora: !campaign.fecha_envio,
            fecha_envio: formatDateForInput(campaign.fecha_envio),
            estado: estadoValido,
            // Datos de recurrencia
            es_recurrente: !!campaign.tipo_recurrencia,
            tipo_recurrencia: campaign.tipo_recurrencia || undefined,
            intervalo: campaign.intervalo || 1,
            dias_semana: campaign.dias_semana || undefined,
            dia_mes: campaign.dia_mes || undefined,
            fecha_fin: formatDateForInput(campaign.fecha_fin) || undefined
          };
          
          console.log('Cargando datos de la campaña:', formData);
          methods.reset(formData);
        } else {
          setError(result.message || 'No se pudo cargar la campaña');
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

  const onSubmit = async (formData: CampaignFormValues) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Mapear los datos del formulario a la interfaz UpdateCampaignData
      const campaignData: UpdateCampaignData = {
        nombre_campaign: formData.nombre_campaign,
        descripcion: formData.descripcion || null,
        objetivo: formData.objetivo,
        asunto: formData.asunto,
        contenido: formData.contenido || '',
        id_lista_contactos: formData.id_lista,
        nombre_lista: formData.nombre_lista,
        total_contactos: formData.total_contactos,
        fecha_envio: formData.enviar_ahora ? null : formData.fecha_envio || null,
        estado: formData.estado,
        es_recurrente: formData.es_recurrente,
      };

      // Agregar campos de recurrencia solo si es recurrente
      if (formData.es_recurrente && formData.tipo_recurrencia) {
        campaignData.tipo_recurrencia = formData.tipo_recurrencia;
        campaignData.intervalo = formData.intervalo || 1;
        campaignData.dias_semana = formData.dias_semana || undefined;
        campaignData.dia_mes = formData.dia_mes || undefined;
        campaignData.fecha_fin = formData.fecha_fin || undefined;
      }

      console.log('Datos a actualizar:', campaignData);
      
      // Actualizar la campaña
      const result = await updateCampaign(campaignId, campaignData);
      
      if (result.success) {
        // Mostrar mensaje de éxito
        toast.success('Campaña actualizada correctamente');
        
        // Redirigir al detalle de la campaña actualizada
        router.push(`/campaign/${campaignId}`);
        router.refresh();
      } else {
        setError(result.message || 'Error al actualizar la campaña');
        toast.error(result.message || 'Error al actualizar la campaña');
      }
    } catch (err) {
      console.error('Error al actualizar la campaña:', err);
      setError('Ocurrió un error al actualizar la campaña');
    } finally {
      setIsSubmitting(false);
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
