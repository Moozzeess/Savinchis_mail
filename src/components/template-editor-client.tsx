
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import {
  Pilcrow, ImageIcon, MousePointerClick, Minus, GripVertical, Code,
  Loader2, Trash2, StretchVertical, Upload, Computer, Smartphone
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import { type Block, formSchema, type FormValues, blockSchema } from '@/lib/template-utils';
import { saveTemplateAction, type Template } from '@/actions/template-actions';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';

const PALETTE_BLOCKS: {
  id: Block['type'];
  label: string;
  icon: React.ElementType;
}[] = [
  { id: 'text', label: 'Texto', icon: Pilcrow },
  { id: 'image', label: 'Imagen', icon: ImageIcon },
  { id: 'button', label: 'Botón', icon: MousePointerClick },
  { id: 'divider', label: 'Divisor', icon: Minus },
  { id: 'spacer', label: 'Espaciador', icon: StretchVertical },
  { id: 'html', label: 'HTML', icon: Code },
];

const BlockRenderer = ({ block }: { block: Block }) => {
    const content = block.content;
    const style: React.CSSProperties = {
        padding: '10px 20px',
        fontFamily: 'Arial, sans-serif'
    };

    switch (block.type) {
        case 'text':
            return (
                <div style={style}>
                    <p style={{
                        color: content.color,
                        fontSize: `${content.fontSize}px`,
                        lineHeight: content.lineHeight,
                        fontWeight: content.fontWeight,
                        textAlign: content.textAlign,
                        margin: 0
                    }} dangerouslySetInnerHTML={{ __html: content.text.replace(/\n/g, '<br />') }} />
                </div>
            );
        case 'image':
            return (
                <div style={{ ...style, textAlign: content.align }}>
                    <img src={content.src} alt={content.alt} style={{ maxWidth: `${content.width}%`, height: 'auto', display: 'inline-block' }} />
                </div>
            );
        case 'button':
            return (
                <div style={{ ...style, textAlign: content.textAlign }}>
                    <table cellPadding="0" cellSpacing="0" border="0" style={{ margin: content.textAlign === 'center' ? 'auto' : '0' }}>
                        <tbody>
                            <tr>
                                <td align="center" style={{ borderRadius: `${content.borderRadius}px`, backgroundColor: content.backgroundColor }}>
                                    <a href={content.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', color: content.color, textDecoration: 'none', borderRadius: `${content.borderRadius}px`, padding: '12px 25px', display: 'inline-block' }}>
                                        {content.text}
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        case 'spacer':
            return <div style={{ height: `${content.height}px`, lineHeight: `${content.height}px`, fontSize: `${content.height}px` }}>&nbsp;</div>;
        case 'divider':
            return <div style={{ padding: `${content.padding}px 20px` }}><hr style={{ border: 'none', borderTop: `1px solid ${content.color}`, margin: 0 }} /></div>;
        case 'html':
            return <div className="w-full h-auto pointer-events-none" dangerouslySetInnerHTML={{ __html: content.code }}></div>;
        default:
            return <div className="text-red-500 p-4">Bloque desconocido</div>;
    }
};

/**
 * Componente de cliente para crear y editar plantillas de correo electrónico con un editor visual por bloques.
 */
export function TemplateEditorClient({ template }: { template: Template | null }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateName: template?.nombre || 'Mi Nueva Plantilla',
      emailSubject: template?.asunto_predeterminado || 'Asunto del Correo',
      blocks: template?.contenido || [],
    },
  });

  const { fields, move, append, remove } = useFieldArray({
    control: form.control,
    name: 'blocks',
  });

  const watchedBlocks = form.watch('blocks');

  const selectedBlockIndex = useMemo(() => {
    if (!selectedBlockId) return -1;
    return watchedBlocks.findIndex(block => block.id === selectedBlockId);
  }, [selectedBlockId, watchedBlocks]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (template) {
        form.reset({
            templateName: template.nombre,
            emailSubject: template.asunto_predeterminado,
            blocks: template.contenido,
        });
    }
  }, [template, form]);

  async function onSubmit(values: FormValues) {
    setIsSaving(true);
    try {
        const result = await saveTemplateAction({
            id: template?.id_plantilla,
            nombre: values.templateName,
            asunto_predeterminado: values.emailSubject,
            contenido: values.blocks,
        });

        if (result.success) {
            toast({
                title: 'Plantilla guardada',
                description: result.message,
            });
            router.push('/templates');
            router.refresh();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        toast({
            title: 'Error al guardar',
            description: (error as Error).message,
            variant: 'destructive',
        });
    } finally {
        setIsSaving(false);
    }
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId && source.index !== destination.index) {
      move(source.index, destination.index);
    }
  };

  const addBlock = (blockType: Block['type']) => {
    const contentSchema = blockSchema.options.find(o => o.shape.type.value === blockType)?.shape.content;
    const defaultContent = contentSchema ? contentSchema.parse({}) : {};

    const newBlock: Block = {
      id: nanoid(),
      type: blockType,
      content: defaultContent as any,
    };

    append(newBlock);
    setSelectedBlockId(newBlock.id);
  };

  const handleHtmlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedBlockIndex === -1) return;
    const file = e.target.files?.[0];
    if (file && file.type === 'text/html') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const htmlContent = event.target?.result as string;
        form.setValue(`blocks.${selectedBlockIndex}.content.code`, htmlContent);
        toast({ title: 'HTML importado' });
      };
      reader.readAsText(file);
    } else {
      toast({ title: 'Archivo no válido', description: 'Por favor, selecciona un archivo .html', variant: 'destructive' });
    }
    e.target.value = '';
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[250px] space-y-2">
                <Label htmlFor="templateName">Nombre de la Plantilla</Label>
                <FormField control={form.control} name="templateName" render={({ field }) => <Input id="templateName" {...field} className="text-lg font-medium" />} />
            </div>
             <div className="flex-1 min-w-[250px] space-y-2">
                <Label htmlFor="emailSubject">Asunto del Correo</Label>
                <FormField control={form.control} name="emailSubject" render={({ field }) => <Input id="emailSubject" {...field} />} />
            </div>
            <div className="pt-5">
              <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar Plantilla
              </Button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_350px] gap-6 items-start">
            <aside className="space-y-4 sticky top-24">
                <h2 className="text-lg font-semibold font-headline">Bloques</h2>
                <div className="grid grid-cols-2 gap-2">
                {PALETTE_BLOCKS.map((block) => (
                    <button
                        key={block.id}
                        type="button"
                        onClick={() => addBlock(block.id)}
                        className="flex flex-col items-center justify-center p-4 border rounded-lg bg-card hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                    >
                        <block.icon className="h-6 w-6 mb-2" />
                        <span className="text-xs font-medium">{block.label}</span>
                    </button>
                ))}
                </div>
            </aside>

            <main className="bg-[radial-gradient(hsl(var(--border))_0.5px,transparent_0.5px)] [background-size:16px_16px] p-4 sm:p-8 rounded-lg min-h-[500px]">
              <div className="flex justify-center mb-4">
                  <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                      <Button variant={previewMode === 'desktop' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8 rounded-none" onClick={() => setPreviewMode('desktop')} aria-label="Vista de escritorio">
                          <Computer className="h-4 w-4" />
                      </Button>
                      <Button variant={previewMode === 'mobile' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8 rounded-none" onClick={() => setPreviewMode('mobile')} aria-label="Vista móvil">
                          <Smartphone className="h-4 w-4" />
                      </Button>
                  </div>
              </div>

              {isMounted && (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="canvas">
                        {(provided) => (
                            <div 
                              ref={provided.innerRef} 
                              {...provided.droppableProps} 
                              className={cn(
                                "mx-auto bg-background shadow-lg transition-all duration-300 ease-in-out",
                                previewMode === 'desktop' ? "w-full max-w-2xl" : "w-[375px]"
                              )}
                            >
                                {fields.length === 0 && (
                                    <div className="text-center text-muted-foreground p-12">
                                        <p>Añade bloques desde el panel de la izquierda para empezar.</p>
                                    </div>
                                )}
                                {fields.map((field, index) => (
                                    <Draggable key={field.id} draggableId={field.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                onClick={() => setSelectedBlockId(watchedBlocks[index].id)}
                                                className={cn("group", snapshot.isDragging && "opacity-80")}
                                            >
                                                <div className={cn("border-2 border-transparent hover:border-primary/50 relative rounded-md bg-white transition-all", selectedBlockId === watchedBlocks[index].id && "!border-primary ring-2 ring-primary ring-offset-2")}>
                                                    <div {...provided.dragHandleProps} className="absolute -left-9 top-1/2 -translate-y-1/2 cursor-grab p-1 opacity-0 group-hover:opacity-100 bg-background rounded-md border shadow transition-opacity z-10">
                                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); remove(index); setSelectedBlockId(null); }}><Trash2 className="h-4 w-4"/></Button>
                                                    </div>
                                                    <BlockRenderer block={watchedBlocks[index]} />
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
              )}
            </main>

            <aside className="sticky top-24">
              {selectedBlockIndex !== -1 && watchedBlocks[selectedBlockIndex] ? (
                <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="bg-background rounded-lg border p-4 space-y-6">
                  <h2 className="text-lg font-semibold font-headline capitalize">{watchedBlocks[selectedBlockIndex].type}</h2>
                  
                  {(() => {
                      const block = watchedBlocks[selectedBlockIndex];
                      switch (block.type) {
                          case 'text': return (
                              <>
                                  <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.text`} render={({ field }) => <FormItem><FormLabel>Texto</FormLabel><Textarea {...field} rows={5} /></FormItem>} />
                                  <div className="grid grid-cols-2 gap-4">
                                      <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.fontSize`} render={({ field }) => <FormItem><FormLabel>Tamaño ({field.value}px)</FormLabel><Slider value={[field.value]} onValueChange={([v]) => field.onChange(v)} min={8} max={72} /></FormItem>} />
                                      <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.lineHeight`} render={({ field }) => <FormItem><FormLabel>Interlineado ({field.value})</FormLabel><Slider value={[field.value]} onValueChange={([v]) => field.onChange(v)} min={1} max={3} step={0.1} /></FormItem>} />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                      <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.fontWeight`} render={({ field }) => <FormItem><FormLabel>Grosor</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="normal">Normal</SelectItem><SelectItem value="bold">Negrita</SelectItem></SelectContent></Select></FormItem>} />
                                      <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.textAlign`} render={({ field }) => <FormItem><FormLabel>Alineación</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="left">Izquierda</SelectItem><SelectItem value="center">Centro</SelectItem><SelectItem value="right">Derecha</SelectItem></SelectContent></Select></FormItem>} />
                                  </div>
                                  <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.color`} render={({ field }) => <FormItem><FormLabel>Color</FormLabel><Input type="color" {...field} className="p-1 h-10 w-full" /></FormItem>} />
                              </>
                          );
                          case 'image': return (
                              <>
                                  <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.src`} render={({ field }) => <FormItem><FormLabel>URL de imagen</FormLabel><Input {...field} /></FormItem>} />
                                  <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.alt`} render={({ field }) => <FormItem><FormLabel>Texto Alternativo</FormLabel><Input {...field} /></FormItem>} />
                                  <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.width`} render={({ field }) => <FormItem><FormLabel>Ancho ({field.value}%)</FormLabel><Slider value={[field.value]} onValueChange={([v]) => field.onChange(v)} min={10} max={100} /></FormItem>} />
                                  <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.align`} render={({ field }) => <FormItem><FormLabel>Alineación</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="left">Izquierda</SelectItem><SelectItem value="center">Centro</SelectItem><SelectItem value="right">Derecha</SelectItem></SelectContent></Select></FormItem>} />
                              </>
                          );
                          case 'button': return (
                              <>
                                  <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.text`} render={({ field }) => <FormItem><FormLabel>Texto del botón</FormLabel><Input {...field} /></FormItem>} />
                                  <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.href`} render={({ field }) => <FormItem><FormLabel>URL de enlace</FormLabel><Input {...field} /></FormItem>} />
                                  <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.textAlign`} render={({ field }) => <FormItem><FormLabel>Alineación</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="left">Izquierda</SelectItem><SelectItem value="center">Centro</SelectItem><SelectItem value="right">Derecha</SelectItem></SelectContent></Select></FormItem>} />
                                  <div className="grid grid-cols-2 gap-4">
                                     <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.backgroundColor`} render={({ field }) => <FormItem><FormLabel>Color Fondo</FormLabel><Input type="color" {...field} className="p-1 h-10 w-full" /></FormItem>} />
                                     <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.color`} render={({ field }) => <FormItem><FormLabel>Color Texto</FormLabel><Input type="color" {...field} className="p-1 h-10 w-full" /></FormItem>} />
                                  </div>
                                  <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.borderRadius`} render={({ field }) => <FormItem><FormLabel>Radio Borde ({field.value}px)</FormLabel><Slider value={[field.value]} onValueChange={([v]) => field.onChange(v)} min={0} max={30} /></FormItem>} />
                              </>
                          );
                          case 'spacer': return (
                               <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.height`} render={({ field }) => <FormItem><FormLabel>Altura ({field.value}px)</FormLabel><Slider value={[field.value]} onValueChange={([v]) => field.onChange(v)} min={10} max={200} /></FormItem>} />
                          );
                          case 'divider': return (
                              <>
                                  <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.color`} render={({ field }) => <FormItem><FormLabel>Color</FormLabel><Input type="color" {...field} className="p-1 h-10 w-full" /></FormItem>} />
                                  <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.padding`} render={({ field }) => <FormItem><FormLabel>Espaciado ({field.value}px)</FormLabel><Slider value={[field.value]} onValueChange={([v]) => field.onChange(v)} min={0} max={50} /></FormItem>} />
                              </>
                          );
                          case 'html': return (
                              <>
                                  <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.code`} render={({ field }) => <FormItem><FormLabel>Código HTML</FormLabel><Textarea {...field} rows={10} className="font-mono" /></FormItem>} />
                                  <FormItem>
                                      <FormLabel>Importar desde Archivo</FormLabel>
                                      <Button asChild variant="outline" className="w-full">
                                          <label>
                                              <Upload className="mr-2 h-4 w-4"/> Subir archivo .html
                                              <Input type="file" accept=".html" className="hidden" onChange={handleHtmlFileChange} />
                                          </label>
                                      </Button>
                                  </FormItem>
                              </>
                          );
                          default: return null;
                      }
                  })()}

                </div>
                </ScrollArea>
              ) : (
                   <div className="text-center text-muted-foreground p-12 border-dashed border-2 rounded-lg h-full flex items-center justify-center">
                      <p>Selecciona un bloque para editar sus propiedades.</p>
                  </div>
              )}
            </aside>
        </div>
      </form>
    </Form>
  );
}
