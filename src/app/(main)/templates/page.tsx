import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Edit, Mail, Award, FileText } from "lucide-react";
import Link from "next/link";
import { getTemplatesAction, type Template } from "@/actions/Plantillas/template-actions";
import { Block, generateHtmlFromBlocks } from "@/lib/template-utils";
import { DeleteTemplateButton } from "./delete-template-button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { TemplatePreview } from "@/components/templates/template-preview";

/**
 * Página de Diseños.
 * Muestra una lista de las plantillas de correo y certificados existentes
 * y permite crear nuevos o editar/eliminar los actuales.
 */
export default async function TemplatesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const page = Number(sp?.page) || 1;
  const limit = Number(sp?.limit) || 10;

  const { templates, total } = await getTemplatesAction({ page, limit });

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-headline font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Mis Diseños
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Crea y gestiona tus plantillas de correo y certificados personalizados.
          </p>
        </div>
        <Link href="/templates/select-type" className="inline-block">
          <Button className="group relative overflow-hidden flex items-center">
            <span className="relative z-10 flex items-center">
              <PlusCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              <span>Nuevo Diseño</span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-600/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="relative overflow-hidden rounded-xl border border-dashed p-12 text-center hover:border-primary/50 transition-colors duration-300 bg-gradient-to-br from-background to-muted/30">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10"></div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No hay diseños</h3>
          <p className="mb-6 mt-2 text-muted-foreground max-w-md mx-auto">
            Aún no has creado ningún diseño. Comienza creando uno nuevo para personalizar tus certificados y correos.
          </p>
          <Link href="/templates/select-type" className="inline-block">
            <Button variant="outline" className="relative overflow-hidden group">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="relative z-10">Crear mi primer diseño</span>
              <span className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300"></span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template: Template) => {
            const isCertificate = template.tipo === 'certificate';
            const editUrl = isCertificate
              ? `/certificates/editor/${template.id_plantilla}`
              : `/templates/editor/${template.id_plantilla}`;

            return (
              <Card key={template.id_plantilla} className="group relative overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col h-full border border-border/30 hover:border-primary/20 bg-background/50 hover:bg-background/70">
                <CardHeader className="p-0 relative flex-1 flex flex-col">
                  <div className="absolute top-2 right-2 z-10">
                    <Badge 
                      variant="secondary" 
                      className="flex items-center gap-1.5 backdrop-blur-sm bg-background/90 border border-border/30 shadow-sm hover:bg-background text-xs h-6 px-2"
                    >
                      {isCertificate ? (
                        <Award className="h-3 w-3 text-amber-500" />
                      ) : (
                        <Mail className="h-3 w-3 text-blue-500" />
                      )}
                      <span className="text-[11px] font-medium">
                        {isCertificate ? 'Certificado' : 'Plantilla'}
                      </span>
                    </Badge>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-3 bg-muted/10">
                    <div className="w-full h-full max-h-[140px] flex items-center justify-center overflow-hidden rounded-md border bg-background/50 shadow-sm">
                      <TemplatePreview
                        templateContent={template.contenido}
                        templateName={template.nombre}
                        isCertificate={isCertificate}
                        className="w-full h-full scale-90 origin-top"
                      />
                    </div>
                  </div>
                </CardHeader>
                <div className="relative">
                  <CardContent className="p-3 space-y-1.5 border-t border-border/20">
                    <CardTitle className="text-sm font-medium line-clamp-1 text-foreground/90 group-hover:text-primary transition-colors">
                      {template.nombre}
                    </CardTitle>
                    {!isCertificate && template.asunto_predeterminado && (
                      <CardDescription className="text-xs line-clamp-2 text-muted-foreground/70">
                        {template.asunto_predeterminado}
                      </CardDescription>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between items-center p-2 pt-0">
                    <div className="text-[11px] text-muted-foreground/60">
                      {new Date(template.fecha_creacion).toLocaleDateString()}
                    </div>
                    <div className="flex gap-1.5">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                        className="h-7 w-7 p-0 rounded-md hover:bg-primary/5 hover:text-primary"
                      >
                        <Link href={editUrl} title="Editar plantilla">
                          <Edit className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <DeleteTemplateButton templateId={template.id_plantilla} />
                    </div>
                  </CardFooter>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <PaginationControls total={total} limit={limit} />
    </div>
  );
}
