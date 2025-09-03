
/**
 * @fileoverview Componente de UI "Progress" (Barra de Progreso).
 * Muestra un indicador del progreso de una tarea.
 *
 * @see https://ui.shadcn.com/docs/components/progress
 */
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

type Thickness = "sm" | "md" | "lg"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string
  /** Altura de la barra: sm (h-2), md (h-3), lg (h-4). Por defecto md */
  thickness?: Thickness
  /** Habilita transiciones suaves del indicador */
  animated?: boolean
  /** Muestra un marcador fino al final del progreso */
  showMarker?: boolean
}

/**
 * Componente Progress para visualizar el avance de una operación.
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, indicatorClassName, thickness = "md", animated = true, showMarker = false, ...props }, ref) => {
  const safeValue = typeof value === "number" ? value : 0
  const heightClass = thickness === "sm" ? "h-2" : thickness === "lg" ? "h-4" : "h-3"
  const markerPosition = `${safeValue}%`
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-secondary",
        heightClass,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 bg-primary",
          animated && "transition-all",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
      />
      {showMarker && (
        <div
          aria-hidden
          className="absolute top-0 bottom-0 w-0.5 bg-primary/40"
          style={{ left: markerPosition }}
        />
      )}
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
