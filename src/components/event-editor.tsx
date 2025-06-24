'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { CertificateEditor } from '@/components/certificate-editor';

type RecipientSource = "date" | "file" | "sql";

/**
 * Componente cliente para el editor de eventos y certificados.
 * Permite definir los detalles del evento, configurar los destinatarios
 * y personalizar la plantilla del certificado.
 */
export function EventEditor() {
  const { toast } = useToast();
  
  // State for Recipient Selection
  const [recipientSource, setRecipientSource] = useState<RecipientSource>("date");
  const [date, setDate] = useState<Date>();
  const [fileContent, setFileContent] = useState("");
  const [uploadedFileType, setUploadedFileType] = useState<"csv" | "excel" | null>(null);
  const [sqlQuery, setSqlQuery] = useState("SELECT email, name FROM attendees WHERE event_id = 'your_event_id';");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      const fileName = file.name.toLowerCase();

      const resetState = () => {
        e.target.value = '';
        setFileContent("");
        setUploadedFileType(null);
      }

      if (fileName.endsWith(".csv")) {
        setUploadedFileType("csv");
        reader.onload = (event) => setFileContent(event.target?.result as string);
        reader.readAsText(file);
      } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
        setUploadedFileType("excel");
        reader.onload = (event) => {
          const buffer = event.target?.result as ArrayBuffer;
          const bytes = new Uint8Array(buffer);
          let binary = "";
          bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
          setFileContent(window.btoa(binary));
        };
        reader.readAsArrayBuffer(file);
      } else {
        toast({
          title: "Archivo no válido",
          description: "Por favor, selecciona un archivo .csv, .xls o .xlsx.",
          variant: "destructive",
        });
        resetState();
        return;
      }
      
      reader.onerror = () => {
        toast({
          title: "Error al leer el archivo",
          description: "No se pudo procesar el archivo seleccionado.",
          variant: "destructive",
        });
        resetState();
      };
    }
  };

  const handleSaveEvent = () => {
    // Here you would normally gather all the data and send to a server action.
    // For now, we'll just show a toast.
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
          Crea un nuevo evento, define los destinatarios y personaliza el certificado de asistencia.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Detalles del Evento y Correo</CardTitle>
          <CardDescription>
            Configura la información básica del evento y el remitente del correo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">Nombre del Evento</Label>
              <Input id="event-name" placeholder="Ej: Conferencia Anual de Tecnología" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sender-email">Email del Remitente</Label>
              <Input id="sender-email" type="email" placeholder="tu-correo@ejemplo.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-description">Descripción del Evento</Label>
            <Textarea id="event-description" placeholder="Describe brevemente de qué trata el evento..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Destinatarios del Certificado</CardTitle>
          <CardDescription>
            Define quiénes recibirán el certificado de asistencia. La lista debe contener una columna "email".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={recipientSource}
            onValueChange={(value) => setRecipientSource(value as RecipientSource)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="date">Fecha de Visita (BD)</TabsTrigger>
              <TabsTrigger value="file">Subir Archivo</TabsTrigger>
              <TabsTrigger value="sql">Consulta SQL</TabsTrigger>
            </TabsList>
            <TabsContent value="date" className="mt-4 border-t pt-4">
              <Label className="mb-2 block">Selecciona la fecha de visita de los asistentes</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-[280px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} />
                </PopoverContent>
              </Popover>
            </TabsContent>
            <TabsContent value="file" className="mt-4 space-y-2 border-t pt-4">
              <Label htmlFor="file-upload">Sube un archivo CSV o Excel de asistentes</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />
              <p className="text-sm text-muted-foreground">
                El archivo debe contener una columna "email" y opcionalmente "name".
              </p>
            </TabsContent>
            <TabsContent value="sql" className="mt-4 space-y-2 border-t pt-4">
              <Label htmlFor="sql-query">Escribe tu consulta SQL para obtener los asistentes</Label>
              <Textarea
                id="sql-query"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={4}
                placeholder="SELECT email, name FROM attendees WHERE..."
              />
              <p className="text-sm text-muted-foreground">
                La consulta debe devolver una columna "email" y opcionalmente "name".
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Diseño del Certificado</CardTitle>
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
