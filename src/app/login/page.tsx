import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MicrosoftLogo } from "@/components/microsoft-logo";
import Link from "next/link";
import { AppLogo } from "@/components/app-logo";

/**
 * Página de inicio de sesión.
 * Permite a los usuarios "autenticarse" (simulado) con una cuenta de Microsoft.
 */
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <AppLogo className="size-8 text-primary" />
            <CardTitle className="text-2xl font-headline">EmailCraft Lite</CardTitle>
          </div>
          <CardDescription>
            Inicia sesión para gestionar tus campañas de correo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/dashboard">
              <MicrosoftLogo className="mr-2 h-4 w-4" />
              Iniciar sesión con Microsoft
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
