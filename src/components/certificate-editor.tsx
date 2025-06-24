'use client';

import { useState, type ChangeEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Draggable from 'react-draggable';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

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

/**
 * Componente de cliente para el editor de plantillas de certificados.
 * Permite subir una imagen de fondo, personalizar los textos del certificado
 * y mover los elementos en una vista previa en tiempo real.
 */
export function CertificateEditor() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [title, setTitle] = useState('Certificado de Asistencia');
  const [issuedToText, setIssuedToText] = useState('Otorgado a:');
  const [description, setDescription] = useState('Por completar exitosamente el taller de Email Marketing Avanzado.');
  const [dateText, setDateText] = useState('Fecha:');
  const [signatureText, setSignatureText] = useState('Firma del Organizador');
  
  const [elementStyles, setElementStyles] = useState<{ [key: string]: StyleProps }>({
    title: { fontSize: 48, color: '#000000', width: 80, textAlign: 'center', fontWeight: 'bold', fontFamily: 'headline' },
    issuedTo: { fontSize: 18, color: '#000000', width: 80, textAlign: 'center', fontWeight: 'normal', fontFamily: 'body' },
    contactName: { fontSize: 36, color: '#000000', width: 80, textAlign: 'center', fontWeight: '600', fontFamily: 'headline' },
    description: { fontSize: 16, color: '#000000', width: 80, textAlign: 'center', fontWeight: 'normal', fontFamily: 'body' },
    signature: { fontSize: 16, color: '#000000', width: 50, textAlign: 'center', fontWeight: '600', fontFamily: 'body' },
    date: { fontSize: 16, color: '#000000', width: 50, textAlign: 'center', fontWeight: '600', fontFamily: 'body' },
  });

  const { toast } = useToast();

  const titleRef = useRef(null);
  const issuedToRef = useRef(null);
  const contactNameRef = useRef(null);
  const descriptionRef = useRef(null);
  const signatureRef = useRef(null);
  const dateRef = useRef(null);

  const handleStyleChange = (element: string, property: keyof StyleProps, value: string | number) => {
    setElementStyles(prev => ({
        ...prev,
        [element]: {
            ...prev[element],
            [property]: value,
        },
    }));
  };

  /**
   * Gestiona el cambio de la imagen de fondo.
   * Lee el archivo seleccionado, lo convierte a un Data URL y lo establece en el estado
   * para actualizar la vista previa. Muestra un error si el archivo no es una imagen.
   * @param e - El evento de cambio del input de archivo.
   */
  const handleBackgroundImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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
  };

  /**
   * Gestiona el guardado de la plantilla de certificado.
   * Actualmente, muestra una notificación de éxito.
   */
  const handleSaveTemplate = () => {
    toast({
      title: 'Plantilla Guardada',
      description: 'Tu plantilla de certificado ha sido guardada con éxito.',
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

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Personalizar Certificado</CardTitle>
          <CardDescription>
            Ajusta los textos y estilos. Arrastra los elementos en la vista previa para moverlos. Usa{' '}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-code">{'{{contact.name}}'}</code> y{' '}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-code">{'{{event.date}}'}</code>{' '}
            como marcadores de posición.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bg-image">Imagen de Fondo</Label>
            <Input id="bg-image" type="file" accept="image/*" onChange={handleBackgroundImageChange} />
          </div>

          <Accordion type="multiple" className="w-full space-y-2">
            {styleControls('title', 'Título', title, setTitle)}
            {styleControls('issuedTo', 'Texto "Otorgado a"', issuedToText, setIssuedToText)}
            {styleControls('contactName', 'Nombre del Contacto', null, null)}
            {styleControls('description', 'Descripción/Motivo', description, setDescription)}
            {styleControls('signature', 'Firma', signatureText, setSignatureText)}
            {styleControls('date', 'Texto de Fecha', dateText, setDateText)}
          </Accordion>
          
          <Button onClick={handleSaveTemplate} className="mt-4 w-full">Guardar Plantilla</Button>
        </CardContent>
      </Card>
      
      <div className="sticky top-24">
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa del Certificado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[11/8.5] w-full bg-card-foreground/5 border rounded-lg overflow-hidden">
              {backgroundImage ? (
                <Image src={backgroundImage} alt="Fondo del certificado" fill objectFit="cover" />
              ) : (
                <div className="grid place-content-center h-full">
                  <p className="text-muted-foreground">Sube una imagen de fondo</p>
                </div>
              )}
              <div className="absolute inset-0">
                
                <Draggable bounds="parent" nodeRef={titleRef}>
                  <div ref={titleRef} className="absolute cursor-move p-2" style={{ top: '10%', left: '10%' }}>
                    <div style={{ width: `${elementStyles.title.width}%`, textAlign: elementStyles.title.textAlign }}>
                      <h1
                        className={cn('tracking-wider', `font-${elementStyles.title.fontFamily}`)}
                        style={{ textShadow: '1px 1px 2px white', fontSize: elementStyles.title.fontSize, color: elementStyles.title.color, fontWeight: elementStyles.title.fontWeight }}
                      >
                        {title}
                      </h1>
                    </div>
                  </div>
                </Draggable>

                <Draggable bounds="parent" nodeRef={issuedToRef}>
                  <div ref={issuedToRef} className="absolute cursor-move p-2" style={{ top: '25%', left: '10%' }}>
                    <div style={{ width: `${elementStyles.issuedTo.width}%`, textAlign: elementStyles.issuedTo.textAlign }}>
                      <p
                        className={cn(`font-${elementStyles.issuedTo.fontFamily}`)}
                        style={{ textShadow: '1px 1px 2px white', fontSize: elementStyles.issuedTo.fontSize, color: elementStyles.issuedTo.color, fontWeight: elementStyles.issuedTo.fontWeight }}
                      >
                        {issuedToText}
                      </p>
                    </div>
                  </div>
                </Draggable>

                <Draggable bounds="parent" nodeRef={contactNameRef}>
                  <div ref={contactNameRef} className="absolute cursor-move p-2" style={{ top: '32%', left: '10%' }}>
                    <div style={{ width: `${elementStyles.contactName.width}%`, textAlign: elementStyles.contactName.textAlign }}>
                      <p
                        className={cn(`font-${elementStyles.contactName.fontFamily}`)}
                        style={{ textShadow: '1px 1px 2px white', fontSize: elementStyles.contactName.fontSize, color: elementStyles.contactName.color, fontWeight: elementStyles.contactName.fontWeight }}
                      >
                        &#123;&#123;contact.name&#125;&#125;
                      </p>
                    </div>
                  </div>
                </Draggable>
                
                <Draggable bounds="parent" nodeRef={descriptionRef}>
                  <div ref={descriptionRef} className="absolute cursor-move p-2" style={{ top: '45%', left: '10%' }}>
                    <div style={{ width: `${elementStyles.description.width}%`, textAlign: elementStyles.description.textAlign }}>
                      <p
                        className={cn(`font-${elementStyles.description.fontFamily}`)}
                        style={{ textShadow: '1px 1px 2px white', fontSize: elementStyles.description.fontSize, color: elementStyles.description.color, fontWeight: elementStyles.description.fontWeight }}
                      >
                        {description}
                      </p>
                    </div>
                  </div>
                </Draggable>

                <Draggable bounds="parent" nodeRef={signatureRef}>
                  <div ref={signatureRef} className="absolute cursor-move p-2" style={{ bottom: '15%', left: '5%' }}>
                    <div style={{ width: `${elementStyles.signature.width}%`, textAlign: elementStyles.signature.textAlign }}>
                      <div className="border-t-2 border-current pt-1" style={{borderColor: elementStyles.signature.color}}>
                        <p
                          className={cn(`font-${elementStyles.signature.fontFamily}`)}
                          style={{ textShadow: '1px 1px 2px white', fontSize: elementStyles.signature.fontSize, color: elementStyles.signature.color, fontWeight: elementStyles.signature.fontWeight }}
                        >
                          {signatureText}
                        </p>
                      </div>
                    </div>
                  </div>
                </Draggable>

                <Draggable bounds="parent" nodeRef={dateRef}>
                  <div ref={dateRef} className="absolute cursor-move p-2" style={{ bottom: '15%', right: '5%' }}>
                    <div style={{ width: `${elementStyles.date.width}%`, textAlign: elementStyles.date.textAlign }}>
                      <div className="border-t-2 border-current pt-1" style={{borderColor: elementStyles.date.color}}>
                        <p
                          className={cn(`font-${elementStyles.date.fontFamily}`)}
                          style={{ textShadow: '1px 1px 2px white', fontSize: elementStyles.date.fontSize, color: elementStyles.date.color, fontWeight: elementStyles.date.fontWeight }}
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
        </Card>
      </div>
    </div>
  );
}
