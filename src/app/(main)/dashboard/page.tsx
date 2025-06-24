
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
import { Mails, Users, TrendingUp } from "lucide-react";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { campaigns } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Página del Panel de Control (Dashboard).
 * Ofrece un resumen de la actividad de la cuenta, incluyendo estadísticas clave,
 * un gráfico de rendimiento y un historial de campañas recientes.
 */
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Panel de Control</h1>
        <p className="text-muted-foreground">
          Bienvenido a EmailCraft Lite. Aquí tienes un resumen de tu actividad.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Campañas Enviadas (Mes)
            </CardTitle>
            <Mails className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nuevos Contactos (Semana)
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+180</div>
            <p className="text-xs text-muted-foreground">
              Total: 1,257 contactos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Apertura (General)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% desde la última campaña
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <AnalyticsCharts />

        <Card>
          <CardHeader>
            <CardTitle>Campañas Recientes</CardTitle>
            <CardDescription>
              Un vistazo a tus últimas 5 campañas enviadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.slice(0, 5).map((campaign) => (
                  <TableRow key={campaign.name}>
                    <TableCell className="font-medium">
                      {campaign.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          campaign.status === "AGOTADA"
                            ? "destructive"
                            : campaign.status === "EXPIRADA"
                            ? "outline"
                            : "default"
                        }
                        className={cn({
                          "bg-green-500/20 text-green-700 border-transparent hover:bg-green-500/30":
                            campaign.status === "TERMINADA",
                          "bg-blue-500/20 text-blue-700 border-transparent hover:bg-blue-500/30":
                            campaign.status === "INICIADA",
                          "bg-yellow-500/20 text-yellow-700 border-transparent hover:bg-yellow-500/30":
                            campaign.status === "TIEMPO LIMITADO",
                        })}
                      >
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{campaign.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
