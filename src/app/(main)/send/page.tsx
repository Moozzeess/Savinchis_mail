
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Loader2,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Info,
  MailPlus,
  Send,
  Paperclip,
  Reply,
  ReplyAll,
  Forward,
  MoreHorizontal,
  File,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { templates, events, surveys, certificateTemplates } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { sendCampaign } from "@/app/actions/send-campaign-action";
import { sendTestEmailAction } from "@/app/actions/send-test-email-action";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

type RecipientSource = "date" | "file" | "sql";
type ContentType = "template" | "event" | "survey" | "custom" | "certificate";

interface CampaignStats {
  sentCount: number;
  failedCount: number;
  totalRecipients: number;
  duration: number;
}

/**
 * Página de Nuevo Correo.
 * Permite a los usuarios componer un nuevo envío de correo, seleccionar plantillas,
 * definir destinatarios y configurar los parámetros de envío.
 */
export default function SendPage() {
  const [date, setDate] = useState<Date>();
  const [isSending, setIsSending] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testEmail, setTestEmail] = useState("usuario@email.com");
  const { toast } = useToast();

  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [recipientSource, setRecipientSource] = useState<RecipientSource>("file");
  const [fileContent, setFileContent] = useState("");
  const [uploadedFileType, setUploadedFileType] = useState<"csv" | "excel" | null>(null);
  const [sqlQuery, setSqlQuery] = useState("SELECT email, name FROM contacts WHERE subscribed = TRUE;");
  const [lastRunStats, setLastRunStats] = useState<CampaignStats | null>(null);
  
  const [batchSize, setBatchSize] = useState(50);
  const [emailDelay, setEmailDelay] = useState(100);
  const [batchDelay, setBatchDelay] = useState(5);

  const [recipientCount, setRecipientCount] = useState(0);

  // Content type selection
  const [contentType, setContentType] = useState<ContentType>("custom");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>("");
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);

  useEffect(() => {
    setAttachmentName(null);
    setCertificatePreview(null);
    if (contentType === "template" && selectedTemplateId) {
        const template = templates.find(t => t.id === selectedTemplateId);
        if (template) {
            setSubject(`Desde plantilla: ${template.name}`);
            setEmailBody(`<h1>${template.name}</h1><p>${template.description}</p><p>Este es un cuerpo de correo basado en una plantilla.</p>`);
        }
    } else if (contentType === "event" && selectedEventId) {
        const event = events.find(e => e.id === selectedEventId);
        if(event) {
            setSubject(`Invitación al evento: ${event.name}`);
            setEmailBody(`<h1>Invitación a ${event.name}</h1><p>Estás invitado a nuestro próximo evento el ${event.date}. ¡No te lo pierdas!</p>`);
        }
    } else if (contentType === "survey" && selectedSurveyId) {
        const survey = surveys.find(s => s.id === selectedSurveyId);
        if (survey) {
            setSubject(`Participa en nuestra encuesta: ${survey.name}`);
            setEmailBody(`<h1>${survey.name}</h1><p>Tu opinión es importante. <a href="#">Haz clic aquí para participar</a>.</p>`);
        }
    } else if (contentType === "certificate" && selectedEventId) {
      const event = events.find(e => e.id === selectedEventId);
      if (event) {
          setSubject(`Tu certificado del evento: ${event.name}`);
          setEmailBody(`<h1>¡Felicidades! Aquí está tu certificado</h1><p>Hola {{contact.name}},</p><p>Gracias por tu participación en el evento "${event.name}" el {{event.date}}. Adjuntamos tu certificado de asistencia.</p><p>¡Esperamos verte de nuevo!</p>`);
          setAttachmentName(`certificado-${event.name.replace(/\s/g, '_')}.png`);
          const template = certificateTemplates[selectedEventId as keyof typeof certificateTemplates];
          if (template) {
            setCertificatePreview(`data:image/png;base64,${template}`);
          }
      }
    }
  }, [contentType, selectedTemplateId, selectedEventId, selectedSurveyId]);

  const estimatedTime = useMemo(() => {
    if (recipientCount === 0 || batchSize <= 0) return "0s";
    const totalEmailDelaySeconds = (recipientCount * emailDelay) / 1000;
    const numberOfBatches = Math.ceil(recipientCount / batchSize);
    const totalBatchDelaySeconds = (numberOfBatches > 1) ? (numberOfBatches - 1) * batchDelay : 0;
    const totalSeconds = totalEmailDelaySeconds + totalBatchDelaySeconds;

    if (totalSeconds < 60) return `${totalSeconds.toFixed(1)}s`;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }, [recipientCount, batchSize, emailDelay, batchDelay]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      const fileName = file.name.toLowerCase();
      setRecipientCount(0);
      const resetState = () => { e.target.value = ''; setFileContent(""); setUploadedFileType(null); setRecipientCount(0); };

      if (fileName.endsWith(".csv")) {
        setUploadedFileType("csv");
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setFileContent(content);
          try { setRecipientCount(parse(content, { columns: true, skip_empty_lines: true }).length); } catch { setRecipientCount(0); }
        };
        reader.readAsText(file);
      } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
        setUploadedFileType("excel");
        reader.onload = (event) => {
          const buffer = event.target?.result as ArrayBuffer;
          const base64 = Buffer.from(buffer).toString('base64');
          setFileContent(base64);
          try {
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const jsonData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            setRecipientCount(jsonData.length);
          } catch { setRecipientCount(0); }
        };
        reader.readAsArrayBuffer(file);
      } else {
        toast({ title: "Archivo no válido", description: "Por favor, selecciona un archivo .csv, .xls o .xlsx.", variant: "destructive" });
        resetState();
      }
    }
  };
  
  const handleHtmlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".html")) {
      const reader = new FileReader();
      reader.onload = (event) => { setEmailBody(event.target?.result as string); toast({ title: "HTML Cargado" }); };
      reader.readAsText(file);
      setContentType("custom");
    } else {
      toast({ title: "Archivo no válido", description: "Por favor, selecciona un archivo .html.", variant: "destructive" });
    }
    e.target.value = "";
  };

  const handleSendTestEmail = async () => {
    if (!testEmail.trim() || !subject.trim() || !emailBody.trim()) {
      toast({ title: "Faltan datos", description: "Asegúrate de que el asunto, el cuerpo y el correo de prueba estén completos.", variant: "destructive" });
      return;
    }

    setIsSendingTest(true);
    try {
      let attachment;
      if (contentType === 'certificate' && selectedEventId) {
          const template = certificateTemplates[selectedEventId as keyof typeof certificateTemplates];
          const event = events.find(e => e.id === selectedEventId);
          if (template && event) {
              attachment = {
                  content: template,
                  filename: `certificado-${event.name.replace(/ /g, '_')}.png`,
                  contentType: 'image/png'
              }
          }
      }

      await sendTestEmailAction({
        subject,
        htmlBody: emailBody,
        recipientEmail: testEmail,
        attachment,
        eventId: selectedEventId,
      });

      toast({ title: "Correo de prueba enviado", description: `Se ha enviado un correo de prueba a ${testEmail}.` });
    } catch (error) {
      toast({ title: "Error al enviar prueba", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSendCampaign = async () => {
    setLastRunStats(null);
    if (!subject.trim() || !emailBody.trim()) {
      toast({ title: "Asunto y Cuerpo requeridos", variant: "destructive" });
      return;
    }
    let recipientData;
    switch (recipientSource) {
      case "date": recipientData = { type: "date" as const, value: format(date!, "dd/MM/yyyy") }; break;
      case "file": recipientData = { type: uploadedFileType!, value: fileContent }; break;
      case "sql": recipientData = { type: "sql" as const, value: sqlQuery }; break;
    }

    let attachment;
    if (contentType === 'certificate' && selectedEventId) {
        const template = certificateTemplates[selectedEventId as keyof typeof certificateTemplates];
        const event = events.find(e => e.id === selectedEventId);
        if (template && event) {
            attachment = {
                content: template,
                filename: `certificado-${event.name.replace(/ /g, '_')}.png`,
                contentType: 'image/png'
            }
        } else {
            toast({ title: "Plantilla no encontrada", description: "No se encontró una plantilla de certificado para este evento.", variant: "destructive" });
            return;
        }
    }

    setIsSending(true);
    try {
      const result = await sendCampaign({ 
        subject, 
        htmlBody: emailBody, 
        recipientData, 
        batchSize, 
        emailDelay, 
        batchDelay,
        attachment,
        eventId: selectedEventId
      });
      toast({ title: "Proceso de envío finalizado", description: result.message });
      if (result.stats) setLastRunStats(result.stats);
    } catch (error) {
      toast({ title: "Error al enviar", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const renderContentSelector = () => {
    switch (contentType) {
        case 'template':
            return <Select onValueChange={setSelectedTemplateId}><SelectTrigger><SelectValue placeholder="Elige una plantilla..." /></SelectTrigger><SelectContent>{templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select>;
        case 'event':
            return <Select onValueChange={setSelectedEventId}><SelectTrigger><SelectValue placeholder="Elige un evento para la invitación..." /></SelectTrigger><SelectContent>{events.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent></Select>;
        case 'survey':
            return <Select onValueChange={setSelectedSurveyId}><SelectTrigger><SelectValue placeholder="Elige una encuesta..." /></SelectTrigger><SelectContent>{surveys.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select>;
        case 'certificate':
            return <Select onValueChange={setSelectedEventId}><SelectTrigger><SelectValue placeholder="Elige un evento para el certificado..." /></SelectTrigger><SelectContent>{events.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent></Select>;
        default:
            return null;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Nuevo Correo</h1>
          <p className="text-muted-foreground">
            Compón y envía un nuevo correo electrónico masivo.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Composición y Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Tipo de Contenido</Label>
                    <Select value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="custom">Personalizado</SelectItem>
                            <SelectItem value="template">Usar Plantilla</SelectItem>
                            <SelectItem value="event">Invitación a Evento</SelectItem>
                            <SelectItem value="survey">Enviar Encuesta</SelectItem>
                            <SelectItem value="certificate">Certificado de Evento</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {contentType !== 'custom' && <div className="space-y-2">{renderContentSelector()}</div>}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Asunto del Correo</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Cuerpo del Mensaje</Label>
                  <Label htmlFor="html-upload" className="text-sm font-normal text-primary underline-offset-4 hover:underline cursor-pointer">O sube un archivo HTML</Label>
                  <Input id="html-upload" type="file" accept=".html" className="hidden" onChange={handleHtmlFileChange} />
                </div>
                <Textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={10} />
                {attachmentName && (
                  <div className="mt-2 flex items-center gap-2 rounded-md border bg-muted/20 p-2 text-sm text-muted-foreground">
                    <Paperclip className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Adjunto: {attachmentName}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Fuente de Destinatarios</Label>
              <Tabs value={recipientSource} onValueChange={(v) => setRecipientSource(v as RecipientSource)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="date">Fecha de Visita</TabsTrigger>
                  <TabsTrigger value="file">Subir Archivo</TabsTrigger>
                  <TabsTrigger value="sql">Consulta SQL</TabsTrigger>
                </TabsList>
                <TabsContent value="date" className="mt-4 border-t pt-4"><Popover><PopoverTrigger asChild><Button variant={"outline"} className="w-[280px] justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{date ? format(date, "PPP", { locale: es }) : <span>Elige una fecha</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} /></PopoverContent></Popover></TabsContent>
                <TabsContent value="file" className="mt-4 space-y-2 border-t pt-4"><Label htmlFor="file-upload">Sube un archivo CSV o Excel</Label><Input id="file-upload" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileChange} /><p className="text-sm text-muted-foreground">El archivo debe contener una columna "email".</p></TabsContent>
                <TabsContent value="sql" className="mt-4 space-y-2 border-t pt-4"><Label htmlFor="sql-query">Escribe tu consulta SQL</Label><Textarea id="sql-query" value={sqlQuery} onChange={(e) => setSqlQuery(e.target.value)} rows={4} /><p className="text-sm text-muted-foreground">La consulta debe devolver una columna "email".</p></TabsContent>
              </Tabs>
            </div>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Send /> Envío de Prueba</CardTitle>
                <CardDescription>
                  Envía una versión de prueba de este correo a una dirección específica antes del envío masivo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 items-end">
                  <div className="flex-grow space-y-2">
                    <Label htmlFor="test-email">Correo de Prueba</Label>
                    <Input id="test-email" type="email" placeholder="tu-correo@ejemplo.com" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
                  </div>
                  <Button onClick={handleSendTestEmail} variant="secondary" disabled={isSendingTest || isSending}>
                    {isSendingTest ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Enviar Prueba
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-md font-semibold">Control de Envíos</h3>
                 <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label htmlFor="batch-size">Correos/Lote</Label><Input id="batch-size" type="number" value={batchSize} onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 1))} /></div>
                    <div className="space-y-2"><Label>Retraso (ms)/correo</Label><Input type="number" value={emailDelay} onChange={(e) => setEmailDelay(Math.max(0, parseInt(e.target.value) || 0))} /></div>
                    <div className="space-y-2"><Label>Retraso (s)/lote</Label><Input type="number" value={batchDelay} onChange={(e) => setBatchDelay(Math.max(0, parseInt(e.target.value) || 0))} /></div>
                </div>
                <div className="flex items-start space-x-3 rounded-md bg-muted/50 p-3 text-sm">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-muted-foreground">Destinatarios detectados: <span className="font-bold text-foreground">{recipientCount}</span></p>
                        <p className="text-muted-foreground">Tiempo estimado: <span className="font-bold text-foreground">{estimatedTime}</span></p>
                    </div>
                </div>
            </div>

          </CardContent>
          <CardFooter>
            <Button onClick={handleSendCampaign} disabled={isSending || isSendingTest} className="w-full">
              <MailPlus className="mr-2 h-4 w-4" />
              {isSending ? "Enviando..." : "Iniciar Envío Masivo"}
            </Button>
          </CardFooter>
        </Card>

        <div className="sticky top-24 space-y-8">
          <Card>
            <CardHeader>
                <CardTitle>Vista Previa del Correo</CardTitle>
                <CardDescription>Así es como los destinatarios verán tu correo.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>AP</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-sm">Tu Nombre (Remitente)</p>
                                <p className="text-xs text-muted-foreground">Para: destinatario@ejemplo.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <span className="text-xs mr-2">Ahora</span>
                            <Button variant="ghost" size="icon" className="size-8"><Reply className="size-4" /></Button>
                            <Button variant="ghost" size="icon" className="size-8"><ReplyAll className="size-4" /></Button>
                            <Button variant="ghost" size="icon" className="size-8"><Forward className="size-4" /></Button>
                            <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
                        </div>
                    </div>

                    {/* Subject and Attachments */}
                    <div className="p-4 border-b space-y-4">
                        <h2 className="text-xl font-bold">{subject || 'Asunto del correo'}</h2>

                        {attachmentName && (
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">1 archivo adjunto</p>
                                <span className="text-sm text-muted-foreground">(~256 KB)</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2 rounded-md border p-2 max-w-xs bg-muted/30">
                                <File className="h-6 w-6 text-primary flex-shrink-0" />
                                <div className="truncate">
                                    <p className="text-sm font-medium truncate">{attachmentName}</p>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>

                    {/* Body */}
                    <div className="bg-white w-full">
                        <iframe srcDoc={emailBody} title="Email Preview" className="w-full h-[600px] border-0" sandbox="allow-scripts" />
                    </div>

                    {/* Footer actions */}
                    <div className="p-2 border-t flex items-center gap-2 bg-muted/30">
                        <Button variant="outline"><Reply className="mr-2"/> Responder</Button>
                        <Button variant="outline"><Forward className="mr-2"/> Reenviar</Button>
                    </div>
                </div>
            </CardContent>
        </Card>

          {lastRunStats && (
            <Card>
              <CardHeader><CardTitle>Resumen del Envío</CardTitle><CardDescription>Estadísticas del envío finalizado.</CardDescription></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between"><span className="text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Total Destinatarios</span><span className="font-bold">{lastRunStats.totalRecipients}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Enviados</span><span className="font-bold">{lastRunStats.sentCount}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Fallidos</span><span className="font-bold">{lastRunStats.failedCount}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Duración</span><span className="font-bold">{lastRunStats.duration.toFixed(2)}s</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Velocidad Media</span><span className="font-bold">{lastRunStats.duration > 0 ? (lastRunStats.sentCount / lastRunStats.duration).toFixed(2) : "N/A"} correos/s</span></div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
