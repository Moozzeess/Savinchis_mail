
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
  Laptop,
  Smartphone,
  Search,
  List,
  Zap,
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
import { events, surveys, certificateTemplates, managedSenders } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { sendCampaign } from "@/actions/send-campaign-action";
import { sendTestEmailAction } from "@/actions/send-test-email-action";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import { useAuth } from "@/context/auth-context";
import { ROLES } from "@/lib/permissions";
import { getTemplatesAction, type Template } from "@/actions/template-actions";
import { generateHtmlFromBlocks } from "@/lib/template-utils";

type RecipientSource = "date" | "file" | "sql" | "individual";
type ContentType = "template" | "event" | "survey" | "custom" | "certificate";

interface CampaignStats {
  sentCount: number;
  failedCount: number;
  totalRecipients: number;
  duration: number;
}

const defaultInitialBody = `<div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; background-color: #ffffff; margin: 0; padding: 0;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" border="0" cellpadding="0" cellspacing="0" class="content-table" style="width: 100%; max-width: 600px; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td>
              <img src="https://placehold.co/600x95.png" alt="Header Banner" style="width: 100%; height: auto; display: block;" data-ai-hint="papalote museum header" />
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 30px 20px;">
              <p style="margin: 0 0 16px 0;"><strong>Maestra, Maestro:</strong></p>
              <p style="margin: 0 0 16px 0;">Nos alegra mucho que hayas utilizado nuestra página para planear tu visita a Papalote Museo del Niño.</p>
              <p style="margin: 0 0 16px 0;">En este correo encontrarás adjuntos:</p>
              <ul style="margin: 0 0 16px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Formato Proyecto de visita (prellenado)</li>
                <li style="margin-bottom: 8px;">Formatos administrativos</li>
              </ul>
              <p style="margin: 0 0 16px 0;">Esperamos que estas herramientas te ayuden a detonar proyectos increíbles y faciliten la visita con tu grupo escolar.</p>
              
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="top" style="padding-right: 20px; width: 60%;">
                    <p style="margin: 0 0 16px 0;"><strong>Si requieres más información:</strong></p>
                    <p style="margin: 0 0 8px 0;">Llámanos a: 5552371710 - 5546017873</p>
                    <p style="margin: 0 0 16px 0;">O escríbenos un whatsApp.</p>
                    <p style="margin: 0 0 16px 0;">
                      <img src="https://placehold.co/40x40.png" alt="WhatsApp" width="30" height="30" style="vertical-align: middle;" data-ai-hint="whatsapp logo" />
                    </p>
                    <p style="margin: 0;"><strong>¡Nos vemos muy pronto!</strong></p>
                  </td>
                  <td width="40%" valign="top" align="center">
                    <img src="https://placehold.co/200x150.png" alt="¡No olvides descargar la guía educativa! Da clic aquí" style="max-width: 100%; height: auto; display: block;" data-ai-hint="educational guide monster" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td>
              <img src="https://placehold.co/600x50.png" alt="Footer Banner" style="width: 100%; height: auto; display: block;" data-ai-hint="papalote museum footer" />
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`;

/**
 * Página de Nuevo Correo.
 * Permite a los usuarios componer un nuevo envío de correo, seleccionar plantillas,
 * definir destinatarios y configurar los parámetros de envío.
 */
