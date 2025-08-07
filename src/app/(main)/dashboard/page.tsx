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
import { Mails, Users, TrendingUp, Plus, MailCheck, BarChart2, Loader2 } from "lucide-react";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { campaigns } from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { getCampaigns } from '@/service/campaign.service';
import { useEffect, useState } from 'react';

interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalRecipients: number;
  openRate: number;
}

import { Campaign } from '@/types/campaign';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<CampaignStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalRecipients: 0,
    openRate: 0,
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const { data: campaigns, total } = await getCampaigns(1, 5);
        
        // Calcular estadísticas
        const activeCampaigns = campaigns.filter(
          (c: Campaign) => c.status === 'scheduled' || c.status === 'sending'
        ).length;
        
        const totalRecipients = campaigns.reduce(
          (sum: number, c: Campaign) => sum + (c.totalRecipients || 0), 0
        );

        setCampaigns(campaigns);
        setStats({
          totalCampaigns: total,
          activeCampaigns,
          totalRecipients,
          openRate: 0, // Esto se puede actualizar cuando se implemente el seguimiento de aperturas
        });
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('No se pudieron cargar los datos del dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  
  // Función para manejar el clic en una fila de campaña
  const handleCampaignClick = (campaignId: string | number) => {
    router.push(`/campaigns/${campaignId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-destructive">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">Campañas</h1>
          <p className="text-muted-foreground">
            Gestiona y crea nuevas campañas de correo electrónico.
          </p>
        </div>
        <Link href="/campaigns">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Campaña
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Campañas
            </CardTitle>
            <Mails className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeCampaigns} activa{stats.activeCampaigns !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Destinatarios Totales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecipients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {campaigns.length} campaña{campaigns.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Apertura
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openRate}%</div>
            <p className="text-xs text-muted-foreground">
              Promedio general
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estado del Servicio
            </CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Activo</div>
            <p className="text-xs text-muted-foreground">
              Todo funciona correctamente
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tus Campañas</CardTitle>
            <CardDescription>
              {campaigns.length === 0 
                ? 'Aún no has creado ninguna campaña' 
                : `Mostrando ${campaigns.length} de ${stats.totalCampaigns} campañas`}
            </CardDescription>
          </div>
          <Link href="/campaigns">
            <Button variant="outline" size="sm" className="gap-2">
              Ver todas
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Mails className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No hay campañas creadas</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comienza creando tu primera campaña de correo electrónico.
              </p>
              <Link href="/campaigns">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Campaña
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Asunto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de creación</TableHead>
                    <TableHead className="text-right">Destinatarios</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow 
                      key={campaign.id} 
                      className="cursor-pointer hover:bg-muted/50" 
                      onClick={() => handleCampaignClick(campaign.id)}
                    >
                      <TableCell className="font-medium">
                        {campaign.name}
                      </TableCell>
                      <TableCell>{campaign.subject || 'Sin asunto'}</TableCell>
                      <TableCell>
                        <Badge
                        variant={
                          campaign.status === 'sent' ? 'secondary' : 
                          campaign.status === 'scheduled' ? 'outline' :
                          campaign.status === 'sending' ? 'default' :
                          campaign.status === 'failed' ? 'destructive' : 'outline'
                        }
                        className={cn(
                          'capitalize',
                          campaign.status === 'sent' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                          campaign.status === 'scheduled' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                          campaign.status === 'sending' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                          campaign.status === 'failed' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        )}
                      >
                        {campaign.status === 'sent' ? 'Enviado' :
                         campaign.status === 'scheduled' ? 'Programado' :
                         campaign.status === 'sending' ? 'Enviando' :
                         campaign.status === 'failed' ? 'Fallido' : 'Borrador'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {campaign.totalRecipients || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
