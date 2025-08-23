'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { EventDetailsStep } from './steps/event-details-step';
import { TemplateSelectionStep } from './steps/template-selection-step';
import { SchedulingStep } from './steps/scheduling-step';
import { ReviewStep } from './steps/review-step';
import { EventRecipientStep } from '@/components/eventos/event-recipient-step';

// Define form validation schema with Zod
const eventFormSchema = z.object({
  // Step 1: Event Details
  nombre: z.string().min(3, 'El nombre del evento es requerido'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  tipo_evento: z.string().min(1, 'El tipo de evento es requerido'),
  ubicacion: z.string().min(3, 'La ubicación es requerida'),
  fecha_hora_inicio: z.date(),
  fecha_hora_fin: z.date(),
  capacidad: z.number().min(1, 'La capacidad debe ser mayor a 0').optional(),
  
  // Step 2: Contact List
  contactListId: z.string().min(1, 'Debes seleccionar una lista de contactos'),
  
  // Step 3: Templates
  plantilla_invitacion_id: z.string().min(1, 'Plantilla de invitación es requerida'),
  plantilla_recordatorio_id: z.string().min(1, 'Plantilla de recordatorio es requerida'),
  plantilla_confirmacion_id: z.string().min(1, 'Plantilla de confirmación es requerida'),
  plantilla_certificado_id: z.string().min(1, 'Plantilla de certificado es requerida'),
  
  // Step 4: Scheduling
  programacion_invitacion: z.date(),
  programacion_recordatorio: z.date(),
  programacion_confirmacion: z.date(),
  programacion_certificado: z.date(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

const steps = [
  { id: 'details', title: 'Detalles del Evento' },
  { id: 'contacts', title: 'Lista de Contactos' },
  { id: 'templates', title: 'Plantillas' },
  { id: 'scheduling', title: 'Programación' },
  { id: 'review', title: 'Revisión' },
];

interface EventWizardProps {
  onSubmit?: (data: EventFormData) => Promise<void>;
  initialValues?: Partial<EventFormData>;
}

export function EventWizard({ onSubmit: onSubmitProp, initialValues = {} }: EventWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      fecha_hora_inicio: new Date(),
      fecha_hora_fin: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
      ...initialValues,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmitProp) {
        await onSubmitProp(data);
      } else {
        // Default submit behavior if no onSubmit prop provided
        console.log('Submitting event:', data);
        // TODO: Implement default submission logic
      }
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const fields = steps[currentStep].id === 'details' 
      ? ['nombre', 'tipo_evento', 'ubicacion', 'fecha_hora_inicio', 'fecha_hora_fin', 'descripcion']
      : [];
    
    const isValid = await methods.trigger(fields as any);
    if (isValid) {
      setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((step) => Math.max(0, step - 1));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {steps[currentStep].title}
            </CardTitle>
            <div className="pt-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                {steps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`flex flex-col items-center ${index <= currentStep ? 'text-primary' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      index < currentStep 
                        ? 'bg-green-100 text-green-600' 
                        : index === currentStep 
                          ? 'bg-primary text-white' 
                          : 'bg-muted'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="text-xs">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {currentStep === 0 && <EventDetailsStep />}
            {currentStep === 1 && <EventRecipientStep />}
            {currentStep === 2 && <TemplateSelectionStep />}
            {currentStep === 3 && <SchedulingStep />}
            {currentStep === 4 && <ReviewStep />}
          </CardContent>
          
          <CardFooter className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0 || isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
            <div>
              {currentStep < steps.length - 1 ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Crear Evento'}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
