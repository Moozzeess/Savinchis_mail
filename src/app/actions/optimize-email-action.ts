'use server';

import {
  optimizeEmailContent,
  type OptimizeEmailContentInput,
  type OptimizeEmailContentOutput,
} from '@/ai/flows/optimize-email-content';

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
