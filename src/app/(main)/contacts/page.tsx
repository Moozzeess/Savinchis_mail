import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { UploadCloud, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { contacts } from "@/lib/data";

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Contactos</h1>
          <p className="text-muted-foreground">
            Administra tus audiencias y contactos.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2" />
          Añadir Contacto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Importar Contactos</CardTitle>
          <CardDescription>
            Sube un archivo CSV para añadir contactos en bloque.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center border-2 border-dashed rounded-lg p-12">
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            Arrastra y suelta tu archivo CSV aquí, o haz clic para seleccionar
            un archivo.
          </p>
          <Input type="file" className="max-w-xs" accept=".csv" />
          <Button>Importar CSV</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contactos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de alta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.email}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        contact.status === "Suscrito" ? "default" : "destructive"
                      }
                      className={contact.status === "Suscrito" ? "bg-green-500/20 text-green-700 border-green-500/20" : "bg-red-500/20 text-red-700 border-red-500/20"}
                    >
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{contact.dateAdded}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
