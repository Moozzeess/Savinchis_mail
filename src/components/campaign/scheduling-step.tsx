'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { format, isValid, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, Zap, Plus, Trash2, Globe, AlertCircle, Info } from 'lucide-react';

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

interface SendConfig {
  id: string;
  name: string;
  sendNow: boolean;
  optimalTime: boolean;
  date: Date | undefined;
  hour: string;
  minute: string;
  timezone: string;
  isEditing: boolean;
}

export function SchedulingStep({ className = '' }: { className?: string }) {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const [sends, setSends] = useState<SendConfig[]>(() => [
    {
      id: '1',
      name: 'Envío Principal',
      sendNow: true,
      optimalTime: false,
      date: new Date(),
      hour: '12',
      minute: '00',
      timezone: 'America/Mexico_City',
      isEditing: true,
    },
  ]);

  // Estado para controlar qué envío está activo/visible
  const [activeSendId, setActiveSendId] = useState<string | null>('1'); // El primer envío está activo por defecto

  // Obtener valores del formulario
  const scheduledSends = watch('scheduledSends') || [];

  // Actualizar el formulario cuando cambian los envíos
  useEffect(() => {
    const formattedSends = sends.map(send => ({
      id: send.id,
      name: send.name,
      sendNow: send.sendNow,
      optimalTime: send.optimalTime,
      scheduledAt: send.sendNow ? null : send.date ? new Date(
        new Date(send.date).setHours(
          parseInt(send.hour, 10),
          parseInt(send.minute, 10),
          0,
          0
        )
      ) : null,
      timeZone: send.timezone,
    }));
    
    setValue('scheduledSends', formattedSends, { shouldValidate: true });
  }, [sends, setValue]);

  // Agregar un nuevo envío
  const addNewSend = () => {
    // Set all other sends to not editing
    const updatedSends = sends.map(send => ({
      ...send,
      isEditing: false
    }));

    const newSend: SendConfig = {
      id: Date.now().toString(),
      name: `Envío ${sends.length + 1}`,
      sendNow: false,
      optimalTime: false,
      date: addDays(new Date(), 1),
      hour: '10',
      minute: '00',
      timezone: 'America/Mexico_City',
      isEditing: true, // New send is editable
    };
    
    setSends([...updatedSends, newSend]);
  };

  // Edit an existing send
  const editSend = (id: string) => {
    setSends(prevSends => 
      prevSends.map(send => ({
        ...send,
        isEditing: send.id === id
      }))
    );
  };

  // Eliminar un envío
  const removeSend = (id: string) => {
    if (sends.length > 1) {
      setSends(prev => prev.filter(send => send.id !== id));
    }
  };

  // Actualizar un envío
  const updateSend = (id: string, updates: Partial<SendConfig>) => {
    setSends(prev => prev.map(send => 
      send.id === id ? { ...send, ...updates } : send
    ));
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

  // Componente para cada tarjeta de envío
  interface SendCardProps {
    send: SendConfig;
    index: number;
    onFinish?: () => void;
  }

  const SendCard = ({ send, index, onFinish }: SendCardProps) => {
    const handleSendNowChange = (checked: boolean) => {
      updateSend(send.id, {
        sendNow: checked,
        optimalTime: checked ? false : send.optimalTime,
      });
    };

    const handleOptimalTimeChange = (checked: boolean) => {
      updateSend(send.id, {
        optimalTime: checked,
        hour: checked ? '10' : send.hour,
        minute: '00',
      });
    };

    const handleComplete = () => {
      if (onFinish) onFinish();
    };

    return (
      <div className="border-2 border-border/50 rounded-lg bg-card shadow-sm">
        {/* Header del envío */}
        <div className="p-4 bg-primary/10 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Input
                value={send.name}
                onChange={(e) => updateSend(send.id, { name: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              {sends.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSend(send.id)}
                  className="text-destructive/80 hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Eliminar envío</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Contenido del envío */}
        <div className="p-5 space-y-5">
          {/* Opción de enviar ahora */}
          <div className="flex items-start p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-center h-5">
              <Switch
                id={`send-now-${send.id}`}
                checked={send.sendNow}
                onCheckedChange={handleSendNowChange}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30"
              />
            </div>
            <div className="ml-3 space-y-1">
              <Label 
                htmlFor={`send-now-${send.id}`}
                className="text-base font-medium text-foreground cursor-pointer"
              >
                Enviar ahora
              </Label>
              <p className="text-sm text-muted-foreground">
                {index === 0 
                  ? 'La campaña se enviará inmediatamente después de hacer clic en "Enviar campaña".'
                  : 'Este envío se procesará inmediatamente después del anterior.'
                }
              </p>
            </div>
          </div>

          {/* Programación de fecha y hora */}
          {!send.sendNow && (
            <div className="space-y-5">
              <div className="p-4 bg-muted/20 rounded-lg border border-border/50 space-y-4">
                <h4 className="font-medium text-foreground">Programar fecha y hora</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Selector de fecha */}
                  <div className="space-y-2">
                    <Label htmlFor={`schedule-date-${send.id}`} className="text-foreground/90">
                      Fecha de envío
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal h-10',
                            !send.date ? 'text-muted-foreground' : 'text-foreground',
                            'hover:bg-background/80 transition-colors'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {send.date ? formatDate(send.date) : <span>Seleccionar fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={send.date}
                          onSelect={(date) => {
                            if (date) {
                              updateSend(send.id, { date });
                            }
                          }}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          initialFocus
                          locale={es}
                          className="border-border bg-background rounded-md shadow-lg"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Selector de hora */}
                  <div className="space-y-2">
                    <Label htmlFor={`schedule-time-${send.id}`} className="text-foreground/90">
                      Hora de envío
                    </Label>
                    <div className="flex space-x-2">
                      <Select 
                        value={send.hour} 
                        onValueChange={(value) => updateSend(send.id, { hour: value })}
                        disabled={send.optimalTime}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Hora" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] bg-background">
                          {HOURS.map((h) => (
                            <SelectItem 
                              key={h} 
                              value={h}
                              className="hover:bg-muted/50 focus:bg-muted/50"
                            >
                              {h}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select 
                        value={send.minute} 
                        onValueChange={(value) => updateSend(send.id, { minute: value })}
                        disabled={send.optimalTime}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] bg-background">
                          {MINUTES.map((m) => (
                            <SelectItem 
                              key={m} 
                              value={m}
                              className="hover:bg-muted/50 focus:bg-muted/50"
                            >
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Selector de zona horaria */}
                  <div className="space-y-2">
                    <Label htmlFor={`timezone-${send.id}`} className="text-foreground/90">
                      Zona horaria
                    </Label>
                    <Select 
                      value={send.timezone}
                      onValueChange={(value) => updateSend(send.id, { timezone: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Seleccionar zona horaria" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {TIMEZONES.map((tz) => (
                          <SelectItem 
                            key={tz.value} 
                            value={tz.value}
                            className="hover:bg-muted/50 focus:bg-muted/50"
                          >
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  La hora se mostrará a los destinatarios en su zona horaria local.
                </p>
              </div>

              {/* Hora óptima */}
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/30">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Switch
                        id={`optimal-time-${send.id}`}
                        checked={send.optimalTime}
                        onCheckedChange={handleOptimalTimeChange}
                        className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-muted-foreground/30"
                      />
                    </div>
                    <div className="ml-3 space-y-1">
                      <Label 
                        htmlFor={`optimal-time-${send.id}`}
                        className="text-base font-medium text-foreground cursor-pointer"
                      >
                        Hora de envío óptima
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Nuestro sistema analizará cuándo tus contactos tienen más probabilidades de abrir el correo.
                      </p>
                    </div>
                  </div>

                  {send.optimalTime && (
                    <div className="ml-11 p-3 bg-accent/10 rounded-md border border-accent/20">
                      <p className="text-sm text-accent-foreground flex items-start gap-2">
                        <Zap className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
                        <span>El sistema configurará automáticamente la mejor hora para enviar este envío basándose en el comportamiento histórico de tus contactos.</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Resumen de programación */}
          {!send.sendNow && send.date && (
            <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
              <h4 className="text-sm font-medium mb-2 text-foreground/90">Resumen de programación</h4>
              <div className="flex items-start space-x-2 text-sm">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-foreground">
                    Programado para el{' '}
                    <span className="font-medium">
                      {format(send.date, "EEEE d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                    </span>
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    ({send.timezone.replace('_', ' ').split('/')[1]})
                  </p>
                  {send.optimalTime && (
                    <div className="mt-2 flex items-center text-sm text-accent-foreground">
                      <Zap className="mr-1.5 h-3.5 w-3.5 text-accent" />
                      <span>Hora de envío óptima activada</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botón de completado */}
        <div className="p-4 border-t border-border/50 flex justify-end">
          <Button 
            onClick={handleComplete}
            className="bg-primary hover:bg-primary/90"
          >
            Listo
          </Button>
        </div>
      </div>
    );
  };

  // Componente para cada tarjeta de envío en modo resumen
  const SendSummary = ({ send, onEdit }: { send: SendConfig; onEdit: () => void }) => (
    <div className="p-4 bg-muted/20 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
         onClick={onEdit}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${
            send.sendNow ? 'bg-primary' : 'bg-accent'
          }`}></div>
          <h4 className="font-medium text-foreground">{send.name}</h4>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          Editar
        </Button>
      </div>
      
      <div className="mt-2 ml-4 text-sm text-foreground/90 space-y-1">
        {send.sendNow ? (
          <p className="flex items-center">
            <Zap className="w-3.5 h-3.5 mr-1.5 text-primary" />
            <span>Envío inmediato</span>
          </p>
        ) : send.date ? (
          <>
            <div className="flex items-start">
              <CalendarIcon className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <span>{format(send.date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}</span>
            </div>
            {send.optimalTime ? (
              <div className="flex items-center">
                <Zap className="w-3.5 h-3.5 mr-1.5 text-accent flex-shrink-0" />
                <span>Hora optimizada automáticamente</span>
              </div>
            ) : send.hour && send.minute && (
              <div className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                <span>{send.hour}:{send.minute} hrs</span>
              </div>
            )}
            <div className="flex items-center">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
              <span>{TIMEZONES.find(tz => tz.value === send.timezone)?.label}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center text-amber-600">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
            <span>Configuración incompleta</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Mostrar el envío actual en edición */}
      {sends.filter(s => s.isEditing).map((send) => (
        <SendCard 
          key={send.id} 
          send={send} 
          index={sends.findIndex(s => s.id === send.id)}
          onFinish={() => {
            // Al terminar de editar, marcamos como no en edición
            setSends(prevSends => 
              prevSends.map(s => 
                s.id === send.id 
                  ? { ...s, isEditing: false } 
                  : s
              )
            );
          }}
        />
      ))}

      {/* Botón para agregar nuevo envío */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={addNewSend}
          variant="outline"
          className="border-primary/30 text-foreground hover:bg-primary/5"
        >
          <Plus className="w-4 h-4 mr-2" />
          {sends.length > 0 ? 'Agregar otro envío' : 'Agregar envío'}
        </Button>
      </div>

      {/* Mostrar resumen de envíos existentes */}
      {sends.filter(s => !s.isEditing).length > 0 && (
        <div className="border-t border-border/50 pt-6 mt-6">
          <h4 className="font-medium text-foreground text-lg mb-4">
            Envíos programados
          </h4>
          
          <div className="space-y-3">
            {sends
              .filter(send => !send.isEditing)
              .map((send) => (
                <div 
                  key={send.id} 
                  className="p-4 bg-muted/10 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => editSend(send.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        send.sendNow ? 'bg-primary' : 'bg-accent'
                      }`}></div>
                      <span className="font-medium text-foreground">
                        {send.name}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        editSend(send.id);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Editar
                    </Button>
                  </div>
                  
                  <div className="mt-2 ml-4 text-sm text-foreground/90 space-y-1">
                    {send.sendNow ? (
                      <p className="flex items-center">
                        <Zap className="w-3.5 h-3.5 mr-1.5 text-primary" />
                        <span>Envío inmediato</span>
                      </p>
                    ) : send.date ? (
                      <>
                        <div className="flex items-start">
                          <CalendarIcon className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <span>{format(send.date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}</span>
                        </div>
                        {send.optimalTime ? (
                          <div className="flex items-center">
                            <Zap className="w-3.5 h-3.5 mr-1.5 text-accent flex-shrink-0" />
                            <span>Hora optimizada automáticamente</span>
                          </div>
                        ) : send.hour && send.minute && (
                          <div className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                            <span>{send.hour}:{send.minute} hrs</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Globe className="w-3.5 h-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                          <span>{TIMEZONES.find(tz => tz.value === send.timezone)?.label}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center text-amber-600">
                        <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                        <span>Configuración incompleta</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {sends.length > 1 && (
            <div className="mt-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <div className="flex items-start">
                <Info className="w-4 h-4 text-accent mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground/90">
                    Total de envíos programados: <span className="font-semibold">{sends.length}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Los envíos se procesarán en el orden configurado.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}