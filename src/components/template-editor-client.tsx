'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import {
  Pilcrow, ImageIcon, MousePointerClick, Minus, Trash2, GripVertical, Code,
  Download, Eye, Undo, Redo, MoreVertical, StretchVertical, Rows3, Loader2
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import { type Block, formSchema, type FormValues, generateHtmlFromBlocks } from '@/lib/template-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveTemplateAction, type Template } from '@/actions/template-actions';
import { Slider } from './ui/slider';

const PALETTE_BLOCKS: {
  type: Block['type'];
  label: string;
  icon: React.ElementType;
  content: Block['content'];
}[] = [
  { type: 'text', label: 'Texto', icon: Pilcrow, content: { text: 'Escribe tu texto aquí...' } },
  { type: 'image', label: 'Imagen', icon: ImageIcon, content: { src: 'https://placehold.co/600x300.png', alt: 'Imagen descriptiva' } },
  { type: 'button', label: 'Botón', icon: MousePointerClick, content: { text: 'Haz Clic Aquí', href: 'https://example.com' } },
  { type: 'divider', label: 'Divisor', icon: Minus, content: {} },
  { type: 'spacer', label: 'Espaciador', icon: StretchVertical, content: { height: 30 } },
  { type: 'html', label: 'HTML', icon: Code, content: { code: '<!-- Tu código HTML aquí -->' } },
];


/**
 * Componente de cliente para crear y editar plantillas de correo electrónico con un editor visual por bloques.
 */
export function TemplateEditorClient({ template }: { template: Template | null }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("bloques");
  const [isSaving, setIsSaving] = useState(false);

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

  const addBlock = (type: Block['type']) => {
    const blockConfig = PALETTE_BLOCKS.find(b => b.type === type);
    if (blockConfig) {
      const newBlock: Block = {
        id: nanoid(),
        type: blockConfig.type,
        content: JSON.parse(JSON.stringify(blockConfig.content)), // Deep copy
      };
      append(newBlock);
    }
  };

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

  const renderBlockControls = (index: number) => {
    const block = watchedBlocks[index];
    switch (block.type) {
      case 'text':
        return <FormField control={form.control} name={`blocks.${index}.content.text`} render={({ field }) => <Textarea {...field} rows={4} className="bg-muted" />} />;
      case 'image':
        return <div className="space-y-2">
            <FormField control={form.control} name={`blocks.${index}.content.src`} render={({ field }) => <div><Label className="text-xs">URL de la imagen</Label><Input {...field} className="bg-muted"/></div>} />
            <FormField control={form.control} name={`blocks.${index}.content.alt`} render={({ field }) => <div><Label className="text-xs">Texto alternativo</Label><Input {...field} className="bg-muted"/></div>} />
        </div>;
      case 'button':
        return <div className="space-y-2">
            <FormField control={form.control} name={`blocks.${index}.content.text`} render={({ field }) => <div><Label className="text-xs">Texto del botón</Label><Input {...field} className="bg-muted"/></div>} />
            <FormField control={form.control} name={`blocks.${index}.content.href`} render={({ field }) => <div><Label className="text-xs">URL del enlace</Label><Input {...field} className="bg-muted"/></div>} />
        </div>;
      case 'spacer':
        return (
          <FormField
            control={form.control}
            name={`blocks.${index}.content.height`}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Label className="text-xs">Altura ({field.value}px)</Label>
                <Slider
                    value={[field.value]}
                    onValueChange={([val]) => field.onChange(val)}
                    min={10} max={200} step={5}
                />
              </div>
            )}
          />
        );
      case 'divider':
        return <p className="text-xs text-muted-foreground">No hay propiedades para editar.</p>;
      case 'html':
        return <FormField control={form.control} name={`blocks.${index}.content.code`} render={({ field }) => <div><Label className="text-xs">Código HTML</Label><Textarea {...field} rows={6} className="bg-muted font-mono" /></div>} />;
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <div className="flex h-screen w-full bg-muted/30 text-foreground">
        {isMounted && (
          <DragDropContext onDragEnd={onDragEnd}>
            <aside className="w-[350px] flex-shrink-0 bg-background border-r flex flex-col">
              <div className="p-4 border-b h-16 flex items-center">
                 <h2 className="text-lg font-semibold font-headline">Contenido</h2>
              </div>
              <div className="flex-grow p-4 overflow-y-auto">
                <Tabs defaultValue="bloques" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="bloques">Bloques</TabsTrigger>
                    <TabsTrigger value="secciones" disabled>Secciones</TabsTrigger>
                    <TabsTrigger value="guardados" disabled>Guardados</TabsTrigger>
                  </TabsList>
                  <TabsContent value="bloques" className="mt-4">
                    <div className="grid grid-cols-2 gap-2">
                      {PALETTE_BLOCKS.map((block) => (
                        <button
                          key={block.type}
                          type="button"
                          onClick={() => addBlock(block.type)}
                          className="flex flex-col items-center justify-center p-4 border rounded-lg bg-card hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                        >
                          <block.icon className="h-6 w-6 mb-2" />
                          <span className="text-xs font-medium">{block.label}</span>
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </aside>

            <div className="flex-1 flex flex-col">
              <header className="h-16 border-b bg-background flex items-center justify-between px-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="templateName"
                    render={({ field }) => (
                      <Input {...field} className="text-lg font-medium border-none shadow-none focus-visible:ring-0 p-0 h-auto" />
                    )}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" disabled><Undo className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" disabled><Redo className="h-4 w-4" /></Button>
                  <Button variant="outline" disabled>Vista previa y prueba</Button>
                  <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
                     {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     Guardar y salir
                  </Button>
                   <Button variant="ghost" size="icon" disabled><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto bg-[radial-gradient(hsl(var(--border))_0.5px,transparent_0.5px)] [background-size:16px_16px]">
                <div className="max-w-3xl mx-auto py-12">
                   <Droppable droppableId="canvas">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn("min-h-[500px] w-full rounded-lg bg-background shadow-md", snapshot.isDraggingOver && "outline-dashed outline-2 outline-primary")}
                      >
                        {fields.length === 0 ? (
                           <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                            <Download className="h-10 w-10 mb-4" />
                            <p className="font-semibold">Haz clic en un bloque para añadirlo</p>
                          </div>
                        ) : (
                          fields.map((field, index) => (
                            <Draggable key={field.id} draggableId={field.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={cn("p-2", snapshot.isDragging && "opacity-80")}
                                >
                                  <div className="flex items-start gap-2 p-4 border rounded-md bg-card hover:border-primary/50 relative">
                                    <div {...provided.dragHandleProps} className="cursor-grab p-2">
                                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-grow space-y-2">
                                      <h4 className="font-medium capitalize text-sm">{watchedBlocks[index].type}</h4>
                                      {renderBlockControls(index)}
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => remove(index)}
                                      className="absolute top-2 right-2"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </main>
            </div>
          </DragDropContext>
        )}
      </div>
    </Form>
  );
}
