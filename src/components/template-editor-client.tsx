
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { optimizeEmailContentAction } from '@/app/actions/optimize-email-action';
import type { OptimizeEmailContentOutput } from '@/ai/flows/optimize-email-content';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Wand2, Sparkles, PlusCircle, Trash2, GripVertical, Image as ImageIcon, Pilcrow, MousePointerClick, Minus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/auth-context';
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';

// Definición de los esquemas para cada tipo de bloque
const textBlockSchema = z.object({
  text: z.string().min(1, 'El texto no puede estar vacío.'),
});

const imageBlockSchema = z.object({
  src: z.string().url('Debe ser una URL válida.'),
  alt: z.string().optional(),
});

const buttonBlockSchema = z.object({
  text: z.string().min(1, 'El texto del botón es requerido.'),
  href: z.string().url('Debe ser una URL válida.'),
});

const spacerBlockSchema = z.object({
  height: z.number().min(10, 'La altura mínima es 10px.').max(200, 'La altura máxima es 200px.'),
});

const customHtmlBlockSchema = z.object({
  html: z.string().min(1, 'El HTML no puede estar vacío.'),
});

// Esquema principal para un bloque, usando `discriminatedUnion`
const blockSchema = z.discriminatedUnion('type', [
  z.object({ id: z.string(), type: z.literal('text'), content: textBlockSchema }),
  z.object({ id: z.string(), type: z.literal('image'), content: imageBlockSchema }),
  z.object({ id: z.string(), type: z.literal('button'), content: buttonBlockSchema }),
  z.object({ id: z.string(), type: z.literal('spacer'), content: spacerBlockSchema }),
  z.object({ id: z.string(), type: z.literal('customHtml'), content: customHtmlBlockSchema }),
]);

type Block = z.infer<typeof blockSchema>;

// Esquema de validación para el formulario completo
const formSchema = z.object({
  templateName: z.string().min(1, 'El nombre de la plantilla es requerido.'),
  emailSubject: z.string().min(1, 'El asunto del correo es requerido.'),
  blocks: z.array(blockSchema).min(1, 'El cuerpo del correo debe tener al menos un bloque.'),
  audience: z.string().min(1, 'La descripción de la audiencia es requerida para la optimización con IA.'),
});

type FormValues = z.infer<typeof formSchema>;

