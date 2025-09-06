'use client';

import { useEffect, useRef, useState } from 'react';
import { campaignContentService } from '@/service/campaignContentService';

interface EmailPreviewProps {
  content: string;
  isPath?: boolean;
  height?: number | string;
  maxWidth?: number;
}

export default function EmailPreview({ 
  content, 
  isPath = false, 
  height, 
  maxWidth = 600 
}: EmailPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState('');

  // Cargar el contenido si es una ruta
  useEffect(() => {
    const loadContent = async () => {
      if (!isPath) {
        setHtmlContent(content);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/campaigns?path=${encodeURIComponent(content)}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Error al cargar el contenido');
        }
        const htmlContent = await response.text();
        setHtmlContent(htmlContent);
      } catch (error) {
        console.error('Error al cargar el contenido:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [content, isPath]);

  // Actualizar el iframe cuando cambie el contenido
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !htmlContent) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    const safeHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    /* Reset básico para el iframe */
    html, body { margin: 0; padding: 0; background: #ffffff; }
    img { max-width: 100%; height: auto; display: inline-block; }
    table { height: auto !important; }
    /* Contenedor centrado y responsivo */
    .email-container { max-width: ${maxWidth}px; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="email-container">${htmlContent}</div>
</body>
</html>`;

    doc.open();
    doc.write(safeHtml);
    doc.close();

    // Auto-ajustar altura al contenido cuando no se provee height fijo
    if (!height) {
      const resize = () => {
        const body = doc.body;
        const htmlEl = doc.documentElement;
        const newHeight = Math.max(
          body?.scrollHeight || 0,
          body?.offsetHeight || 0,
          htmlEl?.clientHeight || 0,
          htmlEl?.scrollHeight || 0,
          htmlEl?.offsetHeight || 0
        );
        if (iframe) {
          iframe.style.height = Math.max(newHeight, 200) + 'px';
        }
      };

      // Programar reajustes
      const timeouts = [
        setTimeout(resize, 0),
        setTimeout(resize, 50),
        setTimeout(resize, 200)
      ];

      // Observar cambios para reajustar
      const observer = new MutationObserver(resize);
      observer.observe(doc.documentElement, { 
        childList: true, 
        subtree: true, 
        attributes: true, 
        characterData: true 
      });

      // Reajustar al cargar recursos (imágenes)
      const onLoad = () => resize();
      const images = doc.images || [];
      Array.from(images).forEach(img => {
        if (!img.complete) img.addEventListener('load', onLoad);
      });

      return () => {
        timeouts.forEach(clearTimeout);
        observer.disconnect();
        Array.from(images).forEach(img => img.removeEventListener('load', onLoad));
      };
    }
  }, [htmlContent, maxWidth, height]);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Cargando vista previa...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <iframe
  ref={iframeRef}
  srcDoc={htmlContent}
  title="Email Preview"
  style={{
    width: '100%',
    minHeight: height || '500px',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    backgroundColor: '#ffffff'
  }}
  sandbox="allow-same-origin allow-scripts" // Add this line
  onLoad={() => setLoading(false)}
/>
  );
}