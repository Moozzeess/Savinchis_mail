
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { CertificateEditor } from '@/components/certificate-editor';

/**
 * Componente de cliente para el editor de eventos y certificados.
 * Permite definir los detalles del evento y personalizar la plantilla del certificado.
 */
export function EventEditor() {
  const { toast } = useToast();

  const handleSaveEvent = () => {
    // Aquí normalmente reunirías todos los datos y los enviarías a una acción de servidor.
    // Por ahora, solo mostraremos una notificación.
    toast({
      title: "Evento Guardado",
      description: "La configuración del evento y el certificado se ha guardado.",
    });
  };

  return (
    <div className="space-y-8">
       <div>
        <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-headline font-bold">Editor de Eventos</h1>
            <Button onClick={handleSaveEvent}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Evento
            </Button>
        </div>
        <p className="text-muted-foreground">
          Crea un nuevo evento y personaliza el certificado de asistencia.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Detalles del Evento</CardTitle>
          <CardDescription>
            Configura la información básica del evento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-name">Nombre del Evento</Label>
            <Input id="event-name" placeholder="Ej: Conferencia Anual de Tecnología" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-description">Descripción del Evento</Label>
            <Textarea id="event-description" placeholder="Describe brevemente de qué trata el evento..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Diseño del Certificado</CardTitle>
          <CardDescription>
            Personaliza la plantilla que se enviará a los destinatarios.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <CertificateEditor />
        </CardContent>
      </Card>
    </div>
  );
}
