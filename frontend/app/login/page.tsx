'use client';

import { Button } from "@frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@frontend/components/ui/card";
import { useRouter } from 'next/navigation';
import { AppLogo } from "@frontend/components/app-logo";
import Image from "next/image";
import { useAuth } from '@frontend/context/auth-context';
import { ROLES, type Role } from '@frontend/lib/permissions';
import { Users, Code, Megaphone } from 'lucide-react';

/**
 * Página de inicio de sesión.
 * Permite a los usuarios "autenticarse" (simulado) seleccionando un rol.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (role: Role) => {
    login(role);
    router.push('/dashboard');
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm overflow-hidden">
        <Image
          src="https://placehold.co/436x236.png"
          alt="Monstruos divertidos"
          width={436}
          height={236}
          className="w-full object-cover"
          data-ai-hint="happy monsters"
        />
        <CardHeader className="text-center pt-6">
          <div className="flex justify-center items-center gap-2 mb-4">
            <AppLogo className="size-8 text-primary" />
            <CardTitle className="text-2xl font-headline">EmailCraft Lite</CardTitle>
          </div>
          <CardDescription>
            Selecciona un rol para iniciar sesión.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={() => handleLogin(ROLES.IT)} className="w-full">
            <Code className="mr-2 h-4 w-4" />
            Iniciar como TI
          </Button>
           <Button onClick={() => handleLogin(ROLES.MARKETING)} className="w-full">
            <Megaphone className="mr-2 h-4 w-4" />
            Iniciar como Marketing
          </Button>
           <Button onClick={() => handleLogin(ROLES.HR)} className="w-full">
            <Users className="mr-2 h-4 w-4" />
            Iniciar como RH
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
