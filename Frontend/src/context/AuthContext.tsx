// Contexto de Autenticação (JWT): centraliza login/registro/logout, persiste tokens e hidrata o usuário; expõe useAuth para rotas protegidas.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearTokens, getTokens, isExpired, login as apiLogin, register as apiRegister, setTokens, parseJwt } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";

export type AuthUser = { id?: string; email?: string; name?: string; username?: string; role?: number } | null;

type AuthContextType = {
  user: AuthUser;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate tokens and naive user from token payload if present
    const tokens = getTokens();
    if (tokens?.accessToken && !isExpired(tokens.accessToken, 5)) {
        const payload = parseJwt(tokens.accessToken) || {};
        setUser({ id: payload.sub, email: payload.email, name: payload.name, username: (payload as any).username ?? payload.name });
    }
    setLoading(false);
  }, []);

  const handleLogin = useCallback(async (username: string, password: string) => {
    const data: any = await apiLogin({ username, password });
    if (data.accessToken && data.refreshToken) setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    const payload = data.accessToken ? (parseJwt(data.accessToken) || {}) : {};
    setUser({
      id: data.id ?? payload.sub,
      email: data.email ?? payload.email,
      name: payload.name ?? payload.given_name ?? undefined,
      username: data.username ?? payload.username ?? username,
      role: data.role ?? undefined,
    });

    // Garante que o evento de login apareça no feed ao redirecionar
    try {
      const raw = localStorage.getItem('signalr.activities');
      const list = raw ? JSON.parse(raw) : [];
      const newEntry = {
        id: Date.now().toString(),
        type: 'user_login',
        user: data.username ?? payload.username ?? username,
        timestamp: new Date().toISOString(),
      };
      const next = [newEntry, ...list].slice(0, 10);
      localStorage.setItem('signalr.activities', JSON.stringify(next));
    } catch {}

    toast({ title: "Bem-vindo!", description: "Login realizado com sucesso." });
  }, []);

  const handleRegister = useCallback(async (username: string, email: string, password: string) => {
    const data = await apiRegister({ username, email, password });
    // Alguns backends já retornam tokens no registro; se sim, persiste
    if ((data as any).accessToken && (data as any).refreshToken) {
      setTokens({ accessToken: (data as any).accessToken, refreshToken: (data as any).refreshToken });
      const payload = parseJwt((data as any).accessToken) || {};
      setUser({ id: payload.sub, email: payload.email ?? email, name: payload.name ?? payload.username ?? username });
    }
    toast({ title: "Conta criada!", description: "Cadastro realizado com sucesso." });
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    toast({ title: "Até logo!", description: "Você saiu da sua conta." });
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout,
  }), [user, loading, handleLogin, handleRegister, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
