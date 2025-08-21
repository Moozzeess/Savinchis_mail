/**
 * Página de Rendimiento.
 * Muestra métricas clave y gráficos sobre el rendimiento de las campañas
 * y permite generar reportes en PDF, con acceso controlado por rol.
 */
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
import { Mail, Eye, MousePointerClick, AlertCircle, FileDown, Activity, Bot, Share2, TriangleAlert, TrendingUp, DatabaseZap, Calendar as CalendarIcon, XCircle } from "lucide-react";
import { AnalyticsCharts } from "@/components/Analisis/analytics-charts";
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
import { useAuth } from "@/context/auth-context";
import { hasPermission, APP_PERMISSIONS } from "@/lib/permissions";

export default function PerformancePage() {
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { role } = useAuth();
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  // Permisos granulares
  const canGenerateReport = hasPermission(role, APP_PERMISSIONS.GENERATE_REPORTS);
  const canViewMainMetrics = hasPermission(role, APP_PERMISSIONS.VIEW_PERFORMANCE_MAIN_METRICS);
  const canViewCharts = hasPermission(role, APP_PERMISSIONS.VIEW_PERFORMANCE_CHARTS);
  const canViewPredictions = hasPermission(role, APP_PERMISSIONS.VIEW_PERFORMANCE_PREDICTIONS);
  const canViewErrors = hasPermission(role, APP_PERMISSIONS.VIEW_PERFORMANCE_ERRORS);
  const canViewFunnel = hasPermission(role, APP_PERMISSIONS.VIEW_PERFORMANCE_FUNNEL);
  const canViewSegments = hasPermission(role, APP_PERMISSIONS.VIEW_PERFORMANCE_SEGMENTS);
  const canViewSystem = hasPermission(role, APP_PERMISSIONS.VIEW_PERFORMANCE_SYSTEM);

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
          {canGenerateReport && (
            <Button onClick={handleGeneratePdf}>
              <FileDown className="mr-2" />
              Generar Reporte
            </Button>
          )}
        </div>
      </div>

      <div ref={reportRef} className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Métricas Principales */}
        {canViewMainMetrics && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-200">Emails Enviados</CardTitle>
                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">&nbsp;</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-200">Tasa de Apertura</CardTitle>
                <Eye className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0%</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">&nbsp;</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-200">Tasa de Clics</CardTitle>
                <MousePointerClick className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0%</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">&nbsp;</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Rebote</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground">&nbsp;</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gráficos y Análisis Detallado */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canViewCharts && (
            <div className="lg:col-span-2">
               <AnalyticsCharts />
            </div>
          )}
          
          <div className="space-y-6 p-4">
            {canViewPredictions && (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" /> Perspectivas Predictivas</CardTitle>
                    <CardDescription>Análisis de IA basado en datos históricos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                   <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0"/>
                      <p>No hay suficientes datos para generar predicciones. Envía más campañas para habilitar esta función.</p>
                   </div>
                </CardContent>
              </Card>
            )}

            {canViewErrors && (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                    <CardTitle>Desglose de Errores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500"/>Rebotes Duros (Hard)</span>
                        <span className="font-bold">0</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-yellow-500"/>Rebotes Suaves (Soft)</span>
                        <span className="font-bold">0</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2"><TriangleAlert className="h-4 w-4 text-orange-500"/>Quejas de Spam</span>
                        <span className="font-bold">0</span>
                    </div>
                </CardContent>
              </Card>
            )}
          </div>

          {canViewFunnel && (
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Análisis de Embudo de Conversión</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">Flujo de usuarios desde el envío hasta el clic. Envía una campaña para ver datos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <FunnelStep 
                      title="Enviados" 
                      value="0" 
                      percentage={0} 
                      change="0%" 
                      color="bg-blue-500 dark:bg-blue-400" 
                    />
                    <FunnelStep 
                      title="Entregados" 
                      value="0" 
                      percentage={0} 
                      change="0%" 
                      color="bg-green-500 dark:bg-green-400" 
                    />
                    <FunnelStep 
                      title="Abiertos" 
                      value="0" 
                      percentage={0} 
                      change="0%" 
                      color="bg-teal-500 dark:bg-teal-400" 
                    />
                    <FunnelStep 
                      title="Clics" 
                      value="0" 
                      percentage={0} 
                      change="0%" 
                      color="bg-purple-500 dark:bg-purple-400" 
                    />
                </CardContent>
              </Card>
            </div>
          )}

          {canViewSegments && (
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Análisis por Segmento</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">Compara el rendimiento entre diferentes grupos de audiencia.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="geography" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="geography">Geografía</TabsTrigger>
                      <TabsTrigger value="new_users">Nuevos</TabsTrigger>
                      <TabsTrigger value="device">Dispositivo</TabsTrigger>
                    </TabsList>
                    <TabsContent value="geography" className="mt-4 space-y-4">
                        <div className="flex justify-between items-center text-sm"><p>Norteamérica</p><div className="flex items-center gap-2"><Progress value={0} className="w-24 h-2"/><span className="font-bold">0%</span></div></div>
                        <div className="flex justify-between items-center text-sm"><p>Europa</p><div className="flex items-center gap-2"><Progress value={0} className="w-24 h-2" /><span className="font-bold">0%</span></div></div>
                        <div className="flex justify-between items-center text-sm"><p>Latinoamérica</p><div className="flex items-center gap-2"><Progress value={0} className="w-24 h-2"/><span className="font-bold">0%</span></div></div>
                    </TabsContent>
                    <TabsContent value="new_users" className="mt-4">
                        <p className="text-sm text-muted-foreground text-center p-4">No hay datos de rendimiento para nuevos usuarios.</p>
                    </TabsContent>
                    <TabsContent value="device" className="mt-4">
                        <p className="text-sm text-muted-foreground text-center p-4">No hay datos de rendimiento por dispositivo.</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
            </Card>
          )}
          
           {canViewSystem && (
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
                          <Button className="w-full" disabled><Share2 className="mr-2" /> Exportar Datos (CSV)</Button>
                          <p className="text-xs text-muted-foreground text-center">Próximamente: Conexión API para PowerBI y Looker Studio.</p>
                      </CardContent>
                  </Card>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
