
'use client';

import { useState } from 'react';
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
import { Database, Info, Send, ShieldCheck } from "lucide-react";
import { useAuth } from '@/context/auth-context';
import { ROLES, APP_PERMISSIONS, ROLE_PERMISSIONS, type Role, type Permission } from '@/lib/permissions';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Convierte una clave de permiso (ej. 'VIEW_DASHBOARD') a un formato legible (ej. 'View Dashboard').
 * @param permissionKey - La clave del permiso del objeto APP_PERMISSIONS.
 * @returns Una cadena formateada y legible.
 */
const getPermissionName = (permissionKey: string) => {
    return permissionKey
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Página de Ajustes.
 * Permite a los usuarios configurar su perfil, los ajustes de envío de correo
 * y gestionar integraciones. El rol de TI tiene acceso a la gestión de permisos.
 */
export default function SettingsPage() {
    const { role } = useAuth();
    const { toast } = useToast();
    const [permissions, setPermissions] = useState(ROLE_PERMISSIONS);

    /**
     * Gestiona el cambio de estado de un permiso para un rol específico.
     * @param targetRole - El rol al que se le modifica el permiso.
     * @param permission - El permiso que se está cambiando.
     * @param isChecked - El nuevo estado del permiso (marcado/desmarcado).
     */
    const handlePermissionChange = (
        targetRole: Role,
        permission: Permission,
        isChecked: boolean
    ) => {
        setPermissions(prev => {
            const currentPermissions = prev[targetRole] || [];
            let newPermissions;
            if (isChecked) {
                // Añade el permiso si no está presente
                newPermissions = [...new Set([...currentPermissions, permission])];
            } else {
                // Elimina el permiso
                newPermissions = currentPermissions.filter(p => p !== permission);
            }
            return {
                ...prev,
                [targetRole]: newPermissions
            };
        });
    };

    /**
     * Simula el guardado de los cambios de permisos. En una aplicación real,
     * esto enviaría los datos a un backend.
     */
    const handleSaveChanges = () => {
        // En una aplicación real, aquí guardarías el estado `permissions` en tu backend.
        console.log("Guardando permisos:", permissions);
        toast({
            title: "Permisos Guardados",
            description: "La configuración de permisos se ha actualizado con éxito.",
        });
    };

    const isIT = role === ROLES.IT;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Ajustes</h1>
                <p className="text-muted-foreground">
                Configura tu cuenta, conexiones e integraciones.
                </p>
            </div>

            {/* Tarjeta de Gestión de Permisos - Solo visible para TI */}
            {isIT && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldCheck /> Gestión de Permisos</CardTitle>
                        <CardDescription>
                            Habilita o deshabilita el acceso a funcionalidades para otros roles.
                            El rol de TI siempre tiene acceso completo por defecto.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="multiple" className="w-full" defaultValue={[ROLES.MARKETING, ROLES.HR]}>
                            {Object.values(ROLES)
                                .filter(r => r !== ROLES.IT)
                                .map((targetRole) => (
                                <AccordionItem key={targetRole} value={targetRole}>
                                    <AccordionTrigger className="text-base capitalize">{targetRole === ROLES.HR ? 'Recursos Humanos' : targetRole}</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 pt-2">
                                            {Object.entries(APP_PERMISSIONS).map(([key, permission]) => (
                                                <div key={permission} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`${targetRole}-${permission}`}
                                                        checked={permissions[targetRole]?.includes(permission)}
                                                        onCheckedChange={(checked) => {
                                                            handlePermissionChange(targetRole, permission, !!checked);
                                                        }}
                                                    />
                                                    <Label 
                                                    htmlFor={`${targetRole}-${permission}`}
                                                    className="font-normal cursor-pointer"
                                                    >
                                                        {getPermissionName(key)}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSaveChanges}>Guardar Permisos</Button>
                    </CardFooter>
                </Card>
            )}

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
                <CardTitle>Ajustes de Envío de Correo</CardTitle>
                <CardDescription>
                    Configura los parámetros para el envío masivo de correos para optimizar la entrega y evitar el bloqueo.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="batch-size">Correos por Lote</Label>
                    <Input id="batch-size" type="number" defaultValue="50" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="email-delay">Retraso por Correo (ms)</Label>
                    <Input id="email-delay" type="number" defaultValue="100" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="batch-delay">Retraso por Lote (s)</Label>
                    <Input id="batch-delay" type="number" defaultValue="5" />
                    </div>
                </div>
                <div className="flex items-start space-x-4 rounded-md border p-4 bg-muted/40">
                    <Send className="h-5 w-5 text-muted-foreground mt-1"/>
                    <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Mejoras Futuras
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Próximamente: Manejo de reintentos, validación de correos, seguimiento de métricas (aperturas, clics) y pruebas A/B para optimizar el rendimiento de las campañas.
                    </p>
                    </div>
                </div>
                </CardContent>
                <CardFooter>
                <Button>Guardar Ajustes de Envío</Button>
                </CardFooter>
            </Card>
            
            <Card>
                <CardHeader>
                <CardTitle>Conexión a Base de Datos MySQL</CardTitle>
                <CardDescription>
                    Configura los detalles para conectar la aplicación a tu base de datos MySQL.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="db-host">Host</Label>
                    <Input id="db-host" placeholder="localhost" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="db-port">Puerto</Label>
                    <Input id="db-port" placeholder="3306" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="db-user">Usuario</Label>
                    <Input id="db-user" placeholder="root" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="db-pass">Contraseña</Label>
                    <Input id="db-pass" type="password" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="db-name">Nombre de la Base de Datos</Label>
                    <Input id="db-name" placeholder="customer_db" />
                </div>
                </CardContent>
                <CardFooter>
                <Button>
                    <Database className="mr-2" />
                    Probar y Guardar Conexión
                </Button>
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