export default function SendPage() {
  const [date, setDate] = useState<Date>();
  const [isSending, setIsSending] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const { toast } = useToast();
  const { role } = useAuth();
  const isIT = role === ROLES.IT;
  
  const [senderEmail, setSenderEmail] = useState("");
  const [testEmail, setTestEmail] = useState("");

  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [recipientSource, setRecipientSource] = useState<RecipientSource>("file");
  const [fileContent, setFileContent] = useState("");
  const [uploadedFileType, setUploadedFileType] = useState<"csv" | "excel" | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState("SELECT email, nombre FROM contactos WHERE suscrito = TRUE;");
  const [individualEmails, setIndividualEmails] = useState("");
  const [lastRunStats, setLastRunStats] = useState<CampaignStats | null>(null);
  
  const [recipientCount, setRecipientCount] = useState(0);
  const [recipientSummary, setRecipientSummary] = useState("Ninguna fuente seleccionada");

  // State for recipient dialog
  const [isRecipientDialogOpen, setIsRecipientDialogOpen] = useState(false);

  // templates state
  const [templates, setTemplates] = useState<Template[]>([]);

  // Content type selection
  const [contentType, setContentType] = useState<ContentType>("template");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>("");
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (role) {
      const userEmail = isIT ? managedSenders[0].email : `${role}@email.com`;
      setSenderEmail(userEmail);
      setTestEmail(userEmail);
    }
    
    const fetchTemplates = async () => {
      const dbTemplates = await getTemplatesAction();
      setTemplates(dbTemplates);
    };
    fetchTemplates();
  }, [role, isIT]);

  useEffect(() => {
    setAttachmentName(null);
    setCertificatePreview(null);
    
    if (contentType === 'custom') {
        setSubject("Asunto Personalizado");
        setEmailBody(defaultInitialBody);
    } else if (contentType === "template") {
        if (templates.length > 0) {
            // Default to first template if none is selected
            const currentTemplateId = selectedTemplateId || String(templates[0].id_plantilla);
            if (!selectedTemplateId) {
                setSelectedTemplateId(currentTemplateId);
            }
            
            const template = templates.find(t => String(t.id_plantilla) === currentTemplateId);
            if (template) {
                setSubject(template.asunto_predeterminado || '');
                if (template.contenido) {
                  let blocks = [];
                  try {
                    const parsedContent = typeof template.contenido === 'string' 
                      ? JSON.parse(template.contenido) 
                      : template.contenido;
                    
                    if (Array.isArray(parsedContent)) {
                      blocks = parsedContent;
                    }
                  } catch (error) {
                    console.error('Error al parsear el contenido de la plantilla:', error);
                    // Si falla el parseo, blocks se mantendrá como un array vacío.
                  }
                  setEmailBody(generateHtmlFromBlocks(blocks));
                }
            }
        } else {
            // No templates loaded yet or available
            setSubject("");
            setEmailBody("");
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
      const template = certificateTemplates[selectedEventId as keyof typeof certificateTemplates];
      if (event && template) {
          setSubject(`Tu certificado del evento: ${event.name}`);
          setEmailBody(`<h1>¡Felicidades! Aquí está tu certificado</h1><p>Hola {{contact.name}},</p><p>Gracias por tu participación en el evento "${event.name}" el {{event.date}}. Adjuntamos tu certificado de asistencia.</p><p>¡Esperamos verte de nuevo!</p>`);
          setAttachmentName(`certificado-${event.name.replace(/\s/g, '_')}.pdf`);
          setCertificatePreview(`data:image/png;base64,${template}`);
      }
    } else {
        setSubject("");
        setEmailBody("");
    }
  }, [contentType, selectedTemplateId, selectedEventId, selectedSurveyId, templates]);

  useEffect(() => {
    let count = 0;
    switch (recipientSource) {
      case 'file': count = recipientCount; break;
      case 'individual': count = individualEmails.split(/[\s,;]+/).filter(e => e && e.includes('@')).length; break;
      // SQL and Date count would ideally come from a backend query preview
    }
    setRecipientCount(count);
  }, [recipientSource, recipientCount, individualEmails]);

  const estimatedTime = useMemo(() => {
    const batchSize = 50;
    const emailDelay = 100;
    const batchDelay = 5;

    if (recipientCount === 0 || batchSize <= 0) return "0s";
    const totalEmailDelaySeconds = (recipientCount * emailDelay) / 1000;
    const numberOfBatches = Math.ceil(recipientCount / batchSize);
    const totalBatchDelaySeconds = (numberOfBatches > 1) ? (numberOfBatches - 1) * batchDelay : 0;
    const totalSeconds = totalEmailDelaySeconds + totalBatchDelaySeconds;

    if (totalSeconds < 60) return `${totalSeconds.toFixed(1)}s`;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }, [recipientCount]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      const fileName = file.name.toLowerCase();
      setRecipientCount(0);
      setUploadedFileName(file.name);
      const resetState = () => { e.target.value = ''; setFileContent(""); setUploadedFileType(null); setRecipientCount(0); setUploadedFileName(null); };

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
    if (!testEmail.trim() || !senderEmail.trim() || !subject.trim() || !emailBody.trim()) {
      toast({ title: "Faltan datos", description: "Asegúrate de que el remitente, asunto, cuerpo y correo de prueba estén completos.", variant: "destructive" });
      return;
    }
    if (!role) {
      toast({ title: "Error de autenticación", description: "No se pudo verificar el rol del usuario.", variant: "destructive" });
      return;
    }

    setIsSendingTest(true);
    try {
      let attachment;
      if (contentType === 'certificate' && selectedEventId) {
          const template = certificateTemplates[selectedEventId as keyof typeof certificateTemplates];
          const event = events.find(e => e.id === selectedEventId);
          if (template && event) {
              const pdf = new jsPDF('l', 'px', [1100, 850]);
              const dataUrl = `data:image/png;base64,${template}`;
              pdf.addImage(dataUrl, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
              pdf.text(`Otorgado a: Usuario de Prueba`, 550, 450, { align: 'center' });
              const pdfBase64 = pdf.output('datauristring').split(',')[1];
              attachment = {
                  content: pdfBase64,
                  filename: `certificado-${event.name.replace(/ /g, '_')}.pdf`,
                  contentType: 'application/pdf'
              }
          }
      }

      await sendTestEmailAction({
        subject,
        htmlBody: emailBody,
        recipientEmail: testEmail,
        senderEmail,
        attachment,
        eventId: selectedEventId,
        role,
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
    if (!subject.trim() || !senderEmail.trim() || !emailBody.trim()) {
      toast({ title: "Remitente, Asunto y Cuerpo requeridos", variant: "destructive" });
      return;
    }
    if (!role) {
      toast({ title: "Error de autenticación", description: "No se pudo verificar el rol del usuario.", variant: "destructive" });
      return;
    }
    let recipientData;
    switch (recipientSource) {
      case "date": 
        if (!date) { toast({ title: "Fecha requerida", variant: "destructive" }); return; }
        recipientData = { type: "date" as const, value: format(date, "yyyy-MM-dd") }; 
        break;
      case "file": 
        if (!uploadedFileType || !fileContent) { toast({ title: "Archivo requerido", variant: "destructive" }); return; }
        recipientData = { type: uploadedFileType, value: fileContent }; 
        break;
      case "sql": 
        if (!sqlQuery.trim()) { toast({ title: "Consulta SQL requerida", variant: "destructive" }); return; }
        recipientData = { type: "sql" as const, value: sqlQuery }; 
        break;
      case "individual":
        if (!individualEmails.trim()) { toast({ title: "Correos requeridos", variant: "destructive" }); return; }
        recipientData = { type: "individual" as const, value: individualEmails };
        break;
      default:
        toast({ title: "Fuente de destinatarios no válida", variant: "destructive" });
        return;
    }

    let attachment;
    if (contentType === 'certificate' && selectedEventId) {
        const template = certificateTemplates[selectedEventId as keyof typeof certificateTemplates];
        const event = events.find(e => e.id === selectedEventId);
        if (template && event) {
            const pdf = new jsPDF('l', 'px', [1100, 850]);
            const dataUrl = `data:image/png;base64,${template}`;
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
            const pdfBase64 = pdf.output('datauristring').split(',')[1];
            attachment = { content: pdfBase64, filename: `certificado-${event.name.replace(/ /g, '_')}.pdf`, contentType: 'application/pdf' }
        } else {
            toast({ title: "Plantilla no encontrada", variant: "destructive" }); return;
        }
    }

    setIsSending(true);
    try {
      const result = await sendCampaign({ subject, htmlBody: emailBody, recipientData, senderEmail, attachment, eventId: selectedEventId, role });
      toast({ title: "Proceso de envío finalizado", description: result.message });
      if (result.stats) setLastRunStats(result.stats);
    } catch (error) {
      toast({ title: "Error al enviar", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveRecipients = () => {
    let summary = "Ninguna fuente seleccionada";
    switch (recipientSource) {
      case "file":
        if (recipientCount > 0 && uploadedFileName) {
          summary = `Archivo: "${uploadedFileName}" (${recipientCount} destinatarios).`;
        }
        break;
      case "date":
        if (date) {
          summary = `Fecha de Visita (BD): ${format(date, "PPP", { locale: es })}`;
        }
        break;
      case "sql":
        summary = "Consulta SQL personalizada.";
        break;
      case "individual":
        const count = individualEmails.split(/[\s,;]+/).filter(e => e && e.includes('@')).length;
        if (count > 0) {
          summary = `Contactos Individuales: ${count} destinatarios.`;
        }
        break;
    }
    setRecipientSummary(summary);
    setIsRecipientDialogOpen(false);
  };

  const renderContentSelector = () => {
    switch (contentType) {
        case 'template':
            return <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}><SelectTrigger><SelectValue placeholder="Elige una plantilla..." /></SelectTrigger><SelectContent>{templates.map(t => <SelectItem key={t.id_plantilla} value={String(t.id_plantilla)}>{t.nombre}</SelectItem>)}</SelectContent></Select>;
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
  
  const renderSenderInput = () => {
    if (isIT) {
        return (
            <div className="space-y-2">
                <Label htmlFor="sender-email">Email del Remitente</Label>
                <Select value={senderEmail} onValueChange={setSenderEmail}>
                    <SelectTrigger id="sender-email"><SelectValue placeholder="Selecciona un remitente..." /></SelectTrigger>
                    <SelectContent>{managedSenders.map(sender => <SelectItem key={sender.email} value={sender.email}>{sender.name} ({sender.email})</SelectItem>)}</SelectContent>
                </Select>
            </div>
        )
    }
    return (
        <div className="space-y-2">
            <Label htmlFor="sender-email">Email del Remitente</Label>
            <Input id="sender-email" type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />
        </div>
    )
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
        <div className="space-y-6">
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
                              <SelectItem value="template">Usar Plantilla</SelectItem>
                              <SelectItem value="event">Invitación a Evento</SelectItem>
                              <SelectItem value="survey">Enviar Encuesta</SelectItem>
                              <SelectItem value="certificate">Certificado de Evento</SelectItem>
                              <SelectItem value="custom">Personalizado (HTML)</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  {contentType !== 'custom' && <div className="space-y-2">{renderContentSelector()}</div>}
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                    {renderSenderInput()}
                    <div className="space-y-2">
                        <Label htmlFor="subject">Asunto del Correo</Label>
                        <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                    </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Cuerpo del Mensaje</Label>
                    <div className={cn("flex items-center gap-2", contentType !== 'custom' && 'hidden')}>
                      <Label htmlFor="html-upload" className="text-sm font-normal text-primary underline-offset-4 hover:underline cursor-pointer">O sube HTML</Label>
                      <Input id="html-upload" type="file" accept=".html" className="hidden" onChange={handleHtmlFileChange} />
                    </div>
                  </div>
                  <Textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={10} disabled={contentType !== 'custom'} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Destinatarios</CardTitle>
                <CardDescription>{recipientSummary}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" onClick={() => setIsRecipientDialogOpen(true)}>
                    Seleccionar Fuente de Destinatarios
                </Button>
            </CardContent>
          </Card>

          <Dialog open={isRecipientDialogOpen} onOpenChange={setIsRecipientDialogOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Destinatarios</DialogTitle>
                <DialogDescription>
                  Elige las personas que recibirán tu campaña.
                </DialogDescription>
              </DialogHeader>
              <div className="p-1">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Buscar listas o segmentos..." className="pl-9" />
                  </div>
                  <Tabs defaultValue="lists" className="mt-4">
                      <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="lists"><List className="mr-2 h-4 w-4" />Listas</TabsTrigger>
                          <TabsTrigger value="segments" disabled={!isIT}><Zap className="mr-2 h-4 w-4" />Segmentos</TabsTrigger>
                          <TabsTrigger value="individuals"><Users className="mr-2 h-4 w-4" />Individuales</TabsTrigger>
                      </TabsList>
                      <TabsContent value="lists" className="mt-4">
                          <Accordion type="single" collapsible className="w-full" onValueChange={(v) => setRecipientSource(v as RecipientSource)}>
                              <AccordionItem value="file">
                                  <AccordionTrigger>Subir Archivo (CSV/Excel)</AccordionTrigger>
                                  <AccordionContent className="pt-4 space-y-2">
                                      <Label htmlFor="file-upload">Sube un archivo de contactos</Label>
                                      <Input id="file-upload" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileChange} />
                                      <p className="text-sm text-muted-foreground">El archivo debe contener una columna "email".</p>
                                  </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="date">
                                  <AccordionTrigger>Contactos por Fecha (BD)</AccordionTrigger>
                                  <AccordionContent className="pt-4 space-y-2">
                                    <Label>Selecciona una fecha de visita</Label>
                                    <Popover><PopoverTrigger asChild><Button variant={"outline"} className="w-[280px] justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{date ? format(date, "PPP", { locale: es }) : <span>Elige una fecha</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} /></PopoverContent></Popover>
                                  </AccordionContent>
                              </AccordionItem>
                          </Accordion>
                      </TabsContent>
                      <TabsContent value="segments" className="mt-4 space-y-2">
                        <Label htmlFor="sql-query">Escribe tu consulta SQL</Label>
                        <Textarea id="sql-query" value={sqlQuery} onChange={(e) => { setSqlQuery(e.target.value); setRecipientSource('sql'); }} rows={6} />
                        <p className="text-sm text-muted-foreground">La consulta debe devolver una columna "email".</p>
                      </TabsContent>
                      <TabsContent value="individuals" className="mt-4 space-y-2">
                          <Label htmlFor="individual-emails">Pegar Correos</Label>
                          <Textarea id="individual-emails" placeholder="ejemplo1@dominio.com, ejemplo2@dominio.com" rows={6} value={individualEmails} onChange={(e) => { setIndividualEmails(e.target.value); setRecipientSource('individual'); }} />
                          <p className="text-sm text-muted-foreground">Separa los correos con comas, espacios o saltos de línea.</p>
                      </TabsContent>
                  </Tabs>
              </div>
              <DialogFooter className="mt-4">
                  <Button variant="ghost" onClick={() => setIsRecipientDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSaveRecipients}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader>
                <CardTitle>Envío de Prueba</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 items-end">
                  <div className="flex-grow space-y-2">
                    <Label htmlFor="test-email" className="sr-only">Correo de Prueba</Label>
                    <Input id="test-email" type="email" placeholder="tu-correo@ejemplo.com" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
                  </div>
                  <Button onClick={handleSendTestEmail} variant="secondary" disabled={isSendingTest || isSending}>
                    {isSendingTest ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
            </CardContent>
          </Card>
            
          <div className="flex items-start space-x-3 rounded-md bg-muted/50 p-3 text-sm">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                  <p className="text-muted-foreground">Destinatarios detectados: <span className="font-bold text-foreground">{recipientCount}</span></p>
                  <p className="text-muted-foreground">Tiempo estimado: <span className="font-bold text-foreground">{estimatedTime}</span></p>
                  <p className="text-muted-foreground mt-1 text-xs">Los ajustes de velocidad de envío se gestionan en la sección de <span className="font-bold text-foreground">Ajustes</span>.</p>
              </div>
          </div>
          
          <Button onClick={handleSendCampaign} disabled={isSending || isSendingTest} size="lg" className="w-full">
            <MailPlus className="mr-2 h-4 w-4" />
            {isSending ? "Enviando..." : "Iniciar Envío Masivo"}
          </Button>

        </div>

        <div className="sticky top-24 space-y-8">
          <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Vista Previa del Correo</CardTitle>
                        <CardDescription>Así es como los destinatarios verán tu correo.</CardDescription>
                    </div>
                    <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                        <Button variant={previewMode === 'desktop' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setPreviewMode('desktop')} aria-label="Vista de escritorio">
                            <Laptop className="h-4 w-4" />
                        </Button>
                        <Button variant={previewMode === 'mobile' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setPreviewMode('mobile')} aria-label="Vista móvil">
                            <Smartphone className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className={cn(
                    "w-full transition-all duration-300 ease-in-out",
                    previewMode === 'mobile' && 'mx-auto w-[375px]'
                )}>
                    <div className={cn(
                        "rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden",
                        previewMode === 'mobile' && 'border-8 border-black rounded-[40px] shadow-lg'
                    )}>
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>AP</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{senderEmail || 'remitente@ejemplo.com'}</p>
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
                            <iframe
                                srcDoc={emailBody}
                                title="Email Preview"
                                className={cn(
                                    "w-full h-[600px] border-0",
                                    previewMode === 'mobile' && 'rounded-[32px]'
                                )}
                                sandbox="allow-scripts"
                            />
                            {certificatePreview && (
                                <div className="p-4 bg-gray-100">
                                    <h3 className="text-lg font-semibold mb-2">Vista Previa del Certificado</h3>
                                    <img src={certificatePreview} alt="Vista previa del certificado" className="max-w-full border rounded-md" />
                                </div>
                            )}
                        </div>

                        {/* Footer actions */}
                        <div className="p-2 border-t flex items-center gap-2 bg-muted/30">
                            <Button variant="outline"><Reply className="mr-2"/> Responder</Button>
                            <Button variant="outline"><Forward className="mr-2"/> Reenviar</Button>
                        </div>
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
