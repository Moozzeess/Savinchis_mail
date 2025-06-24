"use client";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const campaigns = [
  {
    name: "Lanzamiento de Verano",
    status: "Enviado",
    sent: "1,200",
    opens: "25%",
    clicks: "5%",
    date: "2024-07-15",
  },
  {
    name: "Promoción de Otoño",
    status: "Programado",
    sent: "1,500",
    opens: "-",
    clicks: "-",
    date: "2024-09-01",
  },
  {
    name: "Newsletter Mensual",
    status: "Borrador",
    sent: "N/A",
    opens: "-",
    clicks: "-",
    date: "-",
  },
];

export default function CampaignsPage() {
  const [date, setDate] = useState<Date>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Campañas</h1>
          <p className="text-muted-foreground">
            Gestiona y programa tus campañas de correo electrónico.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2" />
          Crear Campaña
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programar Nueva Campaña</CardTitle>
          <CardDescription>
            Selecciona una fecha y hora para tu próxima campaña. Esta es una UI
            de ejemplo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: es }) : <span>Elige una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </CardContent>
        <CardFooter>
          <Button>Programar</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Campañas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Enviados</TableHead>
                <TableHead>Aperturas</TableHead>
                <TableHead>Clics</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.name}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        campaign.status === "Enviado"
                          ? "default"
                          : campaign.status === "Programado"
                          ? "secondary"
                          : "outline"
                      }
                      className={campaign.status === "Enviado" ? "bg-green-500/20 text-green-700 border-green-500/20" : ""}
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.sent}</TableCell>
                  <TableCell>{campaign.opens}</TableCell>
                  <TableCell>{campaign.clicks}</TableCell>
                  <TableCell>{campaign.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
