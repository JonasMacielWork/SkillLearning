import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Zap, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { useAutenticacao } from "@/context/ContextoAutenticacao";

const CabecalhoHero: React.FC = () => {
  const { autenticado, usuario, sair } = useAutenticacao();
  const nomeExibicao = usuario?.username || usuario?.name || usuario?.email || "";

  return (
    <header className="text-center mb-16 animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold gradient-text">SkillLearning</h1>
      </div>

      <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
        API robusta e escalável construída com <span className="text-primary">.NET 9</span>,
        demonstrando Clean Architecture e padrões avançados de desenvolvimento.
      </p>

      <div className="flex flex-col items-center gap-3">
        {autenticado ? (
          <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-2xl bg-gradient-primary p-5 animate-scale-in">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-white/40">
                  <AvatarFallback>{(nomeExibicao || usuario?.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-accent ring-2 ring-white/80"></span>
              </div>
              <div className="text-left text-white">
                <p className="text-sm/none opacity-80">Bem-vindo de volta</p>
                <p className="text-xl font-semibold">{nomeExibicao || usuario?.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  {usuario?.email && <span className="text-xs/none opacity-80">{usuario.email}</span>}
                  {usuario?.role !== undefined && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/20">Permissão: {usuario.role}</span>
                  )}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button asChild size="sm" variant="outline" className="glass-card border-glass-border hover:border-primary">
                  <Link to="/me">Meu perfil</Link>
                </Button>
                <Button asChild size="sm" className="glass-button">
                  <a href="#" onClick={(e) => { e.preventDefault(); sair(); }}>Sair</a>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <Button asChild className="glass-button">
              <Link to="/register">Começar agora</Link>
            </Button>
            <Button asChild variant="outline" className="glass-card border-glass-border hover:border-primary">
              <Link to="/login">Já tenho conta</Link>
            </Button>
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          <a
            href="https://github.com/JonasMacielWork/SkillLearning.git"
            target="_blank"
            rel="noopener noreferrer"
            className="story-link inline-flex items-center gap-2"
          >
            <Github className="w-4 h-4" /> Repositório no GitHub
          </a>
        </p>
      </div>
    </header>
  );
};

export default CabecalhoHero;
