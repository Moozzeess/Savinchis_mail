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
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Panel", icon: Home },
  { href: "/send", label: "Nuevo Correo", icon: MailPlus },
  { href: "/campaigns", label: "Monitor de Envíos", icon: Monitor },
  { href: "/mailbox", label: "Buzón", icon: Inbox },
  { href: "/contacts", label: "Contactos", icon: Users },
  { href: "/templates", label: "Plantillas", icon: FileText },
  { href: "/analytics", label: "Analíticas", icon: BarChart3 },
  { href: "/events", label: "Eventos", icon: Award },
  { href: "/surveys", label: "Encuestas", icon: ClipboardList },
];

/**
 * Componente que renderiza los enlaces de navegación principal en la barra lateral.
 * Resalta el enlace activo basándose en la ruta actual de la URL.
 */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
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