// Función para generar HTML a partir de los bloques
function generateHtmlFromBlocks(blocks: Block[]): string {
    const content = blocks.map(block => {
        switch (block.type) {
            case 'text':
                return `<tr><td style="padding: 10px 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">${block.content.text.replace(/\n/g, '<br>')}</td></tr>`;
            case 'image':
                return `<tr><td style="padding: 10px 20px; text-align: center;"><img src="${block.content.src}" alt="${block.content.alt || ''}" style="max-width: 100%; height: auto; border: 0;" /></td></tr>`;
            case 'button':
                return `<tr><td style="padding: 20px;" align="center"><a href="${block.content.href}" target="_blank" style="background-color: #74B49B; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; display: inline-block;">${block.content.text}</a></td></tr>`;
            case 'spacer':
                return `<tr><td style="height: ${block.content.height}px; line-height: ${block.content.height}px; font-size: ${block.content.height}px;">&nbsp;</td></tr>`;
            case 'customHtml':
                return `<tr><td>${block.content.html}</td></tr>`;
            default:
                return '';
        }
    }).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head><title>${'Email Preview'}</title></head>
    <body style="margin: 0; padding: 0; background-color: #E2F9F0;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 20px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              ${content}
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Componente de cliente para crear y editar plantillas de correo electrónico con un editor visual por bloques.
 */
export function TemplateEditorClient() {
  const [aiResult, setAiResult] = useState<OptimizeEmailContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const { toast } = useToast();
  const { role } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateName: '',
      emailSubject: '',
      blocks: [],
      audience: '',
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'blocks',
  });

  const watchedBlocks = form.watch('blocks');

  useEffect(() => {
    const html = generateHtmlFromBlocks(watchedBlocks);
    setPreviewHtml(html);
  }, [watchedBlocks]);

  const handleOptimize = async () => {
    const { audience, blocks } = form.getValues();
    if (blocks.length === 0) {
      toast({ title: 'Cuerpo vacío', description: 'Añade al menos un bloque para optimizar.', variant: 'destructive' });
      return;
    }
    if (!audience) {
      form.setError('audience', { type: 'manual', message: 'La audiencia es requerida para optimizar.' });
      return;
    }
    if (!role) {
      toast({ title: 'Error de autenticación', description: 'Rol de usuario no encontrado.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setAiResult(null);
    try {
      const emailBody = generateHtmlFromBlocks(blocks);
      const result = await optimizeEmailContentAction({ emailContent: emailBody, audience, role });
      setAiResult(result);
    } catch (error) {
      toast({ title: 'Error de optimización', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  function onSubmit(values: FormValues) {
    const finalHtml = generateHtmlFromBlocks(values.blocks);
    console.log({ ...values, emailBody: finalHtml });
    toast({
      title: 'Plantilla guardada',
      description: `La plantilla "${values.templateName}" ha sido guardada con éxito.`,
    });
  }
  
  const addBlock = (type: Block['type']) => {
    let newBlock: Block;
    const id = nanoid();
    switch (type) {
      case 'text':
        newBlock = { id, type, content: { text: 'Escribe tu texto aquí...' } };
        break;
      case 'image':
        newBlock = { id, type, content: { src: 'https://placehold.co/600x300.png', alt: 'Imagen descriptiva' } };
        break;
      case 'button':
        newBlock = { id, type, content: { text: 'Haz Clic Aquí', href: 'https://example.com' } };
        break;
      case 'spacer':
        newBlock = { id, type, content: { height: 30 } };
        break;
      default:
        return;
    }
    append(newBlock);
  };
  
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  const renderBlockControls = (index: number) => {
    const block = watchedBlocks[index];
    switch (block.type) {
      case 'text':
        return <FormField control={form.control} name={`blocks.${index}.content.text`} render={({ field }) => <Textarea {...field} rows={4} />} />;
      case 'image':
        return <div className="space-y-2">
            <FormField control={form.control} name={`blocks.${index}.content.src`} render={({ field }) => <Input {...field} placeholder="URL de la imagen" />} />
            <FormField control={form.control} name={`blocks.${index}.content.alt`} render={({ field }) => <Input {...field} placeholder="Texto alternativo" />} />
        </div>;
      case 'button':
        return <div className="space-y-2">
            <FormField control={form.control} name={`blocks.${index}.content.text`} render={({ field }) => <Input {...field} placeholder="Texto del botón" />} />
            <FormField control={form.control} name={`blocks.${index}.content.href`} render={({ field }) => <Input {...field} placeholder="URL del enlace" />} />
        </div>;
      case 'spacer':
        return <FormField control={form.control} name={`blocks.${index}.content.height`} render={({ field }) => <div className="flex items-center gap-2"><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/><span>px</span></div>} />;
      case 'customHtml':
        return <p className="text-sm text-muted-foreground italic">Este es un bloque de HTML personalizado y no se puede editar visualmente.</p>;
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Columna del Editor */}
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Editor de Plantilla</CardTitle>
                        <CardDescription>Crea o edita tu plantilla de correo electrónico.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="templateName" render={({ field }) => (<FormItem><FormLabel>Nombre de la Plantilla</FormLabel><FormControl><Input placeholder="Ej: Newsletter Mensual" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="emailSubject" render={({ field }) => (<FormItem><FormLabel>Asunto del Correo</FormLabel><FormControl><Input placeholder="Ej: Novedades de este mes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </CardContent>
                 </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contenido del Correo</CardTitle>
                        <CardDescription>Añade y organiza los bloques de contenido de tu correo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="blocks">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                        {fields.map((field, index) => (
                                            <Draggable key={field.id} draggableId={field.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={cn("p-4 border rounded-lg bg-background", snapshot.isDragging && "shadow-lg")}>
                                                        <div className="flex items-start gap-2">
                                                            <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move" />
                                                            <div className="flex-grow space-y-2">
                                                                <h4 className="font-medium capitalize">{watchedBlocks[index].type}</h4>
                                                                {renderBlockControls(index)}
                                                            </div>
                                                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                            <Button type="button" variant="outline" size="sm" onClick={() => addBlock('text')}><Pilcrow className="mr-2 h-4 w-4"/>Añadir Texto</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => addBlock('image')}><ImageIcon className="mr-2 h-4 w-4"/>Añadir Imagen</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => addBlock('button')}><MousePointerClick className="mr-2 h-4 w-4"/>Añadir Botón</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => addBlock('spacer')}><Minus className="mr-2 h-4 w-4"/>Añadir Espaciador</Button>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Wand2 /> Optimizador de Correo con IA</CardTitle>
                        <CardDescription>Mejora tu contenido para evitar filtros de spam y aumentar la interacción.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="audience" render={({ field }) => (<FormItem><FormLabel>Describe tu Audiencia</FormLabel><FormControl><Input placeholder="Ej: Clientes interesados en tecnología" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <Button type="button" onClick={handleOptimize} disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            {isLoading ? 'Optimizando...' : 'Optimizar con IA'}
                        </Button>
                    </CardContent>
                </Card>

                {aiResult && (
                    <Card>
                        <CardHeader><CardTitle className="font-headline">Resultados de la Optimización</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div><Label>Puntuación de Spam</Label><Progress value={aiResult.spamScore || 0} className="w-full mt-1" /><p className="text-sm text-muted-foreground mt-1">Puntuación: {aiResult.spamScore || 'N/A'}/100 (más bajo es mejor)</p></div>
                            <div><Label>Sugerencias de Interacción</Label><p className="text-sm bg-muted p-3 rounded-md mt-1">{aiResult.engagementSuggestions}</p></div>
                            <div><Label>Contenido Optimizado</Label><Textarea readOnly value={aiResult.optimizedContent} rows={15} className="mt-1 bg-muted" /><Button type="button" variant="secondary" size="sm" className="mt-2" onClick={() => {form.setValue('blocks', [{ id: nanoid(), type: 'customHtml', content: { html: aiResult.optimizedContent }}]); toast({ title: 'Contenido actualizado', description: 'Tus bloques han sido reemplazados con la versión optimizada.'})}}>Usar este contenido</Button></div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Columna de la Vista Previa */}
            <div className="sticky top-24 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Vista Previa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-[800px] border rounded-md overflow-hidden">
                            <iframe srcDoc={previewHtml} title="Vista previa del correo" className="w-full h-full border-0" sandbox="allow-scripts" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <Button type="submit" size="lg" className="w-full">Guardar Plantilla</Button>
      </form>
    </Form>
  );
}
