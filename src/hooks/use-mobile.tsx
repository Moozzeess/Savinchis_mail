import * as React from "react"

/**
 * Punto de corte para la detección de dispositivos móviles en píxeles.
 */
const MOBILE_BREAKPOINT = 768

/**
 * Hook personalizado para detectar si el ancho de la pantalla actual se considera móvil.
 * @returns {boolean} `true` si el ancho de la pantalla es menor que el punto de corte móvil, de lo contrario `false`.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
