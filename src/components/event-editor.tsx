'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { type Template } from '@/actions/template-actions';
import { saveEventAction } from '@/actions/event-actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Componente de cliente para el editor de eventos.
 * Permite definir los detalles del evento y asociar una plantilla de invitación y una de certificado.
 */
export function EventEditor({ 
  invitationTemplates, 
  certificateTemplates 
}: { 
  invitationTemplates: Template[], 
  certificateTemplates: Template[] 
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [selectedInvitation, setSelectedInvitation] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

  const handleSaveEvent = async () => {
    if (!eventName || !eventDate || !selectedInvitation || !selectedCertificate) {
        toast({
            title: "Error de validación",
            description: "Por favor, completa todos los campos antes de guardar.",
            variant: "destructive",
        });
        return;
    }

    try {
      await saveEventAction({
        nombre: eventName,
        fecha: new Date(eventDate),
        id_plantilla_invitacion: Number(selectedInvitation),
        id_plantilla_certificado: Number(selectedCertificate),
      });

      toast({
        title: "Evento Guardado con Éxito",
        description: `El evento "${eventName}" ha sido creado.`,
      });

      router.push('/events');

    } catch (error) {
      console.error("Error al guardar el evento:", error);
      toast({
        title: "Error en el servidor",
        description: "No se pudo guardar el evento. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
       <div>
         <div className="flex items-center justify-between mb-4">
           <h1 className="text-3xl font-bold">Editor de Eventos</h1>
           <Button onClick={handleSaveEvent}>
             <Save className="mr-2" />
             Guardar Evento
           </Button>
         </div>
         <p className="text-muted-foreground">
           Define los detalles, la invitación y el certificado para tu evento.
         </p>
       </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Detalles del Evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-name">Nombre del Evento</Label>
            <Input 
              id="event-name" 
              placeholder="Ej: Conferencia Anual de Tecnología" 
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-date">Fecha del Evento</Label>
            <Input 
              id="event-date" 
              type="date" 
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Plantilla de Invitación</CardTitle>
          <CardDescription>
            Selecciona la plantilla de correo que se usará para invitar a los contactos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedInvitation}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una plantilla de invitación" />
            </SelectTrigger>
            <SelectContent>
              {invitationTemplates.map((template) => (
                <SelectItem key={template.id_plantilla} value={template.id_plantilla.toString()}>
                  {template.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Plantilla del Certificado</CardTitle>
          <CardDescription>
            Selecciona la plantilla de certificado que se enviará a los asistentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedCertificate}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una plantilla de certificado" />
            </SelectTrigger>
            <SelectContent>
              {certificateTemplates.map((template) => (
                <SelectItem key={template.id_plantilla} value={template.id_plantilla.toString()}>
                  {template.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
