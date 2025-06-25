import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, Info, Send } from "lucide-react";

/**
 * Página de Ajustes.
 * Permite a los usuarios configurar su perfil, los ajustes de envío de correo (SMTP)
 * y gestionar integraciones como Microsoft Graph.
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Ajustes</h1>
        <p className="text-muted-foreground">
          Configura tu cuenta, conexiones e integraciones.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
          <CardDescription>
            Actualiza la información de tu perfil.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" defaultValue="Usuario" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="usuario@email.com" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Guardar Cambios</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conexión a Base de Datos MySQL</CardTitle>
          <CardDescription>
            Configura los detalles para conectar la aplicación a tu base de datos MySQL.
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

      <Card>
        <CardHeader>
          <CardTitle>Integración con Microsoft Graph</CardTitle>
          <CardDescription>
            La aplicación está configurada para enviar correos usando la API de Microsoft Graph.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4 rounded-md border p-4 bg-muted/40">
             <Info className="h-5 w-5 text-muted-foreground mt-1"/>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Integración Activa
              </p>
              <p className="text-sm text-muted-foreground">
                El envío de correos se realiza a través de Microsoft Graph.
                Asegúrate de que las variables de entorno (`GRAPH_CLIENT_ID`, `GRAPH_TENANT_ID`, etc.) 
                estén configuradas correctamente en tu archivo `.env`.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
