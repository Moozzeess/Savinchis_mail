import { Button } from "@frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@frontend/components/ui/card";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { templates } from "@frontend/lib/data";

/**
 * Página de Plantillas.
 * Muestra una lista de las plantillas de correo electrónico existentes
 * y permite crear nuevas o editar/eliminar las actuales.
 */
export default function TemplatesPage() {
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <Image
                src={template.image}
                width={600}
                height={400}
                alt={template.name}
                className="rounded-t-lg object-cover aspect-[3/2]"
                data-ai-hint={template.aiHint}
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl font-headline">
                {template.name}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/templates/editor">
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
