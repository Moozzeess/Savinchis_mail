'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle2, AlertCircle, Clock, Mail, FileText, Users, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type TemplateType = 'invitacion' | 'recordatorio' | 'confirmacion' | 'certificado';

const TEMPLATE_LABELS: Record<TemplateType, string> = {
  invitacion: 'Invitación',
  recordatorio: 'Recordatorio',
  confirmacion: 'Confirmación',
  certificado: 'Certificado'
};

export function ReviewStep() {
  const { watch } = useFormContext();
  
  // Get all form values
  const formValues = watch();
  
  // Format date for display
  const formatDate = (date: Date | string) => {
    if (!date) return 'No especificada';
    return format(new Date(date), "PPPp", { locale: es });
  };
  
  // Get template name by ID
  const getTemplateName = (templateId: string) => {
    // This should be replaced with actual template data from your API
    const templates = [
      { id: '1', name: 'Invitación Estándar' },
      { id: '2', name: 'Invitación Premium' },
      { id: '3', name: 'Recordatorio 1 Semana' },
      { id: '4', name: 'Recordatorio 1 Día' },
      { id: '5', name: 'Confirmación Básica' },
      { id: '6', name: 'Certificado Estándar' },
    ];
    return templates.find(t => t.id === templateId)?.name || 'Plantilla no encontrada';
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center text-green-600">
          <CheckCircle2 className="h-8 w-8 mr-2" />
          <h2 className="text-2xl font-bold">¡Estás listo para crear tu evento!</h2>
        </div>
        <p className="text-muted-foreground">
          Revisa la información del evento antes de continuar.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Event Details Card */}
        <Card>
          <CardHeader className="bg-muted/50">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <CardTitle className="text-lg">Detalles del Evento</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Información Básica</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Nombre:</span> {formValues.nombre || 'No especificado'}</p>
                  <p><span className="font-medium">Tipo:</span> {formValues.tipo_evento || 'No especificado'}</p>
                  <p><span className="font-medium">Ubicación:</span> {formValues.ubicacion || 'No especificada'}</p>
                  <p><span className="font-medium">Capacidad:</span> {formValues.capacidad || 'Ilimitada'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Fechas y Horarios</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Inicio:</span> {formatDate(formValues.fecha_hora_inicio)}</p>
                  <p><span className="font-medium">Fin:</span> {formatDate(formValues.fecha_hora_fin)}</p>
                </div>
              </div>
            </div>
            
            {formValues.descripcion && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Descripción</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {formValues.descripcion}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact List Card */}
        <Card>
          <CardHeader className="bg-muted/50">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle className="text-lg">Lista de Contactos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h4 className="font-medium">Lista Seleccionada</h4>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {formValues.contactListId ? `ID: ${formValues.contactListId}` : 'No se ha seleccionado una lista'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formValues.contactListId 
                    ? 'Los contactos podrán confirmar su asistencia' 
                    : 'No se enviarán invitaciones sin una lista de contactos'}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Notas</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li>Podrás editar la lista de asistentes confirmados después de crear el evento.</li>
                <li>Los asistentes recibirán un enlace para confirmar su asistencia.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Templates Card */}
        <Card>
          <CardHeader className="bg-muted/50">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <CardTitle className="text-lg">Plantillas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {(['invitacion', 'recordatorio', 'confirmacion', 'certificado'] as TemplateType[]).map((type) => (
                <div key={type} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{TEMPLATE_LABELS[type]}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formValues[`plantilla_${type}_id`] 
                          ? getTemplateName(formValues[`plantilla_${type}_id`])
                          : 'No seleccionada'}
                      </p>
                    </div>
                    <Badge variant={formValues[`plantilla_${type}_id`] ? 'default' : 'outline'}>
                      {formValues[`plantilla_${type}_id`] ? 'Configurada' : 'Pendiente'}
                    </Badge>
                  </div>
                  
                  {formValues[`programacion_${type}`] && (
                    <div className="mt-2 pt-2 border-t text-sm flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Programado para: {formatDate(formValues[`programacion_${type}`])}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">Resumen de Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <div>
                <p className="font-medium">Crear evento</p>
                <p className="text-sm text-muted-foreground">Se creará un nuevo evento con la información proporcionada.</p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className={`h-2 w-2 rounded-full ${
                  formValues.contactListId ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              </div>
              <div>
                <p className="font-medium">Asignar lista de contactos</p>
                <p className="text-sm text-muted-foreground">
                  {formValues.contactListId 
                    ? 'Se asignará la lista de contactos seleccionada.'
                    : 'No se asignará ninguna lista de contactos.'}
                </p>
              </div>
            </li>
            
            {formValues.plantilla_invitacion_id && (
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
                <div>
                  <p className="font-medium">Programar envío de invitaciones</p>
                  <p className="text-sm text-muted-foreground">
                    {formValues.programacion_invitacion 
                      ? `Programado para: ${formatDate(formValues.programacion_invitacion)}`
                      : 'No se ha programado el envío de invitaciones.'}
                  </p>
                </div>
              </li>
            )}
            
            {formValues.plantilla_recordatorio_id && (
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className={`h-2 w-2 rounded-full ${
                    formValues.programacion_recordatorio ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                </div>
                <div>
                  <p className="font-medium">Programar recordatorio</p>
                  <p className="text-sm text-muted-foreground">
                    {formValues.programacion_recordatorio 
                      ? `Programado para: ${formatDate(formValues.programacion_recordatorio)}`
                      : 'No se ha programado ningún recordatorio.'}
                  </p>
                </div>
              </li>
            )}
          </ul>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <div className="w-full space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Revisa cuidadosamente la información antes de continuar.</span>
            </div>
            
            <Button type="submit" className="w-full" size="lg">
              Confirmar y crear evento
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
