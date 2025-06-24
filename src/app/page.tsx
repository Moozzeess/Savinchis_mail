import { redirect } from 'next/navigation';

/**
 * Página de inicio de la aplicación.
 * Redirige automáticamente a la página de login.
 */
export default function Home() {
  redirect('/login');
}
