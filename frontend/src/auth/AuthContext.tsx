import { createContext, useContext, useState, type ReactNode } from "react";
import type { Usuario } from "../types";

const CHAVE = "salao:usuario";

interface AuthContextoValor {
  usuario: Usuario | null;
  entrar: (usuario: Usuario) => void;
  sair: () => void;
}

const AuthContexto = createContext<AuthContextoValor | null>(null);

// Lê o usuário guardado no navegador (para continuar logado ao recarregar a página).
function lerGuardado(): Usuario | null {
  try {
    const texto = localStorage.getItem(CHAVE);
    return texto ? (JSON.parse(texto) as Usuario) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(lerGuardado);

  const entrar = (novo: Usuario) => {
    setUsuario(novo);
    try {
      localStorage.setItem(CHAVE, JSON.stringify(novo));
    } catch {
      /* sem armazenamento: o login vale só enquanto a aba estiver aberta */
    }
  };

  const sair = () => {
    setUsuario(null);
    try {
      localStorage.removeItem(CHAVE);
    } catch {
      /* ignora */
    }
  };

  return <AuthContexto.Provider value={{ usuario, entrar, sair }}>{children}</AuthContexto.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContexto);
  if (!contexto) throw new Error("useAuth precisa estar dentro do AuthProvider");
  return contexto;
}
