'use client';

import { useEffect, useState } from 'react';
import { generateHtmlFromBlocks } from '@/lib/template-utils';
import Image from 'next/image';
import { Award } from 'lucide-react';

interface TemplatePreviewProps {
  templatePath: string | null;
  templateName: string;
  isCertificate: boolean;
  templateContent?: any;
}

export function TemplatePreview({ 
  templatePath, 
  templateName, 
  isCertificate, 
  templateContent: initialTemplateContent 
}: TemplatePreviewProps) {
  const [html, setHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [templateContent, setTemplateContent] = useState(initialTemplateContent);

  useEffect(() => {
    const loadTemplate = async () => {
      if (isCertificate) {
        // Para certificados, verificamos si necesitamos cargar el contenido desde un archivo
        if (typeof templateContent === 'string' && templatePath) {
          try {
            const response = await fetch(`/api/templates/load?path=${encodeURIComponent(templatePath)}`);
            if (!response.ok) throw new Error('Error al cargar el certificado');
            
            const data = await response.json();
            // Actualizamos el contenido con los datos cargados del archivo
            setTemplateContent(data);
          } catch (error) {
            console.error('Error al cargar el contenido del certificado:', error);
          }
        }
        setIsLoading(false);
        return;
      }

      // Para plantillas normales (no certificados)
      if (!templatePath) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/templates/load?path=${encodeURIComponent(templatePath)}`);
        if (!response.ok) throw new Error('Error al cargar la plantilla');
        
        const data = await response.json();
        if (Array.isArray(data)) {
          setHtml(generateHtmlFromBlocks(data));
        } else if (data.blocks && Array.isArray(data.blocks)) {
          setHtml(generateHtmlFromBlocks(data.blocks));
        }
      } catch (error) {
        console.error('Error al cargar la vista previa:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [templatePath, isCertificate, templateContent]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="animate-pulse text-muted-foreground">Cargando vista previa...</div>
      </div>
    );
  }

  if (isCertificate) {
    // Si es un certificado, mostramos la imagen de fondo si existe
    // o un placeholder si no hay imagen
    
    // Función para extraer la imagen de fondo del contenido del certificado
    const getBackgroundImage = (content: any): string | null => {
      // Si el contenido es un string, es probable que sea una ruta a un archivo JSON
      if (typeof content === 'string' && content.endsWith('.json')) {
        return null; // Se manejará en el efecto
      }
      
      // Si el contenido es un objeto, buscamos la imagen en diferentes ubicaciones posibles
      if (typeof content === 'object' && content !== null) {
        return (
          content.backgroundImage || // Caso directo
          (content.contenido && content.contenido.backgroundImage) || // Caso anidado
          (content.texts && content.texts.backgroundImage) || // Caso dentro de texts
          null
        );
      }
      
      return null;
    };

    const backgroundImage = getBackgroundImage(templateContent);
    
    // Si tenemos una imagen de fondo, la mostramos
    if (backgroundImage) {
      // Si la imagen es un data URL, la usamos directamente
      // Si es una ruta, usamos la API para cargarla
      const imageSrc = backgroundImage.startsWith('data:') || backgroundImage.startsWith('http')
        ? backgroundImage 
        : `/api/templates/load?path=${encodeURIComponent(backgroundImage)}`;
      
      return (
        <div className="relative w-full h-full">
          <img 
            src={imageSrc}
            alt={templateName}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Si hay un error al cargar la imagen, mostramos un placeholder
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '';
              target.parentElement!.innerHTML = `
                <div class="w-full h-full flex flex-col items-center justify-center bg-muted p-4 text-center">
                  <Award class="h-12 w-12 text-muted-foreground/50 mb-2" />
                  <p class="text-muted-foreground">No se pudo cargar la imagen de fondo</p>
                  <p class="text-xs text-muted-foreground/70 mt-1">${templateName}</p>
                </div>
              `;
            }}
          />
        </div>
      );
    }
    
    // Si no hay imagen de fondo, mostramos un placeholder
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-4 text-center">
        <Award className="h-12 w-12 text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground">Sin imagen de certificado</p>
        <p className="text-xs text-muted-foreground/70 mt-1">{templateName}</p>
      </div>
    );
  }

  if (!html) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="text-muted-foreground">Sin vista previa disponible</div>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={html}
      title={templateName}
      className="w-full h-full border-0 scale-[0.5] origin-top-left"
      style={{ width: "200%", height: "200%" }}
      scrolling="no"
    />
  );
}
