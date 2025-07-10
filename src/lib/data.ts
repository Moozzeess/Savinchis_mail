/**
 * @fileOverview Datos de prueba para la aplicación.
 * Este archivo contiene datos de ejemplo para campañas y contactos,
 * utilizados para poblar la interfaz de usuario hasta que se conecte una base de datos real.
 */
import type { Block } from '@/lib/template-utils';

/**
 * Los datos de ejemplo han sido eliminados para simular un entorno real.
 * La aplicación ahora comenzará con datos vacíos.
 */
export const campaigns: any[] = [];

/**
 * Los datos de las plantillas ahora se gestionan en la base de datos.
 * Este array se ha eliminado para evitar conflictos.
 */

/**
 * Los datos de ejemplo han sido eliminados para simular un entorno real.
 */
export const contacts: any[] = [];

/**
 * Los datos de ejemplo han sido eliminados para simular un entorno real.
 */
export const surveys: any[] = [];

/**
 * Los datos de ejemplo han sido eliminados para simular un entorno real.
 */
export const events: any[] = [];

/**
 * Plantillas de certificados de ejemplo (mapeado por event.id).
 * El contenido es una imagen PNG codificada en base64.
 * Los datos de ejemplo han sido eliminados.
 */
export const certificateTemplates: { id: string; name: string; content: string }[] = [];

/**
 * Datos de ejemplo para los remitentes gestionados por TI.
 */
export const managedSenders = [
  { name: 'Soporte Técnico', email: 'soporte@emailcraft.com' },
  { name: 'Notificaciones del Sistema', email: 'noreply@emailcraft.com' },
  { name: 'Comunicaciones Internas', email: 'comms@emailcraft.com' },
];
