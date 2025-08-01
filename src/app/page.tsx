
import { redirect } from 'next/navigation';

/**
 * @file src/app/page.tsx
 * @description Página de inicio de la aplicación.
 * Redirige automáticamente a la página de login al cargar.
 */

// Página de inicio de la aplicación
export default function Home() {
  redirect('/login');
}
