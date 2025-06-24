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
import { Switch } from "@/components/ui/switch";

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
          Configura tu cuenta y tus integraciones.
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
          <CardTitle>Configuración SMTP</CardTitle>
          <CardDescription>
            Configura los detalles de tu servidor de correo saliente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="smtp-host">Host SMTP</Label>
            <Input id="smtp-host" placeholder="smtp.example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-port">Puerto</Label>
            <Input id="smtp-port" placeholder="587" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-user">Usuario</Label>
            <Input id="smtp-user" placeholder="user@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-pass">Contraseña</Label>
            <Input id="smtp-pass" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Guardar Configuración SMTP</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integración con Microsoft Graph</CardTitle>
          <CardDescription>
            Conecta tu cuenta de Microsoft para mejorar la capacidad de envío y
            la gestión de contactos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Activar Microsoft Graph
              </p>
              <p className="text-sm text-muted-foreground">
                Usa la API de Microsoft Graph para enviar correos.
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Conectar con Microsoft</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
