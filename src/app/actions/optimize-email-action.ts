'use server';

import {
  optimizeEmailContent,
  type OptimizeEmailContentInput,
  type OptimizeEmailContentOutput,
} from '@/ai/flows/optimize-email-content';
import { hasPermission, APP_PERMISSIONS, type Role } from '@/lib/permissions';


interface OptimizeEmailContentInputWithRole extends OptimizeEmailContentInput {
  role: Role;
}

/**
 * Acción de servidor para optimizar el contenido de un correo electrónico utilizando un flujo de IA.
 * Incluye verificación de permisos basada en rol.
 * @param input - El contenido del correo, la descripción de la audiencia y el rol del usuario.
 * @returns Una promesa que se resuelve con el contenido del correo optimizado.
 * @throws Arrojará un error si la optimización falla o el usuario no tiene permisos.
 */
export async function optimizeEmailContentAction(
  input: OptimizeEmailContentInputWithRole
): Promise<OptimizeEmailContentOutput> {
  const { role, ...optimizeInput } = input;

  if (!hasPermission(role, APP_PERMISSIONS.SEND_CAMPAIGN)) {
    throw new Error('Acceso denegado: No tienes permiso para optimizar contenido.');
  }

  try {
    const result = await optimizeEmailContent(optimizeInput);
    return result;
  } catch (error) {
    console.error('Error optimizing email content:', error);
    throw new Error('No se pudo optimizar el contenido del correo electrónico.');
  }
}
