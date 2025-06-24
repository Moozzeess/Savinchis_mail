'use client';

import { useState, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Draggable from 'react-draggable';

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

  const { toast } = useToast();

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
    // Aquí se podría guardar la posición de los elementos también
    toast({
      title: 'Plantilla Guardada',
      description: 'Tu plantilla de certificado ha sido guardada con éxito.',
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Personalizar Certificado</CardTitle>
          <CardDescription>
            Sube una imagen de fondo y ajusta los textos. Haz clic y arrastra los textos en la vista previa para moverlos. Usa{' '}
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
          <div className="space-y-2">
            <Label htmlFor="cert-title">Título del Certificado</Label>
            <Input id="cert-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cert-issued-to">Texto "Otorgado a"</Label>
            <Input id="cert-issued-to" value={issuedToText} onChange={(e) => setIssuedToText(e.target.value)} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="cert-desc">Descripción/Motivo</Label>
            <Textarea id="cert-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cert-date">Texto de Fecha</Label>
            <Input id="cert-date" value={dateText} onChange={(e) => setDateText(e.target.value)} />
          </div>
          <Button onClick={handleSaveTemplate}>Guardar Plantilla</Button>
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
              <div className="absolute inset-0 p-8 text-black font-serif">
                
                <Draggable bounds="parent">
                  <div className="absolute cursor-move p-2" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}>
                    <h1 className="text-4xl font-bold tracking-wider text-center" style={{ textShadow: '1px 1px 2px white' }}>{title}</h1>
                  </div>
                </Draggable>

                <Draggable bounds="parent">
                  <div className="absolute cursor-move p-2" style={{ top: '25%', left: '50%', transform: 'translateX(-50%)' }}>
                    <p className="text-lg text-center" style={{ textShadow: '1px 1px 2px white' }}>{issuedToText}</p>
                  </div>
                </Draggable>

                <Draggable bounds="parent">
                  <div className="absolute cursor-move p-2" style={{ top: '32%', left: '50%', transform: 'translateX(-50%)' }}>
                    <p className="text-3xl font-headline font-semibold text-center" style={{ textShadow: '1px 1px 2px white' }}>
                      &#123;&#123;contact.name&#125;&#125;
                    </p>
                  </div>
                </Draggable>
                
                <Draggable bounds="parent">
                   <div className="absolute cursor-move p-2" style={{ top: '45%', left: '50%', transform: 'translateX(-50%)', width: '80%' }}>
                    <p className="text-base max-w-md mx-auto text-center" style={{ textShadow: '1px 1px 2px white' }}>
                      {description}
                    </p>
                  </div>
                </Draggable>

                <Draggable bounds="parent">
                  <div className="absolute cursor-move p-2" style={{ top: '80%', left: '25%', transform: 'translateX(-50%)' }}>
                    <div className="text-center">
                        <p className="font-semibold border-t-2 border-current pt-1" style={{ textShadow: '1px 1px 2px white' }}>Firma del Organizador</p>
                    </div>
                  </div>
                </Draggable>

                <Draggable bounds="parent">
                  <div className="absolute cursor-move p-2" style={{ top: '80%', left: '75%', transform: 'translateX(-50%)' }}>
                    <div className="text-center">
                          <p className="font-semibold" style={{ textShadow: '1px 1px 2px white' }}>{dateText} &#123;&#123;event.date&#125;&#125;</p>
                          <div className="border-t-2 border-current mt-1"></div>
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
