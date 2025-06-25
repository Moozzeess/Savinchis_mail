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
import {
  Calendar as CalendarIcon,
  Loader2,
  PlusCircle,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Info,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { campaigns } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { sendCampaign } from "@/app/actions/send-campaign-action";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

type RecipientSource = "date" | "file" | "sql";

interface CampaignStats {
  sentCount: number;
  failedCount: number;
  totalRecipients: number;
  duration: number;
}

/**
 * Página de Gestión de Envíos.
 * Permite a los usuarios crear, programar y enviar nuevas campañas de correo,
 * ver el historial de campañas enviadas y gestionar su estado.
 */
export default function CampaignsPage() {
  const [date, setDate] = useState<Date>();
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const [recipientSource, setRecipientSource] = useState<RecipientSource>("date");
  const [fileContent, setFileContent] = useState("");
  const [uploadedFileType, setUploadedFileType] = useState<"csv" | "excel" | null>(null);
  const [sqlQuery, setSqlQuery] = useState("SELECT email FROM contacts WHERE subscribed = TRUE;");
  const [lastRunStats, setLastRunStats] = useState<CampaignStats | null>(null);
  
  // Sending parameters state
  const [batchSize, setBatchSize] = useState(50);
  const [emailDelay, setEmailDelay] = useState(100); // ms
  const [batchDelay, setBatchDelay] = useState(5); // seconds

  const [recipientCount, setRecipientCount] = useState(0);

  useEffect(() => {
    setPreviewContent(emailBody);
  }, [emailBody]);
  
  const estimatedTime = useMemo(() => {
    if (recipientCount === 0 || batchSize <= 0) return "0s";

    const totalEmailDelaySeconds = (recipientCount * emailDelay) / 1000;
    const numberOfBatches = Math.ceil(recipientCount / batchSize);
    const totalBatchDelaySeconds = (numberOfBatches > 1) ? (numberOfBatches - 1) * batchDelay : 0;
    
    const totalSeconds = totalEmailDelaySeconds + totalBatchDelaySeconds;

    if (totalSeconds < 60) return `${totalSeconds.toFixed(2)}s`;
    
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

      const resetState = () => {
        e.target.value = '';
        setFileContent("");
        setUploadedFileType(null);
        setRecipientCount(0);
      }

      if (fileName.endsWith(".csv")) {
        setUploadedFileType("csv");
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setFileContent(content);
          try {
            const records = parse(content, { columns: true, skip_empty_lines: true });
            setRecipientCount(records.length);
          } catch {
            setRecipientCount(0);
          }
        };
        reader.readAsText(file);
      } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
        setUploadedFileType("excel");
        reader.onload = (event) => {
          const buffer = event.target?.result as ArrayBuffer;
          const bytes = new Uint8Array(buffer);
          let binary = "";
          bytes.forEach((byte) => {
            binary += String.fromCharCode(byte);
          });
          const base64 = window.btoa(binary);
          setFileContent(base64);
          try {
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
            setRecipientCount(jsonData.length);
          } catch {
            setRecipientCount(0);
          }
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

  const handleHtmlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".html")) {
        toast({
          title: "Archivo no válido",
          description: "Por favor, selecciona un archivo .html.",
          variant: "destructive",
        });
        e.target.value = ""; // Reset file input
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setEmailBody(event.target?.result as string);
        toast({
          title: "HTML Cargado",
          description: "El contenido del archivo HTML se ha cargado en el editor.",
        });
      };
      reader.onerror = () => {
        toast({
          title: "Error al leer el archivo",
          description: "No se pudo procesar el archivo seleccionado.",
          variant: "destructive",
        });
      };
      reader.readAsText(file);
    }
  };

  const handleSendCampaign = async () => {
    setLastRunStats(null);
    if (!subject.trim() || !previewContent.trim()) {
      toast({ title: "Asunto y Cuerpo requeridos", variant: "destructive" });
      return;
    }

    let recipientData;

    switch (recipientSource) {
      case "date":
        if (!date) {
          toast({ title: "Fecha requerida", variant: "destructive" });
          return;
        }
        recipientData = { type: "date" as const, value: format(date, "dd/MM/yyyy") };
        break;
      case "file":
        if (!fileContent || !uploadedFileType) {
          toast({ title: "Archivo requerido", variant: "destructive" });
          return;
        }
        recipientData = { type: uploadedFileType, value: fileContent };
        break;
      case "sql":
        if (!sqlQuery.trim()) {
          toast({ title: "Consulta SQL requerida", variant: "destructive" });
          return;
        }
        recipientData = { type: "sql" as const, value: sqlQuery };
        break;
      default:
        toast({ title: "Fuente de destinatarios no válida", variant: "destructive" });
        return;
    }

    setIsSending(true);
    try {
      const result = await sendCampaign({
        subject: subject,
        htmlBody: previewContent,
        recipientData: recipientData,
        batchSize: batchSize,
        emailDelay: emailDelay,
        batchDelay: batchDelay,
      });

      toast({ title: "Proceso de envío finalizado", description: result.message });
      if (result.stats) setLastRunStats(result.stats);

    } catch (error) {
      toast({ title: "Error al enviar", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Gestor de Envíos</h1>
          <p className="text-muted-foreground">
            Crea y controla tus envíos de correo electrónico masivo.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Envío</CardTitle>
            <CardDescription>
              Define el contenido, los destinatarios y los límites de tu envío.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subject and Body */}
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
              </div>
            </div>

            {/* Recipients */}
            <div className="space-y-2">
              <Label>Fuente de Destinatarios</Label>
              <Tabs value={recipientSource} onValueChange={(value) => setRecipientSource(value as RecipientSource)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="date">Fecha de Visita</TabsTrigger>
                  <TabsTrigger value="file">Subir Archivo</TabsTrigger>
                  <TabsTrigger value="sql">Consulta SQL</TabsTrigger>
                </TabsList>
                <TabsContent value="date" className="mt-4 border-t pt-4">
                  <Label className="mb-2 block">Selecciona la fecha de visita</Label>
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
                  <p className="text-sm text-muted-foreground mt-2">La estimación de tiempo no está disponible para esta opción.</p>
                </TabsContent>
                <TabsContent value="file" className="mt-4 space-y-2 border-t pt-4">
                  <Label htmlFor="file-upload">Sube un archivo CSV o Excel</Label>
                  <Input id="file-upload" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileChange} />
                  <p className="text-sm text-muted-foreground">El archivo debe contener una columna "email".</p>
                </TabsContent>
                <TabsContent value="sql" className="mt-4 space-y-2 border-t pt-4">
                  <Label htmlFor="sql-query">Escribe tu consulta SQL</Label>
                  <Textarea id="sql-query" value={sqlQuery} onChange={(e) => setSqlQuery(e.target.value)} rows={4} placeholder="SELECT email FROM users;" />
                  <p className="text-sm text-muted-foreground">La consulta debe devolver una columna "email". La estimación de tiempo no está disponible para esta opción.</p>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sending Controls */}
            <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-md font-semibold">Control de Envíos</h3>
                 <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="batch-size">Correos por Lote</Label>
                        <Input id="batch-size" type="number" value={batchSize} onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 1))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email-delay">Retraso (ms) / correo</Label>
                        <Input id="email-delay" type="number" value={emailDelay} onChange={(e) => setEmailDelay(Math.max(0, parseInt(e.target.value) || 0))} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="batch-delay">Retraso (s) / lote</Label>
                        <Input id="batch-delay" type="number" value={batchDelay} onChange={(e) => setBatchDelay(Math.max(0, parseInt(e.target.value) || 0))} />
                    </div>
                </div>
                <div className="flex items-start space-x-3 rounded-md bg-muted/50 p-3 text-sm">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-muted-foreground">Total de destinatarios detectados: <span className="font-bold text-foreground">{recipientCount}</span></p>
                        <p className="text-muted-foreground">Tiempo de envío estimado: <span className="font-bold text-foreground">{estimatedTime}</span></p>
                    </div>
                </div>
            </div>

          </CardContent>
          <CardFooter>
            <Button onClick={handleSendCampaign} disabled={isSending}>
              {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSending ? "Enviando..." : "Iniciar Envío"}
            </Button>
          </CardFooter>
        </Card>

        <div className="sticky top-24 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa del Correo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[9/12] w-full bg-muted rounded-lg overflow-hidden border">
                <iframe srcDoc={previewContent} title="Email Preview" className="w-full h-full border-0" sandbox="allow-scripts" />
              </div>
            </CardContent>
          </Card>

          {lastRunStats && (
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Último Envío</CardTitle>
                <CardDescription>Estadísticas del envío que acaba de finalizar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between"><span className="text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Total Destinatarios</span><span className="font-bold">{lastRunStats.totalRecipients}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Enviados</span><span className="font-bold">{lastRunStats.sentCount}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Fallidos</span><span className="font-bold">{lastRunStats.failedCount}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Duración Real</span><span className="font-bold">{lastRunStats.duration.toFixed(2)}s</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Velocidad Media</span><span className="font-bold">{lastRunStats.duration > 0 ? (lastRunStats.sentCount / lastRunStats.duration).toFixed(2) : "N/A"} correos/s</span></div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Envíos</CardTitle>
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
                    <Badge variant={campaign.status === "AGOTADA" ? "destructive" : campaign.status === "EXPIRADA" ? "outline" : "default"} className={cn({"bg-green-500/20 text-green-700 border-transparent hover:bg-green-500/30": campaign.status === "TERMINADA", "bg-blue-500/20 text-blue-700 border-transparent hover:bg-blue-500/30": campaign.status === "INICIADA", "bg-yellow-500/20 text-yellow-700 border-transparent hover:bg-yellow-500/30": campaign.status === "TIEMPO LIMITADO"})}>{campaign.status}</Badge>
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
