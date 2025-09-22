'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { HtmlImportModal } from './html-import-modal';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import {
  Pilcrow, ImageIcon, MousePointerClick, Minus, GripVertical, Code,
  Loader2, Trash2, StretchVertical, Upload, Computer, Smartphone, FileText
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult, DraggableProvided, DraggableStateSnapshot, DroppableProvided } from '@hello-pangea/dnd';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import { type Block, formSchema, type FormValues, blockSchema } from '@/lib/template-utils';
import { saveTemplateAction, type Template } from '@/actions/Plantillas/template-actions';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

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
 * @function BlockRenderer
 * @description Un componente funcional que renderiza un bloque de plantilla de correo electrónico
 * basándose en su tipo y contenido. Utiliza estilos en línea para una compatibilidad óptima
 * con clientes de correo.
 * @param {object} props - Las props del componente.
 * @param {Block} props.block - El objeto de bloque que se va a renderizar.
 * @returns {React.ReactElement | null} Un elemento de React que representa el bloque o null si el tipo es desconocido.
 */
const BlockRenderer = ({ block }: { block: Block }) => {
  switch (block.type) {
    case 'text':
      if ('color' in block.content && 'fontSize' in block.content && 'lineHeight' in block.content && 'fontWeight' in block.content && 'textAlign' in block.content && 'text' in block.content) {
        return <p style={{ color: block.content.color, fontSize: `${block.content.fontSize}px`, lineHeight: block.content.lineHeight, fontWeight: block.content.fontWeight, textAlign: block.content.textAlign, whiteSpace: 'pre-wrap' }}>{block.content.text}</p>;
      }
      return null;
    case 'image':
      if ('align' in block.content && 'src' in block.content && 'alt' in block.content && 'width' in block.content) {
        const alignStyle: React.CSSProperties = {
          display: 'block',
          margin: block.content.align === 'center' ? '0 auto' : (block.content.align === 'right' ? '0 0 0 auto' : '0 auto 0 0')
        };
        return <img src={block.content.src} alt={block.content.alt} style={{ ...alignStyle, width: `${block.content.width}%` }} />;
      }
      return null;
    case 'button':
      if ('textAlign' in block.content && 'borderRadius' in block.content && 'backgroundColor' in block.content && 'href' in block.content && 'color' in block.content && 'text' in block.content) {
        return (
          <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%', textAlign: block.content.textAlign }}>
            <tbody>
              <tr>
                <td style={{ textAlign: block.content.textAlign }}>
                  <a href={block.content.href} target="_blank" style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: block.content.backgroundColor, color: block.content.color, borderRadius: `${block.content.borderRadius}px`, textDecoration: 'none' }}>
                    {block.content.text}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        );
      }
      return null;
    case 'spacer':
      if ('height' in block.content) {
        return <div style={{ height: `${block.content.height}px` }} />;
      }
      return null;
    case 'divider':
      if ('padding' in block.content && 'color' in block.content) {
        return <div style={{ padding: `${block.content.padding}px 0` }}><hr style={{ borderColor: block.content.color }} /></div>;
      }
      return null;
    case 'html':
      if ('code' in block.content) {
        return <div dangerouslySetInnerHTML={{ __html: block.content.code }} />;
      }
      return null;
    default:
      return <div className="text-red-500">Bloque desconocido</div>;
  }
};

/**
 * @function TemplateEditorClient
 * @description Componente de cliente para crear y editar plantillas de correo electrónico con un editor visual por bloques.
 * Utiliza React Hook Form y una librería de arrastrar y soltar para una experiencia de usuario interactiva.
 * @param {object} props - Las props del componente.
 * @param {Template} [props.templateData] - Los datos de la plantilla existente, opcional para el modo de edición.
 */
export function TemplateEditorClient({ templateData }: { templateData?: Template }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedHtml, setImportedHtml] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateName: templateData?.nombre || 'Mi Nueva Plantilla',
      emailSubject: templateData?.asunto_predeterminado || 'Asunto del Correo',
      blocks: templateData?.tipo === 'html' ? [] : (templateData?.contenido || []),
      isHtmlTemplate: templateData?.tipo === 'html',
      htmlContent: templateData?.tipo === 'html' ? (templateData?.contenido as string || '') : '',
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
    if (templateData) {
        form.reset({
            templateName: templateData.nombre,
            emailSubject: templateData.asunto_predeterminado,
            blocks: templateData.contenido,
        });
    }
  }, [templateData, form]);

