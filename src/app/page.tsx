import { redirect } from 'next/navigation';

/**
 * Página de inicio de la aplicación.
 * Redirige automáticamente al panel de control principal.
 */
export default function Home() {
  redirect('/dashboard');
}
