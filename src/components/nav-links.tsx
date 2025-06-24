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
  Mails,
  Users,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Panel", icon: Home },
  { href: "/campaigns", label: "Campañas", icon: Mails },
  { href: "/contacts", label: "Contactos", icon: Users },
  { href: "/templates", label: "Plantillas", icon: FileText },
  { href: "/analytics", label: "Analíticas", icon: BarChart3 },
];

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
