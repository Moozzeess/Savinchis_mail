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
  LayoutTemplate,
  AlertCircle as AlertCircleIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Template } from '@/actions/Plantillas/template-actions';
import { generateHtmlFromBlocks } from '@/lib/template-utils';

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
  templateName?: string;
  templateContent?: string;
  contactListId?: string;
  status?: string;
  scheduledAt?: string;
  timeZone?: string;
  useOptimalTime?: boolean;
  trackOpens?: boolean;
  trackClicks?: boolean;
  isABTest?: boolean;
};

interface ReviewStepProps {
  className?: string;
  onEditStep?: (step: number) => void;
  isSubmitting?: boolean;
  isPreview?: boolean;
  templates?: Template[];
  formData?: CampaignFormData;
}

export default function ReviewStep({ 
  className = '',
  onEditStep,
  isSubmitting,
  isPreview = false,
  templates = [],
  formData,
}: ReviewStepProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasConfirmedDetails, setHasConfirmedDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { handleSubmit, formState: { isSubmitting: isFormSubmitting } } = useFormContext();
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const form = document.querySelector('form');
      if (form) {
        const formData = new FormData(form);
        const response = await fetch('/api/campaigns', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al guardar la campaña');
        }
        
        // Show success message or redirect
        window.location.href = '/campaigns';
      }
    } catch (err) {
      console.error('Error saving campaign:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al guardar la campaña');
    } finally {
      setIsSaving(false);
    }
  };

  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const { getValues } = useFormContext();
  
  const values = getValues();
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
    contactListName = '',
    totalRecipients = 0,
    templateId = '',
    templateName = '',
    templateContent = '',
    contactListId = '',
    status = '',
    scheduledAt = '',
    timeZone = 'America/Mexico_City',
    useOptimalTime = false,
  } = values;

  // Validar datos faltantes
  const getMissingData = () => {
    const missing = [];
    if (!name) missing.push('Nombre de campaña');
    if (!fromEmail) missing.push('Correo del remitente');
    if (!contactListName) missing.push('Lista de contactos');
    if (!subject) missing.push('Asunto del correo');
    if (!templateContent && !emailBody) missing.push('Contenido del correo');
    if (scheduleDate && !scheduleTime && !useOptimalTime) missing.push('Hora de envío');
    return missing;
  };

  const missingData = getMissingData();
  const isFormValid = missingData.length === 0 && hasConfirmedDetails;

  // Obtener resumen de programación
  const getSchedulingSummary = () => {
    if (!scheduleDate) return 'Envío inmediato';
    
    const date = new Date(scheduleDate);
    const dateStr = date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (useOptimalTime) {
      return `${dateStr} - Hora optimizada automáticamente`;
    } else if (scheduleTime) {
      return `${dateStr} a las ${scheduleTime}`;
    }
    
    return 'No configurado';
  };

  // Renderizar detalles de la campaña con mejoras
  const renderCampaignDetails = () => (
    <div className="space-y-6">
      {/* Alerta de datos faltantes */}
      {!isFormValid && !isPreview && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800 mb-2">
                Faltan datos por completar
              </h4>
              <p className="text-sm text-red-700 mb-3">
                Para enviar tu campaña, necesitas completar la siguiente información:
              </p>
              <ul className="text-sm text-red-600 space-y-1">
                {missingData.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación de campaña lista */}
      {isFormValid && !isPreview && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-green-800">
                ¡Campaña lista para enviar!
              </h4>
              <p className="text-sm text-green-700 mt-1">
                Todos los datos están completos. Puedes programar tu campaña cuando estés listo.
              </p>
            </div>
          </div>
        </div>
      )}

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
            value={
              contactListName
                ? `${contactListName} (${totalRecipients || 0} contactos)`
                : 'Sin lista seleccionada'
            }
          />
          <DetailItem
            icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
            label="Programación"
            value={getSchedulingSummary()}
          />
          {templateName && (
            <DetailItem
              icon={<LayoutTemplate className="h-5 w-5 text-muted-foreground" />}
              label="Plantilla"
              value={templateName}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Resumen del contenido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">Asunto:</span>
            <span className="text-sm text-right max-w-xs">
              {subject || 'Sin asunto'}
            </span>
          </div>
          
          {attachmentName && (
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">Archivo adjunto:</span>
              <div className="flex items-center gap-2 text-sm text-right max-w-xs">
                <File className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{attachmentName}</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">Seguimiento:</span>
            <div className="text-sm text-right space-y-1">
              <div className="flex items-center gap-2">
                {values.trackOpens ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span>Aperturas {values.trackOpens ? 'activado' : 'desactivado'}</span>
              </div>
              <div className="flex items-center gap-2">
                {values.trackClicks ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span>Clics {values.trackClicks ? 'activado' : 'desactivado'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar vista previa del correo
  const renderEmailPreview = () => {
    const selectedTemplate = templates?.find(t => t.id_plantilla === templateId);
    const raw = (selectedTemplate?.contenido ?? emailBody) as unknown;
    let previewContent: string = '';
    if (Array.isArray(raw)) {
      try {
        previewContent = generateHtmlFromBlocks(raw as any);
      } catch {
        previewContent = '';
      }
    } else if (typeof raw === 'string') {
      previewContent = raw;
    } else {
      previewContent = '';
    }

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
        <div className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircleIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error al guardar la campaña</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end items-center pt-4 border-t">
            <Button 
              type="button"
              onClick={() => setShowConfirmation(true)}
              disabled={!isFormValid || isSubmitting}
              className={!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {isSubmitting || isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSaving ? 'Guardando...' : 'Procesando...'}
                </>
              ) : (
                <>
                  Guardar campaña
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          
          <ConfirmationDialog
            open={showConfirmation}
            onOpenChange={setShowConfirmation}
            onConfirm={handleSave}
            title="Confirmar guardado"
            description="¿Estás seguro de que deseas guardar esta campaña? Podrás editarla más tarde desde el panel de control."
            confirmText="Sí, guardar campaña"
            cancelText="No, volver"
            confirmVariant="default"
            showCheckbox={true}
            checkboxLabel="He revisado y confirmo que toda la información es correcta"
          />
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