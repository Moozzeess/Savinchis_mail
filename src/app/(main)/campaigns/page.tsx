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
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { campaigns } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { sendCampaign } from "@/app/actions/send-campaign-action";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

/**
 * Página de Campañas.
 * Permite a los usuarios crear, programar y enviar nuevas campañas de correo,
 * ver el historial de campañas enviadas y gestionar su estado.
 */
export default function CampaignsPage() {
  const [date, setDate] = useState<Date>();
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [previewContent, setPreviewContent] = useState('');

  const [recipientSource, setRecipientSource] = useState<'file' | 'query'>('file');
  const [recipientFile, setRecipientFile] = useState<File | null>(null);
  const [recipientQuery, setRecipientQuery] = useState('SELECT email FROM contacts WHERE subscribed = true;');

  useEffect(() => {
    setPreviewContent(emailBody);
  }, [emailBody]);

  /**
   * Gestiona el envío de una campaña.
   * Valida los campos, prepara el payload y llama a la acción del servidor.
   */
  const handleSendCampaign = async () => {
    if (!subject.trim()) {
      toast({
        title: "Asunto del correo requerido",
        description: "Por favor, escribe un asunto para la campaña.",
        variant: "destructive",
      });
      return;
    }
    
    if (!previewContent.trim()) {
      toast({
        title: 'Cuerpo del correo vacío',
        description: 'Por favor, escribe el contenido del correo.',
        variant: 'destructive',
      });
      return;
    }

    let fileContent: string | undefined;

    if (recipientSource === 'file') {
      if (!recipientFile) {
        toast({
          title: 'Archivo de destinatarios no seleccionado',
          description: 'Por favor, selecciona un archivo CSV con los correos.',
          variant: 'destructive',
        });
        return;
      }
      if (!recipientFile.name.toLowerCase().endsWith('.csv')) {
        toast({
          title: 'Archivo no válido',
          description: 'Por favor, selecciona un archivo con extensión .csv',
          variant: 'destructive',
        });
        return;
      }
      fileContent = await recipientFile.text();
    } else { // 'query'
      if (!recipientQuery.trim()) {
        toast({
          title: 'Consulta de destinatarios vacía',
          description: 'Por favor, escribe una consulta SQL para obtener los correos.',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsSending(true);
    try {
      await sendCampaign({
        subject: subject,
        htmlBody: previewContent,
        recipientSource: recipientSource,
        fileContent: fileContent,
        query: recipientSource === 'query' ? recipientQuery : undefined,
      });

      toast({
        title: "Campaña enviada",
        description: "La campaña de correo ha sido enviada a los destinatarios.",
      });
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

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Crear Nueva Campaña</CardTitle>
            <CardDescription>
              Define el contenido, los destinatarios y envía tu campaña.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Asunto del Correo</Label>
              <Input 
                id="subject" 
                placeholder="Ej: Novedades de este mes"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="mb-2 block">Cuerpo del Mensaje (soporta HTML)</Label>
              <Textarea 
                placeholder="Escribe el cuerpo del correo aquí..." 
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={10}
              />
            </div>

            <div className="space-y-2">
              <Label>Destinatarios</Label>
              <RadioGroup value={recipientSource} onValueChange={(value) => setRecipientSource(value as 'file' | 'query')} className="flex gap-4 mb-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="r1" />
                  <Label htmlFor="r1">Subir Archivo CSV</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="query" id="r2" />
                  <Label htmlFor="r2">Desde Base de Datos (SQL)</Label>
                </div>
              </RadioGroup>

              {recipientSource === 'file' && (
                <Input 
                  type="file" 
                  accept=".csv" 
                  onChange={(e) => setRecipientFile(e.target.files ? e.target.files[0] : null)}
                />
              )}

              {recipientSource === 'query' && (
                <Textarea 
                  placeholder="Escribe tu consulta SQL aquí..." 
                  value={recipientQuery}
                  onChange={(e) => setRecipientQuery(e.target.value)}
                  rows={4}
                  className="font-mono"
                />
              )}
            </div>

             <div>
              <Label className="mb-2 block">Fecha de envío (Opcional)</Label>
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
          </CardContent>
          <CardFooter>
            <Button onClick={handleSendCampaign} disabled={isSending}>
              {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSending ? "Enviando..." : "Enviar Campaña"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Vista Previa del Correo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[9/12] w-full bg-muted rounded-lg overflow-hidden border">
              <iframe
                srcDoc={previewContent}
                title="Email Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            </div>
          </CardContent>
        </Card>
      </div>

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
