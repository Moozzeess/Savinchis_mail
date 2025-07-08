'use client';

import { useState, type ChangeEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Draggable from 'react-draggable';
import type { DraggableEvent, DraggableData } from 'react-draggable';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toPng } from 'html-to-image';
import { Download, Loader2, Save } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { saveTemplateAction, type Template } from '@/actions/template-actions';
import { useRouter } from 'next/navigation';

type TextAlign = 'left' | 'center' | 'right';
type FontWeight = 'normal' | 'bold' | '300' | '600';
type FontFamily = 'body' | 'headline';

interface StyleProps {
  fontSize: number;
  color: string;
  width: number;
  textAlign: TextAlign;
  fontWeight: FontWeight;
  fontFamily: FontFamily;
}

interface Position {
  x: number;
  y: number;
}

/**
 * Componente de cliente para el editor de plantillas de certificados.
 * Permite subir una imagen de fondo, personalizar los textos del certificado
 * y mover los elementos en una vista previa en tiempo real.
 */
export function CertificateEditor({ certificate }: { certificate: Partial<Template> | null }) {
  const router = useRouter();
  const { toast } = useToast();

  // Contenido del certificado
  const [templateName, setTemplateName] = useState(certificate?.nombre || 'Mi Nuevo Certificado');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(certificate?.contenido?.backgroundImage || null);
  const [title, setTitle] = useState(certificate?.contenido?.texts?.title || 'Certificado de Asistencia');
  const [issuedToText, setIssuedToText] = useState(certificate?.contenido?.texts?.issuedToText || 'Otorgado a:');
  const [description, setDescription] = useState(certificate?.contenido?.texts?.description || 'Por completar exitosamente el taller de Email Marketing Avanzado.');
  const [dateText, setDateText] = useState(certificate?.contenido?.texts?.dateText || 'Fecha:');
  const [signatureText, setSignatureText] = useState(certificate?.contenido?.texts?.signatureText || 'Firma del Organizador');
  
  // Estilos y posiciones
  const [elementStyles, setElementStyles] = useState<{ [key: string]: StyleProps }>(certificate?.contenido?.styles || {
    title: { fontSize: 48, color: '#000000', width: 80, textAlign: 'center', fontWeight: 'bold', fontFamily: 'headline' },
    issuedTo: { fontSize: 18, color: '#000000', width: 80, textAlign: 'center', fontWeight: 'normal', fontFamily: 'body' },
    contactName: { fontSize: 36, color: '#000000', width: 80, textAlign: 'center', fontWeight: '600', fontFamily: 'headline' },
    description: { fontSize: 16, color: '#000000', width: 80, textAlign: 'center', fontWeight: 'normal', fontFamily: 'body' },
    signature: { fontSize: 16, color: '#000000', width: 50, textAlign: 'center', fontWeight: '600', fontFamily: 'body' },
    date: { fontSize: 16, color: '#000000', width: 50, textAlign: 'center', fontWeight: '600', fontFamily: 'body' },
  });

  const [positions, setPositions] = useState<{ [key: string]: Position }>(certificate?.contenido?.positions || {
    title: { x: 50, y: 50 },
    issuedTo: { x: 50, y: 120 },
    contactName: { x: 50, y: 160 },
    description: { x: 50, y: 220 },
    signature: { x: 100, y: 380 },
    date: { x: 550, y: 380 },
  });

  const [isSaving, setIsSaving] = useState(false);

  const certificateRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const issuedToRef = useRef<HTMLDivElement>(null);
  const contactNameRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const handleStyleChange = (element: string, property: keyof StyleProps, value: string | number) => {
    setElementStyles(prev => ({
        ...prev,
        [element]: {
            ...prev[element],
            [property]: value,
        },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const contenido = {
      backgroundImage,
      texts: {
        title,
        issuedToText,
        description,
        dateText,
        signatureText,
      },
      styles: elementStyles,
      positions,
    };

    const result = await saveTemplateAction({
      id: certificate?.id_plantilla,
      nombre: templateName,
      asunto_predeterminado: 'Certificado - ' + templateName,
      contenido: contenido,
      tipo: 'certificate',
    });

    setIsSaving(false);

    if (result.success) {
      toast({
        title: result.message,
      });
      if (result.id) {
        // Para evitar que el usuario haga cambios mientras redirige
        setTimeout(() => {
          router.push(`/templates/certificate/edit/${result.id}`);
        }, 1000);
      }
    } else {
      toast({
        title: 'Error al guardar',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  /**
   * Gestiona la descarga del certificado como un archivo PDF.
   * Utiliza html-to-image para convertir el DOM en una imagen y la descarga.
   */
  const handleDownload = () => {
    const element = certificateRef.current;
    if (!element) {
      toast({
        title: 'Error de referencia',
        description: 'No se pudo encontrar el elemento del certificado para descargar.',
        variant: 'destructive',
      });
      return;
    }

    toPng(element, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          // Usar las dimensiones del elemento para el tamaño del PDF y así mantener la relación de aspecto
          format: [element.offsetWidth, element.offsetHeight],
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('certificado.pdf');
        toast({
          title: 'Descarga Iniciada',
          description: 'El certificado se está descargando como archivo PDF.',
        });
      })
      .catch((err) => {
        console.error('Error al generar la imagen:', err);
        toast({
          title: 'Error al Descargar',
          description: 'No se pudo generar la imagen del certificado.',
          variant: 'destructive',
        });
      });
  };

  const styleControls = (elementName: string, elementLabel: string, textState: string | null, setTextState: ((val: string) => void) | null) => (
    <AccordionItem value={elementName}>
      <AccordionTrigger>{elementLabel}</AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        {textState !== null && setTextState && (
          <div className="space-y-2">
            <Label htmlFor={`cert-${elementName}`}>Texto</Label>
            <Input id={`cert-${elementName}`} value={textState} onChange={(e) => setTextState(e.target.value)} />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tamaño ({elementStyles[elementName].fontSize}px)</Label>
            <Slider
              value={[elementStyles[elementName].fontSize]}
              onValueChange={([val]) => handleStyleChange(elementName, 'fontSize', val)}
              min={8} max={120} step={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Ancho ({elementStyles[elementName].width}%)</Label>
            <Slider
              value={[elementStyles[elementName].width]}
              onValueChange={([val]) => handleStyleChange(elementName, 'width', val)}
              min={10} max={100} step={1}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Alineación</Label>
            <Select
              value={elementStyles[elementName].textAlign}
              onValueChange={(val: TextAlign) => handleStyleChange(elementName, 'textAlign', val)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Izquierda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Derecha</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Grosor</Label>
            <Select
              value={elementStyles[elementName].fontWeight}
              onValueChange={(val: FontWeight) => handleStyleChange(elementName, 'fontWeight', val)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="300">Light</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="600">Semi-Bold</SelectItem>
                <SelectItem value="bold">Negrita</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Fuente</Label>
            <Select
              value={elementStyles[elementName].fontFamily}
              onValueChange={(val: FontFamily) => handleStyleChange(elementName, 'fontFamily', val)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="body">Alegreya (Cuerpo)</SelectItem>
                <SelectItem value="headline">Belleza (Títulos)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${elementName}-color`}>Color</Label>
            <Input
              id={`${elementName}-color`}
              type="color"
              value={elementStyles[elementName].color}
              onChange={(e) => handleStyleChange(elementName, 'color', e.target.value)}
              className="p-1 h-10 w-full"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const handleStop = (elementName: string) => (e: import('react-draggable').DraggableEvent, data: import('react-draggable').DraggableData) => {
  setPositions(prev => ({
      ...prev,
      [elementName]: { x: data.x, y: data.y },
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4 md:p-8">
      {/* Columna de Controles */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Controles del Certificado</CardTitle>
            <CardDescription>Ajusta los elementos de tu diseño.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Nombre del Certificado</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Ej: Certificado Taller de Marketing"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="background-image">Imagen de Fondo</Label>
              <Input id="background-image" type="file" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (!file.type.startsWith('image/')) {
                    toast({
                      title: 'Archivo no válido',
                      description: 'Por favor, selecciona un archivo de imagen.',
                      variant: 'destructive',
                    });
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setBackgroundImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }} accept="image/*" />
              {backgroundImage && (
                <Button variant="outline" size="sm" onClick={() => setBackgroundImage(null)} className="w-full">
                  Eliminar Fondo
                </Button>
              )}
            </div>

            <Accordion type="single" collapsible className="w-full">
              {styleControls('title', 'Título', title, setTitle)}
              {styleControls('issuedTo', 'Texto "Otorgado a"', issuedToText, setIssuedToText)}
              {styleControls('description', 'Descripción', description, setDescription)}
              {styleControls('signature', 'Texto de Firma', signatureText, setSignatureText)}
              {styleControls('date', 'Texto de Fecha', dateText, setDateText)}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Columna de Vista Previa */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa del Certificado</CardTitle>
          </CardHeader>
          <CardContent className="relative aspect-[11/8.5] w-full overflow-hidden border rounded-lg" ref={certificateRef}>
            <div id="certificate-design" className="absolute inset-0 w-full h-full bg-white">
              {backgroundImage && (
                <Image src={backgroundImage} layout="fill" objectFit="cover" alt="Fondo del certificado" />
              )}

              <div className="relative w-full h-full">
                               {/* Elementos Arrastrables */}
                               <Draggable bounds="parent" position={positions.title} onStop={handleStop('title')} nodeRef={titleRef}>
                  <div className="absolute cursor-move p-2" ref={titleRef}>
                    <div style={{ width: `${elementStyles.title.width}%`, textAlign: elementStyles.title.textAlign }}>
                      <h2
                        className={cn(`font-${elementStyles.title.fontFamily}`)}
                        style={{ color: elementStyles.title.color, fontSize: `${elementStyles.title.fontSize}px`, fontWeight: elementStyles.title.fontWeight as FontWeight }}
                      >
                        {title}
                      </h2>
                    </div>
                  </div>
                </Draggable>

                <Draggable bounds="parent" position={positions.issuedTo} onStop={handleStop('issuedTo')} nodeRef={issuedToRef}>
                  <div className="absolute cursor-move p-2" ref={issuedToRef}>
                    <div style={{ width: `${elementStyles.issuedTo.width}%`, textAlign: elementStyles.issuedTo.textAlign }}>
                      <p
                        className={cn(`font-${elementStyles.issuedTo.fontFamily}`)}
                        style={{ color: elementStyles.issuedTo.color, fontSize: `${elementStyles.issuedTo.fontSize}px`, fontWeight: elementStyles.issuedTo.fontWeight as FontWeight }}
                      >
                        {issuedToText}
                      </p>
                    </div>
                  </div>
                </Draggable>

                <Draggable bounds="parent" position={positions.contactName} onStop={handleStop('contactName')} nodeRef={contactNameRef}>
                  <div className="absolute cursor-move p-2" ref={contactNameRef}>
                    <div style={{ width: `${elementStyles.contactName.width}%`, textAlign: elementStyles.contactName.textAlign }}>
                      <p
                        className={cn(`font-${elementStyles.contactName.fontFamily}`)}
                        style={{ color: elementStyles.contactName.color, fontSize: `${elementStyles.contactName.fontSize}px`, fontWeight: elementStyles.contactName.fontWeight as FontWeight }}
                      >
                        &#123;&#123;contact.name&#125;&#125;
                      </p>
                    </div>
                  </div>
                </Draggable>
                
                <Draggable bounds="parent" position={positions.description} onStop={handleStop('description')} nodeRef={descriptionRef}>
                  <div className="absolute cursor-move p-2" ref={descriptionRef}>
                    <div style={{ width: `${elementStyles.description.width}%`, textAlign: elementStyles.description.textAlign }}>
                      <p
                        className={cn(`font-${elementStyles.description.fontFamily}`)}
                        style={{ color: elementStyles.description.color, fontSize: `${elementStyles.description.fontSize}px`, fontWeight: elementStyles.description.fontWeight as FontWeight }}
                      >
                        {description}
                      </p>
                    </div>
                  </div>
                </Draggable>

                <Draggable bounds="parent" position={positions.signature} onStop={handleStop('signature')} nodeRef={signatureRef}>
                  <div className="absolute cursor-move p-2" ref={signatureRef}>
                    <div style={{ width: `${elementStyles.signature.width}%`, textAlign: elementStyles.signature.textAlign }}>
                      <div className="border-t-2 border-current pt-1" style={{borderColor: elementStyles.signature.color}}>
                        <p
                          className={cn(`font-${elementStyles.signature.fontFamily}`)}
                          style={{ color: elementStyles.signature.color, fontSize: `${elementStyles.signature.fontSize}px`, fontWeight: elementStyles.signature.fontWeight as FontWeight }}
                        >
                          {signatureText}
                        </p>
                      </div>
                    </div>
                  </div>
                </Draggable>

                <Draggable bounds="parent" position={positions.date} onStop={handleStop('date')} nodeRef={dateRef}>
                  <div className="absolute cursor-move p-2" ref={dateRef}>
                    <div style={{ width: `${elementStyles.date.width}%`, textAlign: elementStyles.date.textAlign }}>
                      <div className="border-t-2 border-current pt-1" style={{borderColor: elementStyles.date.color}}>
                        <p
                          className={cn(`font-${elementStyles.date.fontFamily}`)}
                          style={{ color: elementStyles.date.color, fontSize: `${elementStyles.date.fontSize}px`, fontWeight: elementStyles.date.fontWeight as FontWeight }}
                        >
                          {dateText} &#123;&#123;event.date&#125;&#125;
                        </p>
                      </div>
                    </div>
                  </div>
                </Draggable>
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Guardar
            </Button>
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
