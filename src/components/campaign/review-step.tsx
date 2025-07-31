'use client';

import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  Mail, 
  Users, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  Zap,
  Edit2,
  ArrowRight,
  Laptop,
  Smartphone,
  Reply,
  ReplyAll,
  Forward,
  MoreHorizontal,
  File,
  Users as UsersIcon,
  CheckCircle,
  AlertTriangle,
  Clock as ClockIcon,
  TrendingUp,
  LayoutTemplate
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Template } from '@/actions/template-actions';

const CAMPAIGN_OBJECTIVES: Record<string, string> = {
  promotional: 'Promocional',
  newsletter: 'Boletín informativo',
  announcement: 'Anuncio',
  event: 'Invitación a evento',
  welcome: 'Correo de bienvenida',
  other: 'Otro'
};

type PreviewMode = 'desktop' | 'mobile';
interface CampaignFormData {
  name: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  emailBody: string;
  objective?: string;
  attachmentName?: string;
  scheduleDate?: string;
  scheduleTime?: string;
  contactList?: {
    name: string;
    total: number;
  };
  totalRecipients?: number;
  templateId?: string | number;
};

interface ReviewStepProps {
  className?: string;
  onEditStep?: (step: number) => void;
  isSubmitting?: boolean;
  isPreview?: boolean;
  templates?: Template[];
  formData?: CampaignFormData;
}

export function ReviewStep({ 
  className = '',
  onEditStep,
  isSubmitting,
  isPreview = false,
  templates = [],
  formData,
}: ReviewStepProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');



  const {
    name = '',
    objective = '',
    fromName = '',
    fromEmail = '',
    subject = '',
    emailBody = '',
    attachmentName = '',
    scheduleDate = '',
    scheduleTime = '',
    contactList,
    totalRecipients = 0,
    templateId = ''
  } = formData || {};

  // Formatear fecha y hora
  const formattedDate = scheduleDate ? format(new Date(scheduleDate), "EEEE d 'de' MMMM 'de' yyyy", { locale: es }) : '';
  const formattedTime = scheduleTime || '';

  // Renderizar detalles de la campaña
  const renderCampaignDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Revisa tu campaña</h2>
        {!isPreview && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEditStep?.(0)}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Editar
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Detalles de la campaña</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailItem 
            icon={<FileText className="h-5 w-5 text-muted-foreground" />}
            label="Nombre"
            value={name || 'Sin nombre'}
          />
          <DetailItem 
              icon={<Zap className="h-5 w-5 text-muted-foreground" />}
              label="Objetivo"
              value={objective ? CAMPAIGN_OBJECTIVES[objective] || objective : 'No especificado'}
            />
          <DetailItem 
            icon={<Mail className="h-5 w-5 text-muted-foreground" />}
            label="Remitente"
            value={`${fromName || 'Sin nombre'} <${fromEmail || 'sin@email.com'}>`}
          />
          <DetailItem 
            icon={<Users className="h-5 w-5 text-muted-foreground" />}
            label="Destinatarios"
            value={contactList?.name ? `${contactList.name} (${totalRecipients || 0} contactos)` : 'Sin lista seleccionada'}
          />
          {scheduleDate && (
            <>
              <DetailItem 
                icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
                label="Fecha de envío"
                value={formattedDate}
              />
              <DetailItem 
                icon={<Clock className="h-5 w-5 text-muted-foreground" />}
                label="Hora de envío"
                value={formattedTime || 'Inmediatamente'}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Resumen del contenido</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-medium mb-2">Asunto: {subject || 'Sin asunto'}</h3>
          {attachmentName && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <File className="h-4 w-4" />
              <span>1 archivo adjunto</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar vista previa del correo
  const renderEmailPreview = () => {
    const selectedTemplate = templates?.find(t => t.id_plantilla === templateId);
  const previewContent = selectedTemplate?.contenido || emailBody || '';


  
    return (
      <div className="space-y-8">
      {selectedTemplate && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <LayoutTemplate className="h-4 w-4" />
            <span className="text-sm font-medium">
              Usando plantilla: {selectedTemplate.nombre}
            </span>
          </div>
        </div>
      )}
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vista Previa del Correo</CardTitle>
                <CardDescription>Así es como los destinatarios verán tu correo.</CardDescription>
              </div>
              <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                <Button variant={previewMode === 'desktop' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setPreviewMode('desktop')} aria-label="Vista de escritorio">
                  <Laptop className="h-4 w-4" />
                </Button>
                <Button variant={previewMode === 'mobile' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setPreviewMode('mobile')} aria-label="Vista móvil">
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "w-full transition-all duration-300 ease-in-out",
              previewMode === 'mobile' ? 'mx-auto w-[375px]' : 'w-full'
            )}>
              <div className={cn(
                "rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden",
                previewMode === 'mobile' && 'border-8 border-black rounded-[40px] shadow-lg',
                'h-[80vh] flex flex-col'
              )}>
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{(fromName || 'U')[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{fromName || 'Remitente'}</p>
                      <p className="text-xs text-muted-foreground">Para: destinatario@ejemplo.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span className="text-xs mr-2">Ahora</span>
                    <Button variant="ghost" size="icon" className="size-8"><Reply className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="size-8"><ReplyAll className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="size-8"><Forward className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
                  </div>
                </div>

                {/* Subject and Attachments */}
                <div className="p-4 border-b space-y-4">
                  <h2 className="text-xl font-bold">{subject || 'Asunto del correo'}</h2>

                  {attachmentName && (
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">1 archivo adjunto</p>
                        <span className="text-sm text-muted-foreground">(~256 KB)</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 rounded-md border p-2 max-w-xs bg-muted/30">
                        <File className="h-6 w-6 text-primary flex-shrink-0" />
                        <div className="truncate">
                          <p className="text-sm font-medium truncate">{attachmentName}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="bg-white flex-1 overflow-hidden">
                  <iframe
                    srcDoc={previewContent}
                    title="Email Preview"
                    className={cn(
                      "w-full h-full border-0",
                      previewMode === 'mobile' && 'rounded-[32px]'
                    )}
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>

                {/* Footer actions */}
                <div className="p-2 border-t flex items-center gap-2 bg-muted/30">
                  <Button variant="outline" size="sm"><Reply className="mr-2 h-4 w-4"/> Responder</Button>
                  <Button variant="outline" size="sm"><Forward className="mr-2 h-4 w-4"/> Reenviar</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          {renderCampaignDetails()}
        </div>
        <div className="lg:col-span-8">
          {renderEmailPreview()}
        </div>
      </div>

      {!isPreview && (
        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              <>
                Programar campaña
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// Componente auxiliar para mostrar detalles
function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm">{value || '-'}</p>
      </div>
    </div>
  );
}