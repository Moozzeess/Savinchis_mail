'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Award } from 'lucide-react';
import Link from 'next/link';

export default function NewTemplatePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Crear un nuevo diseño</h1>
        <p className="text-lg text-muted-foreground mt-2">¿Qué te gustaría diseñar hoy?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link href="/templates/edit/new" className="group">
          <Card className="h-full flex flex-col items-center justify-center text-center p-8 transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-2 border-2 border-transparent hover:border-primary">
            <CardHeader>
              <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full mb-4">
                <Mail className="h-12 w-12" />
              </div>
              <CardTitle className="text-2xl font-semibold">Plantilla de Correo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Crea plantillas de correo reutilizables con un editor de arrastrar y soltar.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/templates/certificate/new" className="group">
          <Card className="h-full flex flex-col items-center justify-center text-center p-8 transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-2 border-2 border-transparent hover:border-primary">
            <CardHeader>
              <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full mb-4">
                <Award className="h-12 w-12" />
              </div>
              <CardTitle className="text-2xl font-semibold">Certificado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Diseña certificados personalizados para tus eventos y cursos.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
