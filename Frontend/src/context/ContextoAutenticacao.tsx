// Contexto de Autenticação (JWT): centraliza login/registro/logout, persiste tokens e hidrata o usuário; expõe useAutenticacao para rotas protegidas.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearTokens, getTokens, isExpired, login as apiLogin, register as apiRegister, setTokens, parseJwt } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

export type UsuarioAutenticado = { id?: string; email?: string; name?: string; username?: string; role?: number } | null;

type ContextoAutenticacao = {
  usuario: UsuarioAutenticado;
  autenticado: boolean;
  carregando: boolean;
  entrar: (usuario: string, senha: string) => Promise<void>;
  registrar: (usuario: string, email: string, senha: string) => Promise<void>;
  sair: () => void;
};

const ContextoAutenticacaoCtx = createContext<ContextoAutenticacao | undefined>(undefined);

export const ProvedorAutenticacao: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioAutenticado>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Hidrata tokens e usuário de forma ingênua a partir do payload do token, se presente
    const tokens = getTokens();
    if (tokens?.accessToken && !isExpired(tokens.accessToken, 5)) {
        const payload = parseJwt(tokens.accessToken) || {};
        setUsuario({ id: payload.sub, email: payload.email, name: payload.name, username: (payload as any).username ?? payload.name });
    }
    setCarregando(false);
  }, []);

  const entrar = useCallback(async (nomeUsuario: string, senha: string) => {
    const data: any = await apiLogin({ username: nomeUsuario, password: senha });
    if (data.accessToken && data.refreshToken) setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    const payload = data.accessToken ? (parseJwt(data.accessToken) || {}) : {};
    setUsuario({
      id: data.id ?? payload.sub,
      email: data.email ?? payload.email,
      name: payload.name ?? payload.given_name ?? undefined,
      username: data.username ?? payload.username ?? nomeUsuario,
      role: data.role ?? undefined,
    });

    // Garante que o evento de login apareça no feed ao redirecionar
    try {
      const raw = localStorage.getItem('signalr.activities');
      const list = raw ? JSON.parse(raw) : [];
      const newEntry = {
        id: Date.now().toString(),
        type: 'user_login',
        user: data.username ?? payload.username ?? nomeUsuario,
        timestamp: new Date().toISOString(),
      };
      const next = [newEntry, ...list].slice(0, 10);
      localStorage.setItem('signalr.activities', JSON.stringify(next));
    } catch {}

    toast({ title: "Bem-vindo!", description: "Login realizado com sucesso." });
  }, []);

  const registrar = useCallback(async (nomeUsuario: string, email: string, senha: string) => {
    const data = await apiRegister({ username: nomeUsuario, email, password: senha });
    // Alguns backends já retornam tokens no registro; se sim, persiste
    if ((data as any).accessToken && (data as any).refreshToken) {
      setTokens({ accessToken: (data as any).accessToken, refreshToken: (data as any).refreshToken });
      const payload = parseJwt((data as any).accessToken) || {};
      setUsuario({ id: payload.sub, email: payload.email ?? email, name: payload.name ?? payload.username ?? nomeUsuario });
    }
    toast({ title: "Conta criada!", description: "Cadastro realizado com sucesso." });
  }, []);

  const sair = useCallback(() => {
    clearTokens();
    setUsuario(null);
    toast({ title: "Até logo!", description: "Você saiu da sua conta." });
  }, []);

  const valor = useMemo(() => ({
    usuario,
    autenticado: !!usuario,
    carregando,
    entrar,
    registrar,
    sair,
  }), [usuario, carregando, entrar, registrar, sair]);

  return <ContextoAutenticacaoCtx.Provider value={valor}>{children}</ContextoAutenticacaoCtx.Provider>;
};

export function useAutenticacao() {
  const ctx = useContext(ContextoAutenticacaoCtx);
  if (!ctx) throw new Error("useAutenticacao deve ser usado dentro de ProvedorAutenticacao");
  return ctx;
}
