import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Edit, Mail, Award } from "lucide-react";
import Link from "next/link";
import { getTemplatesAction, type Template } from "@/actions/template-actions";
import { Badge } from "@/components/ui/badge";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { TemplatePreview } from "@/components/templates/template-preview";
import Image from "next/image";
import { DeleteTemplateButton } from "./delete-template-button";

/**
 * Página de Diseños.
 * Muestra una lista de las plantillas de correo y certificados existentes
 * y permite crear nuevos o editar/eliminar los actuales.
 */
export default async function TemplatesPage({ 
  searchParams 
}: { 
  searchParams: { page?: string } 
}) {
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const limit = 9;

  const { templates, total } = await getTemplatesAction({ page, limit });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Mis Diseños</h1>
          <p className="text-muted-foreground">
            Crea y gestiona tus plantillas de correo y certificados.
          </p>
        </div>
        <Button asChild>
          <Link href="/templates/select-type">
            <PlusCircle className="mr-2" />
            Crear Diseño
          </Link>
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
          <p>No se encontraron diseños.</p>
          <p>¡Crea tu primer diseño para empezar!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template: Template) => {
            const isCertificate = template.tipo === 'certificate';
            const editUrl = isCertificate
              ? `/certificates/editor/${template.id_plantilla}`
              : `/templates/editor/${template.id_plantilla}`;

            return (
              <Card key={template.id_plantilla} className="flex flex-col">
                <CardHeader className="p-0 relative">
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="flex items-center gap-1.5">
                      {isCertificate ? <Award className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                      {isCertificate ? 'Certificado' : 'Plantilla'}
                    </Badge>
                  </div>
                  <div className="aspect-[3/2] w-full h-full overflow-hidden rounded-t-lg bg-muted pointer-events-none">
                    <TemplatePreview 
                      templatePath={!isCertificate && typeof template.contenido === 'string' ? template.contenido : null}
                      templateName={template.nombre}
                      isCertificate={isCertificate}
                      templateContent={template.contenido}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-grow">
                  <CardTitle className="text-xl font-headline">
                    {template.nombre}
                  </CardTitle>
                  {!isCertificate && <CardDescription>{template.asunto_predeterminado}</CardDescription>}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={editUrl}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteTemplateButton templateId={template.id_plantilla} />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      <PaginationControls total={total} limit={limit} />
    </div>
  );
}
