// Este archivo es el archivo de configuración principal para Next.js.
import type {NextConfig} from 'next';

// Se define el objeto de configuración de Next.js con el tipo `NextConfig` importado.
const nextConfig: NextConfig = {
  // Configuración de reescritura de rutas para el proxy
  async rewrites() {
    return [
      {
        source: '/api/mailing/:path*',
        destination: 'https://events.papalote.org.mx/api/mailing/:path*',
      },
    ]
  },
  
  // Configuración de CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },

  // Configuración relacionada con TypeScript.
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configuración relacionada con ESLint.
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configuración para la optimización de imágenes.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
