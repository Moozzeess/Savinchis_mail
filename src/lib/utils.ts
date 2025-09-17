import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Función de utilidad para combinar nombres de clase de forma condicional.
 * Utiliza `clsx` para las clases condicionales y `tailwind-merge` para resolver
 * conflictos entre clases de Tailwind CSS.
 *
 * @param inputs - Una lista de nombres de clase u objetos de clases condicionales.
 * @returns Una cadena de nombres de clase combinados y optimizados.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Obtiene la URL base del API considerando distintos entornos (local, Vercel, etc.).
 *
 * Orden de prioridad:
 * - NEXT_PUBLIC_SITE_URL
 * - APP_URL
 * - VERCEL_URL (agregando https si falta)
 * - http://localhost:3000
 */
export function getApiUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || process.env.VERCEL_URL
  if (fromEnv) {
    const url = fromEnv.startsWith('http') ? fromEnv : `https://${fromEnv}`
    return url.replace(/\/$/, '')
  }
  return 'http://localhost:3000'
}
