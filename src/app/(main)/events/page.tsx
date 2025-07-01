
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
import { events } from "@/lib/data";

/**
 * Página de Eventos.
 * Muestra una lista de eventos pasados y próximos, y permite crear nuevos.
 */
export default function EventsPage() {
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
            Crear Evento y Certificado
          </Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle className="text-xl font-headline">
                {event.name}
              </CardTitle>
              <CardDescription>Fecha: {event.date}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant={event.status === "Realizado" ? "secondary" : "default"}>
                {event.status}
              </Badge>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{event.attendees} asistentes</span>
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/events/editor">
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
