import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicial from "./pages/Inicial";
import NotFound from "./pages/NotFound";
import Entrar from "./pages/Auth/Entrar";
import Cadastrar from "./pages/Auth/Cadastrar";
import PerfilUsuario from "./pages/PerfilUsuario";
import { ProvedorAutenticacao } from "@/context/ContextoAutenticacao";
import RotaProtegida from "@/components/auth/RotaProtegida";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ProvedorAutenticacao>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Inicial />} />
            <Route path="/login" element={<Entrar />} />
            <Route path="/register" element={<Cadastrar />} />
            <Route path="/me" element={<RotaProtegida><PerfilUsuario /></RotaProtegida>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProvedorAutenticacao>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
