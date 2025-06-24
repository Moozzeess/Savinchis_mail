import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mails, Users, FileText, PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/**
 * Página del Panel de Control (Dashboard).
 * Ofrece un resumen de la actividad de la cuenta, incluyendo estadísticas clave
 * y accesos directos a las funciones principales de la aplicación.
 */
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Panel de Control
        </h1>
        <p className="text-muted-foreground">
          Bienvenido a EmailCraft Lite. Aquí tienes un resumen de tu actividad.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Campañas Activas
            </CardTitle>
            <Mails className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              +2_ desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Contactos Totales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,257</div>
            <p className="text-xs text-muted-foreground">
              +180_ esta semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Plantillas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3_ nuevas plantillas creadas
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="flex flex-col md:flex-row items-center gap-6 p-8">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-headline font-semibold">
            Crea tu próxima campaña exitosa
          </h2>
          <p className="text-muted-foreground">
            Empieza a interactuar con tu audiencia. Crea una nueva campaña,
            importa tus contactos o diseña una plantilla de correo electrónico
            atractiva.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/campaigns">
                <PlusCircle className="mr-2" />
                Crear Campaña
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/contacts">
                <Users className="mr-2" />
                Importar Contactos
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="https://placehold.co/400x300.png"
            width={400}
            height={300}
            alt="Marketing illustration"
            className="rounded-lg object-cover"
            data-ai-hint="email marketing"
          />
        </div>
      </Card>
    </div>
  );
}
