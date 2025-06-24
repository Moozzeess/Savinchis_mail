"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Loader2, PlusCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { campaigns } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { sendTestCampaign } from "@/app/actions/send-campaign-action";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * Página de Campañas.
 * Permite a los usuarios programar nuevas campañas de correo, ver el historial
 * de campañas enviadas y gestionar su estado.
 */
export default function CampaignsPage() {
  const [date, setDate] = useState<Date>();
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const [bodyType, setBodyType] = useState<'text' | 'file'>('text');
  const [emailBody, setEmailBody] = useState('');
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  /**
   * Gestiona el envío de una campaña de prueba.
   * Valida la fecha y el contenido del correo (ya sea texto o archivo),
   * llama a la acción del servidor y muestra notificaciones de éxito o error.
   */
  const handleScheduleCampaign = async () => {
    if (!date) {
      toast({
        title: "Fecha no seleccionada",
        description: "Por favor, elige una fecha para programar la campaña.",
        variant: "destructive",
      });
      return;
    }

    let emailHtml = '';

    if (bodyType === 'text') {
      if (!emailBody.trim()) {
        toast({
          title: 'Cuerpo del correo vacío',
          description: 'Por favor, escribe el contenido del correo.',
          variant: 'destructive',
        });
        return;
      }
      emailHtml = emailBody;
    } else {
      if (!htmlFile) {
        toast({
          title: 'Archivo no seleccionado',
          description: 'Por favor, selecciona un archivo HTML.',
          variant: 'destructive',
        });
        return;
      }

      if (!htmlFile.name.toLowerCase().endsWith('.html')) {
        toast({
            title: 'Archivo no válido',
            description: 'Por favor, selecciona un archivo con extensión .html',
            variant: 'destructive',
        });
        return;
      }
      
      if (saveAsTemplate && !templateName.trim()) {
        toast({
          title: 'Nombre de plantilla requerido',
          description: 'Por favor, asigna un nombre a la plantilla.',
          variant: 'destructive',
        });
        return;
      }

      try {
        emailHtml = await htmlFile.text();
      } catch (error) {
        toast({
          title: 'Error al leer el archivo',
          description: 'No se pudo leer el contenido del archivo HTML.',
          variant: 'destructive',
        });
        return;
      }
    }


    setIsSending(true);
    try {
      await sendTestCampaign(emailHtml);
      toast({
        title: "Campaña de prueba enviada",
        description: "Se ha enviado un correo de prueba a los contactos suscritos.",
      });

      if (bodyType === 'file' && saveAsTemplate) {
        // Lógica para guardar la plantilla (simulada por ahora)
        console.log(`Guardando plantilla: ${templateName}`);
        toast({
          title: "Plantilla guardada",
          description: `El archivo HTML ha sido guardado como la plantilla "${templateName}".`
        });
        setSaveAsTemplate(false);
        setTemplateName('');
      }

    } catch (error) {
      toast({
        title: "Error al enviar la campaña",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Campañas</h1>
          <p className="text-muted-foreground">
            Gestiona y programa tus campañas de correo electrónico.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2" />
          Crear Campaña
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programar Nueva Campaña</CardTitle>
          <CardDescription>
            Selecciona una fecha, define el cuerpo del correo y envía una campaña de prueba.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block">Fecha de envío</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label className="mb-2 block">Cuerpo del Mensaje</Label>
            <RadioGroup defaultValue="text" onValueChange={(value) => setBodyType(value as 'text' | 'file')} className="flex gap-4 mb-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="r1" />
                <Label htmlFor="r1">Texto Plano</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="file" id="r2" />
                <Label htmlFor="r2">Adjuntar Archivo HTML</Label>
              </div>
            </RadioGroup>

            {bodyType === 'text' && (
              <Textarea 
                placeholder="Escribe el cuerpo del correo aquí..." 
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={10}
              />
            )}

            {bodyType === 'file' && (
              <div className="space-y-4">
                <Input 
                  type="file" 
                  accept=".html,text/html" 
                  onChange={(e) => setHtmlFile(e.target.files ? e.target.files[0] : null)}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="save-template" 
                    checked={saveAsTemplate}
                    onCheckedChange={(checked) => setSaveAsTemplate(checked as boolean)}
                  />
                  <Label htmlFor="save-template">Guardar como plantilla</Label>
                </div>
                {saveAsTemplate && (
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Nombre de la Plantilla</Label>
                    <Input 
                      id="template-name"
                      placeholder="Ej: Plantilla de Bienvenida"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleScheduleCampaign} disabled={isSending}>
            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSending ? "Enviando..." : "Enviar Campaña de Prueba"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Campañas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Enviados</TableHead>
                <TableHead>Aperturas</TableHead>
                <TableHead>Clics</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.name}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        campaign.status === "Enviado"
                          ? "default"
                          : campaign.status === "Programado"
                          ? "secondary"
                          : "outline"
                      }
                      className={campaign.status === "Enviado" ? "bg-green-500/20 text-green-700 border-green-500/20" : ""}
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.sent}</TableCell>
                  <TableCell>{campaign.opens}</TableCell>
                  <TableCell>{campaign.clicks}</TableCell>
                  <TableCell>{campaign.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
