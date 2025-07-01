
// Este archivo es el archivo de configuración principal para tu aplicación Next.js.
// Aquí puedes definir opciones para la construcción, rendering, y otras características de Next.js.
import type {NextConfig} from 'next';

// Se define el objeto de configuración de Next.js con el tipo `NextConfig` importado.
const nextConfig: NextConfig = {
  /* config options here */

  // Configuración relacionada con TypeScript.
  typescript: {
    // Ignora los errores de TypeScript durante el proceso de construcción.
    // Esto puede ser útil en etapas tempranas del desarrollo, pero no se recomienda para producción.
    ignoreBuildErrors: true,
  },

  // Configuración relacionada con ESLint.
  eslint: {
    // Ignora los errores y advertencias de ESLint durante el proceso de construcción.
    // Similar a `ignoreBuildErrors` de TypeScript, útil durante el desarrollo pero a evitar en producción.
    ignoreDuringBuilds: true,
  },

  // Configuración para la optimización de imágenes.
  images: {
    // Permite cargar imágenes desde dominios remotos específicos.
    remotePatterns: [
      {
        protocol: 'https', // Define el protocolo permitido (por ejemplo, 'http', 'https').
        hostname: 'placehold.co', // Define el hostname o dominio permitido para las imágenes remotas.
        port: '', // Define el puerto permitido. Dejar vacío permite cualquier puerto por defecto para el protocolo.
        pathname: '/**', // Define el patrón de ruta permitido en el dominio. '**' permite cualquier ruta.
      },
    ],
  },
};

export default nextConfig;
