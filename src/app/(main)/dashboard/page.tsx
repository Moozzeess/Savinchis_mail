/**
 * Página de Rendimiento Compacta (v8 - FINAL).
 * Dashboard de alta densidad con el gráfico de "Mejor Rendimiento" como elemento central.
 * Optimizado para una visualización completa en pantallas de escritorio.
 */
"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import CountUp from "react-countup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Eye, MousePointerClick, AlertCircle, FileDown, Activity, TriangleAlert, Calendar as CalendarIcon, XCircle, ArrowDownRight, ArrowUpRight, Minus, Users, BarChart3, PieChart as PieChartIcon, CheckCircle } from "lucide-react";
import { AnalyticsCharts } from "@/components/Analisis/analytics-charts";
import { CampaignStatusChart } from "@/components/Analisis/campaign-status-chart";
import { TopCampaignsChart } from "@/components/Analisis/top-campaigns-chart";
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
import { useAuth } from "@/context/auth-context";
import { hasPermission, APP_PERMISSIONS } from "@/lib/permissions";

// --- Variantes de Animación para Framer Motion ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};


// --- Componente Reutilizable para las Tarjetas de Métricas ---
interface MetricCardProps {
  title: string;
  value: string;
  change?: { value: string; type: 'increase' | 'decrease' | 'neutral' };
  icon: ReactNode;
  colorClass: string;
}

const MetricCard = ({ title, value, change, icon, colorClass }: MetricCardProps) => {
  const ChangeIcon = change?.type === 'increase' ? ArrowUpRight : change?.type === 'decrease' ? ArrowDownRight : Minus;
  const changeColor = change?.type === 'increase' ? 'text-emerald-500' : change?.type === 'decrease' ? 'text-red-500' : 'text-slate-500';

  const numericValue = parseFloat(value.replace(/,/g, ''));
  const suffix = value.replace(String(numericValue).replace(/,/g, ''), '').trim();

  return (
    <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.03 }}>
      <Card className="bg-white dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 shadow-sm h-full transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</CardTitle>
          <div className={cn("flex-shrink-0 p-2 rounded-full", colorClass)}>
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
            <CountUp 
              start={0} 
              end={numericValue} 
              duration={2} 
              separator="," 
              decimals={value.includes('.') ? 2 : 0}
            />
            {suffix}
          </div>
          {change && (
            <p className={cn("text-xs flex items-center gap-1", changeColor)}>
              <ChangeIcon className="h-4 w-4" />
              {change.value}
            </p>
          )}
          {!change && <p className="text-xs text-transparent select-none">.</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
};


