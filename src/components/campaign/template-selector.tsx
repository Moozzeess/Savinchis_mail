'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Plantillas } from "@/types/templates";
import { TemplatePreview } from "@/components/templates/template-preview";

interface TemplateCarouselProps {
    templates: Plantillas[];
    onSelect: (template: Plantillas) => void;
    selectedTemplateId?: string | number | null;
}

export function TemplateCarousel({ 
  templates, 
  onSelect,
  selectedTemplateId 
}: TemplateCarouselProps) {

  // Modal de vista previa ampliada
  const [previewTemplate, setPreviewTemplate] = useState<Plantillas | null>(null);

  return (
    <div className="relative w-full">
      <h2 className="text-lg font-bold mb-1">Selecciona una plantilla</h2>
      <p className="text-sm text-muted-foreground mb-4">Haz clic en una plantilla para seleccionarla o ampliar su vista previa.</p>

      {templates.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          No hay plantillas disponibles. Crea una nueva para comenzar.
        </div>
      ) : (
        <div className="flex-1 flex space-x-4 overflow-x-auto pb-4 px-1">
          {templates.map((template) => (
            <div
              key={template.id_plantilla}
              className={cn(
                "flex-none w-40 transition-all duration-200 relative group",
                "cursor-pointer hover:scale-105",
                selectedTemplateId === template.id_plantilla && "ring-4 ring-primary/70 bg-primary/10 rounded-lg shadow-lg"
              )}
              onClick={() => onSelect(template)}
            >
              <Card className="h-48 overflow-hidden">
                <div
                  className="h-32 w-full flex items-center justify-center bg-muted/40 rounded-t-md overflow-hidden relative"
                  onClick={e => {
                    e.stopPropagation();
                    setPreviewTemplate(template);
                  }}
                  title="Ver vista previa ampliada"
                >
                  <TemplatePreview
                    templateName={template.nombre}
                    isCertificate={template.tipo === 'certificate'}
                    templateContent={typeof template.contenido === 'string' ? undefined : template.contenido}
                    className="w-full h-full scale-90"
                  />
                  <span className="absolute bottom-1 right-1 text-xs bg-white/80 rounded px-1 py-0.5 shadow">Ver</span>
                </div>
                <CardContent className="p-2">
                  <div className="text-sm font-medium truncate flex items-center gap-1">
                    {template.nombre}
                    {selectedTemplateId === template.id_plantilla && (
                      <span className="ml-1 text-green-600" title="Plantilla seleccionada">✓</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Tipo: {template.tipo}
                  </div>
                  <Button
                    variant={selectedTemplateId === template.id_plantilla ? "default" : "outline"}
                    size="sm"
                    className="w-full mt-1"
                    onClick={e => {
                      e.stopPropagation();
                      onSelect(template);
                    }}
                    title={selectedTemplateId === template.id_plantilla ? "Esta plantilla está seleccionada" : "Seleccionar plantilla"}
                  >
                    {selectedTemplateId === template.id_plantilla ? "Seleccionada" : "Seleccionar"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Modal de vista previa */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setPreviewTemplate(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setPreviewTemplate(null)}
              title="Cerrar vista previa"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2">Vista previa de plantilla</h3>
            <TemplatePreview
              templateName={previewTemplate.nombre}
              isCertificate={previewTemplate.tipo === 'certificate'}
              templateContent={typeof previewTemplate.contenido === 'string' ? undefined : previewTemplate.contenido}
              className="w-full h-56"
            />
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => {
                  onSelect(previewTemplate);
                  setPreviewTemplate(null);
                }}
                variant={selectedTemplateId === previewTemplate.id_plantilla ? "default" : "outline"}
              >
                {selectedTemplateId === previewTemplate.id_plantilla ? "Seleccionada" : "Seleccionar esta plantilla"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Función auxiliar para obtener la miniatura de la plantilla
function getTemplateThumbnail(template: Plantillas): string {
    // Si el contenido es un objeto y tiene backgroundImage
    if (template.tipo === 'certificate' && 
        typeof template.contenido === 'object' && 
        template.contenido?.backgroundImage) {
      return template.contenido.backgroundImage;
    }
    // Si hay un thumbnail definido
    if (template.thumbnail) {
      return template.thumbnail;
    }
    // Si el contenido es una cadena que parece ser una URL de imagen
    if (typeof template.contenido === 'string' && 
        (template.contenido.startsWith('http') || 
         template.contenido.startsWith('data:image'))) {
      return template.contenido;
    }
    // Valor por defecto
    return '/placeholder-template.png';
}