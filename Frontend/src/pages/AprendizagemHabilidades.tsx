import React, { useState, useEffect } from 'react';
import DemoSignalR from '@/components/DemoSignalR';
import FeedAtividades from '@/components/FeedAtividades';
import GradeEstatisticas from '@/components/GradeEstatisticas';
import EstadoSaude from '@/components/EstadoSaude';
import CartaoStatusConexao from '@/sections/CartaoStatusConexao';
import CabecalhoHero from '@/sections/CabecalhoHero';
import GradeRecursos from '@/sections/GradeRecursos';
import GradeTecnologias from '@/sections/GradeTecnologias';
import SecaoArquitetura from '@/sections/SecaoArquitetura';
import { features } from '@/data/features';
import { techStack } from '@/data/techStack';

/*
  Home com exemplos simples para estudo
  - Mantém: Header, Health, Stats, SignalR demo, Feed simulado, seções de features/stack/arquitetura, card de status
  - Comentários curtos explicam cada bloco
*/
const SkillLearning = () => {
  // Estado do SignalR (apenas reflete conexão atual no cabeçalho/rodapé)
  const [isConnected, setIsConnected] = useState(false);

  // Estatísticas fictícias para Cards (demonstra UI e estado)
  const [estatisticas, setEstatisticas] = useState({
    usuarios: 1247,
    atividades: 3847,
    tempoAtivo: '99.9%',
    tempoResposta: '45ms'
  });

  // SEO básico da página
  useEffect(() => {
    document.title = 'SkillLearning | Demo .NET + React + SignalR';
    const name = 'description';
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = 'Exemplos simples: autenticação JWT, SignalR em tempo real, UI com Tailwind/shadcn.';

    // Canonical link
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = window.location.href;

    // JSON-LD simples para Website
    const ldId = 'ld-json-website';
    let ld = document.getElementById(ldId) as HTMLScriptElement | null;
    const ldData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "SkillLearning",
      url: window.location.origin,
      inLanguage: "pt-BR"
    } as const;
    if (!ld) {
      ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.id = ldId;
      document.head.appendChild(ld);
    }
    ld.text = JSON.stringify(ldData);
  }, []);

  // Atualiza stats de forma periódica (mock) para mostrar mudança visual
  useEffect(() => {
    const interval = setInterval(() => {
      setEstatisticas(prev => ({
        ...prev,
        usuarios: prev.usuarios + Math.floor(Math.random() * 3),
        atividades: prev.atividades + Math.floor(Math.random() * 5),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fundo animado com leve glass/gradiente */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 animate-float"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Cabeçalho com CTAs e info do usuário se logado */}
        <CabecalhoHero />

        {/* Saúde da API (GET simples) */}
        <EstadoSaude />

        {/* Cards de estatísticas (mock) */}
        <GradeEstatisticas estatisticas={estatisticas} />

        {/* Grid principal */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Demo do SignalR (tempo real) */}
          <div className="lg:col-span-2">
            <DemoSignalR 
              isConnected={isConnected}
              onConnectionChange={setIsConnected}
            />
          </div>

          {/* Feed simulado (apenas UI) */}
          <div className="lg:col-span-1">
            <FeedAtividades />
          </div>
        </div>

        {/* Seções de referência/conteúdo estático para estudo */}
        <GradeRecursos features={features} />
        <GradeTecnologias techStack={techStack} />
        <SecaoArquitetura />

        {/* Status resumido da conexão (rodapé) */}
        <CartaoStatusConexao isConnected={isConnected} />
      </div>
    </div>
  );
};

export default SkillLearning;