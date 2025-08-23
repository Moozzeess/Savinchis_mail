'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, FileText, ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

// Mock data - Replace with actual API calls
const mockEvents = [
  {
    id: '1',
    name: 'Conferencia Anual 2023',
    date: '2023-11-15',
    location: 'Centro de Convenciones',
    type: 'conferencia',
    attendees: 150,
    status: 'active',
  },
  {
    id: '2',
    name: 'Taller de Marketing Digital',
    date: '2023-10-20',
    location: 'Sala de Juntas Principal',
    type: 'taller',
    attendees: 30,
    status: 'upcoming',
  },
  {
    id: '3',
    name: 'Seminario de Liderazgo',
    date: '2023-09-10',
    location: 'Auditorio Central',
    type: 'seminario',
    attendees: 80,
    status: 'completed',
  },
];

const statusVariants = {
  active: { label: 'Activo', variant: 'default' },
  upcoming: { label: 'Próximo', variant: 'secondary' },
  completed: { label: 'Completado', variant: 'outline' },
  draft: { label: 'Borrador', variant: 'outline' },
};

type Event = typeof mockEvents[0];

export default function EventsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);


  const filteredEvents = mockEvents.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEvent = () => {
    router.push('/eventos/editor');
  };

  const getStatusBadge = (status: keyof typeof statusVariants) => {
    const statusConfig = statusVariants[status] || { label: status, variant: 'outline' };
    return (
      <Badge variant={statusConfig.variant as any}>
        {statusConfig.label}
      </Badge>
    );
  };

  if (showCreateForm) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => setShowCreateForm(false)}
          className="mb-6"
        >
          ← Volver a la lista de eventos
        </Button>
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
            <div className="space-y-4">
              <p>Formulario de creación de evento iría aquí...</p>
              <Button onClick={() => setShowCreateForm(false)}>
                Guardar Evento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
          <p className="text-muted-foreground">
            Gestiona tus eventos y realiza un seguimiento de los asistentes
          </p>
        </div>
        <Button onClick={handleCreateEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Evento
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="w-full md:w-auto">
                <Calendar className="mr-2 h-4 w-4" />
                Filtrar por fecha
              </Button>
              <Button variant="outline" className="w-full md:w-auto">
                <Users className="mr-2 h-4 w-4" />
                Filtrar por tipo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Evento</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Asistentes</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(event.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {event.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      {event.attendees}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(event.status as keyof typeof statusVariants)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/eventos/${event.id}`}>
                        Ver detalles <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron eventos que coincidan con tu búsqueda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredEvents.length}</span> de{' '}
            <span className="font-medium">{filteredEvents.length}</span> eventos
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled>
              Siguiente
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Eventos
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximos Eventos
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockEvents.filter(e => e.status === 'upcoming').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Próximos 30 días
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asistentes Totales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockEvents.reduce((sum, event) => sum + event.attendees, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              +180 desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Plantillas Guardadas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              +1 desde la semana pasada
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
