import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAutenticacao } from "@/context/ContextoAutenticacao";

interface Propriedades {
  children: React.ReactNode;
}

const RotaProtegida: React.FC<Propriedades> = ({ children }) => {
  const { autenticado, carregando } = useAutenticacao();
  const location = useLocation();

  if (carregando) return null; // Poderia exibir um skeleton/spinner aqui
  if (!autenticado) return <Navigate to="/login" state={{ from: location }} replace />;

  return <>{children}</>;
};

export default RotaProtegida;
