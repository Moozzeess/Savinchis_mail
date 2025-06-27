
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  BarChart3,
  FileText,
  Award,
  ClipboardList,
  MailPlus,
  Monitor,
  Inbox,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { hasPermission, APP_PERMISSIONS } from "@/lib/permissions";


const links = [
  { href: "/dashboard", label: "Panel", icon: Home, permission: APP_PERMISSIONS.VIEW_DASHBOARD },
  { href: "/send", label: "Nuevo Correo", icon: MailPlus, permission: APP_PERMISSIONS.SEND_CAMPAIGN },
  { href: "/campaigns", label: "Monitor de Envíos", icon: Monitor, permission: APP_PERMISSIONS.VIEW_CAMPAIGN_MONITOR },
  { href: "/mailbox", label: "Buzón", icon: Inbox, permission: APP_PERMISSIONS.VIEW_MAILBOX },
  { href: "/contacts", label: "Contactos", icon: Users, permission: APP_PERMISSIONS.VIEW_CONTACTS },
  { href: "/templates", label: "Plantillas", icon: FileText, permission: APP_PERMISSIONS.VIEW_TEMPLATES },
  { href: "/analytics", label: "Rendimiento", icon: BarChart3, permission: APP_PERMISSIONS.VIEW_PERFORMANCE },
  { href: "/events", label: "Eventos", icon: Award, permission: APP_PERMISSIONS.VIEW_EVENTS },
  { href: "/surveys", label: "Encuestas", icon: ClipboardList, permission: APP_PERMISSIONS.VIEW_SURVEYS },
  { href: "/settings", label: "Ajustes", icon: Settings, permission: APP_PERMISSIONS.VIEW_SETTINGS },
];

/**
 * Componente que renderiza los enlaces de navegación principal en la barra lateral.
 * Resalta el enlace activo basándose en la ruta actual de la URL y filtra los enlaces
 * según el rol del usuario.
 */
export function NavLinks() {
  const pathname = usePathname();
  const { role } = useAuth();

  const visibleLinks = links.filter(link => hasPermission(role, link.permission));

  return (
    <SidebarMenu>
      {visibleLinks.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton asChild isActive={pathname.startsWith(link.href)} tooltip={link.label}>
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
