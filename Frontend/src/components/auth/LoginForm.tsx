import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<{ message: string; details?: string[] } | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err: any) {
      const problem = err?.problem as { title?: string; detail?: string; errors?: Record<string, string[]> } | undefined;
      const details = problem?.errors
        ? Object.entries(problem.errors)
            .flatMap(([field, msgs]) => (Array.isArray(msgs) ? msgs.map((m) => `${field}: ${m}`) : []))
        : undefined;
      const message = [problem?.title || err?.message || "Erro no login", problem?.detail].filter(Boolean).join(" — ");
      setServerError({ message, details });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card border-glass-border p-6 max-w-md w-full mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Entrar</h1>
        <p className="text-sm text-muted-foreground">Acesse sua conta</p>
      </header>
      {serverError && (
        <Alert variant="destructive" className="glass-card border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{serverError.message}</AlertTitle>
          <AlertDescription>
            {serverError.details && serverError.details.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {serverError.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            ) : null}
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={onSubmit} className="space-y-4 mt-4">
        <div>
          <label className="text-sm">Usuário</label>
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="glass-card border-glass-border" />
        </div>
        <div>
          <label className="text-sm">Senha</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="glass-card border-glass-border" />
        </div>
        <Button type="submit" disabled={loading} className="glass-button w-full">{loading ? "Entrando..." : "Entrar"}</Button>
      </form>
      <footer className="mt-4 text-sm">
        Não tem conta? <Link className="story-link" to="/register">Cadastre-se</Link>
      </footer>
    </Card>
  );
};

export default LoginForm;
