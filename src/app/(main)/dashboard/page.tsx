
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
          Bienvenido a Savinchis' Mail. Aquí tienes un resumen de tu actividad.
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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">&nbsp;</p>
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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Total: 0 contactos
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
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              &nbsp;
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
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Aperturas</TableHead>
                  <TableHead className="text-right">Clics</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No hay campañas recientes.
                        </TableCell>
                    </TableRow>
                ) : (
                    campaigns.slice(0, 5).map((campaign) => (
                    <TableRow key={campaign.name}>
                        <TableCell>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">{campaign.date}</div>
                        </TableCell>
                        <TableCell className="text-center">
                        <Badge
                            variant="outline"
                            className={cn("text-xs", {
                            "bg-green-100 text-green-800 border-green-200": campaign.status === "TERMINADA",
                            "bg-blue-100 text-blue-800 border-blue-200": campaign.status === "INICIADA",
                            "bg-yellow-100 text-yellow-800 border-yellow-200": campaign.status === "TIEMPO LIMITADO",
                            "bg-gray-100 text-gray-800 border-gray-200": campaign.status === "EXPIRADA",
                            "bg-red-100 text-red-800 border-red-200": campaign.status === "AGOTADA",
                            })}
                        >
                            {campaign.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{campaign.opens}</TableCell>
                        <TableCell className="text-right font-medium">{campaign.clicks}</TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
