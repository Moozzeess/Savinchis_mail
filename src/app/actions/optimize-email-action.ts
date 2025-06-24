'use server';

import {
  optimizeEmailContent,
  type OptimizeEmailContentInput,
  type OptimizeEmailContentOutput,
} from '@/ai/flows/optimize-email-content';

/**
 * Acción de servidor para optimizar el contenido de un correo electrónico utilizando un flujo de IA.
 * @param input - El contenido del correo y la descripción de la audiencia.
 * @returns Una promesa que se resuelve con el contenido del correo optimizado.
 * @throws Arrojará un error si la optimización falla.
 */
export async function optimizeEmailContentAction(
  input: OptimizeEmailContentInput
): Promise<OptimizeEmailContentOutput> {
  try {
    const result = await optimizeEmailContent(input);
    return result;
  } catch (error) {
    console.error('Error optimizing email content:', error);
    throw new Error('No se pudo optimizar el contenido del correo electrónico.');
  }
}
