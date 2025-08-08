import React from 'react';
import { Users, Activity, Zap, Timer } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatsGridProps {
  stats: {
    users: number;
    activities: number;
    uptime: string;
    responseTime: string;
  };
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const statsData = [
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Usuários Ativos',
      value: stats.users.toLocaleString(),
      change: '+12%',
      color: 'primary',
      gradient: 'gradient-primary'
    },
    {
      icon: <Activity className="w-6 h-6" />,
      label: 'Atividades',
      value: stats.activities.toLocaleString(),
      change: '+8%',
      color: 'secondary',
      gradient: 'gradient-secondary'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Uptime',
      value: stats.uptime,
      change: 'Estável',
      color: 'accent',
      gradient: 'gradient-primary'
    },
    {
      icon: <Timer className="w-6 h-6" />,
      label: 'Resp. Time',
      value: stats.responseTime,
      change: '-15%',
      color: 'primary',
      gradient: 'gradient-secondary'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {statsData.map((stat, index) => (
        <Card 
          key={index}
          className="glass-card p-6 text-center hover-lift animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className={`w-12 h-12 rounded-xl bg-${stat.gradient} flex items-center justify-center mx-auto mb-4 glow-${stat.color}`}>
            {stat.icon}
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-xs ${stat.change.startsWith('+') ? 'text-accent' : stat.change.startsWith('-') ? 'text-primary' : 'text-muted-foreground'}`}>
              {stat.change}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;