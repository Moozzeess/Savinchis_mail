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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSentEmailsAction } from "@/app/actions/get-sent-emails-action";
import { AlertTriangle, Info } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Página del Buzón.
 * Muestra los correos enviados, rebotados y rechazados.
 */
export default async function MailboxPage() {
  const sentEmails = await getSentEmailsAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Buzón</h1>
        <p className="text-muted-foreground">
          Consulta el estado de los correos de tus envíos.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="sent" className="w-full">
            <div className="p-4 border-b">
              <TabsList>
                <TabsTrigger value="sent">Enviados</TabsTrigger>
                <TabsTrigger value="bounced">Rebotados</TabsTrigger>
                <TabsTrigger value="rejected">Rechazados</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="sent" className="p-0">
                <CardHeader>
                    <CardTitle>Elementos Enviados</CardTitle>
                    <CardDescription>
                        Correos enviados exitosamente a través de Microsoft Graph.
                    </CardDescription>
                </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Asunto</TableHead>
                    <TableHead>Destinatario</TableHead>
                    <TableHead className="text-right">Fecha de Envío</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sentEmails.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell className="font-medium">
                        {email.subject}
                      </TableCell>
                      <TableCell>{email.to}</TableCell>
                      <TableCell className="text-right">
                        {format(new Date(email.sentDateTime), "Pp", { locale: es })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
               {sentEmails.length === 0 && (
                <div className="text-center text-muted-foreground p-8">
                    No se encontraron correos enviados.
                </div>
               )}
            </TabsContent>
            <TabsContent value="bounced" className="p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <AlertTriangle className="h-10 w-10 text-yellow-500" />
                <h3 className="text-lg font-semibold">Función No Implementada</h3>
                <p className="text-muted-foreground max-w-md">
                  El seguimiento de correos rebotados requiere una configuración avanzada
                  de webhooks con Microsoft Graph para recibir notificaciones de estado
                  de entrega (DSN).
                </p>
              </div>
            </TabsContent>
            <TabsContent value="rejected" className="p-6 text-center">
             <div className="flex flex-col items-center gap-4">
                <Info className="h-10 w-10 text-blue-500" />
                <h3 className="text-lg font-semibold">Función No Implementada</h3>
                <p className="text-muted-foreground max-w-md">
                  El seguimiento de correos rechazados por el servidor de destino
                  también depende de la configuración de notificaciones de estado
                  de entrega (DSN) a través de webhooks.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
