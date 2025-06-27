/**
 * @fileoverview Define los roles y permisos para el Control de Acceso Basado en Roles (RBAC).
 * Este archivo centraliza la lógica de permisos para simular un sistema RBAC.
 * En una aplicación real, esta información provendría de una base de datos.
 */

export const ROLES = {
  IT: 'it',
  MARKETING: 'marketing',
  HR: 'hr',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Define los permisos disponibles en la aplicación.
export const APP_PERMISSIONS = {
  // General
  VIEW_DASHBOARD: 'dashboard:view',
  // Envío
  SEND_CAMPAIGN: 'campaign:send',
  VIEW_CAMPAIGN_MONITOR: 'campaign:view',
  VIEW_MAILBOX: 'mailbox:view',
  // Gestión
  VIEW_CONTACTS: 'contacts:view',
  VIEW_TEMPLATES: 'templates:view',
  VIEW_EVENTS: 'events:view',
  VIEW_SURVEYS: 'surveys:view',
  // Avanzado
  VIEW_PERFORMANCE: 'performance:view',
  GENERATE_REPORTS: 'performance:generate_report',
  VIEW_SETTINGS: 'settings:view',
} as const;

export type Permission = (typeof APP_PERMISSIONS)[keyof typeof APP_PERMISSIONS];

// Asigna permisos iniciales a cada rol. Esta será la configuración por defecto.
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.IT]: Object.values(APP_PERMISSIONS), // TI tiene todos los permisos
  [ROLES.MARKETING]: [
    APP_PERMISSIONS.VIEW_DASHBOARD,
    APP_PERMISSIONS.SEND_CAMPAIGN,
    APP_PERMISSIONS.VIEW_CAMPAIGN_MONITOR,
    APP_PERMISSIONS.VIEW_MAILBOX,
    APP_PERMISSIONS.VIEW_CONTACTS,
    APP_PERMISSIONS.VIEW_TEMPLATES,
    APP_PERMISSIONS.VIEW_SURVEYS,
    APP_PERMISSIONS.VIEW_PERFORMANCE,
  ],
  [ROLES.HR]: [
    APP_PERMISSIONS.VIEW_DASHBOARD,
    APP_PERMISSIONS.SEND_CAMPAIGN,
    APP_PERMISSIONS.VIEW_CAMPAIGN_MONITOR,
    APP_PERMISSIONS.VIEW_MAILBOX,
    APP_PERMISSIONS.VIEW_CONTACTS,
    APP_PERMISSIONS.VIEW_EVENTS,
  ],
};

/**
 * Comprueba si un rol tiene un permiso específico.
 * @param role El rol del usuario.
 * @param permission El permiso a comprobar.
 * @returns `true` si el rol tiene el permiso, `false` en caso contrario.
 */
export function hasPermission(role: Role | null, permission: Permission): boolean {
  if (!role) return false;
  // En una implementación real y dinámica, ROLE_PERMISSIONS se obtendría
  // de un estado global o contexto que el admin de TI puede modificar.
  // Por ahora, usamos la configuración estática.
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}
