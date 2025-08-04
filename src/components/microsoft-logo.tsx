
/**
 * Componente SVG para el logo de Microsoft.
 * @param props - Propiedades SVG estándar.
 */

import type { SVGProps } from "react";

export function MicrosoftLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 21 21"
      {...props}
    >
      <path fill="#f25022" d="M1 1h9v9H1z"></path>
      <path fill="#00a4ef" d="M1 11h9v9H1z"></path>
      <path fill="#7fba00" d="M11 1h9v9h-9z"></path>
      <path fill="#ffb900" d="M11 11h9v9h-9z"></path>
    </svg>
  );
}
