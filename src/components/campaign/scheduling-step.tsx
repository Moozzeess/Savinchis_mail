'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// Zonas horarias comunes
const TIMEZONES = [
  { value: 'America/Mexico_City', label: 'Ciudad de México (UTC-6/-5)' },
  { value: 'America/Bogota', label: 'Bogotá (UTC-5)' },
  { value: 'America/Lima', label: 'Lima (UTC-5)' },
  { value: 'America/Santiago', label: 'Santiago (UTC-4/-3)' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (UTC-3)' },
  { value: 'America/Sao_Paulo', label: 'Sao Paulo (UTC-3/-2)' },
  { value: 'America/New_York', label: 'Nueva York (UTC-5/-4)' },
  { value: 'America/Los_Angeles', label: 'Los Ángeles (UTC-8/-7)' },
  { value: 'Europe/Madrid', label: 'Madrid (UTC+1/+2)' },
];

// Horas del día para el selector de hora
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

export function SchedulingStep({ className = '' }: { className?: string }) {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const [isOptimalTime, setIsOptimalTime] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [timezone, setTimezone] = useState('America/Mexico_City');

  // Obtener valores del formulario
  const scheduledAt = watch('scheduledAt');
  const timeZone = watch('timeZone') || 'America/Mexico_City';

// Usar useCallback para estabilizar las referencias de las funciones
  const handleSendNowChange = useCallback((checked: boolean) => {
    if (checked) {
      setValue('scheduledAt', null);
    } else {
      const now = new Date();
      setDate(now);
      setHour(now.getHours().toString().padStart(2, '0'));
      setMinute(now.getMinutes().toString().padStart(2, '0'));
    }
  }, [setValue]);

// Efecto para actualizar la fecha/hora programada cuando cambian los valores
useEffect(() => {
  if (date && !isOptimalTime && !isNaN(new Date(date).getTime())) {
    const newDate = new Date(date);
    newDate.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);
    if (!isNaN(newDate.getTime())) {  // Validate before setting
      setValue('scheduledAt', newDate, { shouldValidate: true });
    }
  }
}, [date, hour, minute, isOptimalTime, setValue]);

  // Actualizar fecha y hora programada cuando cambian los valores
  useEffect(() => {
    if (date && hour && minute && timezone) {
      const newDate = new Date(date);
      newDate.setHours(parseInt(hour, 10));
      newDate.setMinutes(parseInt(minute, 10));
      newDate.setSeconds(0);
      
      // Ajustar según la zona horaria seleccionada
      const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
      const localISOTime = (new Date(newDate.getTime() - timeZoneOffset)).toISOString();
      
      setValue('scheduledAt', localISOTime, { shouldValidate: true });
      setValue('timeZone', timezone, { shouldValidate: true });
    }
  }, [date, hour, minute, timezone, setValue]);

  // Manejar cambio de hora óptima
  const handleOptimalTimeChange = (checked: boolean) => {
    setIsOptimalTime(checked);
    setValue('useOptimalTime', checked, { shouldValidate: true });
    
    if (checked) {
      // Calcular hora óptima (por ejemplo, mañana a las 10 AM)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      setDate(tomorrow);
      setHour('10');
      setMinute('00');
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (date: Date | undefined | null) => {
    if (!date || isNaN(new Date(date).getTime())) {
      return 'Selecciona una fecha';
    }
    try {
      return format(new Date(date), "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return 'Fecha inválida';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h3 className="text-base font-medium">Programar envío</h3>
        <p className="text-sm text-muted-foreground">
          Configura cuándo quieres que se envíe tu campaña.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base" htmlFor="send-now">
              Enviar ahora
            </Label>
            <p className="text-sm text-muted-foreground">
              La campaña se enviará inmediatamente después de hacer clic en "Enviar campaña"
            </p>
          </div>
          <Switch
            id="send-now"
            checked={!scheduledAt}
            onCheckedChange={handleSendNowChange}
          />
        </div>

        {scheduledAt && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Fecha de envío</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? formatDate(date) : <span>Selecciona una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date && !isNaN(new Date(date).getTime()) ? new Date(date) : undefined}
                    onSelect={(newDate) => {
                      if (newDate && !isNaN(new Date(newDate).getTime())) {
                        setDate(newDate);
                      }
                    }}
                    initialFocus
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    locale={es}
                  />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Hora de envío</Label>
                <div className="flex space-x-2">
                  <Select value={hour} onValueChange={setHour}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Hora" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {HOURS.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={minute} onValueChange={setMinute}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Minutos" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {MINUTES.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Zona horaria</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una zona horaria" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                La hora se mostrará a los destinatarios en su zona horaria local.
              </p>
            </div>

            <div className="flex items-center space-x-2 rounded-lg border p-4">
              <div className="flex-1 space-y-0.5">
                <Label className="flex items-center" htmlFor="optimal-time">
                  <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                  Hora de envío óptima
                </Label>
                <p className="text-sm text-muted-foreground">
                  Nuestro sistema analizará cuándo tus contactos tienen más probabilidades de abrir el correo.
                </p>
              </div>
              <Switch
                id="optimal-time"
                checked={isOptimalTime}
                onCheckedChange={handleOptimalTimeChange}
              />
            </div>

            {isOptimalTime && (
              <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                <p className="font-medium">¿Cómo funciona el envío en el momento óptimo?</p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>Analizamos los horarios de apertura de tus contactos anteriores</li>
                  <li>Enviamos el correo cuando es más probable que lo vean</li>
                  <li>El envío puede ocurrir dentro de las 24 horas siguientes</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {scheduledAt && date && (
          <div className="mt-6 rounded-lg bg-muted p-4">
            <h4 className="mb-2 text-sm font-medium">Resumen de programación</h4>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                Programado para el{' '}
                <span className="font-medium">
                {format(isValid(date) ? date : new Date(), "EEEE d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}                </span>{' '}
                ({timezone.replace('_', ' ').split('/')[1]})
              </span>
            </div>
            {isOptimalTime && (
              <div className="mt-2 flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                <Zap className="mr-1 h-3 w-3" />
                <span>Hora de envío óptima activada</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}