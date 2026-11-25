import { Navigate, Route, Routes } from "react-router-dom";
import { RotaProtegida, RotaPublica } from "./auth/Rotas";
import Layout from "./components/Layout";
import Agendamentos from "./pages/Agendamentos";
import Cadastro from "./pages/Cadastro";
import Clientes from "./pages/Clientes";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profissionais from "./pages/Profissionais";
import Servicos from "./pages/Servicos";

export default function App() {
  return (
    <Routes>
      {/* Telas abertas: login e cadastro */}
      <Route element={<RotaPublica />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Route>

      {/* Telas internas: só para quem está logado */}
      <Route element={<RotaProtegida />}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/profissionais" element={<Profissionais />} />
          <Route path="/servicos" element={<Servicos />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
