// use-templates.ts
import { useState, useEffect } from 'react';
import { Plantillas } from '@/types/templates';

interface UseTemplatesOptions {
  tipo?: 'template' | 'certificate';
  limit?: number;
}

export function useTemplates({ tipo, limit = 10 }: UseTemplatesOptions = {}) {
  const [templates, setTemplates] = useState<Plantillas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/templates/load?tipo=${tipo}&limit=${limit}`);
        if (!response.ok) throw new Error('Error al cargar plantillas');
        const { templates: data } = await response.json();
        const templatesWithContent = data || [];
        console.log('Plantillas con contenido cargado:', templatesWithContent);
        setTemplates(templatesWithContent);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [tipo, limit]);

  return { data: templates, isLoading, error };
}