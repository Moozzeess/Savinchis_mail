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
