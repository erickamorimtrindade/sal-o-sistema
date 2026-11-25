import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Só deixa passar quem está logado; os demais vão para o login.
export function RotaProtegida() {
  const { usuario } = useAuth();
  return usuario ? <Outlet /> : <Navigate to="/login" replace />;
}

// Login e cadastro: quem já está logado vai direto para a Home.
export function RotaPublica() {
  const { usuario } = useAuth();
  return usuario ? <Navigate to="/" replace /> : <Outlet />;
}
