'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

const steps = [
  { id: '1', name: 'Detalles', description: 'Información básica' },
  { id: '2', name: 'Destinatarios', description: 'Lista de contactos' },
  { id: '3', name: 'Contenido', description: 'Redactar correo' },
  { id: '4', 'name': 'Recurencia', description: 'Fecha y hora' },
  { id: '5', name: 'Revisar', description: 'Confirmar detalles' },
];

interface CampaignStepsProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function CampaignSteps({ currentStep, onStepClick }: CampaignStepsProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex justify-between overflow-hidden">
        {steps.map((step, stepIdx) => {
          const status =
            currentStep > stepIdx
              ? 'completed'
              : currentStep === stepIdx
                ? 'current'
                : 'upcoming';

          return (
            <li
              key={step.id}
              className={cn(
                'relative flex-1', 
                stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '' 
              )}
              onClick={() => onStepClick(stepIdx)}
            >
              {stepIdx !== steps.length - 1 && (
               
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div
                    className={cn(
                      'h-0.5 w-full',
                      status === 'completed' ? 'bg-primary' : 'bg-gray-200'
                    )}
                  />
                </div>
              )}

              <a
                href="#"
                className="group relative flex flex-col items-center"
              >
                {status !== 'upcoming' ? (
                  <>
                    <span className="flex h-9 items-center">
                      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                        <CheckCircle
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                    <span className="mt-2 text-sm font-medium text-center">
                      {step.name}
                    </span>
                    <span className="text-sm text-muted-foreground text-center">
                      {step.description}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex h-9 items-center" aria-hidden="true">
                      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                        <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                      </span>
                    </span>
                    <span className="mt-2 text-sm font-medium text-muted-foreground text-center">
                      {step.name}
                    </span>
                    <span className="text-sm text-muted-foreground text-center">
                      {step.description}
                    </span>
                  </>
                )}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}