// --- Componente Principal de la Página ---
export default function PerformancePage() {
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { role } = useAuth();
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  // Permisos
  const canGenerateReport = hasPermission(role, APP_PERMISSIONS.GENERATE_REPORTS);
  const canViewMainMetrics = hasPermission(role, APP_PERMISSIONS.VIEW_PERFORMANCE_MAIN_METRICS);
  const canViewCharts = hasPermission(role, APP_PERMISSIONS.VIEW_PERFORMANCE_CHARTS);
  const canViewErrors = hasPermission(role, APP_PERMISSIONS.VIEW_PERFORMANCE_ERRORS);
  const canViewFunnel = hasPermission(role, APP_PERMISSIONS.VIEW_PERFORMANCE_FUNNEL);
  const canViewSystem = hasPermission(role, APP_PERMISSIONS.VIEW_PERFORMANCE_SYSTEM);

  // Generación de PDF (sin cambios)
  const handleGeneratePdf = async () => { /* ... */ };
  
  // Componente de embudo (sin cambios)
  const FunnelStep = ({ icon, title, value, percentage, change, color }: { icon: ReactNode, title: string, value: string, percentage: number, change: string, color: string }) => (
     <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 w-32">
        <div className={cn("p-2 rounded-lg bg-opacity-10 dark:bg-opacity-20", 
          color.replace('bg-', 'bg-').replace('500', '100'), 
          color.replace('bg-', 'text-').replace('500', '500'))}>
          {icon}
        </div>
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-100">{value}</p>
          <p className="text-xs text-muted-foreground dark:text-slate-300/80">{title}</p>
        </div>
      </div>
      <div className="flex-1">
        <Progress value={percentage} indicatorClassName={cn("dark:saturate-150", color)} />
      </div>
      <div className="w-20 text-left text-xs text-muted-foreground dark:text-slate-400">{change}</div>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 gap-6">
      {/* --- Encabezado de la Página --- */}
      <div className="flex-shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold text-slate-800 dark:text-slate-100">Rendimiento de Savinchi's</h1>
              <p className="text-slate-500 dark:text-slate-300/80">
                Análisis de métricas clave en una sola vista.
              </p>
            </div>
            <div className="flex items-center gap-2">
               <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "d LLL, y", { locale: es })} -{" "}
                            {format(date.to, "d LLL, y", { locale: es })}
                          </>
                        ) : (
                          format(date.from, "d LLL, y")
                        )
                      ) : (
                        <span>Elige un rango de fechas</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} locale={es} />
                  </PopoverContent>
                </Popover>
                {canGenerateReport && (
                  <Button 
                    onClick={handleGeneratePdf} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500/90 dark:hover:bg-indigo-600/90 transition-colors"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Generar Reporte
                  </Button>
                )}
            </div>
          </div>
      </div>

      {/* --- Contenido del Dashboard para Reporte --- */}
      <motion.div 
        ref={reportRef} 
        className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-3 gap-6 flex-grow pb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* === COLUMNA 1 === */}
        <motion.div className="lg:col-span-1 lg:row-span-3 flex flex-col gap-6">
            {canViewMainMetrics && <>
              <MetricCard title="Emails Enviados" value="12,540" change={{ value: "+20.1%", type: 'increase' }} icon={<Mail className="h-4 w-4 text-white"/>} colorClass="bg-sky-500" />
              <MetricCard title="Tasa de Apertura" value="24.80%" change={{ value: "+1.2%", type: 'increase' }} icon={<Eye className="h-4 w-4 text-white"/>} colorClass="bg-violet-500" />
              <MetricCard title="Tasa de Clics (CTR)" value="4.20%" change={{ value: "-0.5%", type: 'decrease' }} icon={<MousePointerClick className="h-4 w-4 text-white"/>} colorClass="bg-amber-500" />
              <MetricCard title="Tasa de Rebote" value="1.90%" change={{ value: "Estable", type: 'neutral' }} icon={<AlertCircle className="h-4 w-4 text-white"/>} colorClass="bg-slate-500" />
            </>}
            {canViewErrors && (
              <motion.div variants={itemVariants} className="flex-grow">
                <Card className="h-full border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm"><TriangleAlert className="h-4 w-4 text-red-500"/>Desglose de Errores</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><XCircle className="h-4 w-4 text-red-500"/>Rebotes Duros</span><span className="font-bold text-slate-800 dark:text-slate-100">112</span></div>
                      <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><AlertCircle className="h-4 w-4 text-yellow-500"/>Rebotes Suaves</span><span className="font-bold text-slate-800 dark:text-slate-100">127</span></div>
                      <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><TriangleAlert className="h-4 w-4 text-orange-500"/>Quejas de Spam</span><span className="font-bold text-slate-800 dark:text-slate-100">4</span></div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
        </motion.div>

        {/* === COLUMNA 2 (CENTRAL) === */}
        <motion.div className="lg:col-span-2 lg:row-span-3 flex flex-col gap-6">
            {/* --- GRÁFICO PRINCIPAL AHORA ES 'MEJOR RENDIMIENTO' --- */}
            {canViewCharts && (
              <motion.div variants={itemVariants} className="lg:row-span-2">
                <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm h-full">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        Campañas con Mejor Rendimiento
                      </CardTitle>
                      <CardDescription>Tasa de apertura de las 5 campañas principales en el período.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                     <TopCampaignsChart />
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {canViewFunnel && (
              <motion.div variants={itemVariants} className="lg:row-span-1 flex-grow">
                <Card className="h-full border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-5 w-5 text-indigo-500"/>Análisis de Embudo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                      <FunnelStep icon={<Mail />} title="Enviados" value="12,540" percentage={100} change="100%" color="bg-sky-500" />
                      <FunnelStep icon={<Users />} title="Entregados" value="12,301" percentage={98} change="98.1%" color="bg-emerald-500" />
                      <FunnelStep icon={<Eye />} title="Abiertos" value="3,050" percentage={24} change="24.8%" color="bg-violet-500" />
                      <FunnelStep icon={<MousePointerClick />} title="Clics" value="526" percentage={4} change="4.2%" color="bg-amber-500" />
                  </CardContent>
                </Card>
              </motion.div>
            )}
        </motion.div>

        {/* === COLUMNA 3 === */}
        <motion.div className="lg:col-span-1 lg:row-span-3 flex flex-col gap-6">
            {canViewSystem && (
              <motion.div variants={itemVariants} className="flex-grow">
                <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base"><PieChartIcon className="h-5 w-5 text-indigo-500" />Resumen de Campañas</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <CampaignStatusChart />
                    </CardContent>
                </Card>
              </motion.div>
            )}
            {/* --- GRÁFICO SECUNDARIO AHORA ES 'EVOLUCIÓN DE MÉTRICAS' --- */}
            {canViewCharts && (
              <motion.div variants={itemVariants} className="flex-grow">
                <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm h-full">
                  <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-slate-100 text-base">Evolución de Métricas</CardTitle>
                    <CardDescription>Tendencia de apertura y clics.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px]">
                     <AnalyticsCharts />
                  </CardContent>
                </Card>
              </motion.div>
            )}
        </motion.div>
      </motion.div>

    </div>
  );
}