/**
 * @function handleSave
 * @description Maneja el envío del formulario. Llama a la acción del servidor `saveTemplateAction`
 * para guardar la plantilla, maneja el estado de carga y muestra notificaciones de éxito o error.
 * @async
 * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de guardado ha terminado.
 */
  const handleSave = async () => {
    setIsSaving(true);
    const formValues = form.getValues();
    const result = await saveTemplateAction({
      id_plantilla: templateData?.id_plantilla,
      nombre: formValues.templateName,
      asunto_predeterminado: formValues.emailSubject,
      contenido: formValues.isHtmlTemplate ? formValues.htmlContent : formValues.blocks,
      tipo: formValues.isHtmlTemplate ? 'html' : 'template',
      html_content: formValues.isHtmlTemplate ? formValues.htmlContent : undefined,
    });

    setIsSaving(false);

    if (result.success) {
      toast({
        title: result.message,
      });
      // Redirigir a la lista de plantillas después de guardar
      setTimeout(() => {
        router.push('/templates');
      }, 1000);
    } else {
      toast({
        title: 'Error al guardar',
        description: result.message,
        variant: 'destructive',
      });
    }
  }

/**
 * @function onDragEnd
 * @description Callback para la librería de arrastrar y soltar (`@hello-pangea/dnd`).
 * Reordena la lista de bloques en el formulario si un bloque se suelta en una nueva posición válida.
 * @param {DropResult} result - El objeto de resultado de la operación de arrastrar y soltar.
 */
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    if (result.source.droppableId === result.destination.droppableId && result.source.index !== result.destination.index) {
      move(result.source.index, result.destination.index);
    }
  };

