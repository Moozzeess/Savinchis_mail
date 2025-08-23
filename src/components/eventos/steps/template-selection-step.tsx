'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useState } from 'react';

// Mock data - Replace with actual API call to fetch templates
const TEMPLATE_TYPES = [
  { id: 'invitacion', name: 'Invitación', description: 'Plantilla para enviar invitaciones iniciales' },
  { id: 'recordatorio', name: 'Recordatorio', description: 'Plantilla para recordatorios antes del evento' },
  { id: 'confirmacion', name: 'Confirmación', description: 'Plantilla para confirmar asistencia' },
  { id: 'certificado', name: 'Certificado', description: 'Plantilla para certificados de asistencia' },
];

// Mock templates - Replace with actual API call
const TEMPLATES = [
  { id: '1', name: 'Invitación Estándar', type: 'invitacion' },
  { id: '2', name: 'Invitación Premium', type: 'invitacion' },
  { id: '3', name: 'Recordatorio 1 Semana', type: 'recordatorio' },
  { id: '4', name: 'Recordatorio 1 Día', type: 'recordatorio' },
  { id: '5', name: 'Confirmación Básica', type: 'confirmacion' },
  { id: '6', name: 'Certificado Estándar', type: 'certificado' },
];

export function TemplateSelectionStep() {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const [selectedTemplates, setSelectedTemplates] = useState<Record<string, string>>({});

  const handleTemplateSelect = (type: string, templateId: string) => {
    const newSelectedTemplates = { ...selectedTemplates, [type]: templateId };
    setSelectedTemplates(newSelectedTemplates);
    
    // Update form values
    setValue(`plantilla_${type}_id`, templateId, { shouldValidate: true });
  };

  const getTemplateName = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    return template ? template.name : 'No seleccionada';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Plantillas para el Evento</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona las plantillas que se utilizarán para las diferentes comunicaciones del evento.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Información importante</AlertTitle>
        <AlertDescription>
          Cada tipo de plantilla se utilizará en diferentes momentos del flujo del evento. 
          Asegúrate de seleccionar la plantilla adecuada para cada caso de uso.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {TEMPLATE_TYPES.map((templateType) => (
          <Card key={templateType.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 p-4">
              <CardTitle className="text-base">{templateType.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{templateType.description}</p>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Label htmlFor={`template-${templateType.id}`}>
                  {templateType.name} {errors[`plantilla_${templateType.id}_id`] && (
                    <span className="text-destructive text-xs">*</span>
                  )}
                </Label>
                <Select
                  value={selectedTemplates[templateType.id] || ''}
                  onValueChange={(value) => handleTemplateSelect(templateType.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Seleccionar ${templateType.name.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATES
                      .filter(template => template.type === templateType.id)
                      .map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors[`plantilla_${templateType.id}_id`] && (
                  <p className="text-sm font-medium text-destructive">
                    {errors[`plantilla_${templateType.id}_id`]?.message as string}
                  </p>
                )}
                {selectedTemplates[templateType.id] && (
                  <div className="mt-2 p-2 bg-muted/30 rounded text-sm">
                    <p className="font-medium">Vista previa:</p>
                    <p className="text-muted-foreground">
                      {getTemplateName(selectedTemplates[templateType.id])}
                    </p>
                    <button 
                      type="button" 
                      className="text-xs text-blue-600 hover:underline mt-1"
                      onClick={() => {
                        // TODO: Implement preview functionality
                        console.log('Preview template:', selectedTemplates[templateType.id]);
                      }}
                    >
                      Ver previsualización
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h4 className="font-medium text-amber-800 mb-2">Recomendaciones:</h4>
        <ul className="text-sm space-y-1 text-amber-700 list-disc pl-5">
          <li>Asegúrate de que las plantillas incluyan la información relevante del evento.</li>
          <li>Verifica que los enlaces de confirmación funcionen correctamente.</li>
          <li>Las plantillas de certificado deben incluir campos para el nombre del asistente y la fecha del evento.</li>
        </ul>
      </div>
    </div>
  );
}
