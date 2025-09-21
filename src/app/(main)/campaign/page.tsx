"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mails, Users, Plus, MailCheck, BarChart2, Loader2, CheckCircle, Clock, XCircle, AlertCircle, ArrowRight, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
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
    
    // Calcular días desde la creación
    const createdDate = campaign.createdAt ? new Date(campaign.createdAt) : null;
    const daysAgo = createdDate 
      ? Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <div 
        key={campaign.id}
        onClick={() => handleCampaignClick(campaign.id)}
        className="p-5 border rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative group bg-card/95 dark:bg-card/80 focus:outline-none focus:ring-2 focus:ring-primary/40 overflow-hidden"
      >
        {/* Efecto de resaltado al pasar el mouse */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base text-gray-900 dark:text-white group-hover:text-primary/90 truncate">
                {campaign.name}
              </h3>
              {daysAgo !== null && daysAgo < 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                  Nuevo
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">{campaign.subject}</p>
            {campaign.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {campaign.description}
              </p>
            )}
          </div>
          <div className="flex items-start gap-2 shrink-0">
            <div className="flex flex-col items-end">
              <Badge 
                className={cn(
                  "text-[11px] py-1.5 px-2.5 border inline-flex items-center gap-1 mb-2 transition-all duration-200",
                  getCampaignStatusColor(campaign.status),
                  "group-hover:shadow-sm"
                )}
              >
                <span className={cn(
                  "inline-block h-1.5 w-1.5 rounded-full flex-shrink-0",
                  campaign.status === 'failed' ? 'bg-rose-500' :
                  campaign.status === 'paused' ? 'bg-amber-500' :
                  campaign.status === 'completed' ? 'bg-blue-500' :
                  'bg-emerald-500'
                )} />
                <span className="flex items-center whitespace-nowrap">
                  {getStatusIcon(campaign.status)}
                  {campaign.status === 'scheduled' ? 'Programada' :
                   campaign.status === 'sending' ? 'Enviando...' :
                   campaign.status === 'completed' ? 'Completada' :
                   campaign.status === 'paused' ? 'Pausada' :
                   campaign.status === 'failed' ? 'Fallida' :
                   'Borrador'}
                </span>
              </Badge>
              {createdDate && (
                <span className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  {formatDate(createdDate.toISOString())}
                </span>
              )}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2">
              <button 
                onClick={(e) => handleEditClick(e, campaign.id)}
                className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-all duration-200 hover:scale-110"
                title="Editar campaña"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={(e) => handleDeleteClick(e, campaign.id)}
                className="p-1.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/50 transition-all duration-200 hover:scale-110"
                title="Eliminar campaña"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>


        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{totalRecipients.toLocaleString()}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Destinatarios</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{openRate}%</span>
                <span className="text-xs text-gray-500 ml-1">({opened.toLocaleString()})</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aperturas</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{clickRate}%</span>
                <span className="text-xs text-gray-500 ml-1">({clicked.toLocaleString()})</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Clicks</span>
            </div>
          </div>
        </div>

        {campaign.status === 'sending' && totalRecipients > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">Progreso de envío</span>
              <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
            </div>
            <div className="relative pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-primary">
                    {sent.toLocaleString()} de {totalRecipients.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold inline-block text-emerald-500">
                    {progress}%
                  </span>
                </div>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-gray-200 dark:bg-gray-700 overflow-hidden mt-1"
                indicatorClassName="bg-gradient-to-r from-emerald-500 to-emerald-400"
              />
            </div>
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
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-headline font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Panel de Campañas
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">
                Gestiona, supervisa y analiza el rendimiento de tus campañas de email marketing en un solo lugar. 
                Crea nuevas campañas o edita las existentes para optimizar tus envíos.
              </p>
            </div>
            <Link href="/campaign/New-campaigns" className="shrink-0">
              <Button 
                className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-100 dark:shadow-emerald-900/30 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                Nueva campaña
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border border-green-100 dark:border-green-800/30 hover:shadow-md transition-shadow duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-green-100">
              Total de Campañas
            </CardTitle>
            <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
              <Mails className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCampaigns}</div>
            <div className="flex items-center mt-1">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
              <p className="text-xs text-green-700 dark:text-green-300">
                {stats.activeCampaigns} activa{stats.activeCampaigns !== 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/5 via-blue-400/10 to-cyan-500/10 dark:from-blue-500/10 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-500/20 rounded-xl hover:shadow-lg hover:shadow-blue-100/30 dark:hover:shadow-blue-900/10 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-200">
              Destinatarios
            </CardTitle>
            <div className="h-9 w-9 rounded-full bg-blue-500/10 dark:bg-blue-500/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-all duration-300 border border-blue-200/30 dark:border-blue-500/20">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-300 dark:to-cyan-300 bg-clip-text text-transparent">{stats.totalRecipients.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <div className="h-2 w-2 rounded-full bg-blue-500 mr-1.5"></div>
              <p className="text-xs text-blue-700/90 dark:text-blue-300/90">
                {campaigns.length} campaña{campaigns.length !== 1 ? 's' : ''} activa{campaigns.length !== 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/5 via-fuchsia-400/10 to-pink-500/10 dark:from-purple-500/10 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-500/20 rounded-xl hover:shadow-lg hover:shadow-purple-100/30 dark:hover:shadow-purple-900/10 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-200">
              Tasa de Apertura
            </CardTitle>
            <div className="h-9 w-9 rounded-full bg-purple-500/10 dark:bg-purple-500/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-purple-500/20 dark:group-hover:bg-purple-500/30 transition-all duration-300 border border-purple-200/30 dark:border-purple-500/20">
              <MailCheck className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">{stats.openRate}%</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-3.5 w-3.5 text-green-500 mr-1" />
              <p className="text-xs text-green-700/90 dark:text-green-400/90">
                +2.5% vs el mes pasado
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/5 via-orange-400/10 to-red-500/10 dark:from-amber-500/10 dark:to-red-900/20 border border-amber-200/50 dark:border-amber-500/20 rounded-xl hover:shadow-lg hover:shadow-amber-100/30 dark:hover:shadow-amber-900/10 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-200">
              Tasa de Clics
            </CardTitle>
            <div className="h-9 w-9 rounded-full bg-amber-500/10 dark:bg-amber-500/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-amber-500/20 dark:group-hover:bg-amber-500/30 transition-all duration-300 border border-amber-200/30 dark:border-amber-500/20">
              <BarChart2 className="h-5 w-5 text-amber-600 dark:text-amber-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 dark:from-amber-300 dark:to-red-300 bg-clip-text text-transparent">{stats.clickRate}%</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-3.5 w-3.5 text-green-500 mr-1" />
              <p className="text-xs text-green-700/90 dark:text-green-400/90">
                +1.2% vs el mes pasado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200/60 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100 dark:border-gray-700/50">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">Tus Campañas Recientes</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {campaigns.length === 0 
                ? 'Aún no has creado ninguna campaña' 
                : `Mostrando ${Math.min(campaigns.length, 5)} de ${stats.totalCampaigns} campañas`}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Link href="/campaign" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full sm:w-auto gap-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/campaign/New-campaigns" className="w-full sm:w-auto">
              <Button 
                size="sm" 
                className="w-full sm:w-auto gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                <Plus className="h-4 w-4" />
                Nueva campaña
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {campaigns.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 mb-4">
                <Mails className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">No hay campañas</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Aún no has creado ninguna campaña. Crea tu primera campaña para comenzar a enviar correos electrónicos.
              </p>
              <Link href="/campaign/New-campaigns">
                <Button 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-100 dark:shadow-emerald-900/30"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear mi primera campaña
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {campaigns.slice(0, 6).map(renderCampaignCard)}
            </div>
          )}
          
          {campaigns.length > 0 && (
            <div className="border-t border-gray-100 dark:border-gray-700/50 p-4 flex justify-center">
              <Link href="/campaign" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center">
                Ver todas las campañas
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
