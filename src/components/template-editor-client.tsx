'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

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
import { Minus, Sparkles, Trash2, GripVertical, Image as ImageIcon, Pilcrow } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import { type Block, formSchema, type FormValues, generateHtmlFromBlocks } from '@/lib/template-utils';


/**
 * Componente de cliente para crear y editar plantillas de correo electrónico con un editor visual por bloques.
 */
export function TemplateEditorClient() {
  const [previewHtml, setPreviewHtml] = useState('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateName: '',
      emailSubject: '',
      blocks: [],
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
                         <div className="pt-4 mt-4 border-t">
                            <div className="grid grid-cols-2 gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('text')}><Pilcrow className="mr-2 h-4 w-4"/>Añadir Texto</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('image')}><ImageIcon className="mr-2 h-4 w-4"/>Añadir Imagen</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('button')}><Sparkles className="mr-2 h-4 w-4"/>Añadir Botón</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('spacer')}><Minus className="mr-2 h-4 w-4"/>Añadir Espaciador</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
