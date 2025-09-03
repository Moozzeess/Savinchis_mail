
/**
 * @fileoverview Componente de UI "Badge" (Insignia).
 * Muestra una pequeña insignia o etiqueta, comúnmente usada para estados o categorías.
 *
 * @see https://ui.shadcn.com/docs/components/badge
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Define las variantes de estilo para el componente de insignia.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
        warning:
          "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
        info:
          "border-transparent bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200",
      },
      pulse: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      pulse: false,
    },
  }
)

/**
 * Propiedades del componente Badge.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  pulse?: boolean
}

/**
 * Componente Badge para mostrar etiquetas o estados.
 * @param {BadgeProps} props - Propiedades del componente.
 */
function Badge({ className, variant, pulse = false, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, pulse }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
