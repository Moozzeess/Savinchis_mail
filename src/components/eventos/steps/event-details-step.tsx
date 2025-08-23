'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EventFormData {
  nombre: string;
  tipo_evento: string;
  ubicacion: string;
  fecha_hora_inicio: Date;
  fecha_hora_fin: Date;
  capacidad?: number;
  descripcion: string;
}

export function EventDetailsStep() {
  const { 
    register, 
    formState: { errors }, 
    watch, 
    setValue,
    trigger
  } = useFormContext<EventFormData>();
  
  const startDate = watch('fecha_hora_inicio');
  const endDate = watch('fecha_hora_fin');
  const tipoEvento = watch('tipo_evento');

  const handleDateChange = (field: 'fecha_hora_inicio' | 'fecha_hora_fin', date: Date | undefined) => {
    if (date) {
      setValue(field, date, { shouldValidate: true });
      trigger(field);
    }
  };

  // Register form fields with validation
  const nombreField = register('nombre', { required: 'El nombre es requerido' });
  const ubicacionField = register('ubicacion', { required: 'La ubicación es requerida' });
  const descripcionField = register('descripcion', { required: 'La descripción es requerida' });
  const capacidadField = register('capacidad', { 
    valueAsNumber: true,
    min: { value: 1, message: 'La capacidad debe ser mayor a 0' }
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre del Evento */}
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del Evento *</Label>
          <div>
            <Input
              id="nombre"
              placeholder="Ej: Conferencia Anual 2023"
              {...nombreField}
              className={errors.nombre ? 'border-red-500' : ''}
              onChange={(e) => {
                nombreField.onChange(e);
                trigger('nombre');
              }}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500 mt-1">{errors.nombre.message as string}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo_evento">Tipo de Evento *</Label>
          <Select 
            value={tipoEvento}
            onValueChange={(value: string) => {
              setValue('tipo_evento', value, { shouldValidate: true });
              trigger('tipo_evento');
            }}
          >
            <SelectTrigger className={errors.tipo_evento ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecciona un tipo de evento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conferencia">Conferencia</SelectItem>
              <SelectItem value="seminario">Seminario</SelectItem>
              <SelectItem value="taller">Taller</SelectItem>
              <SelectItem value="webinar">Webinar</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
          {errors.tipo_evento && (
            <p className="text-sm text-red-500">{errors.tipo_evento.message as string}</p>
          )}
        </div>

        {/* Ubicación */}
        <div className="space-y-2">
          <Label htmlFor="ubicacion">Ubicación *</Label>
          <div>
            <Input
              id="ubicacion"
              placeholder="Ej: Centro de Convenciones"
              {...ubicacionField}
              className={errors.ubicacion ? 'border-red-500' : ''}
              onChange={(e) => {
                ubicacionField.onChange(e);
                trigger('ubicacion');
              }}
            />
            {errors.ubicacion && (
              <p className="text-sm text-red-500 mt-1">{errors.ubicacion.message as string}</p>
            )}
          </div>
        </div>

        {/* Fecha y Hora de Inicio */}
        <div className="space-y-2">
          <Label>Fecha y Hora de Inicio *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground',
                  errors.fecha_hora_inicio && 'border-red-500'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(new Date(startDate), 'PPPp') : <span>Selecciona una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate ? new Date(startDate) : undefined}
                onSelect={(date) => handleDateChange('fecha_hora_inicio', date || undefined)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.fecha_hora_inicio && (
            <p className="text-sm text-red-500">{errors.fecha_hora_inicio.message as string}</p>
          )}
        </div>

        {/* Fecha y Hora de Finalización */}
        <div className="space-y-2">
          <Label>Fecha y Hora de Finalización *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground',
                  errors.fecha_hora_fin && 'border-red-500'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(new Date(endDate), 'PPPp') : <span>Selecciona una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate ? new Date(endDate) : undefined}
                onSelect={(date) => handleDateChange('fecha_hora_fin', date || undefined)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.fecha_hora_fin && (
            <p className="text-sm text-red-500">{errors.fecha_hora_fin.message as string}</p>
          )}
        </div>
      </div>

      {/* Capacidad */}
      <div className="space-y-2">
        <Label htmlFor="capacidad">Capacidad (opcional)</Label>
        <div>
          <Input
            id="capacidad"
            type="number"
            min={1}
            placeholder="Número de asistentes"
            {...capacidadField}
            className={errors.capacidad ? 'border-red-500' : ''}
            onChange={(e) => {
              capacidadField.onChange(e);
              trigger('capacidad');
            }}
          />
          {errors.capacidad && (
            <p className="text-sm text-red-500 mt-1">{errors.capacidad.message as string}</p>
          )}
        </div>
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción del Evento *</Label>
        <div>
          <Textarea
            id="descripcion"
            placeholder="Proporciona detalles sobre el evento..."
            className={cn('min-h-[120px]', errors.descripcion && 'border-red-500')}
            {...descripcionField}
            onChange={(e) => {
              descripcionField.onChange(e);
              trigger('descripcion');
            }}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-500 mt-1">{errors.descripcion.message as string}</p>
          )}
        </div>
      </div>
    </div>
  );
}
