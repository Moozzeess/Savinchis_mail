'use client';

import { useEffect, useRef } from 'react';

interface EmailPreviewProps {
  html: string;
  /**
   * Altura fija del iframe. Si no se provee, el iframe se auto-redimensiona a la altura del contenido.
   */
  height?: number | string; // e.g. '75vh'
  /**
   * Ancho máximo del contenido (típicamente 600px para emails)
   */
  maxWidth?: number;
}

export default function EmailPreview({ html, height, maxWidth = 600 }: EmailPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

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
  <div class="email-container">${html}</div>
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
        iframe.style.height = Math.max(newHeight, 200) + 'px';
      };

      // Primer ajuste tras pintar
      setTimeout(resize, 0);
      setTimeout(resize, 50);
      setTimeout(resize, 200);

      // Observar cambios para reajustar
      const observer = new MutationObserver(() => resize());
      observer.observe(doc.documentElement, { childList: true, subtree: true, attributes: true, characterData: true });

      // Reajustar al cargar recursos (imágenes)
      const onLoad = () => resize();
      Array.from(doc.images || []).forEach(img => {
        if (!img.complete) img.addEventListener('load', onLoad);
      });

      return () => {
        observer.disconnect();
        Array.from(doc.images || []).forEach(img => img.removeEventListener('load', onLoad));
      };
    }
  }, [html, maxWidth, height]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-same-origin"
      className="w-full border rounded-md bg-white"
      style={{ height: height ?? '200px' }}
    />
  );
}
