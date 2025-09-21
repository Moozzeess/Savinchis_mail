'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/auth-context';
import { ROLES, type Role } from '@/lib/permissions';
import { Users, Code, Megaphone, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Página de inicio de sesión.
 * Permite a los usuarios "autenticarse" (simulado) seleccionando un rol.
 */
export default function LoginPage() {
  const { theme, setTheme } = useTheme();
  const { login } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Evitar hidratación hasta que el componente se monte en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // O un placeholder mientras se carga el tema
  }
  
  // Ruta del logo basada en el tema actual
  const logoPath = theme === 'dark' ? '/images/logo-dark.png' : '/images/logo-light.png';

  const handleLogin = (role: Role) => {
    login(role);
    router.push('/dashboard');
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full"
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
      <Card className="w-full max-w-sm overflow-hidden">
        <Image
          src={logoPath}
          alt="Savinchis' Mail"
          width={456}
          height={236}
          className="w-full object-cover"
          data-ai-hint="Savinchi at the world"
        />
        <CardHeader className="text-center pt-6">
          <div className="flex justify-center items-center gap-2 mb-4">
            <CardTitle className="text-2xl font-headline">Savinchis' Mail</CardTitle>
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
