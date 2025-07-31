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

interface Template {
  id_plantilla: number;
  nombre: string;
  tipo?: 'template' | 'certificate';
  asunto_predeterminado?: string;
  contenido?: any;
  fecha_creacion?: string;
}

type EmailTab = 'gallery' | 'new';

export function EmailStep({ className = '' }: { className?: string }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EmailTab>('gallery');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const subject = watch('subject') || '';
  const emailBody = watch('emailBody') || '';
  const fromName = watch('fromName') || '';
  const fromEmail = watch('fromEmail') || '';

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

  // Cargar plantillas
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        const templates = await getTemplateListAction({ tipo: 'template' });
        setTemplates(templates);
      } catch (error) {
        console.error('Error cargando plantillas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const filteredTemplates = templates.filter(template => 
    template.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (template.asunto_predeterminado?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template.id_plantilla);
    setValue('templateId', template.id_plantilla);
    setValue('subject', template.asunto_predeterminado || '');
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

        <TabsContent value="gallery" className="mt-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar plantillas..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleCreateNewTemplateRedirect}
                variant="outline"
                className="whitespace-nowrap"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva Plantilla
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <p>Cargando plantillas...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card 
                    key={template.id_plantilla}
                    className={cn(
                      'cursor-pointer transition-all hover:border-primary h-full flex flex-col',
                      selectedTemplate === template.id_plantilla ? 'border-2 border-primary' : ''
                    )}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        {template.tipo === 'certificate' ? (
                          <Award className="h-5 w-5 text-amber-500" />
                        ) : (
                          <Mail className="h-5 w-5 text-blue-500" />
                        )}
                        <CardTitle className="text-base">{template.nombre}</CardTitle>
                      </div>
                      {template.asunto_predeterminado && (
                        <CardDescription className="line-clamp-2 text-sm">
                          {template.asunto_predeterminado}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="p-4 pt-0 mt-auto">
                      <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                        {template.tipo === 'certificate' ? (
                          <Award className="h-12 w-12 text-muted-foreground/50" />
                        ) : (
                          <Mail className="h-12 w-12 text-muted-foreground/50" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1 p-1 border rounded-md bg-muted/50">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => formatText('bold')}
                title="Negrita (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => formatText('italic')}
                title="Cursiva (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => formatText('underline')}
                title="Subrayado (Ctrl+U)"
              >
                <Underline className="h-4 w-4" />
              </Button>
              <div className="mx-1 h-6 w-px bg-border" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => formatText('h1')}
                title="Título 1"
              >
                <span className="text-sm font-bold">H1</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => formatText('h2')}
                title="Título 2"
              >
                <span className="text-sm font-bold">H2</span>
              </Button>
              <div className="mx-1 h-6 w-px bg-border" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => formatText('ul')}
                title="Lista con viñetas"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => formatText('ol')}
                title="Lista numerada"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <div className="mx-1 h-6 w-px bg-border" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => alignText('left')}
                title="Alinear a la izquierda"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => alignText('center')}
                title="Centrar"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => alignText('right')}
                title="Alinear a la derecha"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Textarea
              id="emailBody"
              placeholder="Escribe tu mensaje aquí..."
              className="min-h-[300px] resize-none"
              {...register('emailBody')}
              ref={editorRef}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Usa las teclas de acceso rápido: Ctrl+B, Ctrl+I, Ctrl+U</span>
              <span>{emailBody.replace(/<[^>]*>?/gm, '').length} caracteres</span>
            </div>
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