import React, { useEffect, useState } from "react";
import { useAutenticacao } from "@/context/ContextoAutenticacao";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { obterUsuarioPorUsername, atualizarEmailUsuario } from "@/lib/usuarioApi";

const PerfilUsuario: React.FC = () => {
  const { usuario, sair } = useAutenticacao();

  const [perfil, setPerfil] = useState<{ id: string; username: string; email: string; role: number } | null>(null);
  const [email, setEmail] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    document.title = "Perfil do Usuário | Skill Learning";
    // Meta description para SEO
    const name = "description";
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = "Perfil do usuário autenticado com informações e atalhos.";
  }, []);

  useEffect(() => {
    const uname = usuario?.username || usuario?.name;
    if (!uname) return;
    (async () => {
      try {
        const u = await obterUsuarioPorUsername(uname);
        setPerfil(u);
        setEmail(u.email || "");
      } catch (e) {
        toast({ title: "Erro ao carregar usuário", description: e instanceof Error ? e.message : "Falha ao obter dados.", variant: "destructive" });
      }
    })();
  }, [usuario?.username, usuario?.name]);

  const nomeExibicao = perfil?.username || usuario?.username || usuario?.name || usuario?.email || "Usuário";

  const salvarEmail = async () => {
    if (!perfil) return;
    const novoEmail = email.trim();
    if (!novoEmail) return;
    setSalvando(true);
    try {
      await atualizarEmailUsuario(perfil.id, novoEmail);
      setPerfil({ ...perfil, email: novoEmail });
      toast({ title: "Email atualizado", description: "Seu email foi alterado com sucesso." });
    } catch (e) {
      toast({ title: "Falha ao atualizar", description: e instanceof Error ? e.message : "Erro desconhecido.", variant: "destructive" });
    } finally {
      setSalvando(false);
    }
  };


  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background animado */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 animate-fade-in"></div>
      <div className="absolute top-24 -left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-24 -right-10 w-60 h-60 bg-secondary/20 rounded-full blur-3xl animate-float"></div>

      <div className="relative z-10 container mx-auto px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Perfil do Usuário</h1>
          <p className="text-muted-foreground mt-2">Veja e gerencie suas informações pessoais.</p>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          <Card className="glass-card p-6 md:col-span-2">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-white/30">
                <AvatarFallback>{nomeExibicao.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{nomeExibicao}</h2>
                {(perfil?.email || usuario?.email) && <p className="text-muted-foreground">{perfil?.email ?? usuario?.email}</p>}
                {usuario?.role !== undefined && <p className="text-xs mt-1">Permissão: {usuario.role}</p>}
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button asChild variant="outline" className="glass-card border-glass-border hover:border-primary">
                  <Link to="/">Voltar</Link>
                </Button>
                <Button onClick={sair} className="glass-button">Sair</Button>
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              <Card className="glass-card p-4">
                <p className="text-xs text-muted-foreground">ID do usuário</p>
                <p className="font-medium break-all">{perfil?.id ?? usuario?.id ?? "—"}</p>
              </Card>
              <Card className="glass-card p-4">
                <p className="text-xs text-muted-foreground">Nome</p>
                <p className="font-medium">{usuario?.name ?? "—"}</p>
              </Card>
              <Card className="glass-card p-4">
                <p className="text-xs text-muted-foreground">Username</p>
                <p className="font-medium">{perfil?.username ?? usuario?.username ?? "—"}</p>
              </Card>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="font-semibold mb-3">Atualizar email</h3>
            <div className="space-y-3">
              <Input type="email" placeholder="novo@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button onClick={salvarEmail} disabled={salvando || !perfil} className="glass-button">
                {salvando ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="font-semibold mb-3">Atalhos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="story-link">Página inicial</Link></li>
              <li><a href="https://github.com/JonasMacielWork/SkillLearning.git" target="_blank" rel="noopener noreferrer" className="story-link">Repositório no GitHub</a></li>
            </ul>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default PerfilUsuario;
