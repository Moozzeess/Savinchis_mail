"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mails, Users, Plus, MailCheck, BarChart2, Loader2, CheckCircle, Clock, XCircle, AlertCircle, ArrowRight, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { getCampaigns } from '@/actions/Campaings/new-campaign-action';
import { deleteCampaign } from '@/actions/Campaings/delete-campaign-action';
import { useEffect, useState } from 'react';
import { Campaign } from '@/types/campaign';


const fetchCampaigns = async (page: number = 1, limit: number = 10) => {
  const response = await fetch(`/api/campaigns?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Error al cargar las campañas');
  }
  return response.json();
};



const getCampaignStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
    case 'sending':
      return 'bg-emerald-50 dark:bg-emerald-900/25 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800';
    case 'completed':
      return 'bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800';
    case 'paused':
      return 'bg-amber-50 dark:bg-amber-900/25 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800';
    case 'failed':
      return 'bg-rose-50 dark:bg-rose-900/25 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800';
    case 'draft':
      return 'bg-slate-100 dark:bg-slate-800/60 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    default:
      return 'bg-slate-100 dark:bg-slate-800/60 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
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
    router.push(`/campaign/${campaignId}`);
  };

  const handleEditClick = (e: React.MouseEvent, campaignId: string | number) => {
    e.stopPropagation();
    router.push(`/campaign/${campaignId}/edit`);
  };

  const handleDeleteClick = async (e: React.MouseEvent, campaignId: string | number) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de que deseas eliminar esta campaña? Esta acción no se puede deshacer.')) {
      try {
        const result = await deleteCampaign(Number(campaignId));
        if (result.success) {
          // Actualizar la lista de campañas
          const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
          setCampaigns(updatedCampaigns);
          // Actualizar estadísticas
          setStats(calculateCampaignStats(updatedCampaigns));
        } else {
          alert(result.message || 'Error al eliminar la campaña');
        }
      } catch (error) {
        console.error('Error al eliminar la campaña:', error);
        alert('Ocurrió un error al intentar eliminar la campaña');
      }
    }
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
        className="p-5 border rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative group bg-card/95 dark:bg-card/80 focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 className="font-semibold text-base text-gray-900 dark:text-white group-hover:text-primary/90 truncate">
              {campaign.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{campaign.subject}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge className={cn("text-[11px] py-1.5 px-2.5 border inline-flex items-center gap-1", getCampaignStatusColor(campaign.status))}>
              <span className={cn(
                "inline-block h-1.5 w-1.5 rounded-full",
                campaign.status === 'failed' ? 'bg-rose-500' :
                campaign.status === 'paused' ? 'bg-amber-500' :
                campaign.status === 'completed' ? 'bg-blue-500' :
                'bg-emerald-500'
              )} />
              <span className="flex items-center">
                {getStatusIcon(campaign.status)}
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
            </Badge>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button 
                onClick={(e) => handleEditClick(e, campaign.id)}
                className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
                title="Editar campaña"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={(e) => handleDeleteClick(e, campaign.id)}
                className="p-1.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors"
                title="Eliminar campaña"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">Creada {campaign.createdAt ? formatDate(campaign.createdAt) : 'N/A'}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700">
            <Users className="h-3.5 w-3.5" /> {totalRecipients.toLocaleString()} destinatarios
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 text-[11px] border border-emerald-200/60 dark:border-emerald-800">
            <MailCheck className="h-3.5 w-3.5" /> {opened.toLocaleString()} ({openRate}%) aperturas
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 text-[11px] border border-blue-200/60 dark:border-blue-800">
            <BarChart2 className="h-3.5 w-3.5" /> {clicked.toLocaleString()} ({clickRate}%) clicks
          </span>
        </div>

        {campaign.status === 'sending' && totalRecipients > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Progreso de envío</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2 bg-gray-200 dark:bg-gray-700 overflow-hidden" 
            />
          </div>
        )}

        
      </div>
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const result = await getCampaigns(1, 5);
        
        if (result.success) {
          setCampaigns(result.data);
          setStats(calculateCampaignStats(result.data));
        } else {
          setError(result.message || 'Error al cargar las campañas');
        }
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
        <Link href="/campaign/New-campaigns">
          <Button className="gap-2 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Nueva campaña
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 border-green-200 dark:border-green-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-green-100">
              Total de Campañas
            </CardTitle>
            <Mails className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCampaigns}</div>
            <p className="text-xs text-green-700 dark:text-green-300">
              {stats.activeCampaigns} activa{stats.activeCampaigns !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/30 dark:to-sky-900/20 border-blue-200 dark:border-blue-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-blue-100">
              Destinatarios
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRecipients.toLocaleString()}</div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {campaigns.length} campaña{campaigns.length !== 1 ? 's' : ''} activas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-purple-100">
              Tasa de Apertura
            </CardTitle>
            <MailCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.openRate}%</div>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              +2.5% vs el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 border-amber-200 dark:border-amber-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-amber-100">
              Tasa de Clics
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.clickRate}%</div>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              +1.2% vs el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm dark:bg-card/80 dark:border dark:border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-gray-900 dark:text-white">Tus Campañas Recientes</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {campaigns.length === 0 
                ? 'Aún no has creado ninguna campaña' 
                : `Mostrando ${Math.min(campaigns.length, 5)} de ${stats.totalCampaigns} campañas`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/campaign">
              <Button variant="outline" size="sm" className="gap-2 border-border/50 dark:border-gray-700 dark:hover:bg-gray-800">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/campaign/New-campaigns">
              <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Nueva campaña
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Mails className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No hay campañas</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Crea tu primera campaña para comenzar</p>
               <Link href="/campaign/New-campaigns">
                <Button className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Campaña
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {campaigns.slice(0, 5).map(renderCampaignCard)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
