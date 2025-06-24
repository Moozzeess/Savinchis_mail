import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, BarChart2 } from "lucide-react";
import Link from "next/link";
import { surveys } from "@/lib/data";

/**
 * Página de Encuestas.
 * Muestra una lista de encuestas existentes, permite crear nuevas,
 * y ofrece opciones para importar desde otras plataformas.
 */
export default function SurveysPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Encuestas</h1>
          <p className="text-muted-foreground">
            Crea y gestiona encuestas para tu audiencia.
          </p>
        </div>
        <Button asChild>
          <Link href="/surveys/editor">
            <PlusCircle className="mr-2" />
            Crear Encuesta
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Importar Encuesta</CardTitle>
          <CardDescription>
            Trae encuestas existentes desde otros servicios.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="outline">Importar de Google Forms</Button>
          <Button variant="outline">Importar de Microsoft Forms</Button>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {surveys.map((survey) => (
          <Card key={survey.id}>
            <CardHeader>
              <CardTitle className="text-xl font-headline">
                {survey.name}
              </CardTitle>
              <CardDescription>{survey.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{survey.responses}</span> respuestas
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
               <Button variant="ghost" size="icon" asChild>
                <Link href="#">
                  <BarChart2 className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/surveys/editor">
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
