'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type TemplateSchedule = {
  id: string;
  type: 'invitacion' | 'recordatorio' | 'confirmacion' | 'certificado';
  name: string;
  description: string;
  defaultOffset?: {
    days?: number;
    hours?: number;
  };
};

const TEMPLATE_SCHEDULES: TemplateSchedule[] = [
  {
    id: 'invitacion',
    type: 'invitacion',
    name: 'Invitación',
    description: 'Enviar invitación inicial',
    defaultOffset: { days: 7 },
  },
  {
    id: 'recordatorio',
    type: 'recordatorio',
    name: 'Recordatorio',
    description: 'Recordatorio antes del evento',
    defaultOffset: { days: 1 },
  },
  {
    id: 'confirmacion',
    type: 'confirmacion',
    name: 'Confirmación',
    description: 'Confirmación de asistencia',
    defaultOffset: { hours: 2 },
  },
  {
    id: 'certificado',
    type: 'certificado',
    name: 'Certificado',
    description: 'Envío de certificados',
    defaultOffset: { hours: 1 },
  },
];

export function SchedulingStep() {
  const { watch, setValue, formState: { errors } } = useFormContext();
  
  // Watch the event start time to calculate default schedule times
  const eventStartTime = watch('fecha_hora_inicio');
  
  // Calculate default schedule times based on event start time
  const getDefaultScheduleTime = (schedule: TemplateSchedule) => {
    if (!eventStartTime) return new Date();
    
    const date = new Date(eventStartTime);
    const offset = schedule.defaultOffset || {};
    
    if (offset.days) {
      date.setDate(date.getDate() - offset.days);
    }
    if (offset.hours) {
      date.setHours(date.getHours() - offset.hours);
    }
    
    return date;
  };

  const handleDateSelect = (date: Date | undefined, field: string) => {
    if (date) {
      setValue(field, date, { shouldValidate: true });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, currentDate: Date) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(currentDate);
    newDate.setHours(hours, minutes);
    setValue(field, newDate, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Programación de Envíos</h3>
        <p className="text-sm text-muted-foreground">
          Configura cuándo se enviarán automáticamente las diferentes comunicaciones del evento.
        </p>
      </div>

      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-700">¡Atención!</AlertTitle>
        <AlertDescription className="text-red-600">
          Asegúrate de programar los envíos con suficiente anticipación. 
          Las invitaciones deberían enviarse al menos con una semana de anticipación.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {TEMPLATE_SCHEDULES.map((schedule) => {
          const fieldName = `programacion_${schedule.type}` as const;
          const dateValue = watch(fieldName) || getDefaultScheduleTime(schedule);
          
          return (
            <Card key={schedule.id}>
              <CardHeader className="p-4 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {schedule.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{schedule.description}</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha de envío</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !dateValue && 'text-muted-foreground',
                            errors[fieldName] && 'border-destructive'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateValue ? (
                            format(new Date(dateValue), "PPP", { locale: es })
                          ) : (
                            <span>Seleccionar fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={new Date(dateValue)}
                          onSelect={(date) => handleDateSelect(date, fieldName)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Hora de envío</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={dateValue ? format(new Date(dateValue), 'HH:mm') : ''}
                        onChange={(e) => handleTimeChange(e, fieldName, new Date(dateValue))}
                        className={cn(
                          errors[fieldName] && 'border-destructive'
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Set to now + 1 hour
                          const now = new Date();
                          now.setHours(now.getHours() + 1);
                          setValue(fieldName, now, { shouldValidate: true });
                        }}
                      >
                        Ahora +1h
                      </Button>
                    </div>
                  </div>
                </div>
                
                {errors[fieldName] && (
                  <p className="mt-2 text-sm font-medium text-destructive">
                    {errors[fieldName]?.message as string}
                  </p>
                )}
                
                <div className="mt-3 text-xs text-muted-foreground">
                  {schedule.type === 'invitacion' && (
                    <p>Se recomienda enviar las invitaciones al menos una semana antes del evento.</p>
                  )}
                  {schedule.type === 'recordatorio' && (
                    <p>Un recordatorio 24 horas antes ayuda a reducir el ausentismo.</p>
                  )}
                  {schedule.type === 'confirmacion' && (
                    <p>Envíe la confirmación poco después de que el asistente confirme su asistencia.</p>
                  )}
                  {schedule.type === 'certificado' && (
                    <p>Los certificados suelen enviarse inmediatamente después de finalizado el evento.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-700">Consejo</AlertTitle>
        <AlertDescription className="text-blue-600">
          Puedes modificar estas programaciones más adelante desde el panel de control del evento.
        </AlertDescription>
      </Alert>
    </div>
  );
}
