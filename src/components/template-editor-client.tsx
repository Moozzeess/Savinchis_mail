
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { optimizeEmailContentAction } from '@/app/actions/optimize-email-action';
import type { OptimizeEmailContentOutput } from '@/ai/flows/optimize-email-content';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Wand2, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/auth-context';

/**
 * Esquema de validación para el formulario del editor de plantillas.
 */
const formSchema = z.object({
  templateName: z.string().min(1, 'El nombre de la plantilla es requerido.'),
  emailSubject: z.string().min(1, 'El asunto del correo es requerido.'),
  emailBody: z.string().min(10, 'El cuerpo del correo debe tener al menos 10 caracteres.'),
  audience: z.string().min(1, 'La descripción de la audiencia es requerida.'),
});

type FormValues = z.infer<typeof formSchema>;

/**
 * Componente de cliente para crear y editar plantillas de correo electrónico.
 * Incluye un formulario para los detalles de la plantilla, un optimizador de contenido
 * con IA y muestra los resultados de la optimización.
 */
export function TemplateEditorClient() {
  const [aiResult, setAiResult] = useState<OptimizeEmailContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { role } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateName: '',
      emailSubject: '',
      emailBody: '',
      audience: '',
    },
  });

  /**
   * Gestiona el proceso de optimización con IA para el cuerpo del correo.
   * Valida que los campos necesarios estén completos, llama a la acción del servidor,
   * y actualiza el estado del componente con el resultado o un error.
   */
  const handleOptimize = async () => {
    const { emailBody, audience } = form.getValues();
    if (!emailBody || !audience) {
      toast({
        title: 'Faltan campos',
        description: 'Por favor, rellena el cuerpo del correo y la audiencia para optimizar.',
        variant: 'destructive',
      });
      return;
    }
    if (!role) {
      toast({ title: 'Error de autenticación', description: 'Rol de usuario no encontrado.', variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);
    setAiResult(null);
    try {
      const result = await optimizeEmailContentAction({ emailContent: emailBody, audience, role });
      setAiResult(result);
    } catch (error) {
      toast({
        title: 'Error de optimización',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gestiona el envío del formulario para guardar la plantilla.
   * @param values - Los valores validados del formulario.
   */
  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: 'Plantilla guardada',
      description: `La plantilla "${values.templateName}" ha sido guardada con éxito.`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Editor de Plantilla</CardTitle>
            <CardDescription>Crea o edita tu plantilla de correo electrónico.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="templateName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Plantilla</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Newsletter Mensual" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailSubject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asunto del Correo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Novedades de este mes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailBody"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuerpo del Correo (soporta HTML)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Escribe tu correo aquí..." {...field} rows={15} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Guardar Plantilla</Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6 sticky top-24 h-max">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Wand2 /> Optimizador de Correo con IA
              </CardTitle>
              <CardDescription>
                Mejora tu contenido para evitar filtros de spam y aumentar la interacción.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe tu Audiencia</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Clientes interesados en tecnología" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <Button type="button" onClick={handleOptimize} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Optimizando...' : 'Optimizar con IA'}
              </Button>
            </CardContent>
          </Card>

          {aiResult && (
             <Card>
              <CardHeader>
                <CardTitle className="font-headline">Resultados de la Optimización</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Puntuación de Spam</Label>
                  <Progress value={aiResult.spamScore || 0} className="w-full mt-1" />
                  <p className="text-sm text-muted-foreground mt-1">
                    Puntuación: {aiResult.spamScore || 'N/A'}/100 (más bajo es mejor)
                  </p>
                </div>
                <div>
                  <Label>Sugerencias de Interacción</Label>
                  <p className="text-sm bg-muted p-3 rounded-md mt-1">{aiResult.engagementSuggestions}</p>
                </div>
                 <div>
                  <Label>Contenido Optimizado</Label>
                  <Textarea readOnly value={aiResult.optimizedContent} rows={15} className="mt-1 bg-muted" />
                  <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={() => {
                    form.setValue('emailBody', aiResult.optimizedContent);
                    toast({ title: 'Contenido actualizado', description: 'El cuerpo del correo ha sido actualizado con la versión optimizada.'})
                    }}>Usar este contenido</Button>
                </div>
              </CardContent>
             </Card>
          )}
        </div>
      </form>
    </Form>
  );
}
