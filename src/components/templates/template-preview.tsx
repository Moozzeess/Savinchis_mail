'use client';

import { useEffect, useState } from 'react';
import { generateHtmlFromBlocks } from '@/lib/template-utils';
import { Award, Loader2, FileText, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface TemplatePreviewProps {
  templatePath?: string;
  templateName: string;
  isCertificate: boolean;
  templateContent?: any;
  className?: string;
}

const generateCertificateHtml = (content: any, templateName: string) => {
  if (!content || !Array.isArray(content)) {
    return `
      <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-muted/30">
        <svg class="h-12 w-12 text-muted-foreground/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <p class="text-sm font-medium text-muted-foreground">Sin contenido de certificado</p>
        ${templateName ? `<p class="text-xs text-muted-foreground/60 mt-1">${templateName}</p>` : ''}
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    transform-origin: top left;
    transform: scale(0.7);
    transform-box: fill-box;
    width: 142.857%; /* 100% / 0.7 */
    height: 142.857%; /* 100% / 0.7 */
  `;
  
  const backgroundStyle = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    opacity: 0.25;
    filter: grayscale(100%) contrast(1.1);
    transition: opacity 0.3s ease;
  `;
  
  const contentStyle = `
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 10px;
    background: linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%);
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
    
    const baseSize = 8;
    const scaleFactor = 0.4;
    const minSize = 6;
    const maxSize = 12;
    
    const fontSize = block.content.fontSize 
      ? Math.max(minSize, Math.min(maxSize, block.content.fontSize * scaleFactor))
      : baseSize;
    
    const style = `
      margin: 0;
      color: ${block.content.color || '#1f2937'};
      font-size: ${fontSize}px;
      text-align: ${block.content.textAlign || 'center'};
      font-weight: ${block.content.fontWeight || '500'};
      width: ${block.content.width || 100}%;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.3;
      text-shadow: 0 1px 1px rgba(255,255,255,0.5);
      transition: all 0.2s ease;
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
  templateContent: initialTemplateContent,
  className = ''
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
            setHtml(generateHtmlFromBlocks({
              templateName: templateName,
              emailSubject: 'Vista previa',
              blocks: templateContent,
              isHtmlTemplate: false,
              htmlContent: ''
            }));
          } else if (templateContent.blocks) {
            setHtml(generateHtmlFromBlocks({
              templateName: templateContent.templateName || templateName,
              emailSubject: templateContent.emailSubject || 'Vista previa',
              blocks: templateContent.blocks,
              isHtmlTemplate: templateContent.isHtmlTemplate || false,
              htmlContent: templateContent.htmlContent || ''
            }));
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
          setHtml(generateHtmlFromBlocks({
            templateName: templateName,
            emailSubject: 'Vista previa',
            blocks: data,
            isHtmlTemplate: false,
            htmlContent: ''
          }));
        } else if (data.blocks) {
          setHtml(generateHtmlFromBlocks({
            templateName: data.templateName || templateName,
            emailSubject: data.emailSubject || 'Vista previa',
            blocks: data.blocks,
            isHtmlTemplate: data.isHtmlTemplate || false,
            htmlContent: data.htmlContent || ''
          }));
        }
      } catch (error) {
        console.error('Error loading preview:', error);
        setHtml(`
          <div class="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-muted/20">
            <AlertCircle class="h-8 w-8 text-destructive/60 mb-2" />
            <p class="text-sm font-medium text-muted-foreground">Error al cargar la vista previa</p>
            <p class="text-xs text-muted-foreground/60 mt-1">${templateName}</p>
          </div>
        `);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [templatePath, isCertificate, templateContent, templateName]);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-muted/30">
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
          </div>
          {isCertificate ? (
            <Award className="h-12 w-12 text-muted-foreground/20" />
          ) : (
            <FileText className="h-12 w-12 text-muted-foreground/20" />
          )}
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {isCertificate ? 'Cargando certificado...' : 'Cargando plantilla...'}
        </p>
        {templateName && (
          <p className="text-xs text-muted-foreground/60 mt-1 line-clamp-1 max-w-[200px]">
            {templateName}
          </p>
        )}
      </div>
    );
  }

  // Error state
  if (!html || html.includes('Error al cargar')) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-muted/20">
        <AlertCircle className="h-8 w-8 text-destructive/60 mb-2" />
        <p className="text-sm font-medium text-muted-foreground">
          Error al cargar la vista previa
        </p>
        {templateName && (
          <p className="text-xs text-muted-foreground/60 mt-1 line-clamp-1 max-w-[200px]">
            {templateName}
          </p>
        )}
      </div>
    );
  }

  // Success state with fade-in animation
  return (
    <div className={cn("w-full h-full overflow-hidden flex items-center justify-center", className)}>
      <div 
        className={cn(
          'relative origin-top-left',
          'transition-all duration-300 ease-in-out',
          'transform scale-75 md:scale-90',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          overflow: 'hidden',
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            transform: 'scale(0.9)',
            transformOrigin: 'top left',
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}