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
import { Info } from "lucide-react";

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
