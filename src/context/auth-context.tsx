
'use client';
/**
 * @fileoverview Contexto de autenticación para gestionar el estado del usuario.
 * Proporciona un hook `useAuth` para acceder al rol del usuario y funciones
 * de login/logout en toda la aplicación. El estado se persiste en localStorage
 * para simular una sesión.
 */
import * as React from 'react';
import type { Role } from '@/lib/permissions';
import { ROLES } from '@/lib/permissions';

interface AuthContextType {
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<Role | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const storedRole = localStorage.getItem('userRole') as Role | null;
      if (storedRole && Object.values(ROLES).includes(storedRole)) {
        setRole(storedRole);
      }
    } catch (error) {
      console.error("No se pudo acceder a localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newRole: Role) => {
    setRole(newRole);
    try {
      localStorage.setItem('userRole', newRole);
    } catch (error) {
       console.error("No se pudo acceder a localStorage", error);
    }
  };

  const logout = () => {
    setRole(null);
     try {
      localStorage.removeItem('userRole');
    } catch (error) {
       console.error("No se pudo acceder a localStorage", error);
    }
  };

  const value = { role, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
}

/**
 * Hook para acceder al contexto de autenticación.
 * Proporciona el rol del usuario actual y las funciones de login/logout.
 * @returns El contexto de autenticación.
 */
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
