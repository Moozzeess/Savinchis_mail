'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Mail, Award } from "lucide-react";

export default function SelectTemplateTypePage() {
  return (
    <div className="flex justify-center items-center h-full p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Crear un Nuevo Diseño</CardTitle>
          <CardDescription>¿Qué te gustaría diseñar hoy?</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <Link href="/templates/editor/new" passHref>
            <div className="p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center text-center h-full">
              <Mail className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Plantilla de Correo</h3>
              <p className="text-muted-foreground text-sm">
                Crea un diseño de correo reutilizable para tus campañas.
              </p>
            </div>
          </Link>
          <Link href="/templates/certificates/editor/new" passHref>
            <div className="p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center text-center h-full">
              <Award className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Certificado</h3>
              <p className="text-muted-foreground text-sm">
                Diseña un certificado para eventos o cursos.
              </p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}