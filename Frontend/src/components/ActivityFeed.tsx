import React, { useState, useEffect } from 'react';
import { Activity, User, LogIn, MessageSquare, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ActivityItem {
  id: string;
  type: 'login' | 'registration' | 'api_call' | 'error' | 'performance';
  title: string;
  description: string;
  timestamp: Date;
  severity: 'info' | 'success' | 'warning' | 'error';
}

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'login',
      title: 'Novo Login',
      description: 'Usuario jonas@skilllearning.com autenticado',
      timestamp: new Date(Date.now() - 120000),
      severity: 'success'
    },
    {
      id: '2',
      type: 'registration',
      title: 'Novo Usuário',
      description: 'Conta criada para maria@example.com',
      timestamp: new Date(Date.now() - 300000),
      severity: 'info'
    },
    {
      id: '3',
      type: 'api_call',
      title: 'API Performance',
      description: 'Endpoint /api/users respondeu em 42ms',
      timestamp: new Date(Date.now() - 450000),
      severity: 'success'
    },
    {
      id: '4',
      type: 'performance',
      title: 'Cache Hit',
      description: 'Redis cache utilizado para query otimizada',
      timestamp: new Date(Date.now() - 600000),
      severity: 'info'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivities = [
        {
          type: 'login' as const,
          title: 'Novo Login',
          description: `Usuario ${generateRandomEmail()} autenticado`,
          severity: 'success' as const
        },
        {
          type: 'api_call' as const,
          title: 'API Request',
          description: `Endpoint respondeu em ${Math.floor(Math.random() * 100) + 20}ms`,
          severity: 'success' as const
        },
        {
          type: 'performance' as const,
          title: 'Cache Hit',
          description: 'Redis otimizou consulta ao banco',
          severity: 'info' as const
        },
        {
          type: 'registration' as const,
          title: 'Novo Usuário',
          description: `Conta criada para ${generateRandomEmail()}`,
          severity: 'info' as const
        }
      ];

      const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
      const newItem: ActivityItem = {
        id: Date.now().toString(),
        ...randomActivity,
        timestamp: new Date()
      };

      setActivities(prev => [newItem, ...prev.slice(0, 9)]);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const generateRandomEmail = () => {
    const names = ['ana', 'pedro', 'julia', 'carlos', 'lucia', 'rafael'];
    const domains = ['example.com', 'test.com', 'demo.com'];
    return `${names[Math.floor(Math.random() * names.length)]}@${domains[Math.floor(Math.random() * domains.length)]}`;
  };

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'login':
        return <LogIn className="w-4 h-4" />;
      case 'registration':
        return <User className="w-4 h-4" />;
      case 'api_call':
        return <MessageSquare className="w-4 h-4" />;
      case 'performance':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: ActivityItem['severity']) => {
    switch (severity) {
      case 'success':
        return 'bg-accent text-accent-foreground';
      case 'info':
        return 'bg-primary text-primary-foreground';
      case 'warning':
        return 'bg-secondary text-secondary-foreground';
      case 'error':
        return 'bg-destructive text-destructive-foreground';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}min`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)}d`;
  };

  return (
    <Card className="glass-card p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-secondary flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Feed de Atividades</h3>
          <p className="text-sm text-muted-foreground">Sistema em tempo real</p>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            className="group p-4 rounded-lg bg-muted/10 hover:bg-muted/20 transition-all duration-300 border border-transparent hover:border-glass-border/30 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSeverityColor(activity.severity)}`}>
                {getIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-glass-border/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Atualizações automáticas</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityFeed;