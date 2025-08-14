'use client';

import { useEffect, useState } from 'react';
import { generateHtmlFromBlocks } from '@/lib/template-utils';
import { Award } from 'lucide-react';

interface TemplatePreviewProps {
  templatePath?: string;
  templateName: string;
  isCertificate: boolean;
  templateContent?: any;
}

const generateCertificateHtml = (content: any, templateName: string) => {
  if (!content || !Array.isArray(content)) {
    return `
      <div class="w-full h-full flex flex-col items-center justify-center bg-muted p-4 text-center">
        <div class="h-12 w-12 text-muted-foreground/50 mb-2">📄</div>
        <p class="text-muted-foreground">Sin contenido de certificado</p>
        <p class="text-xs text-muted-foreground/70 mt-1">${templateName}</p>
      </div>
    `;
  }

  const bgBlock = content.find(block => 
    block.id === 'background' || block.content?.isBackground
  );
  
  const titleBlock = content.find(block => block.id === 'title');
  const issuedToBlock = content.find(block => block.id === 'issuedTo');
  const descriptionBlock = content.find(block => block.id === 'description');
  const dateBlock = content.find(block => block.id === 'date');
  const signatureBlock = content.find(block => block.id === 'signature');

  const containerStyle = `
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'Arial', sans-serif;
  `;
  
  const backgroundStyle = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    opacity: 0.3;
  `;
  
  const contentStyle = `
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 10px;
  `;

  let html = `
    <div style="${containerStyle}">
      ${bgBlock?.content?.src ? 
        `<img 
          src="${bgBlock.content.src}" 
          alt="Fondo del certificado" 
          style="${backgroundStyle}"
          onerror="this.style.display='none'; this.parentNode.innerHTML += '<div style=\\'position:absolute;top:0;left:0;width:100%;height:100%;background:#f5f5f5;z-index:1\\'></div>';"
        >` : 
        '<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:#f5f5f5;z-index:1"></div>'
      }
      <div style="${contentStyle}">
  `;

  const addTextBlock = (block: any, defaultText = '') => {
    if (!block?.content) return '';
    
    const style = `
      margin: 0;
      color: ${block.content.color || '#000000'};
      font-size: ${(block.content.fontSize ? Math.max(8, block.content.fontSize * 0.4) : 8)}px;
      text-align: ${block.content.textAlign || 'center'};
      font-weight: ${block.content.fontWeight || 'normal'};
      width: ${block.content.width || 100}%;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
    `;
    
    return `<div style="${style}">${block.content.text || defaultText}</div>`;
  };

  html += addTextBlock(titleBlock, 'Título del Certificado');
  html += addTextBlock(issuedToBlock, 'Otorgado a:');
  html += addTextBlock(descriptionBlock, 'Descripción del certificado...');
  
  html += `
    <div style="margin-top: auto; display: flex; justify-content: space-between; gap: 10px;">
      <div style="flex: 1; text-align: left;">
        ${addTextBlock(signatureBlock, 'Firma')}
      </div>
      <div style="flex: 1; text-align: right;">
        ${addTextBlock(dateBlock, 'Fecha')}
      </div>
    </div>
  `;
  
  html += `
    <div style="font-size: 6px; color: #666; text-align: center; margin-top: 4px;">
      ${templateName}
    </div>
  `;

  html += `
      </div>
    </div>
  `;
  
  return html;
};

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
      try {
        if (templateContent) {
          if (isCertificate) {
            const certHtml = generateCertificateHtml(templateContent, templateName);
            setHtml(certHtml);
          } else if (Array.isArray(templateContent)) {
            setHtml(generateHtmlFromBlocks(templateContent));
          } else if (templateContent.blocks) {
            setHtml(generateHtmlFromBlocks(templateContent.blocks));
          }
          return;
        }

        if (!templatePath) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/templates/load?path=${encodeURIComponent(templatePath)}`);
        if (!response.ok) throw new Error('Error loading content');
        
        const data = await response.json();
        setTemplateContent(data);
        
        if (isCertificate) {
          const certHtml = generateCertificateHtml(data, templateName);
          setHtml(certHtml);
        } else if (Array.isArray(data)) {
          setHtml(generateHtmlFromBlocks(data));
        } else if (data.blocks) {
          setHtml(generateHtmlFromBlocks(data.blocks));
        }
      } catch (error) {
        console.error('Error loading preview:', error);
        setHtml(`
          <div class="w-full h-full flex flex-col items-center justify-center bg-muted p-4 text-center">
            <div class="h-12 w-12 text-muted-foreground/50 mb-2">⚠️</div>
            <p class="text-muted-foreground">Error al cargar la vista previa</p>
            <p class="text-xs text-muted-foreground/70 mt-1">${templateName}</p>
          </div>
        `);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [templatePath, isCertificate, templateContent, templateName]);

  if (isCertificate) {
    if (isLoading) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-4 text-center">
          <Award className="h-12 w-12 text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground">Cargando certificado...</p>
          <p className="text-xs text-muted-foreground/70 mt-1">{templateName}</p>
        </div>
      );
    }

    return (
      <div 
        className="w-full h-full overflow-hidden"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="text-muted-foreground">Cargando vista previa...</div>
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
    <div 
      className="w-full h-full overflow-hidden"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}