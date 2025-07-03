
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { importSurveyAction } from "@/actions/survey-actions";
import { PlusCircle, Edit, Trash2, BarChart2, Loader2, Link as LinkIcon, Download } from "lucide-react";
import Link from "next/link";
import { surveys } from "@/lib/data";
import { MicrosoftLogo } from "@/components/microsoft-logo";

function GoogleLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M21.35 11.1h-9.35v2.8h5.21c-.24 1.63-1.7 2.79-3.48 2.79-2.09 0-3.79-1.7-3.79-3.79s1.7-3.79 3.79-3.79c1.18 0 2.22.48 2.97 1.25l2.25-2.25C17.2 5.15 15.05 4 12.33 4c-3.87 0-7 3.13-7 7s3.13 7 7 7c4.17 0 6.64-2.88 6.64-6.75 0-.52-.05-1.03-.12-1.54z"/>
    </svg>
  );
}

/**
 * Página de Encuestas.
 * Muestra una lista de encuestas existentes, permite crear nuevas,
 * y ofrece opciones para importar desde otras plataformas.
 */
export default function SurveysPage() {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleImport = async () => {
    if (!importUrl) {
      toast({ title: "URL requerida", description: "Por favor, introduce la URL de la encuesta.", variant: "destructive" });
      return;
    }
    setImporting(true);
    try {
      const result = await importSurveyAction(importUrl);
      if (result.success && result.data) {
        // Store data in sessionStorage to be picked up by the editor
        sessionStorage.setItem('importedSurveyData', JSON.stringify(result.data));
        toast({ title: "Encuesta Importada", description: "Tu encuesta ha sido importada. Ahora puedes editarla." });
        setIsImportDialogOpen(false);
        setImportUrl("");
        router.push('/surveys/editor');
      } else {
        throw new Error(result.error || "No se pudieron extraer los datos de la encuesta de la URL proporcionada.");
      }
    } catch (error) {
      toast({ title: "Error de Importación", description: (error as Error).message, variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

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

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Download /> Importar Encuesta con IA</CardTitle>
            <CardDescription>
              Pega la URL pública de una encuesta de Google Forms o Microsoft Forms para importarla automáticamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <DialogTrigger asChild>
              <Button variant="outline">
                <GoogleLogo />
                <span className="ml-2">Importar de Google Forms</span>
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MicrosoftLogo />
                 <span className="ml-2">Importar de Microsoft Forms</span>
              </Button>
            </DialogTrigger>
          </CardContent>
        </Card>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Encuesta desde URL</DialogTitle>
            <DialogDescription>
              Pega la URL pública de tu encuesta. Nuestra IA analizará su contenido y lo importará.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="import-url" className="sr-only">URL de la Encuesta</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="import-url"
                placeholder="https://forms.gle/..."
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsImportDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleImport} disabled={importing}>
              {importing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {importing ? "Importando..." : "Importar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
