'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Image as ImageIcon, 
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Paperclip,
  Smile,
  Code,
  Quote
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type EmailTab = 'write' | 'preview' | 'html';

export function EmailStep({ className = '' }: { className?: string }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const [activeTab, setActiveTab] = useState<EmailTab>('write');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const subject = watch('subject') || '';
  const emailBody = watch('emailBody') || '';
  const fromName = watch('fromName') || 'Tu Nombre';
  const fromEmail = watch('fromEmail') || 'tu@email.com';

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

  // Insertar imagen
  const handleInsertImage = () => {
    if (!imageUrl) return;
    
    const imgTag = `<img src="${imageUrl}" alt="${imageAlt || ''}" style="max-width: 100%;" />`;
    insertAtCursor(imgTag);
    setImageUrl('');
    setImageAlt('');
    setIsImageDialogOpen(false);
  };

  // Insertar enlace
  const handleInsertLink = () => {
    if (!linkUrl) return;
    
    const linkTextToUse = linkText || linkUrl;
    const linkTag = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkTextToUse}</a>`;
    insertAtCursor(linkText ? linkText : linkTag);
    setLinkUrl('');
    setLinkText('');
    setIsLinkDialogOpen(false);
  };

  // Formatear texto
  const formatText = (format: string) => {
    const formats: Record<string, { open: string; close: string }> = {
      bold: { open: '<strong>', close: '</strong>' },
      italic: { open: '<em>', close: '</em>' },
      underline: { open: '<u>', close: '</u>' },
      code: { open: '<code>', close: '</code>' },
      quote: { open: '<blockquote>', close: '</blockquote>' },
      h1: { open: '<h1>', close: '</h1>\n' },
      h2: { open: '<h2>', close: '</h2>\n' },
      ul: { open: '<ul>\n<li>', close: '</li>\n</ul>\n' },
      ol: { open: '<ol>\n<li>', close: '</li>\n</ol>\n' },
      li: { open: '<li>', close: '</li>\n' },
    };

    if (formats[format]) {
      insertAtCursor(`${formats[format].open}${formats[format].close}`);
      // Mover el cursor entre las etiquetas
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

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h3 className="text-base font-medium">Contenido del correo</h3>
        <p className="text-sm text-muted-foreground">
          Escribe y da formato al contenido de tu correo electrónico.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">
            Asunto <span className="text-destructive">*</span>
          </Label>
          <Input
            id="subject"
            placeholder="Ej.: ¡Oferta especial solo para ti!"
            {...register('subject')}
            className={errors.subject && 'border-destructive'}
          />
          {errors.subject && (
            <p className="text-sm text-destructive">
              {errors.subject.message as string}
            </p>
          )}
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as EmailTab)}
          className="w-full"
        >
          <div className="flex items-center justify-between border-b">
            <TabsList className="h-10 rounded-none border-0 bg-transparent p-0">
              <TabsTrigger 
                value="write" 
                className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Escribir
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Vista previa
              </TabsTrigger>
              <TabsTrigger 
                value="html" 
                className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                HTML
              </TabsTrigger>
            </TabsList>

            {activeTab === 'write' && (
              <div className="flex items-center space-x-1 pr-2">
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
                <div className="mx-1 h-6 w-px bg-border" />
                <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Insertar enlace"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Insertar enlace</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkUrl">URL del enlace</Label>
                        <Input
                          id="linkUrl"
                          placeholder="https://ejemplo.com"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkText">Texto a mostrar (opcional)</Label>
                        <Input
                          id="linkText"
                          placeholder="Texto del enlace"
                          value={linkText}
                          onChange={(e) => setLinkText(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsLinkDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleInsertLink}>Insertar</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Insertar imagen"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Insertar imagen</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="imageUrl">URL de la imagen</Label>
                        <Input
                          id="imageUrl"
                          placeholder="https://ejemplo.com/imagen.jpg"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="imageAlt">Texto alternativo</Label>
                        <Input
                          id="imageAlt"
                          placeholder="Descripción de la imagen"
                          value={imageAlt}
                          onChange={(e) => setImageAlt(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Importante para accesibilidad y cuando la imagen no se puede cargar.
                        </p>
                      </div>
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsImageDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleInsertImage}>Insertar</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="Insertar emoji"
                >
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="Insertar archivo adjunto"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="write" className="mt-0">
            <div className="mt-0">
              <Textarea
                id="emailBody"
                placeholder="Escribe tu mensaje aquí..."
                className={cn(
                  'min-h-[400px] resize-none rounded-t-none border-t-0 focus-visible:ring-0',
                  errors.emailBody && 'border-destructive'
                )}
                {...register('emailBody')}
                ref={editorRef}
              />
              {errors.emailBody && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.emailBody.message as string}
                </p>
              )}
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Usa las teclas de acceso rápido: Ctrl+B, Ctrl+I, Ctrl+U</span>
                <span>{emailBody.replace(/<[^>]*>?/gm, '').length} caracteres</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-0 p-4">
            <div className="prose max-w-none dark:prose-invert">
              <h1>{subject || '(Sin asunto)'}</h1>
              <div
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: emailBody || '<p>Escribe algo para ver la vista previa aquí...</p>' }}
              />
            </div>
          </TabsContent>

          <TabsContent value="html" className="mt-0">
            <Textarea
              value={emailBody}
              onChange={(e) => setValue('emailBody', e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              placeholder="<!-- Escribe o edita el HTML aquí -->"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}