import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  rol: string;
  puntos: number;
  nivel: number;
  suscripcion?: string; // "free", "premium", "professional"
}

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  setUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await api.get("/auth/me");
          setUsuario(data.usuario);
        } catch (error) {
          console.error("Error verificando sesión:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, usuario: Usuario) => {
    localStorage.setItem("token", token);
    setUsuario(usuario);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        login,
        logout,
        setUsuario,
        isAuthenticated: !!usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