/**
 * @function addBlock
 * @description Crea un nuevo bloque del tipo especificado y lo añade al final del array de bloques del formulario.
 * Luego, selecciona el nuevo bloque para que se puedan editar sus propiedades.
 * @param {Block['type']} blockType - El tipo de bloque a añadir (e.g., 'text', 'image').
 */
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
        toast({ title: 'HTML importado al bloque' });
      };
      reader.readAsText(file);
    } else {
      toast({ title: 'Archivo no válido', description: 'Por favor, selecciona un archivo .html', variant: 'destructive' });
    }
    e.target.value = '';
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (file.type !== 'text/html') {
      toast({
        title: 'Archivo no válido',
        description: 'Por favor, selecciona un archivo .html',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsImporting(true);
      const htmlContent = await file.text();
      setImportedHtml(htmlContent);
      setIsImportModalOpen(true);
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      toast({
        title: 'Error al leer el archivo',
        description: 'No se pudo leer el contenido del archivo.',
        variant: 'destructive',
      });
    } finally {
      // Limpiar el input de archivo
      if (e.target) {
        e.target.value = '';
      }
      setIsImporting(false);
    }
  };

  const toggleEditMode = useCallback(() => {
    const currentMode = form.getValues('isHtmlTemplate');
    if (currentMode) {
      // Cambiando de modo HTML a bloques
      form.setValue('isHtmlTemplate', false);
      form.setValue('blocks', []);
    } else {
      // Cambiando de modo bloques a HTML
      form.setValue('isHtmlTemplate', true);
      form.setValue('htmlContent', '');
    }
  }, [form]);

  const isHtmlTemplate = useWatch({ control: form.control, name: 'isHtmlTemplate' });
  const htmlContent = useWatch({ control: form.control, name: 'htmlContent' });

  const confirmHtmlImport = useCallback((importedHtml: string) => {
    try {
      // Configurar como plantilla HTML pura
      form.setValue('isHtmlTemplate', true);
      form.setValue('htmlContent', importedHtml);
      form.setValue('blocks', []);
      setSelectedBlockId(null);
      
      toast({
        title: '✅ Plantilla HTML importada',
        description: 'La plantilla HTML se ha importado correctamente como una plantilla pura.',
      });
    } catch (error) {
      console.error('Error al importar el HTML:', error);
      throw error;
    }
  }, [form, toast]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[250px] space-y-2">
                <Label htmlFor="templateName">Nombre de la Plantilla</Label>
                <FormField control={form.control} name="templateName" render={({ field }) => <Input id="templateName" {...field} className="text-lg font-medium" />} />
            </div>
            <div className="flex-1 min-w-[250px] space-y-2">
                <Label htmlFor="emailSubject">Asunto del Correo</Label>
                <FormField control={form.control} name="emailSubject" render={({ field }) => <Input id="emailSubject" {...field} />} />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="file"
                id="import-html"
                accept=".html"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
                disabled={isImporting}
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    {isHtmlTemplate ? 'Actualizar HTML' : 'Importar HTML'}
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={toggleEditMode}
                className="flex items-center gap-2"
              >
                {isHtmlTemplate ? 'Cambiar a Bloques' : 'Cambiar a HTML'}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Plantilla
              </Button>
            </div>
        </div>
        
        {isHtmlTemplate ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Columna izquierda - Editor de código */}
          <div className="flex flex-col h-full">
            <div className="border rounded-lg p-4 bg-white flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Editor HTML</h2>
                <div className="flex space-x-2">
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                  >
                    {isImporting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    Importar HTML
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".html,text/html"
                    className="hidden"
                  />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Code className="mr-1 h-3 w-3" />
                    {htmlContent.length} caracteres
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <FileText className="mr-1 h-3 w-3" />
                    {htmlContent.split('\n').length} líneas
                  </span>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <Textarea
                  value={htmlContent}
                  onChange={(e) => form.setValue('htmlContent', e.target.value)}
                  className="font-mono h-full w-full text-sm resize-none"
                  placeholder="Pega tu código HTML aquí o importa un archivo..."
                />
              </div>
            </div>
          </div>

          {/* Columna derecha - Vista previa */}
          <div className="flex flex-col h-full">
            <div className="border rounded-lg p-4 bg-white flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Vista Previa</h2>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={previewMode === 'desktop' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setPreviewMode('desktop')}
                    className="h-8 w-8 p-0"
                    title="Vista de escritorio"
                  >
                    <Computer className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={previewMode === 'mobile' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setPreviewMode('mobile')}
                    className="h-8 w-8 p-0"
                    title="Vista móvil"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto border rounded bg-gray-50 p-4">
                <div 
                  className={`${previewMode === 'mobile' ? 'max-w-[375px] mx-auto border-8 border-black rounded-3xl overflow-hidden' : ''}`}
                  style={previewMode === 'mobile' ? { minHeight: '667px' } : {}}
                >
                  <div 
                    className={`${previewMode === 'mobile' ? 'h-[calc(100vh-150px)]' : 'min-h-[500px]'}`}
                    dangerouslySetInnerHTML={{ 
                      __html: htmlContent || '<div class="flex items-center justify-center h-full text-muted-foreground"><p>La vista previa aparecerá aquí</p></div>' 
                    }}
                  />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                Nota: Algunos estilos pueden verse diferentes en clientes de correo. 
                Prueba siempre en varios clientes antes de enviar.
              </p>
            </div>
          </div>
        </div>
        ) : (
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
                  <div className="flex items-center gap-1 bg-muted p-1">
                      <Button variant={previewMode === 'desktop' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setPreviewMode('desktop')} aria-label="Vista de escritorio">
                          <Computer className="h-4 w-4" />
                      </Button>
                      <Button variant={previewMode === 'mobile' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setPreviewMode('mobile')} aria-label="Vista móvil">
                          <Smartphone className="h-4 w-4" />
                      </Button>
                  </div>
              </div>

              {isMounted && (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="canvas" isDropDisabled={false}>
                        {(provided: DroppableProvided) => (
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
                                        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
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
        )}
      </form>

      <HtmlImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onConfirm={confirmHtmlImport}
        htmlContent={importedHtml}
      />
    </Form>
  );
}
