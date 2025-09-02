'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {getCampaigns} from '@/actions/Campaings/new-campaign-action';
//import { v4 as uuidv4 } from 'uuid';

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

// Services
import { createCampaign } from '@/service/campaign.service';

// Esquema de validación
const campaignFormSchema = z.object({
  // Detalles básicos
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  objective: z.enum(['promotional', 'newsletter', 'announcement', 'event', 'welcome', 'other']),
  
  // Contenido del correo
  subject: z.string(),
  emailBody: z.string(),
//  fromName: z.string().min(1, 'El nombre del remitente es requerido'),
//  fromEmail: z.string().email('Ingresa un correo electrónico válido'),
//  replyTo: z.string().email('Ingresa un correo electrónico válido').optional(),
  
  // Destinatarios
  contactListId: z.coerce.string().min(1, 'Debes seleccionar una lista de contactos'),
  contactListName: z.string().optional(),
  totalRecipients: z.coerce.number().min(1, 'Debes tener al menos un destinatario'),
  
  // Programación
  sendNow: z.boolean().default(true),
  scheduledAt: z.date().optional(),
  useOptimalTime: z.boolean().default(false),
  timeZone: z.string().default(Intl.DateTimeFormat().resolvedOptions().timeZone),
  status: z.enum(['draft', 'scheduled', 'sending', 'sent', 'failed']).default('draft'),

  // Recurrencia
  isRecurring: z.boolean().default(false),
  recurrenceType: z.enum(['diaria', 'semanal', 'mensual', 'anual']).optional(),
  recurrenceInterval: z.coerce.number().optional(),
  recurrenceDaysOfWeek: z.string().optional(),
  recurrenceDayOfMonth: z.coerce.number().optional(),
  recurrenceStartDate: z.date().optional(),
  recurrenceEndDate: z.date().optional(),
  
  // Seguimiento
  trackOpens: z.boolean().default(true),
  trackClicks: z.boolean().default(true),
  isABTest: z.boolean().default(false),
});

export default function NewCampaignPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<z.infer<typeof campaignFormSchema>>({
  // Inicializar formulario
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: '',
      objective: 'promotional',
      status: 'draft',
      subject: '',
      emailBody: '',
//      fromName: '',
//      fromEmail: '',
      contactListId: '', // Se establecerá cuando el usuario seleccione una lista
      contactListName: '',
      totalRecipients: 0, // Se actualizará cuando se seleccione una lista
      sendNow: true,
      trackOpens: true,
      trackClicks: true,
      isABTest: false,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      useOptimalTime: false,
      isRecurring: false,
      recurrenceType: undefined,
      recurrenceInterval: undefined,
      recurrenceDaysOfWeek: '',
      recurrenceDayOfMonth: undefined,
      recurrenceStartDate: undefined,
      recurrenceEndDate: undefined,
    },
  });
  
  // Avanzar al siguiente paso
  const nextStep = async () => {
    // Validar solo los campos del paso actual
    const fieldsToValidate = getStepFields(currentStep);
    // En el último paso (programación), no validar nada para poder avanzar a revisión
    if (currentStep === 3) {
      setCurrentStep(4);
      return;
    }
    const isValid = await methods.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };
  
  // Obtener campos a validar por paso
  const getStepFields = (step: number): (keyof z.infer<typeof campaignFormSchema>)[] => {
    switch (step) {
      case 0: // Detalles
        return ['name', 'objective'];
      case 1: // Destinatarios
        return ['contactListId', 'totalRecipients'];
      case 2: // Email
        return ['subject', 'emailBody'];
      case 3: // Programación
        // Validar recurrencia solo si está activa
        const base: (keyof z.infer<typeof campaignFormSchema>)[] = ['sendNow', 'scheduledAt', 'timeZone'];
        const vals = methods.getValues();
        if (vals.isRecurring) {
          base.push('recurrenceType', 'recurrenceInterval');
        }
        return base;
      default:
        return [];
    }
  };
  
  // Retroceder al paso anterior
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  // Manejar envío del formulario
  const onSubmit = async (data: z.infer<typeof campaignFormSchema>) => {
    try {
      setIsSubmitting(true);
      console.log('Datos del formulario a enviar:', data);
      
      // Convert form data to Campaign type
      const campaignData: CampaignFormData = {
        name: data.name,
        description: data.description,
        objective: data.objective,
        subject: data.subject,
        emailBody: data.emailBody,
        contactListId: data.contactListId ? parseInt(data.contactListId) : null,
        scheduledAt: data.sendNow ? null : data.scheduledAt?.toISOString(),
        totalRecipients: data.totalRecipients || 0,
        status: 'draft',
        timeZone: data.timeZone,
        useOptimalTime: data.useOptimalTime,
        // Recurrence mapping expected by server action
        isRecurring: data.isRecurring,
        recurrenceType: data.isRecurring ? (data.recurrenceType as any) : null,
        recurrenceInterval: data.isRecurring ? (data.recurrenceInterval ?? null) : null,
        recurrenceDaysOfWeek: data.isRecurring ? (data.recurrenceDaysOfWeek || null) : null,
        recurrenceDayOfMonth: data.isRecurring ? (data.recurrenceDayOfMonth ?? null) : null,
        recurrenceStartDate: data.isRecurring ? (data.recurrenceStartDate ? data.recurrenceStartDate.toISOString() : null) : null,
        recurrenceEndDate: data.isRecurring ? (data.recurrenceEndDate ? data.recurrenceEndDate.toISOString() : null) : null,
      };
      
      // Eliminar propiedades undefined
      Object.keys(campaignData).forEach(key => {
        if (campaignData[key as keyof CampaignFormData] === undefined) {
          delete campaignData[key as keyof CampaignFormData];
        }
      });
      
      console.log('Datos de la campaña a guardar:', campaignData);
      
      const result = await createCampaign(campaignData);
      console.log('Resultado de createCampaign:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Error al guardar la campaña');
      }
      
      // Forzar recarga de la lista de campañas
      router.refresh();
      router.push('/campaign');
    } catch (error) {
      console.error('Error al crear la campaña:', error);
      // Mostrar mensaje de error al usuario
      alert(`Error al guardar la campaña: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Renderizar el paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <DetailsStep />;
      case 1:
        return <RecipientStep />;
      case 2:
        return <EmailStep />;
      case 3:
        return <SchedulingStep />;
      case 4:
        return <ReviewStep onEditStep={setCurrentStep} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <FormProvider {...methods}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Crear nueva campaña</h1>
              <p className="text-muted-foreground">
                Completa los siguientes pasos para crear y programar tu campaña de correo electrónico.
              </p>
            </div>
            <Link href="/campaign">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver a campañas
              </Button>
            </Link>
          </div>
          
          <CampaignSteps currentStep={currentStep} onStepClick={setCurrentStep} />
          
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {renderStep()}
            
            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Anterior
              </Button>
              
              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Siguiente
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Crear campaña'}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}