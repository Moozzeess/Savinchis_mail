
"use client";

import { useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Eye, MousePointerClick, AlertCircle, FileDown, Activity } from "lucide-react";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { useToast } from "@/hooks/use-toast";

/**
 * Página de Rendimiento.
 * Muestra métricas clave y gráficos sobre el rendimiento de las campañas
 * y permite generar reportes en PDF.
 */
export default function PerformancePage() {
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
        pixelRatio: 2, // Aumenta la resolución para mejor calidad
        style: {
            backgroundColor: 'white', // Asegura un fondo blanco en el PNG
        }
      });
      
      const pdf = new jsPDF("l", "px", "a4"); // l: landscape, px: pixels, a4: formato
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
          const imgWidth = img.width;
          const imgHeight = img.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          
          const w = imgWidth * ratio * 0.95; // Escala un poco para márgenes
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Rendimiento</h1>
          <p className="text-muted-foreground">
            Visualiza el rendimiento de tus campañas y genera reportes.
          </p>
        </div>
        <Button onClick={handleGeneratePdf}>
          <FileDown className="mr-2" />
          Generar Reporte PDF
        </Button>
      </div>

      <div ref={reportRef} className="space-y-6 bg-background p-4 rounded-lg">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails Enviados</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,231</div>
              <p className="text-xs text-muted-foreground">
                +20.1% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Apertura</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28.7%</div>
              <p className="text-xs text-muted-foreground">
                +2.3% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Clics</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2%</div>
              <p className="text-xs text-muted-foreground">
                +0.5% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Rebote</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.1%</div>
              <p className="text-xs text-muted-foreground">
                -0.2% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <AnalyticsCharts />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rendimiento del Sistema en Vivo</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] pt-6">
                    <div className="text-center">
                        <p className="text-muted-foreground">Próximamente: Métricas en tiempo real sobre la velocidad de envío y el estado de la cola.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
