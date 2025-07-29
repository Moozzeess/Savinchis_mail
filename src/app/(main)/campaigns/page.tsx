'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Components
import { CampaignSteps } from '@/components/campaign/campaign-steps';
import { DetailsStep } from '@/components/campaign/details-step';
import { RecipientStep } from '@/components/campaign/recipient-step';
import { EmailStep } from '@/components/campaign/email-step';
import { SchedulingStep } from '@/components/campaign/scheduling-step';
import { ReviewStep } from '@/components/campaign/review-step';
import { Button } from '@/components/ui/button';

// Types
import { Campaign, CampaignFormData } from '@/types/campaign';

// Services
import { createCampaign } from '@/service/campaign.service';

// Schema de validación
const campaignFormSchema = z.object({
  // Detalles básicos
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  objective: z.enum(['promotional', 'newsletter', 'announcement', 'event', 'welcome', 'other']),
  
  // Contenido del correo
  subject: z.string(),
  emailBody: z.string(),
  fromName: z.string().min(1, 'El nombre del remitente es requerido'),
  fromEmail: z.string().email('Ingresa un correo electrónico válido'),
  replyTo: z.string().email('Ingresa un correo electrónico válido').optional(),
  
  // Destinatarios
  contactList: z.string().min(1, 'Debes seleccionar una lista de contactos'),
  contactListName: z.string().optional(),
  totalRecipients: z.number().min(1, 'Debes tener al menos un destinatario'),
  
  // Programación
  sendNow: z.boolean().default(true),
  scheduledDate: z.date().optional(),
  optimalTime: z.boolean().default(false),
  timezone: z.string().optional(),
  
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
      subject: '',
      emailBody: '',
      fromName: '',
      fromEmail: '',
      contactList: '',
      sendNow: true,
      trackOpens: true,
      trackClicks: true,
      isABTest: false,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
  
  // Avanzar al siguiente paso
  const nextStep = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
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
      // Convert form data to Campaign type
      const campaignData: Campaign = {
        ...data,
        scheduledAt: data.sendNow ? null : data.scheduledDate?.toISOString(),
        timeZone: data.timezone,
        useOptimalTime: data.optimalTime,
      };
      await createCampaign(campaignData);
      router.push('/campaigns');
    } catch (error) {
      console.error('Error al crear la campaña:', error);
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Crear nueva campaña</h1>
            <p className="text-muted-foreground">
              Completa los siguientes pasos para crear y programar tu campaña de correo electrónico.
            </p>
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