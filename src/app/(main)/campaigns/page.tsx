
"use client";

import { useMemo } from "react";
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
import { Target, Users, Megaphone, Code, Globe, Server } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { ROLES, type Role } from "@/lib/permissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


type Campaign = {
    name: string;
    sender: string;
    status: "INICIADA" | "TERMINADA" | "PAUSADA";
    sent: number;
    total: number;
    date: string;
    role: Role;
};

// Datos de ejemplo para el monitor de envíos
const allCampaigns: Campaign[] = [
  { name: "Lanzamiento Nuevo Producto", sender: "marketing@emailcraft.com", status: "INICIADA", sent: 1200, total: 8000, date: "2024-07-18", role: ROLES.MARKETING },
  { name: "Encuesta de Satisfacción Q3 (TI)", sender: "soporte@emailcraft.com", status: "INICIADA", sent: 3500, total: 5000, date: "2024-07-20", role: ROLES.IT },
  { name: "Contrataciones Abiertas", sender: "rh@emailcraft.com", status: "TERMINADA", sent: 500, total: 500, date: "2024-07-15", role: ROLES.HR },
  { name: "Newsletter Mensual - Julio", sender: "marketing@emailcraft.com", status: "TERMINADA", sent: 15000, total: 15000, date: "2024-07-01", role: ROLES.MARKETING },
  { name: "Recordatorio Webinar (RH)", sender: "rh@emailcraft.com", status: "PAUSADA", sent: 50, total: 400, date: "2024-07-22", role: ROLES.HR },
  { name: "Actualización de Servidores", sender: "noreply@emailcraft.com", status: "TERMINADA", sent: 25, total: 25, date: "2024-07-19", role: ROLES.IT },
  { name: "Comunicado Interno de TI", sender: "comms@emailcraft.com", status: "TERMINADA", sent: 150, total: 150, date: "2024-07-10", role: ROLES.IT },
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
 * Componente reutilizable para renderizar la tabla de campañas.
 */
const CampaignsTable = ({ campaigns }: { campaigns: Campaign[] }) => (
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
        {campaigns.map((campaign) => {
          const progress = (campaign.total > 0) ? (campaign.sent / campaign.total) * 100 : 0;
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
                {campaign.sent.toLocaleString()} / {campaign.total.toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="h-2" />
                  <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                </div>
              </TableCell>
              <TableCell>{campaign.date}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );


/**
 * Página del Monitor de Envíos.
 * Muestra el estado y progreso de las campañas de correo electrónico activas y recientes,
 * con vistas personalizadas según el rol del usuario.
 */
export default function CampaignsPage() {
    const { role } = useAuth();
    const isIT = role === ROLES.IT;
    const dailyLimit = 10000;

    const campaignsForUser = useMemo(() => {
        if (!role || isIT) return allCampaigns;
        return allCampaigns.filter((campaign) => campaign.role === role);
    }, [role, isIT]);

    const marketingCampaigns = useMemo(() => allCampaigns.filter(c => c.role === ROLES.MARKETING), []);
    const hrCampaigns = useMemo(() => allCampaigns.filter(c => c.role === ROLES.HR), []);
    const itCampaigns = useMemo(() => allCampaigns.filter(c => c.role === ROLES.IT), []);

    const totalSentForRole = useMemo(() =>
        campaignsForUser.reduce((acc, c) => acc + c.sent, 0),
    [campaignsForUser]);
    
    const globalSent = useMemo(() =>
        allCampaigns.reduce((acc, c) => acc + c.sent, 0),
    []);

    const totalSentForMarketing = useMemo(() =>
        marketingCampaigns.reduce((acc, c) => acc + c.sent, 0),
    [marketingCampaigns]);

    const totalSentForHR = useMemo(() =>
        hrCampaigns.reduce((acc, c) => acc + c.sent, 0),
    [hrCampaigns]);

    const totalSentForIT = useMemo(() => 
        itCampaigns.reduce((acc, c) => acc + c.sent, 0),
    [itCampaigns]);

    const roleSentPercentage = (totalSentForRole / dailyLimit) * 100;
    const itSentPercentage = (totalSentForIT / dailyLimit) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Monitor de Envíos</h1>
          <p className="text-muted-foreground">
            {isIT 
                ? "Supervisa los envíos de toda la organización."
                : "Supervisa el comportamiento y progreso de tus envíos en tiempo real."
            }
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {isIT ? (
            <>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Contador Global de Envíos
                        </CardTitle>
                        <CardDescription>
                            Total de correos enviados hoy por toda la organización.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{globalSent.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Envíos totales</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5" />
                            Contador de Envíos de TI (Hoy)
                        </CardTitle>
                        <CardDescription>
                            Uso del límite diario de envíos para el área de TI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="flex-1"><Progress value={itSentPercentage} /></div>
                            <div className="text-right">
                                <p className="text-lg font-bold">{totalSentForIT.toLocaleString()} / {dailyLimit.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">{itSentPercentage.toFixed(1)}% del límite utilizado</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </>
        ) : (
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Contador de Envíos de tu Área (Hoy)
                </CardTitle>
                <CardDescription>
                    Uso del límite diario de envíos de Microsoft Graph para tu área.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="flex items-center gap-4">
                    <div className="flex-1"><Progress value={roleSentPercentage} /></div>
                    <div className="text-right">
                        <p className="text-lg font-bold">{totalSentForRole.toLocaleString()} / {dailyLimit.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{roleSentPercentage.toFixed(1)}% del límite utilizado</p>
                    </div>
                </div>
                </CardContent>
            </Card>
        )}
      </div>

      {isIT ? (
        <Card>
            <CardHeader>
                <CardTitle>Monitor Global de Envíos</CardTitle>
                <CardDescription>
                    Supervisa las campañas de todas las áreas de la organización.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="global" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="global">Global</TabsTrigger>
                        <TabsTrigger value="marketing"><Megaphone className="mr-2 h-4 w-4" />Marketing</TabsTrigger>
                        <TabsTrigger value="hr"><Users className="mr-2 h-4 w-4" />RH</TabsTrigger>
                        <TabsTrigger value="it"><Code className="mr-2 h-4 w-4" />TI</TabsTrigger>
                    </TabsList>
                    <TabsContent value="global" className="mt-4"><CampaignsTable campaigns={allCampaigns} /></TabsContent>
                    <TabsContent value="marketing" className="mt-4 space-y-4">
                        <Card>
                            <CardHeader className="p-4 flex-row items-center justify-between">
                                <CardTitle className="text-base">Total de Envíos de Marketing (Hoy)</CardTitle>
                                <p className="text-2xl font-bold">{totalSentForMarketing.toLocaleString()}</p>
                            </CardHeader>
                        </Card>
                        <CampaignsTable campaigns={marketingCampaigns} />
                    </TabsContent>
                    <TabsContent value="hr" className="mt-4 space-y-4">
                        <Card>
                            <CardHeader className="p-4 flex-row items-center justify-between">
                                <CardTitle className="text-base">Total de Envíos de RH (Hoy)</CardTitle>
                                <p className="text-2xl font-bold">{totalSentForHR.toLocaleString()}</p>
                            </CardHeader>
                        </Card>
                        <CampaignsTable campaigns={hrCampaigns} />
                    </TabsContent>
                    <TabsContent value="it" className="mt-4 space-y-4">
                        <Card>
                           <CardHeader className="p-4 flex-row items-center justify-between">
                                <CardTitle className="text-base">Total de Envíos de TI (Hoy)</CardTitle>
                                <p className="text-2xl font-bold">{totalSentForIT.toLocaleString()}</p>
                            </CardHeader>
                        </Card>
                        <CampaignsTable campaigns={itCampaigns} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      ) : (
        <Card>
            <CardHeader>
            <CardTitle>Estado de tus Envíos</CardTitle>
            <CardDescription>
                Campañas que tu área está enviando actualmente o que ha finalizado recientemente.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <CampaignsTable campaigns={campaignsForUser} />
            </CardContent>
        </Card>
      )}
    </div>
  );
}
