import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadCloud, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Página de Gestión de Contactos.
 * Permite a los usuarios importar contactos desde archivos (CSV, Excel)
 * o conectarse directamente a una base de datos MySQL.
 */
export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Gestión de Contactos</h1>
          <p className="text-muted-foreground">
            Importa tus contactos desde un archivo o conéctate a tu base de datos.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Importar Contactos desde Archivo</CardTitle>
          <CardDescription>
            Sube un archivo CSV o Excel para añadir contactos en bloque para tu
            campaña.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center border-2 border-dashed rounded-lg p-12">
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            Arrastra y suelta tu archivo aquí, o haz clic para seleccionar.
          </p>
          <Input
            type="file"
            className="max-w-xs"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
          <Button>Importar Archivo</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conectar a Base de Datos MySQL</CardTitle>
          <CardDescription>
            Sincroniza tus contactos directamente desde tu base de datos MySQL
            para atención al cliente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="db-host">Host</Label>
              <Input id="db-host" placeholder="localhost" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-port">Puerto</Label>
              <Input id="db-port" placeholder="3306" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="db-user">Usuario</Label>
            <Input id="db-user" placeholder="root" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="db-pass">Contraseña</Label>
            <Input id="db-pass" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="db-name">Nombre de la Base de Datos</Label>
            <Input id="db-name" placeholder="customer_db" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>
            <Database className="mr-2" />
            Probar y Guardar Conexión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
