import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Edit } from "lucide-react";
import Link from "next/link";
import { getTemplatesAction } from "@/actions/template-actions";
import { generateHtmlFromBlocks } from "@/lib/template-utils";
import { DeleteTemplateButton } from "./delete-template-button";

/**
 * Página de Plantillas.
 * Muestra una lista de las plantillas de correo electrónico existentes
 * y permite crear nuevas o editar/eliminar las actuales.
 */
export default async function TemplatesPage() {
  const templates = await getTemplatesAction();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Plantillas</h1>
          <p className="text-muted-foreground">
            Crea y gestiona tus plantillas de correo electrónico.
          </p>
        </div>
        <Button asChild>
          <Link href="/templates/editor">
            <PlusCircle className="mr-2" />
            Crear Plantilla
          </Link>
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
          <p>No se encontraron plantillas.</p>
          <p>¡Crea tu primera plantilla para empezar!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const templateHtml = generateHtmlFromBlocks(template.contenido);
            return (
              <Card key={template.id_plantilla} className="flex flex-col">
                <CardHeader className="p-0">
                  <div className="aspect-[3/2] w-full h-full overflow-hidden rounded-t-lg bg-muted pointer-events-none">
                    <iframe
                      srcDoc={templateHtml}
                      title={template.nombre}
                      className="w-full h-full border-0 scale-[0.5] origin-top-left"
                      style={{ width: "200%", height: "200%" }}
                      scrolling="no"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-grow">
                  <CardTitle className="text-xl font-headline">
                    {template.nombre}
                  </CardTitle>
                  <CardDescription>{template.asunto_predeterminado}</CardDescription>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/templates/editor?id=${template.id_plantilla}`}>
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
    </div>
  );
}
