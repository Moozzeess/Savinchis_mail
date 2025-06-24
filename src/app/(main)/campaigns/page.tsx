
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
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { campaigns } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { sendCampaign } from "@/app/actions/send-campaign-action";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RecipientSourceType = "date" | "csv" | "sql";

interface CampaignStats {
  sentCount: number;
  failedCount: number;
  totalRecipients: number;
  duration: number;
}

/**
 * Página de Campañas.
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
  const [recipientSource, setRecipientSource] =
    useState<RecipientSourceType>("date");
  const [csvContent, setCsvContent] = useState("");
  const [sqlQuery, setSqlQuery] = useState(
    "SELECT email FROM contacts WHERE subscribed = TRUE;"
  );
  const [lastRunStats, setLastRunStats] = useState<CampaignStats | null>(null);

  useEffect(() => {
    setPreviewContent(emailBody);
  }, [emailBody]);

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
        toast({
          title: "Archivo no válido",
          description: "Por favor, selecciona un archivo .csv.",
          variant: "destructive",
        });
        e.target.value = ""; // Reset file input
        setCsvContent("");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvContent(event.target?.result as string);
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

  /**
   * Gestiona el envío de una campaña.
   * Valida los campos, prepara el payload y llama a la acción del servidor.
   */
  const handleSendCampaign = async () => {
    setLastRunStats(null);
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
        title: "Cuerpo del correo vacío",
        description: "Por favor, escribe el contenido del correo.",
        variant: "destructive",
      });
      return;
    }

    let recipientData;

    switch (recipientSource) {
      case "date":
        if (!date) {
          toast({
            title: "Fecha de visita requerida",
            description: "Por favor, selecciona una fecha.",
            variant: "destructive",
          });
          return;
        }
        recipientData = {
          type: "date" as const,
          value: format(date, "dd/MM/yyyy"),
        };
        break;
      case "csv":
        if (!csvContent) {
          toast({
            title: "Archivo CSV requerido",
            description: "Por favor, sube un archivo CSV.",
            variant: "destructive",
          });
          return;
        }
        recipientData = { type: "csv" as const, value: csvContent };
        break;
      case "sql":
        if (!sqlQuery.trim()) {
          toast({
            title: "Consulta SQL requerida",
            description: "Por favor, escribe una consulta SQL.",
            variant: "destructive",
          });
          return;
        }
        recipientData = { type: "sql" as const, value: sqlQuery };
        break;
      default:
        toast({
          title: "Fuente de destinatarios no válida",
          variant: "destructive",
        });
        return;
    }

    setIsSending(true);
    try {
      const result = await sendCampaign({
        subject: subject,
        htmlBody: previewContent,
        recipientData: recipientData,
      });

      toast({
        title: "Proceso de envío finalizado",
        description: result.message,
      });
      if (result.stats) {
        setLastRunStats(result.stats);
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

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Crear Nueva Campaña</CardTitle>
            <CardDescription>
              Define el contenido y los destinatarios para enviar tu campaña.
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
              <div className="flex justify-between items-center">
                <Label>Cuerpo del Mensaje</Label>
                <Label htmlFor="html-upload" className="text-sm font-normal text-primary underline-offset-4 hover:underline cursor-pointer">
                  O sube un archivo HTML
                </Label>
                <Input id="html-upload" type="file" accept=".html" className="hidden" onChange={handleHtmlFileChange} />
              </div>
              <Textarea
                placeholder="Escribe o pega tu código HTML aquí..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={10}
              />
            </div>

            <div className="space-y-2">
              <Label>Fuente de Destinatarios</Label>
              <Tabs
                value={recipientSource}
                onValueChange={(value) =>
                  setRecipientSource(value as RecipientSourceType)
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="date">Fecha de Visita</TabsTrigger>
                  <TabsTrigger value="csv">Subir CSV</TabsTrigger>
                  <TabsTrigger value="sql">Consulta SQL</TabsTrigger>
                </TabsList>
                <TabsContent value="date" className="mt-4 border-t pt-4">
                  <Label className="mb-2 block">
                    Selecciona la fecha de visita
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-[280px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "PPP", { locale: es })
                        ) : (
                          <span>Elige una fecha</span>
                        )}
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
                </TabsContent>
                <TabsContent value="csv" className="mt-4 space-y-2 border-t pt-4">
                  <Label htmlFor="csv-file">Sube un archivo CSV</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleCsvFileChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    El archivo debe contener una columna "email".
                  </p>
                </TabsContent>
                <TabsContent value="sql" className="mt-4 space-y-2 border-t pt-4">
                  <Label htmlFor="sql-query">Escribe tu consulta SQL</Label>
                  <Textarea
                    id="sql-query"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    rows={4}
                    placeholder="SELECT email FROM users;"
                  />
                  <p className="text-sm text-muted-foreground">
                    La consulta debe devolver una columna "email".
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSendCampaign} disabled={isSending}>
              {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSending ? "Enviando..." : "Enviar Campaña"}
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
                <iframe
                  srcDoc={previewContent}
                  title="Email Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                />
              </div>
            </CardContent>
          </Card>

          {lastRunStats && (
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Último Envío</CardTitle>
                <CardDescription>
                  Estadísticas de la campaña que acabas de enviar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" /> Total Destinatarios
                  </span>
                  <span className="font-bold">{lastRunStats.totalRecipients}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> Enviados
                  </span>
                  <span className="font-bold">{lastRunStats.sentCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" /> Fallidos
                  </span>
                  <span className="font-bold">{lastRunStats.failedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Duración
                  </span>
                  <span className="font-bold">
                    {lastRunStats.duration.toFixed(2)}s
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Velocidad de Envío
                  </span>
                  <span className="font-bold">
                    {lastRunStats.duration > 0
                      ? (
                          lastRunStats.sentCount / lastRunStats.duration
                        ).toFixed(2)
                      : "N/A"}{" "}
                    correos/s
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Límites de Envío SMTP</CardTitle>
              <CardDescription>
                Restricciones para evitar el bloqueo por spam.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Límite Diario de Correos
                </span>
                <span className="font-mono p-1 bg-muted rounded">5,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Límite por Ejecución
                </span>
                <span className="font-mono p-1 bg-muted rounded">200</span>
              </div>
            </CardContent>
          </Card>
        </div>
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
                      className={
                        campaign.status === "Enviado"
                          ? "bg-green-500/20 text-green-700 border-green-500/20"
                          : ""
                      }
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
