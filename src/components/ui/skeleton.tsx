/**
 * @fileoverview Componente de UI "Skeleton" (Esqueleto).
 * Se utiliza para mostrar un marcador de posición de la interfaz
 * mientras se carga el contenido.
 *
 * @see https://ui.shadcn.com/docs/components/skeleton
 */
import { cn } from "@/lib/utils"

/**
 * Componente Skeleton para crear pantallas de carga visuales.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Propiedades del div.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
