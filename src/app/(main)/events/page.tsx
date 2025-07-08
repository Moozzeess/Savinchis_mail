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
import { getEventsAction, saveEventAction } from "@/actions/event-actions-corrected"; // Actualizado
import { getTemplatesAction, type Template } from "@/actions/template-actions";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Event type matching the database structure
interface Event {
    id_evento: number;
    nombre: string;
    fecha: string;
    nombre_plantilla: string;
    estado: 'Próximo' | 'Realizado';
    asistentes: number;
}

function CreateEventForm({ templates, onEventCreated }: { templates: Template[], onEventCreated: () => void }) {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [templateId, setTemplateId] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !date || !templateId) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const result = await saveEventAction({
            nombre: name,
            fecha: new Date(date),
            id_plantilla: templateId,
        });

        if (result.success) {
            alert('Evento creado con éxito');
            onEventCreated();
        } else {
            alert(result.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Nombre del Evento</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="date">Fecha del Evento</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="template">Plantilla</Label>
                <Select onValueChange={(value) => setTemplateId(Number(value))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione una plantilla" />
                    </SelectTrigger>
                    <SelectContent>
                        {templates.map((template) => (
                            <SelectItem key={template.id_plantilla} value={String(template.id_plantilla)}>
                                {template.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit">Crear Evento</Button>
        </form>
    );
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);

    const fetchEventsAndTemplates = async () => {
        const eventsData = await getEventsAction();
        const templatesData = await getTemplatesAction();
        setEvents(eventsData);
        setTemplates(templatesData);
    };

    useEffect(() => {
        fetchEventsAndTemplates();
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
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2" />
                            Crear Evento
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Evento</DialogTitle>
                        </DialogHeader>
                        <CreateEventForm templates={templates} onEventCreated={fetchEventsAndTemplates} />
                    </DialogContent>
                </Dialog>
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
