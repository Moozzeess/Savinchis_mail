
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
  Loader2, Trash2, StretchVertical, Upload, Computer, Smartphone, ScreenShare
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import { type Block, formSchema, type FormValues, generateHtmlFromBlocks, blockSchema } from '@/lib/template-utils';
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

/**
 * Componente de cliente para crear y editar plantillas de correo electrónico con un editor visual por bloques.
 */
export function TemplateEditorClient({ template }: { template: Template | null }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

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
    return fields.findIndex(field => field.id === selectedBlockId);
  }, [selectedBlockId, fields]);

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
    if (!destination || source.droppableId !== 'canvas' || destination.droppableId !== 'canvas') {
      return;
    }
    if (source.index !== destination.index) {
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
      visibility: { device: 'all' } // Default visibility
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
  
  const BlockPreview = ({ block }: { block: Block }) => {
    const html = generateHtmlFromBlocks([block]);
    return (
        <div className="w-full pointer-events-none transform scale-[0.5] origin-top-left -ml-16">
            <iframe
                srcDoc={html}
                className="w-[200%] h-auto border-0"
                scrolling="no"
                onLoad={(e) => {
                    const iframe = e.currentTarget;
                    if (iframe.contentWindow) {
                      iframe.style.height = `${iframe.contentWindow.document.body.scrollHeight}px`;
                    }
                }}
            />
        </div>
    );
};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full w-full bg-muted/40 text-foreground">
        {isMounted && (
          <DragDropContext onDragEnd={onDragEnd}>
            <aside className="w-[280px] flex-shrink-0 bg-background border-r flex flex-col">
              <header className="p-4 border-b h-16 flex items-center">
                 <h2 className="text-lg font-semibold font-headline">Bloques</h2>
              </header>
              <ScrollArea className="flex-grow">
                  <div className="p-4 grid grid-cols-2 gap-2">
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
              </ScrollArea>
            </aside>

            <div className="flex-1 flex flex-col">
              <header className="h-16 border-b bg-background flex items-center justify-between px-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="templateName"
                    render={({ field }) => ( <Input {...field} className="text-lg font-medium border-none shadow-none focus-visible:ring-0 p-0 h-auto" /> )}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button type="submit" disabled={isSaving}>
                     {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     Guardar y salir
                  </Button>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto bg-[radial-gradient(hsl(var(--border))_0.5px,transparent_0.5px)] [background-size:16px_16px]">
                <div className="max-w-2xl mx-auto py-12">
                   <Droppable droppableId="canvas">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[500px] w-full bg-background shadow-md rounded-lg"
                      >
                        {fields.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                onClick={() => setSelectedBlockId(field.id)}
                                className={cn(
                                    "p-2 group",
                                    snapshot.isDragging && "opacity-80"
                                )}
                              >
                                <div className={cn(
                                    "border-2 border-transparent group-hover:border-primary/50 relative rounded-md",
                                    selectedBlockId === field.id && "border-primary"
                                )}>
                                  <div {...provided.dragHandleProps} className="absolute -left-8 top-1/2 -translate-y-1/2 cursor-grab p-2 opacity-0 group-hover:opacity-100 bg-background rounded-md border">
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <BlockPreview block={watchedBlocks[index]} />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </main>
            </div>

            <aside className={cn("w-[350px] flex-shrink-0 bg-background border-l flex flex-col transition-all duration-300",
                selectedBlockId ? 'mr-0' : 'hidden'
            )}>
              {selectedBlockIndex !== -1 && (
                <>
                <header className="p-4 border-b h-16 flex items-center justify-between">
                   <h2 className="text-lg font-semibold font-headline capitalize">{watchedBlocks[selectedBlockIndex].type}</h2>
                   <Button variant="ghost" size="icon" onClick={() => remove(selectedBlockIndex)}><Trash2 className="h-4 w-4" /></Button>
                </header>
                <ScrollArea className="flex-grow">
                    <div className="p-4 space-y-6">
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
                                        <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.color`} render={({ field }) => <FormItem><FormLabel>Color</FormLabel><Input type="color" {...field} className="p-1 h-10" /></FormItem>} />
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
                                           <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.backgroundColor`} render={({ field }) => <FormItem><FormLabel>Color Fondo</FormLabel><Input type="color" {...field} className="p-1 h-10" /></FormItem>} />
                                           <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.color`} render={({ field }) => <FormItem><FormLabel>Color Texto</FormLabel><Input type="color" {...field} className="p-1 h-10" /></FormItem>} />
                                        </div>
                                        <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.borderRadius`} render={({ field }) => <FormItem><FormLabel>Radio Borde ({field.value}px)</FormLabel><Slider value={[field.value]} onValueChange={([v]) => field.onChange(v)} min={0} max={30} /></FormItem>} />
                                    </>
                                );
                                case 'spacer': return (
                                     <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.height`} render={({ field }) => <FormItem><FormLabel>Altura ({field.value}px)</FormLabel><Slider value={[field.value]} onValueChange={([v]) => field.onChange(v)} min={10} max={200} /></FormItem>} />
                                );
                                case 'divider': return (
                                    <>
                                        <FormField control={form.control} name={`blocks.${selectedBlockIndex}.content.color`} render={({ field }) => <FormItem><FormLabel>Color</FormLabel><Input type="color" {...field} className="p-1 h-10" /></FormItem>} />
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
                        
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="font-semibold text-base">Visibilidad del contenido</h3>
                            <p className="text-sm text-muted-foreground">Muestra u oculta este bloque en función del tipo de dispositivo.</p>
                            
                            <FormField
                                control={form.control}
                                name={`blocks.${selectedBlockIndex}.visibility.device`}
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Mostrar en:</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-wrap gap-2">
                                                <Button type="button" variant={field.value === 'all' ? 'secondary' : 'outline'} size="sm" onClick={() => field.onChange('all')} className="flex-1">
                                                    <ScreenShare className="mr-2 h-4 w-4" /> Todos
                                                </Button>
                                                <Button type="button" variant={field.value === 'desktop' ? 'secondary' : 'outline'} size="sm" onClick={() => field.onChange('desktop')} className="flex-1">
                                                    <Computer className="mr-2 h-4 w-4" /> Escritorio
                                                </Button>
                                                <Button type="button" variant={field.value === 'mobile' ? 'secondary' : 'outline'} size="sm" onClick={() => field.onChange('mobile')} className="flex-1">
                                                    <Smartphone className="mr-2 h-4 w-4" /> Móvil
                                                </Button>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </ScrollArea>
                </>
              )}
            </aside>
          </DragDropContext>
        )}
      </form>
    </Form>
  );
}
