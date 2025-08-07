'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Search, LayoutTemplate, Mail, Award, Bold, Italic, Underline, List, ListOrdered, Image as ImageIcon, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { getTemplateListAction } from '@/actions/template-actions';
import { useRouter } from 'next/navigation';
import { useTemplates } from '@/hooks/use-templates';
import { TemplateCarousel } from './template-selector';
import { Plantillas } from "@/types/templates";

type EmailTab = 'gallery' | 'new';

export function EmailStep({ className = '' }: { className?: string }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EmailTab>('gallery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const subject = watch('subject') || '';
  const emailBody = watch('emailBody') || '';
  const fromName = watch('fromName') || '';
  const fromEmail = watch('fromEmail') || '';

  const { data: templates = [], isLoading } = useTemplates({ 
    tipo: 'email', //|| 'template' || 'certificate',
    enabled: activeTab === 'gallery' // Solo cargar cuando esté activa la pestaña
  });;

  // Insertar texto en la posición del cursor
  const insertAtCursor = (text: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;
    
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = emailBody.substring(startPos, endPos);
    
    // Si hay texto seleccionado, rodearlo con el formato
    const insertText = selectedText ? `${text}${selectedText}${text}` : text;
    
    const newText = 
      emailBody.substring(0, startPos) + 
      insertText + 
      emailBody.substring(endPos);
    
    setValue('emailBody', newText);
    
    // Establecer la posición del cursor después de la inserción
    setTimeout(() => {
      const newPos = startPos + insertText.length;
      textarea.setSelectionRange(newPos, newPos);
      textarea.focus();
    }, 0);
  };

  // Formatear texto
  const formatText = (format: string) => {
    const formats: Record<string, { open: string; close: string }> = {
      bold: { open: '<strong>', close: '</strong>' },
      italic: { open: '<em>', close: '</em>' },
      underline: { open: '<u>', close: '</u>' },
      h1: { open: '<h1>', close: '</h1>\n' },
      h2: { open: '<h2>', close: '</h2>\n' },
      ul: { open: '<ul>\n<li>', close: '</li>\n</ul>\n' },
      ol: { open: '<ol>\n<li>', close: '</li>\n</ol>\n' },
      li: { open: '<li>', close: '</li>\n' },
    };

    if (formats[format]) {
      insertAtCursor(`${formats[format].open}${formats[format].close}`);
      const textarea = editorRef.current;
      if (textarea) {
        const cursorPos = textarea.selectionStart + formats[format].open.length;
        setTimeout(() => {
          textarea.setSelectionRange(cursorPos, cursorPos);
          textarea.focus();
        }, 0);
      }
    }
  };

  // Alinear texto
  const alignText = (alignment: string) => {
    const alignments: Record<string, string> = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };
    
    if (alignments[alignment]) {
      insertAtCursor(`<div class="${alignments[alignment]}">\n\n</div>`);
    }
  };

  const filteredTemplates = templates.filter(template => 
    template.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (template.asunto_predeterminado?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleTemplateSelect = (template: Plantillas) => {
    if (activeTab === 'gallery') {
      setSelectedTemplate(template.id_plantilla);
      setValue('templateId', template.id_plantilla);
      setValue('templateName', template.nombre);
      setValue('templateContent', template.contenido || '');
      setValue('emailBody', template.contenido || '');
      setValue('subject', template.asunto_predeterminado || '');  
    }
  };

  const handleCreateNewTemplate = () => {
    setSelectedTemplate(null);
    setValue('templateId', null);
    setValue('emailBody', '');
    setValue('subject', '');
  };

  const handleCreateNewTemplateRedirect = () => {
    // Guardar el contenido actual si es necesario
    const currentContent = watch('emailBody') || '';
    const currentSubject = watch('subject') || '';
    
    // Redirigir al creador de plantillas con el contenido actual
    router.push('/templates/new');
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fromName">Nombre del remitente</Label>
            <Input
              id="fromName"
              placeholder="Ej: Soporte Técnico"
              {...register('fromName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromEmail">Correo del remitente</Label>
            <Input
              id="fromEmail"
              type="email"
              placeholder="ejemplo@midominio.com"
              {...register('fromEmail')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Asunto del correo</Label>
          <Input
            id="subject"
            placeholder="Asunto del correo"
            {...register('subject')}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EmailTab)}>
        <TabsList>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4" />
            Plantillas Guardadas
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Redactar Nuevo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6">
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Textarea
                id="emailBody"
                placeholder="Escribe tu mensaje aquí..."
                className="min-h-[300px] resize-none border-0 focus-visible:ring-0"
                {...register('emailBody')}
                ref={editorRef}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="gallery" className="mt-6">
          <div className="space-y-4">
            <TemplateCarousel 
              templates={templates} 
              onSelect={handleTemplateSelect}
              selectedTemplateId={selectedTemplate ?? undefined}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Hidden field to store template ID */}
      <input type="hidden" {...register('templateId')} />
    </div>
  );
}

// Utility function to handle class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}