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
  ArrowRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CAMPAIGN_OBJECTIVES: Record<string, string> = {
  promotional: 'Promocional',
  newsletter: 'Boletín informativo',
  announcement: 'Anuncio',
  event: 'Invitación a evento',
  welcome: 'Correo de bienvenida',
  other: 'Otro'
};

export function ReviewStep({ 
  className = '',
  onEditStep,
  isSubmitting,
  isPreview = false
}: { 
  className?: string;
  onEditStep?: (step: number) => void;
  isSubmitting?: boolean;
  isPreview?: boolean;
}) {
  const { watch } = useFormContext();

  // Obtener valores del formulario
  const formData = watch();
  const {
    name,
    description,
    objective,
    subject,
    emailBody,
    fromName,
    fromEmail,
    replyTo,
    contactList,
    contactListName,
    totalRecipients = 0,
    scheduledAt,
    timeZone = 'America/Mexico_City',
    useOptimalTime = false
  } = formData;

  // Formatear fecha programada
  const formatScheduledDate = () => {
    if (!scheduledAt) return 'Enviar ahora';
    
    const date = new Date(scheduledAt);
    const timeZoneName = timeZone?.split('/')[1]?.replace('_', ' ') || timeZone;
    
    return (
      <div className="space-y-1">
        <div>
          {format(date, "EEEE d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
        </div>
        <div className="text-sm text-muted-foreground">
          Zona horaria: {timeZoneName}
        </div>
        {useOptimalTime && (
          <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400 mt-1">
            <Zap className="h-3 w-3 mr-1" />
            <span>Hora de envío óptima activada</span>
          </div>
        )}
      </div>
    );
  };

  // Contar etiquetas HTML en el cuerpo del correo
  const countTags = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return {
      images: div.getElementsByTagName('img').length,
      links: div.getElementsByTagName('a').length,
      paragraphs: div.getElementsByTagName('p').length + 
                 div.getElementsByTagName('h1').length + 
                 div.getElementsByTagName('h2').length
    };
  };

  const emailStats = emailBody ? countTags(emailBody) : { images: 0, links: 0, paragraphs: 0 };

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h3 className="text-base font-medium">Revisar y enviar</h3>
        <p className="text-sm text-muted-foreground">
          Revisa los detalles de tu campaña antes de enviarla.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                Detalles de la campaña
              </CardTitle>
              {onEditStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditStep(0)}
                  className="text-primary"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Nombre</h4>
                <p className="mt-1">{name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Objetivo</h4>
                <p className="mt-1">
                  {objective ? CAMPAIGN_OBJECTIVES[objective] || objective : 'No especificado'}
                </p>
              </div>
              {description && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Descripción</h4>
                  <p className="mt-1">{description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Destinatarios
              </CardTitle>
              {onEditStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditStep(1)}
                  className="text-primary"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Lista de contactos</h4>
                <p className="mt-1 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  {contactListName || 'Sin nombre'} 
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {totalRecipients.toLocaleString()} contactos
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                Contenido del correo
              </CardTitle>
              {onEditStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditStep(2)}
                  className="text-primary"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Asunto</h4>
                <p className="mt-1">{subject || 'Sin asunto'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Remitente</h4>
                <p className="mt-1">
                  {fromName} &lt;{fromEmail}&gt;
                  {replyTo && ` (Responder a: ${replyTo})`}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Vista previa</h4>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                  {emailBody ? (
                    <div 
                      className="prose max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: emailBody }}
                    />
                  ) : (
                    <p className="text-muted-foreground italic">Sin contenido</p>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{emailStats.paragraphs} párrafos</span>
                  <span>•</span>
                  <span>{emailStats.images} imágenes</span>
                  <span>•</span>
                  <span>{emailStats.links} enlaces</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Programación
              </CardTitle>
              {onEditStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditStep(3)}
                  className="text-primary"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
              {formatScheduledDate()}
            </div>
          </CardContent>
        </Card>

        {!isPreview && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Antes de continuar, verifica que todo esté correcto:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>He revisado la ortografía y gramática del correo</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>He probado los enlaces para asegurarme de que funcionan correctamente</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>He verificado que la lista de destinatarios es la correcta</span>
              </li>
              {scheduledAt && (
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>He confirmado la fecha y hora de envío programado</span>
                </li>
              )}
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onEditStep?.(0)}
                disabled={isSubmitting}
              >
                Editar campaña
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  'Enviando...'
                ) : scheduledAt ? (
                  <>
                    Programar campaña
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Enviar campaña ahora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}