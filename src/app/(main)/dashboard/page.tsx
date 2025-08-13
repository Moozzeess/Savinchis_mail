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
import { 
  Mails, 
  Users, 
  TrendingUp, 
  Plus, 
  MailCheck, 
  BarChart2, 
  Loader2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  Activity,
  ArrowRight
} from "lucide-react";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { getCampaigns } from '@/service/campaign.service';
import { useEffect, useState } from 'react';
import { Campaign } from '@/types/campaign';

// Utility functions for campaign status
const getCampaignStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
    case 'sending':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'scheduled':
    case 'sending':
      return <CheckCircle className="w-3 h-3 mr-1" />;
    case 'completed':
      return <CheckCircle className="w-3 h-3 mr-1" />;
    case 'paused':
      return <Clock className="w-3 h-3 mr-1" />;
    case 'failed':
      return <XCircle className="w-3 h-3 mr-1" />;
    case 'draft':
      return <AlertCircle className="w-3 h-3 mr-1" />;
    default:
      return <AlertCircle className="w-3 h-3 mr-1" />;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalRecipients: number;
  openRate: number;
  clickRate: number;
  deliveryRate: number;
}

const calculateCampaignStats = (campaigns: Campaign[]): CampaignStats => {
  const stats: CampaignStats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'scheduled' || c.status === 'sending').length,
    totalRecipients: campaigns.reduce((sum, c) => sum + (c.totalRecipients || 0), 0),
    openRate: 0,
    clickRate: 0,
    deliveryRate: 0
  };

  // Calculate rates safely
  const totalSent = campaigns.reduce((sum, c) => sum + (c.stats?.sent || 0), 0);
  const totalDelivered = campaigns.reduce((sum, c) => sum + (c.stats?.delivered || 0), 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + (c.stats?.opened || 0), 0);
  const totalClicked = campaigns.reduce((sum, c) => sum + (c.stats?.clicked || 0), 0);

  if (totalSent > 0) {
    stats.deliveryRate = Math.round((totalDelivered / totalSent) * 100);
    stats.openRate = Math.round((totalOpened / totalSent) * 100);
  }

  if (totalOpened > 0) {
    stats.clickRate = Math.round((totalClicked / totalOpened) * 100);
  }

  return stats;
};

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<CampaignStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalRecipients: 0,
    openRate: 0,
    clickRate: 0,
    deliveryRate: 0
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCampaignClick = (campaignId: string | number) => {
    router.push(`/campaigns/${campaignId}`);
  };

  const renderCampaignCard = (campaign: Campaign) => {
    const sent = campaign.stats?.sent || 0;
    const opened = campaign.stats?.opened || 0;
    const clicked = campaign.stats?.clicked || 0;
    const totalRecipients = campaign.totalRecipients || 0;
    const openRate = sent > 0 ? Math.round((opened / sent) * 100) : 0;
    const clickRate = opened > 0 ? Math.round((clicked / opened) * 100) : 0;
    const progress = totalRecipients > 0 ? Math.round((sent / totalRecipients) * 100) : 0;

    return (
      <div 
        key={campaign.id}
        onClick={() => handleCampaignClick(campaign.id)}
        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer relative group"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium text-gray-900 group-hover:text-primary">
              {campaign.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{campaign.subject}</p>
          </div>
          <Badge className={cn("text-xs py-1 px-2", getCampaignStatusColor(campaign.status))}>
            <span className="flex items-center">
              {getStatusIcon(campaign.status)}
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
          <div>
            <p className="text-xs text-gray-500">Creada</p>
            <p className="font-medium">{campaign.createdAt ? formatDate(campaign.createdAt) : 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Destinatarios</p>
            <p className="font-medium">{totalRecipients.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Aperturas</p>
            <p className="font-medium">
              {opened.toLocaleString()} 
              <span className="text-green-600">({openRate}%)</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Clicks</p>
            <p className="font-medium">
              {clicked.toLocaleString()} 
              <span className="text-blue-600">({clickRate}%)</span>
            </p>
          </div>
        </div>
        
        {campaign.status === 'sending' && totalRecipients > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progreso de envío</span>
              <span>{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2" 
            />
          </div>
        )}
        
        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
            Ver detalles →
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const { data: campaigns, total } = await getCampaigns(1, 5);
        
        setCampaigns(campaigns);
        setStats(calculateCampaignStats(campaigns));
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('No se pudieron cargar los datos del dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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
            Gestiona y supervisa tus campañas de marketing por email
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Campañas
            </CardTitle>
            <Mails className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
            <p className="text-xs text-green-700">
              {stats.activeCampaigns} activa{stats.activeCampaigns !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Destinatarios
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecipients.toLocaleString()}</div>
            <p className="text-xs text-blue-700">
              {campaigns.length} campaña{campaigns.length !== 1 ? 's' : ''} activas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Apertura
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openRate}%</div>
            <p className="text-xs text-purple-700">
              {stats.clickRate}% tasa de clicks
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Entrega
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveryRate}%</div>
            <p className="text-xs text-amber-700">
              {stats.deliveryRate > 95 ? 'Excelente' : 'Bueno'} rendimiento
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tus Campañas Recientes</CardTitle>
            <CardDescription>
              {campaigns.length === 0 
                ? 'Aún no has creado ninguna campaña' 
                : `Mostrando ${Math.min(campaigns.length, 5)} de ${stats.totalCampaigns} campañas`}
            </CardDescription>
          </div>
          <Link href="/campaigns">
            <Button variant="outline" size="sm" className="gap-2">
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Mails className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No hay campañas</h3>
              <p className="text-sm text-gray-500 mb-4">Crea tu primera campaña para comenzar</p>
              <Link href="/campaigns">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Campaña
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.slice(0, 5).map(renderCampaignCard)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
