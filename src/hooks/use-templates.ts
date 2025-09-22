// use-templates.ts
import { useState, useEffect } from 'react';
import { Plantillas } from '@/types/templates';

interface UseTemplatesOptions {
  tipo?: 'template' | 'certificate' | 'email' | 'html';
  limit?: number;
  enabled?: boolean;
}

/**
 * Hook personalizado para cargar y gestionar plantillas de la aplicación.
 * Soporta diferentes tipos de plantillas: 'template', 'certificate', 'email' y 'html'.
 * 
 * @param {Object} options - Opciones de configuración.
 * @param {'template'|'certificate'|'email'|'html'} [options.tipo] - Filtra las plantillas por tipo.
 * @param {number} [options.limit=10] - Número máximo de plantillas a cargar.
 * @param {boolean} [options.enabled=true] - Habilita o deshabilita la carga automática.
 * @returns {Object} - Objeto con las plantillas, estado de carga, errores y estado de vacío.
 */
export function useTemplates({ tipo, limit = 10, enabled = true }: UseTemplatesOptions = {}) {
  const [templates, setTemplates] = useState<Plantillas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Mapear 'email' a 'template' para compatibilidad con el backend
        const mappedTipo = tipo === 'email' ? 'template' : tipo;
        
        const response = await fetch(`/api/templates/load?tipo=${mappedTipo || ''}&limit=${limit}`);
        
        if (!response.ok) {
          throw new Error(`Error al cargar plantillas: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Asegurarse de que tenemos un array de plantillas
        const templatesData = Array.isArray(result) ? result : (result.templates || []);
        
        // Procesar las plantillas para asegurar que tengan el formato correcto
        const processedTemplates = templatesData.map((template: any) => {
          // Crear una copia del template para no modificar el original
          const processedTemplate = { ...template };
          
          // Si es una plantilla HTML, asegurarse de que tenga el tipo correcto
          if (template.tipo === 'html') {
            // Si no hay contenido pero sí hay html_content, usarlo
            if (!template.contenido && template.html_content) {
              processedTemplate.contenido = template.html_content;
            }
            return processedTemplate;
          }
          
          // Para plantillas de correo estándar o de tipo template/email
          if (template.tipo === 'template' || template.tipo === 'email' || !template.tipo) {
            // Si el contenido es un string que parece JSON, intentar parsearlo
            if (typeof template.contenido === 'string' && template.contenido.trim().startsWith('{')) {
              try {
                processedTemplate.contenido = JSON.parse(template.contenido);
              } catch (e) {
                console.warn('Error al parsear contenido de plantilla:', e);
              }
            }
          }
          
          return processedTemplate;
        });
        
        setTemplates(processedTemplates);
      } catch (err) {
        console.error('Error en useTemplates:', err);
        setError(err instanceof Error ? err : new Error('Error desconocido al cargar plantillas'));
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [tipo, limit, enabled]);

  return { 
    data: templates, 
    isLoading, 
    error,
    isEmpty: !isLoading && templates.length === 0
  };
}