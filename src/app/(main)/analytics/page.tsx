
"use client";

import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Eye, MousePointerClick, AlertCircle, FileDown, Activity, Filter, Bot, Share2, TriangleAlert, TrendingUp, DatabaseZap, Calendar as CalendarIcon, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { useToast } from "@/hooks/use-toast";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

/**
 * Página de Rendimiento.
 * Muestra métricas clave y gráficos sobre el rendimiento de las campañas
 * y permite generar reportes en PDF.
 */
export default function PerformancePage() {
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(2024, 5, 30), 20),
  });

  const handleGeneratePdf = async () => {
    const element = reportRef.current;
    if (!element) {
        toast({
            title: "Error",
            description: "No se pudo encontrar el contenido para generar el PDF.",
            variant: "destructive",
        });
        return;
    };

    try {
      const dataUrl = await toPng(element, { 
        cacheBust: true, 
        pixelRatio: 2,
        style: {
            backgroundColor: 'white',
        }
      });
      
      const pdf = new jsPDF("l", "px", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
          const imgWidth = img.width;
          const imgHeight = img.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          
          const w = imgWidth * ratio * 0.95;
          const h = imgHeight * ratio * 0.95;
          
          const x = (pdfWidth - w) / 2;
          const y = (pdfHeight - h) / 2;
          
          pdf.addImage(dataUrl, 'PNG', x, y, w, h);
          pdf.save('reporte-rendimiento.pdf');
          toast({
              title: "Reporte Generado",
              description: "El archivo PDF se ha descargado con éxito."
          });
      }
      img.onerror = () => {
         toast({ title: "Error", description: "No se pudo cargar la imagen para el PDF.", variant: "destructive" });
      }
    } catch (error) {
       console.error("Error al generar el PDF:", error);
       toast({ title: "Error", description: `No se pudo generar el reporte: ${(error as Error).message}`, variant: "destructive" });
    }
  };
  
  const FunnelStep = ({ title, value, percentage, change, color }: { title: string, value: string, percentage: number, change: string, color: string }) => (
    <div className="flex items-center gap-4">
      <div className="w-28 text-right">
        <p className="font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{title}</p>
      </div>
      <div className="flex-1">
        <Progress value={percentage} indicatorClassName={color} />
      </div>
      <div className="w-20 text-left text-xs text-muted-foreground">{change}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Rendimiento</h1>
          <p className="text-muted-foreground">
            Visualiza el rendimiento de tus campañas y genera reportes.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                      {format(date.to, "LLL dd, y", { locale: es })}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Elige un rango de fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={es}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleGeneratePdf}>
            <FileDown className="mr-2" />
            Generar Reporte
          </Button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-6 bg-background p-4 rounded-lg">
        {/* Métricas Principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails Enviados</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,231</div>
              <p className="text-xs text-muted-foreground">+20.1% vs período anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Apertura</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28.7%</div>
              <p className="text-xs text-muted-foreground">+2.3% vs período anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Clics</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2%</div>
              <p className="text-xs text-muted-foreground">+0.5% vs período anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Rebote</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.1%</div>
              <p className="text-xs text-muted-foreground text-green-600">-0.2% vs período anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos y Análisis Detallado */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
             <AnalyticsCharts />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" /> Perspectivas Predictivas</CardTitle>
                  <CardDescription>Análisis de IA basado en datos históricos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                 <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/>
                    <p>Se proyecta una <span className="font-bold">tasa de apertura del 32%</span> para la campaña "Verano 2024", un 10% más alta que campañas similares.</p>
                 </div>
                 <div className="flex items-start gap-3">
                    <TriangleAlert className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0"/>
                    <p>El segmento "Inactivos (90 días)" tiene un <span className="font-bold">riesgo de rebote del 5%</span>. Considere una campaña de reactivación.</p>
                 </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                  <CardTitle>Desglose de Errores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500"/>Rebotes Duros (Hard)</span>
                      <span className="font-bold">78</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-yellow-500"/>Rebotes Suaves (Soft)</span>
                      <span className="font-bold">123</span>
                  </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2"><TriangleAlert className="h-4 w-4 text-orange-500"/>Quejas de Spam</span>
                      <span className="font-bold">12</span>
                  </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Embudo de Conversión</CardTitle>
                <CardDescription>Flujo de usuarios desde el envío hasta el clic para la campaña "Newsletter Julio".</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                  <FunnelStep title="Enviados" value="15,000" percentage={100} change="100%" color="bg-blue-500" />
                  <FunnelStep title="Entregados" value="14,835" percentage={98.9} change="-1.1%" color="bg-sky-500" />
                  <FunnelStep title="Abiertos" value="4,272" percentage={28.8} change="-71.2%" color="bg-teal-500" />
                  <FunnelStep title="Clics" value="635" percentage={14.8} change="-85.2%" color="bg-green-500" />
              </CardContent>
            </Card>
          </div>

          <Card>
              <CardHeader>
                <CardTitle>Análisis por Segmento</CardTitle>
                <CardDescription>Compara el rendimiento entre diferentes grupos de audiencia.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="geography" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="geography">Geografía</TabsTrigger>
                    <TabsTrigger value="new_users">Nuevos</TabsTrigger>
                    <TabsTrigger value="device">Dispositivo</TabsTrigger>
                  </TabsList>
                  <TabsContent value="geography" className="mt-4 space-y-4">
                      <div className="flex justify-between items-center text-sm"><p>Norteamérica</p><div className="flex items-center gap-2"><Progress value={45} className="w-24 h-2"/><span className="font-bold">45%</span></div></div>
                      <div className="flex justify-between items-center text-sm"><p>Europa</p><div className="flex items-center gap-2"><Progress value={35} className="w-24 h-2" /><span className="font-bold">35%</span></div></div>
                      <div className="flex justify-between items-center text-sm"><p>Latinoamérica</p><div className="flex items-center gap-2"><Progress value={20} className="w-24 h-2"/><span className="font-bold">20%</span></div></div>
                  </TabsContent>
                  <TabsContent value="new_users" className="mt-4">
                      <p className="text-sm text-muted-foreground text-center p-4">Los nuevos usuarios muestran una tasa de apertura un 15% mayor que los usuarios existentes.</p>
                  </TabsContent>
                  <TabsContent value="device" className="mt-4">
                      <p className="text-sm text-muted-foreground text-center p-4">El 72% de las aperturas ocurren en dispositivos móviles.</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
          </Card>
          
           <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Rendimiento del Sistema</CardTitle>
                        <CardDescription>Métricas en tiempo real sobre la infraestructura de envío.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground p-8">
                       <p>Próximamente: Estado de la cola de envío, velocidad de procesamiento y estado de la API.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><DatabaseZap className="h-5 w-5" />Integración y Exportación</CardTitle>
                        <CardDescription>Conecta con tus herramientas de BI o descarga los datos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full"><Share2 className="mr-2" /> Exportar Datos (CSV)</Button>
                        <p className="text-xs text-muted-foreground text-center">Próximamente: Conexión API para PowerBI y Looker Studio.</p>
                    </CardContent>
                </Card>
           </div>

        </div>
      </div>
    </div>
  );
}
