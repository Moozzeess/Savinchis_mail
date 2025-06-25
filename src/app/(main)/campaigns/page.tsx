"use client";

import {
  Card,
  CardContent,
  CardDescription,
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
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Datos de ejemplo para el monitor de envíos
const sendingCampaigns = [
  {
    name: "Lanzamiento Nuevo Producto",
    sender: "marketing@emailcraft.com",
    status: "INICIADA",
    sent: 1200,
    total: 8000,
    date: "2024-07-18",
  },
  {
    name: "Encuesta de Satisfacción Q3",
    sender: "soporte@emailcraft.com",
    status: "INICIADA",
    sent: 3500,
    total: 5000,
    date: "2024-07-20",
  },
  {
    name: "Newsletter Mensual - Julio",
    sender: "newsletter@emailcraft.com",
    status: "TERMINADA",
    sent: 15000,
    total: 15000,
    date: "2024-07-01",
  },
  {
    name: "Recordatorio Webinar",
    sender: "eventos@emailcraft.com",
    status: "PAUSADA",
    sent: 50,
    total: 400,
    date: "2024-07-22",
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "TERMINADA":
      return "default";
    case "INICIADA":
      return "default";
    case "PAUSADA":
      return "outline";
    default:
      return "secondary";
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "TERMINADA":
      return "bg-green-500/20 text-green-700 border-transparent hover:bg-green-500/30";
    case "INICIADA":
      return "bg-blue-500/20 text-blue-700 border-transparent hover:bg-blue-500/30 animate-pulse";
    case "PAUSADA":
        return "bg-yellow-500/20 text-yellow-700 border-transparent hover:bg-yellow-500/30";
    default:
      return "";
  }
};

/**
 * Página del Monitor de Envíos.
 * Muestra el estado y progreso de las campañas de correo electrónico activas y recientes.
 */
export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">
            Monitor de Envíos
          </h1>
          <p className="text-muted-foreground">
            Supervisa el comportamiento y progreso de tus envíos en tiempo real.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estado de Envíos</CardTitle>
          <CardDescription>
            Campañas que se están enviando actualmente o que han finalizado
            recientemente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaña / Evento</TableHead>
                <TableHead>Remitente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Enviados / Total</TableHead>
                <TableHead className="w-[25%]">Progreso</TableHead>
                <TableHead>Fecha de Inicio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sendingCampaigns.map((campaign) => {
                const progress = (campaign.sent / campaign.total) * 100;
                return (
                  <TableRow key={campaign.name}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.sender}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(campaign.status)}
                        className={cn(getStatusClass(campaign.status))}
                      >
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {campaign.sent.toLocaleString()} /{" "}
                      {campaign.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="h-2" />
                        <span className="text-xs text-muted-foreground">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{campaign.date}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
