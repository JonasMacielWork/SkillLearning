import React, { useState, useEffect } from 'react';
import { Activity, Users, Zap, Code, Database, MessageSquare, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import SignalRDemo from '@/components/SignalRDemo';
import ActivityFeed from '@/components/ActivityFeed';
import StatsGrid from '@/components/StatsGrid';

const SkillLearning = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({
    users: 1247,
    activities: 3847,
    uptime: '99.9%',
    responseTime: '45ms'
  });

  useEffect(() => {
    // Simulate stats updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        users: prev.users + Math.floor(Math.random() * 3),
        activities: prev.activities + Math.floor(Math.random() * 5),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Autenticação JWT",
      description: "Sistema completo com refresh tokens",
      color: "primary"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "SignalR Real-time",
      description: "Notificações em tempo real",
      color: "secondary"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "CQRS + Redis",
      description: "Cache distribuído e performance",
      color: "accent"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Clean Architecture",
      description: "DDD e padrões avançados",
      color: "primary"
    }
  ];

  const techStack = [
    ".NET 9", "C#", "Entity Framework", "SignalR", "PostgreSQL", 
    "Redis", "Apache Kafka", "Docker", "Azure", "React", 
    "TypeScript", "Tailwind CSS", "AutoMapper", "FluentValidation"
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 animate-float"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header Section */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              SkillLearning
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            API robusta e escalável construída com <span className="text-primary">.NET 9</span>, 
            demonstrando Clean Architecture e padrões avançados de desenvolvimento.
          </p>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button className="glass-button">
              <Activity className="w-4 h-4 mr-2" />
              Documentação
            </Button>
            <Button variant="outline" className="glass-card border-glass-border hover:border-primary">
              <Code className="w-4 h-4 mr-2" />
              Ver Código
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* SignalR Demo */}
          <div className="lg:col-span-2">
            <SignalRDemo 
              isConnected={isConnected}
              onConnectionChange={setIsConnected}
            />
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Features Principais
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="glass-card p-6 text-center hover-lift animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-${feature.color} flex items-center justify-center mx-auto mb-4 glow-${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Stack Tecnológica
          </h2>
          
          <Card className="glass-card p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl bg-gradient-glass p-4 text-center hover-lift animate-slide-up border border-glass-border/50"
                  style={{animationDelay: `${index * 0.03}s`}}
                >
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <span className="relative z-10 text-sm font-medium text-foreground group-hover:text-primary-foreground transition-colors">
                    {tech}
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-glass/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Architecture Diagram */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Arquitetura do Sistema
          </h2>
          
          <Card className="glass-card p-8">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center glow-primary">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Presentation</h3>
                <p className="text-sm text-muted-foreground">API Controllers & SignalR Hubs</p>
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-secondary mx-auto mb-4 flex items-center justify-center glow-secondary">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Application</h3>
                <p className="text-sm text-muted-foreground">CQRS & MediatR Handlers</p>
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
                <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-4 flex items-center justify-center glow-primary">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Domain</h3>
                <p className="text-sm text-muted-foreground">Entities & Business Logic</p>
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="w-16 h-16 rounded-2xl bg-accent mx-auto mb-4 flex items-center justify-center glow-accent">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Infrastructure</h3>
                <p className="text-sm text-muted-foreground">PostgreSQL & External Services</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Connection Status */}
        <div className="fixed bottom-6 right-6">
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className={`status-online ${isConnected ? 'bg-accent' : 'bg-muted'}`}></div>
              <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SkillLearning;