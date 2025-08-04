/**
 * Página de Historial de Contactos.
 * Muestra un registro de las listas de contactos (archivos o consultas)
 * utilizadas en campañas anteriores.
 */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText } from "lucide-react";

// Los datos de ejemplo han sido eliminados para simular un entorno real.
const uploadedFiles: any[] = [];

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">
          Historial de Contactos
        </h1>
        <p className="text-muted-foreground">
          Consulta las listas de contactos utilizadas en tus campañas pasadas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Archivos y Consultas de Campañas</CardTitle>
          <CardDescription>
            Aquí se muestra un registro de los orígenes de contactos para cada
            campaña enviada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre de la Campaña</TableHead>
                <TableHead>Tipo de Fuente</TableHead>
                <TableHead>Nombre / Detalle de la Fuente</TableHead>
                <TableHead className="text-right">Fecha de Envío</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploadedFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No hay historial de contactos.
                  </TableCell>
                </TableRow>
              ) : (
                uploadedFiles.map((file) => (
                  <TableRow key={file.campaignName}>
                    <TableCell className="font-medium">
                      {file.campaignName}
                    </TableCell>
                    <TableCell>{file.sourceType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{file.sourceName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{file.date}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
