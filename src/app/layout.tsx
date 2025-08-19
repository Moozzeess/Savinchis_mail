
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';

/**
 * Metadatos de la aplicación para SEO y visualización en el navegador.
 */
export const metadata: Metadata = {
  title: 'Savinchis Mail',
  description: 'Aplicación para envío masivo de correos.',
};

/**
 * Layout raíz de la aplicación.
 * Configura la estructura HTML base, importa las fuentes globales, los estilos
 * y el componente Toaster para las notificaciones.
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - El contenido de la página actual.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap" rel="stylesheet" />
        {/* Script para inicializar el tema antes del pintado y evitar FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var s=localStorage.getItem('theme');var d=s? s==='dark' : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;var c=document.documentElement.classList; d?c.add('dark'):c.remove('dark');}catch(e){}})();",
          }}
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
