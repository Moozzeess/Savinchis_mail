
'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, LogOut } from "lucide-react";
import { NavLinks } from "@/components/nav-links";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { hasPermission, APP_PERMISSIONS } from "@/lib/permissions";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Layout principal para las secciones autenticadas de la aplicación.
 * Incluye una barra lateral de navegación persistente y una cabecera.
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos que se renderizarán dentro del layout.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getRoleName = (role: string | null) => {
    if (!role) return "Desconocido";
    return {
      it: 'Administrador (TI)',
      marketing: 'Marketing',
      hr: 'Recursos Humanos'
    }[role] || 'Usuario';
  };
  
  React.useEffect(() => {
    if (!isLoading && !role) {
      router.push('/login');
    }
  }, [role, isLoading, router]);

  if (isLoading || !role) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }
  
  const canViewSettings = hasPermission(role, APP_PERMISSIONS.VIEW_SETTINGS);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarRail />
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <span className="text-lg font-headline font-semibold">
              Savinchis' Mail
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <NavLinks />
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 pb-1">
            <ThemeToggle />
          </div>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start gap-2 w-full p-2 h-auto">
                <Avatar className="size-8">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person portrait" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="text-left group-data-[collapsible=icon]:hidden">
                  <p className="font-semibold text-sm">{getRoleName(role)}</p>
                  <p className="text-xs text-muted-foreground">{role}@email.com</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              {canViewSettings && <DropdownMenuSeparator />}
              {canViewSettings && (
                 <DropdownMenuItem asChild>
                    <Link href="/settings"><Settings className="mr-2 h-4 w-4" /><span>Ajustes</span></Link>
                 </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-40">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-semibold"></h1>
          </div>
        </header>
        <main className="flex-1 min-h-0 p-6 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
