import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { getUserByUsername, updateUserEmail } from "@/lib/userApi";

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState<{ id: string; username: string; email: string; role: number } | null>(null);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

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
    const uname = user?.username || user?.name;
    if (!uname) return;
    (async () => {
      try {
        const u = await getUserByUsername(uname);
        setProfile(u);
        setEmail(u.email || "");
      } catch (e) {
        toast({ title: "Erro ao carregar usuário", description: e instanceof Error ? e.message : "Falha ao obter dados.", variant: "destructive" });
      }
    })();
  }, [user?.username, user?.name]);

  const displayName = profile?.username || user?.username || user?.name || user?.email || "Usuário";

  const handleSaveEmail = async () => {
    if (!profile) return;
    const newEmail = email.trim();
    if (!newEmail) return;
    setSaving(true);
    try {
      await updateUserEmail(profile.id, newEmail);
      setProfile({ ...profile, email: newEmail });
      toast({ title: "Email atualizado", description: "Seu email foi alterado com sucesso." });
    } catch (e) {
      toast({ title: "Falha ao atualizar", description: e instanceof Error ? e.message : "Erro desconhecido.", variant: "destructive" });
    } finally {
      setSaving(false);
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
                <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{displayName}</h2>
                {(profile?.email || user?.email) && <p className="text-muted-foreground">{profile?.email ?? user?.email}</p>}
                {user?.role !== undefined && <p className="text-xs mt-1">Permissão: {user.role}</p>}
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button asChild variant="outline" className="glass-card border-glass-border hover:border-primary">
                  <Link to="/">Voltar</Link>
                </Button>
                <Button onClick={logout} className="glass-button">Sair</Button>
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              <Card className="glass-card p-4">
                <p className="text-xs text-muted-foreground">ID do usuário</p>
                <p className="font-medium break-all">{profile?.id ?? user?.id ?? "—"}</p>
              </Card>
              <Card className="glass-card p-4">
                <p className="text-xs text-muted-foreground">Nome</p>
                <p className="font-medium">{user?.name ?? "—"}</p>
              </Card>
              <Card className="glass-card p-4">
                <p className="text-xs text-muted-foreground">Username</p>
                <p className="font-medium">{profile?.username ?? user?.username ?? "—"}</p>
              </Card>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="font-semibold mb-3">Atualizar email</h3>
            <div className="space-y-3">
              <Input type="email" placeholder="novo@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button onClick={handleSaveEmail} disabled={saving || !profile} className="glass-button">
                {saving ? "Salvando..." : "Salvar"}
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

export default UserProfile;
