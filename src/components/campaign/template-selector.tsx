'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FileText, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Plantillas } from "@/types/templates";
import { TemplatePreview } from "@/components/templates/template-preview";
import { generateHtmlFromBlocks } from "@/lib/template-utils";

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
  
  // Generar HTML de vista previa para la miniatura
  const getPreviewHtml = (template: Plantillas) => {
    try {
      // Si es una plantilla HTML, usar directamente el contenido
      if (template.tipo === 'html' && (template as any).html_content) {
        return (template as any).html_content;
      }
      
      // Si es una plantilla con bloques, generar el HTML
      if (template.contenido) {
        if (Array.isArray(template.contenido)) {
          return generateHtmlFromBlocks({
            templateName: template.nombre,
            emailSubject: template.asunto_predeterminado || 'Vista previa',
            blocks: template.contenido,
            isHtmlTemplate: false,
            htmlContent: ''
          });
        } else if (typeof template.contenido === 'object' && template.contenido.blocks) {
          return generateHtmlFromBlocks({
            templateName: template.nombre,
            emailSubject: template.asunto_predeterminado || 'Vista previa',
            blocks: template.contenido.blocks,
            isHtmlTemplate: template.contenido.isHtmlTemplate || false,
            htmlContent: template.contenido.htmlContent || ''
          });
        }
      }
      
      // Si no se pudo generar la vista previa, mostrar un mensaje
      return `
        <div class="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-muted/20">
          <div class="text-yellow-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </div>
          <p class="text-sm font-medium text-muted-foreground">Vista previa no disponible</p>
          <p class="text-xs text-muted-foreground/60 mt-1">${template.nombre || 'Plantilla sin nombre'}</p>
        </div>
      `;
    } catch (error) {
      console.error('Error al generar vista previa:', error);
      return `
        <div class="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-muted/20">
          <div class="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" x2="12" y1="8" y2="12"></line>
              <line x1="12" x2="12.01" y1="16" y2="16"></line>
            </svg>
          </div>
          <p class="text-sm font-medium text-muted-foreground">Error al cargar la vista previa</p>
          <p class="text-xs text-muted-foreground/60 mt-1">${template.nombre || 'Plantilla sin nombre'}</p>
        </div>
      `;
    }
  };

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
              <Card className="h-48 overflow-hidden group-hover:shadow-md transition-shadow">
                <div
                  className="h-32 w-full flex items-center justify-center bg-muted/40 rounded-t-md overflow-hidden relative"
                  onClick={e => {
                    e.stopPropagation();
                    setPreviewTemplate(template);
                  }}
                  title="Ver vista previa ampliada"
                >
                  <div 
                    className="w-full h-full overflow-hidden flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: getPreviewHtml(template) }}
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
    // Si es una plantilla HTML, usar un icono específico
    if (template.tipo === 'html') {
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbGUteG1sIj48cGF0aCBkPSJNMTQuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaMTJhMiAyIDAgMCAwIDItMlY3LjVaIi8+PHBhdGggZD0ibTE0IDItMS40MS0xLjRBMiA5LjA5IDIgMCAwIDAgMTEuODYgMUg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjguMTRhMiAyIDAgMCAwLS41OS0xLjQ1TDE0IDJaIi8+PHBhdGggZD0iTTE1IDExaC0xMmEyIDIgMCAwIDAgMi0yVjcuMTRhMiAyIDAgMCAwLS41OS0xLjQ1TDE1IDJaIi8+PHBhdGggZD0iTTE1IDEyaC4wMSIvPjxwYXRoIGQ9Im0xNSAxMi4wMSIvPjwvc3ZnPg==';
    }
    
    // Si el contenido es un objeto y tiene backgroundImage
    if (template.tipo === 'certificate' && 
        typeof template.contenido === 'object' && 
        template.contenido && 
        'backgroundImage' in template.contenido) {
      return template.contenido.backgroundImage as string;
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
    
    // Valor por defecto basado en el tipo de plantilla
    if (template.tipo === 'email' || template.tipo === 'template') {
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1haWwiPj9v9+8gP3ZhbHVlPSJNNDQgMjBoMWEyIDIgMCAwIDAgMi0ydi05LjM4MmE0IDQgMCAwIDAtMS4wMzQtMi43MDdMMzkuNjUgNC45MjVBMSAxIDAgMCAwIDM4LjkyOSA0SDcuMDcxYTIgMiAwIDAgMC0xLjQxNC41ODVMNC4wMzQgNi4wM0E0IDQgMCAwIDAgMyA4LjYxOXY4Ljc2MkEyIDIgMCAwIDAgNS4wMiAyMGgtMSIvPjxwYXRoIGQ9Ik0xNSAxOEg1YTIgMiAwIDAgMS0yLTJWOGEyIDIgMCAwIDEgMi0yaDEwYTIgMiAwIDAgMSAyIDJ2OGEyIDIgMCAwIDEtMiAyeiIvPjwvc3ZnPg==';
    } else if (template.tipo === 'certificate') {
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWF3YXJkIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjgiIHI9IjYiLz48cGF0aCBkPSJNMTUuQTEgNyAwIDEgMSA5IDE1Ii8+PHBhdGggZD0ibTggMTQgNiA2Ii8+PHBhdGggZD0ibTcgMTVoOWwiLz48L3N2Zz4=';
    }
    
    // Imagen de marcador de posición genérico
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbGUtdGV4dCI+PHBhdGggZD0iTTE0LjUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjcuNUwxNC41IDJaIi8+PHBhdGggZD0iTTE0IDJ2Nmw2IDZtLTkgM2g2Ii8+PC9zdmc+';
  }