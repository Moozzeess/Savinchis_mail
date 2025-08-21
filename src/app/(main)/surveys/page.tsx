"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, BarChart2, ListChecks } from "lucide-react";
import Link from "next/link";

type Survey = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  responses: number;
  questions: number;
};

/**
 * Página de Encuestas.
 * Muestra una lista de encuestas existentes y permite crear nuevas.
 */
export default function SurveysPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: '1',
      title: 'Satisfacción del Cliente',
      description: 'Encuesta para medir la satisfacción de nuestros clientes',
      createdAt: '2023-10-15',
      updatedAt: '2023-10-20',
      responses: 42,
      questions: 10
    },
    {
      id: '2',
      title: 'Evento de Lanzamiento',
      description: 'Retroalimentación sobre nuestro último evento',
      createdAt: '2023-11-01',
      updatedAt: '2023-11-01',
      responses: 28,
      questions: 8
    }
  ]);

  const handleCreateNew = () => {
    router.push('/surveys/editor');
  };

  const handleDeleteSurvey = (id: string) => {
    setSurveys(surveys.filter(survey => survey.id !== id));
    toast({ title: "Encuesta eliminada", description: "La encuesta ha sido eliminada correctamente." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Encuestas</h1>
          <p className="text-muted-foreground">
            Crea y gestiona encuestas para tu audiencia.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Nueva Encuesta
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Encuestas</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveys.length}</div>
            <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respuestas Totales</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {surveys.reduce((sum, survey) => sum + survey.responses, 0)}
            </div>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>
      
      {surveys.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-lg">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <ListChecks className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No hay encuestas</h3>
          <p className="text-sm text-muted-foreground mb-4">Comienza creando tu primera encuesta.</p>
          <Button onClick={handleCreateNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Encuesta
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {surveys.map((survey) => (
            <Card key={survey.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-headline line-clamp-1">
                  {survey.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {survey.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Preguntas</p>
                    <p className="font-medium">{survey.questions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Respuestas</p>
                    <p className="font-medium">{survey.responses}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="text-xs text-muted-foreground">
                  Actualizada el {new Date(survey.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/surveys/${survey.id}/results`}>
                      <BarChart2 className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/surveys/editor?surveyId=${survey.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteSurvey(survey.id)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
