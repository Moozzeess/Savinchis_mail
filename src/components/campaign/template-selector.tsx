'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Template } from "@/actions/template-actions";
import { Plantillas } from "@/types/templates";

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
  const [startIndex, setStartIndex] = useState(0);
  const visibleTemplates = 5; // Número de plantillas visibles

  const visibleItems = templates.slice(startIndex, startIndex + visibleTemplates);

  const next = () => {
    if (startIndex + visibleTemplates < templates.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 overflow-hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={prev} 
          disabled={startIndex === 0}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 flex space-x-4 overflow-x-auto pb-4 px-1">
          {visibleItems.map((template) => (
            <div 
              key={template.id_plantilla} 
              className={cn(
                "flex-none w-40 transition-all duration-200",
                "cursor-pointer hover:scale-105",
                selectedTemplateId === template.id_plantilla && "ring-2 ring-primary rounded-lg"
              )}
              onClick={() => onSelect(template)}
            >
              <Card className="h-48 overflow-hidden">
                <div 
                  className="h-32 bg-cover bg-center" 
                  style={{ 
                    backgroundImage: `url(${getTemplateThumbnail(template)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} 
                />
                <CardContent className="p-2">
                  <div className="text-sm font-medium truncate">{template.nombre}</div>
                  <div className="text-xs text-muted-foreground">
                    {template.tipo === 'template' || 'certificate' || 'email'}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={next}
          disabled={startIndex + visibleTemplates >= templates.length}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
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