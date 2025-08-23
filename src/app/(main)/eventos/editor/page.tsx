'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EventWizard } from "@/components/eventos/event-wizard";

export default function EventEditorPage() {
  const handleSubmit = async (data: any) => {
    try {
      // TODO: Implement event submission logic
      console.log('Submitting event:', data);
      // const result = await saveEventAction(data);
      // if (result.success) {
      //   router.push('/eventos');
      // }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/eventos" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a la lista de eventos
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Crear Nuevo Evento
          </CardTitle>
          <p className="text-muted-foreground">
            Completa todos los pasos para crear un nuevo evento.
          </p>
        </CardHeader>
        <CardContent>
          <EventWizard onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
