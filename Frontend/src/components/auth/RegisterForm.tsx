import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<{ message: string; details?: string[] } | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/login");
    } catch (err: any) {
      const problem = err?.problem as { title?: string; detail?: string; errors?: Record<string, string[]>; status?: number } | undefined;
      const details = problem?.errors
        ? Object.entries(problem.errors)
            .flatMap(([field, msgs]) => (Array.isArray(msgs) ? msgs.map((m) => `${field}: ${m}`) : []))
        : undefined;
      const isServer = typeof problem?.status === "number" && problem.status >= 500;
      const message = isServer
        ? "Erro no servidor. Tente novamente mais tarde."
        : [problem?.title || err?.message || "Erro no cadastro", problem?.detail].filter(Boolean).join(" — ");
      setServerError({ message, details });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card border-glass-border p-6 max-w-md w-full mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Criar conta</h1>
        <p className="text-sm text-muted-foreground">Registre-se para começar</p>
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
          <Input value={username} onChange={(e) => setUsername(e.target.value)} required className="glass-card border-glass-border" />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="glass-card border-glass-border" />
        </div>
        <div>
          <label className="text-sm">Senha</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="glass-card border-glass-border" />
        </div>
        <Button type="submit" disabled={loading} className="glass-button w-full">{loading ? "Cadastrando..." : "Cadastrar"}</Button>
      </form>
      <footer className="mt-4 text-sm">
        Já tem conta? <Link className="story-link" to="/login">Entrar</Link>
      </footer>
    </Card>
  );
};

export default RegisterForm;
