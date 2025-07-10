'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { getEventsAction } from "@/actions/event-actions";
import { useEffect, useState } from "react";

// Event type matching the database structure
interface Event {
  id_evento: number;
  nombre: string;
  fecha: string;
  nombre_plantilla: string; 
  estado: 'Próximo' | 'Realizado';
  asistentes: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const eventsData = await getEventsAction();
    setEvents(eventsData);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Eventos</h1>
          <p className="text-muted-foreground">
            Gestiona tus eventos y los certificados para asistentes.
          </p>
        </div>
        <Button asChild>
          <Link href="/events/editor">
            <PlusCircle className="mr-2" />
            Crear Evento
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
          <p>No se encontraron eventos.</p>
          <p>¡Crea tu primer evento para empezar!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id_evento}>
              <CardHeader>
                <CardTitle className="text-xl font-headline">
                  {event.nombre}
                </CardTitle>
                <CardDescription>Fecha: {new Date(event.fecha).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant={event.estado === "Realizado" ? "secondary" : "default"}>
                  {event.estado}
                </Badge>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{event.asistentes} asistentes</span>
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/events/editor?id=${event.id_evento}`}>
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
      )}
    </div>
  );
}
