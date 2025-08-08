import React, { useState, useEffect } from 'react';
import SignalRDemo from '@/components/SignalRDemo';
import ActivityFeed from '@/components/ActivityFeed';
import StatsGrid from '@/components/StatsGrid';
import HealthStatus from '@/components/HealthStatus';
import ConnectionStatusCard from '@/sections/ConnectionStatusCard';
import HeroHeader from '@/sections/HeroHeader';
import FeaturesGrid from '@/sections/FeaturesGrid';
import TechStackGrid from '@/sections/TechStackGrid';
import ArchitectureSection from '@/sections/ArchitectureSection';
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
  const [stats, setStats] = useState({
    users: 1247,
    activities: 3847,
    uptime: '99.9%',
    responseTime: '45ms'
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
  }, []);

  // Atualiza stats de forma periódica (mock) para mostrar mudança visual
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        users: prev.users + Math.floor(Math.random() * 3),
        activities: prev.activities + Math.floor(Math.random() * 5),
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
        <HeroHeader />

        {/* Saúde da API (GET simples) */}
        <HealthStatus />

        {/* Cards de estatísticas (mock) */}
        <StatsGrid stats={stats} />

        {/* Grid principal */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Demo do SignalR (tempo real) */}
          <div className="lg:col-span-2">
            <SignalRDemo 
              isConnected={isConnected}
              onConnectionChange={setIsConnected}
            />
          </div>

          {/* Feed simulado (apenas UI) */}
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>

        {/* Seções de referência/conteúdo estático para estudo */}
        <FeaturesGrid features={features} />
        <TechStackGrid techStack={techStack} />
        <ArchitectureSection />

        {/* Status resumido da conexão (rodapé) */}
        <ConnectionStatusCard isConnected={isConnected} />
      </div>
    </div>
  );
};

export default SkillLearning;