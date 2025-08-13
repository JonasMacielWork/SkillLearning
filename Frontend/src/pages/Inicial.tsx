import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { 
  Zap, Github, Users, Activity, Timer, HeartPulse, RefreshCw,
  User, LogIn, MessageSquare, TrendingUp, Shield, Database,
  Cloud, Code, Smartphone, BarChart3
} from 'lucide-react';
import { useAutenticacao } from '@/context/ContextoAutenticacao';
import { useSaude } from '@/hooks/useSaude';
import { useAtividadesSignalR } from '@/hooks/useAtividadesSignalR';
import { useRegistroAtividades } from '@/hooks/useRegistroAtividades';

const Inicial = () => {
  const { autenticado, usuario, sair } = useAutenticacao();
  const { data: healthData, isLoading: healthLoading, isError: healthError, refetch: refetchHealth, isFetching: healthFetching } = useSaude();
  const { activities, addActivity } = useRegistroAtividades();
  
  // Estados consolidados
  const [isSignalRConnected, setIsSignalRConnected] = useState(false);
  const [stats] = useState({
    usuarios: 1247,
    atividades: 3847,
    tempoAtivo: '99.9%',
    tempoResposta: '45ms'
  });

  // SEO e título
  useEffect(() => {
    document.title = 'SkillLearning | Demo .NET + React + SignalR';
    const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (meta) {
      meta.content = 'API robusta construída com .NET 9, demonstrando Clean Architecture e padrões avançados.';
    }
  }, []);

  // SignalR simplificado
  useAtividadesSignalR({
    depsKey: 0,
    onConnectedChange: setIsSignalRConnected,
    onUserLoggedIn: (username) => addActivity({ type: 'user_login', user: username, timestamp: new Date() }),
    onNewUserRegistered: (username) => addActivity({ type: 'user_joined', user: username, timestamp: new Date() })
  });

  // Dados das features inline
  const features = [
    { icon: <Shield className="w-6 h-6 text-white" />, title: 'Autenticação JWT', description: 'Sistema seguro com refresh tokens', color: 'primary' },
    { icon: <Database className="w-6 h-6 text-white" />, title: 'PostgreSQL + Redis', description: 'Persistência robusta com cache', color: 'secondary' },
    { icon: <Cloud className="w-6 h-6 text-white" />, title: 'Cloud Ready', description: 'AWS, Kubernetes, Terraform', color: 'accent' },
    { icon: <BarChart3 className="w-6 h-6 text-white" />, title: 'SignalR Real-time', description: 'Comunicação em tempo real', color: 'primary' }
  ];

  const techStack = [
    { name: '.NET 9', category: 'Backend' },
    { name: 'React 18', category: 'Frontend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Redis', category: 'Cache' },
    { name: 'Kafka', category: 'Messaging' },
    { name: 'AWS', category: 'Cloud' }
  ];

  const nomeExibicao = usuario?.username || usuario?.name || usuario?.email || "";
  const healthy = healthData?.healthy;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Hero Inline */}
      <header className="text-center mb-16 animate-fade-in px-6 py-10">
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

        {/* Auth Status Inline */}
        {autenticado ? (
          <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-2xl bg-gradient-primary p-5 animate-scale-in">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-white/40">
                <AvatarFallback>{(nomeExibicao || 'U').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-left text-white flex-1">
                <p className="text-sm opacity-80">Bem-vindo de volta</p>
                <p className="text-xl font-semibold">{nomeExibicao || usuario?.email}</p>
                {usuario?.email && <span className="text-xs opacity-80">{usuario.email}</span>}
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline" className="glass-card border-glass-border">
                  <Link to="/me">Perfil</Link>
                </Button>
                <Button size="sm" className="glass-button" onClick={sair}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="glass-button">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="glass-card border-glass-border">
              <Link to="/register">Cadastrar</Link>
            </Button>
          </div>
        )}
      </header>

      <main className="container mx-auto px-6 space-y-12">
        {/* Health Status Inline */}
        <section aria-label="Status da API">
          <Card className="glass-card p-4 border-glass-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  healthLoading ? 'bg-muted' : healthy ? 'bg-accent' : 'bg-destructive'
                }`}></div>
                <HeartPulse className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {healthLoading ? 'Verificando API...' : healthy ? 'API Saudável' : 'API Indisponível'}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => refetchHealth()} disabled={healthFetching}>
                <RefreshCw className={`w-4 h-4 mr-2 ${healthFetching ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </Card>
        </section>

        {/* Stats Grid Inline */}
        <section aria-label="Estatísticas">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Usuários', value: stats.usuarios.toLocaleString(), color: 'primary' },
              { icon: Activity, label: 'Atividades', value: stats.atividades.toLocaleString(), color: 'secondary' },
              { icon: Zap, label: 'Uptime', value: stats.tempoAtivo, color: 'accent' },
              { icon: Timer, label: 'Response', value: stats.tempoResposta, color: 'primary' }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="glass-card p-4 text-center hover-lift">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* SignalR Status Inline */}
        <section aria-label="Status SignalR">
          <Card className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                SignalR Demo
              </h3>
              <Badge variant={isSignalRConnected ? 'default' : 'destructive'}>
                {isSignalRConnected ? 'Conectado' : 'Desconectado'}
              </Badge>
            </div>
            
            {/* Activities Feed Inline */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {activities.slice(-5).map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.user || 'Sistema'}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.type === 'user_login' ? 'Fez login' : 'Se registrou'}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Features Grid Inline */}
        <section aria-label="Recursos">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Features Principais</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="glass-card p-6 text-center hover-lift">
                <div className={`w-12 h-12 rounded-xl bg-gradient-${feature.color} flex items-center justify-center mx-auto mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Tech Stack Inline */}
        <section aria-label="Stack Tecnológico">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Stack Tecnológico</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((tech, i) => (
              <Card key={i} className="glass-card p-4 text-center hover-lift">
                <p className="font-semibold">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.category}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Architecture Section Inline */}
        <section aria-label="Arquitetura" className="text-center">
          <h2 className="text-3xl font-bold mb-8 gradient-text">Arquitetura</h2>
          <Card className="glass-card p-8">
            <p className="text-lg text-muted-foreground mb-6">
              Clean Architecture com separação clara de responsabilidades
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Domain', desc: 'Entidades e regras de negócio' },
                { title: 'Application', desc: 'Casos de uso e orquestração' },
                { title: 'Infrastructure', desc: 'Persistência e serviços externos' }
              ].map((layer, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">{layer.title}</h4>
                  <p className="text-sm text-muted-foreground">{layer.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 mt-16">
        <p className="text-muted-foreground">
          Desenvolvido com ❤️ usando .NET 9 + React + TypeScript
        </p>
      </footer>
    </div>
  );
};

export default Inicial;
