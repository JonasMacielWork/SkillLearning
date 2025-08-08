import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAutenticacao } from "@/context/ContextoAutenticacao";
import { useNavigate, Link } from "react-router-dom";

const FormularioRegistro: React.FC = () => {
  const { registrar } = useAutenticacao();
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erroServidor, setErroServidor] = useState<{ message: string; details?: string[] } | null>(null);
  const navigate = useNavigate();

  const aoEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroServidor(null);
    setCarregando(true);
    try {
      await registrar(usuario, email, senha);
      navigate("/login");
    } catch (err: any) {
      const problem = err?.problem as { title?: string; detail?: string; errors?: Record<string, string[]>; status?: number } | undefined;
      const details = problem?.errors
        ? Object.entries(problem.errors)
            .flatMap(([campo, msgs]) => (Array.isArray(msgs) ? msgs.map((m) => `${campo}: ${m}`) : []))
        : undefined;
      const isServer = typeof problem?.status === "number" && problem.status >= 500;
      const message = isServer
        ? "Erro no servidor. Tente novamente mais tarde."
        : [problem?.title || err?.message || "Erro no cadastro", problem?.detail].filter(Boolean).join(" — ");
      setErroServidor({ message, details });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Card className="glass-card border-glass-border p-6 max-w-md w-full mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Criar conta</h1>
        <p className="text-sm text-muted-foreground">Registre-se para começar</p>
      </header>
      {erroServidor && (
        <Alert variant="destructive" className="glass-card border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{erroServidor.message}</AlertTitle>
          <AlertDescription>
            {erroServidor.details && erroServidor.details.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {erroServidor.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            ) : null}
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={aoEnviar} className="space-y-4 mt-4">
        <div>
          <label className="text-sm">Usuário</label>
          <Input value={usuario} onChange={(e) => setUsuario(e.target.value)} required className="glass-card border-glass-border" />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="glass-card border-glass-border" />
        </div>
        <div>
          <label className="text-sm">Senha</label>
          <Input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required className="glass-card border-glass-border" />
        </div>
        <Button type="submit" disabled={carregando} className="glass-button w-full">{carregando ? "Cadastrando..." : "Cadastrar"}</Button>
      </form>
      <footer className="mt-4 text-sm">
        Já tem conta? <Link className="story-link" to="/login">Entrar</Link>
      </footer>
    </Card>
  );
};

export default FormularioRegistro;
