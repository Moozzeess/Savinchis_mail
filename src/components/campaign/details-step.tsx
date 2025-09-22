'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const CAMPAIGN_OBJECTIVES = [
  { value: 'promotional', label: 'Promocional' },
  { value: 'newsletter', label: 'Boletín informativo' },
  { value: 'announcement', label: 'Anuncio' },
  { value: 'event', label: 'Invitación a evento' },
  { value: 'welcome', label: 'Correo de bienvenida' },
  { value: 'other', label: 'Otro' },
];

export function DetailsStep({ className = '' }: { className?: string }) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const selectedObjective = watch('objective');

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h3 className="text-base font-medium">Detalles de la campaña</h3>
        <p className="text-sm text-muted-foreground">
          Proporciona información básica sobre tu campaña.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nombre de la campaña <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Ej: Oferta de verano 2023"
            {...register('name')}
            className={errors.name && 'border-destructive'}
          />
          {errors.name && (
            <p className="text-sm text-destructive">
              {errors.name.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción (opcional)</Label>
          <Textarea
            id="description"
            placeholder="Describe el propósito de esta campaña"
            {...register('description')}
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">
            Solo para uso interno, no será visible para los destinatarios.
          </p>
        </div>

        <div className="space-y-2">
          <Label>
            Objetivo de la campaña <span className="text-destructive">*</span>
          </Label>
          <Select
            value={selectedObjective}
            onValueChange={(value) => setValue('objective', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un objetivo" />
            </SelectTrigger>
            <SelectContent>
              {CAMPAIGN_OBJECTIVES.map((objective) => (
                <SelectItem key={objective.value} value={objective.value}>
                  {objective.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.objective && (
            <p className="text-sm text-destructive">
              {errors.objective.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          

        </div>

        
      </div>
    </div>
  );
}