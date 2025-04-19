import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  isProfessional: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface RegisterData {
  username: string;
  password: string;
  email: string;
  fullName?: string;
  isProfessional?: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/login', { username, password });
      const userData = await response.json();
      setUser(userData);
      toast({
        title: "Acceso exitoso",
        description: "Bienvenido de vuelta a Kasa Serena Designs",
      });
    } catch (error) {
      toast({
        title: "Error al iniciar sesión",
        description: error instanceof Error ? error.message : "Credenciales inválidas",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/register', userData);
      const newUser = await response.json();
      setUser(newUser);
      toast({
        title: "Registro exitoso",
        description: "Bienvenido a Kasa Serena Designs",
      });
    } catch (error) {
      toast({
        title: "Error al registrarse",
        description: error instanceof Error ? error.message : "No se pudo crear la cuenta",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiRequest('POST', '/api/logout', {});
      setUser(null);
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error) {
      toast({
        title: "Error al cerrar sesión",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
