import React from 'react';
import type { EventoAtividade } from '@/types/atividade';
import { Send, User, LogIn } from 'lucide-react';

// Componente de lista do feed de atividades.
// Responsável apenas por renderizar; sem lógica de estado aqui (Separation of Concerns).
export function ActivityList({ activities, formatTime }: { activities: EventoAtividade[]; formatTime: (d: Date) => string }) {
  const getActivityIcon = (type: EventoAtividade['type']) => {
    switch (type) {
      case 'user_joined':
        return <User className="w-4 h-4 text-primary" />;
      case 'user_login':
        return <LogIn className="w-4 h-4 text-accent" />;
      case 'message_sent':
        return <Send className="w-4 h-4 text-secondary" />;
    }
  };

  const getActivityText = (activity: EventoAtividade) => {
    switch (activity.type) {
      case 'user_joined':
        return `${activity.user} se juntou à plataforma`;
      case 'user_login':
        return `${activity.user} fez login`;
      case 'message_sent':
        return `${activity.user}: ${activity.message}`;
    }
  };

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors animate-fade-in"
        >
          <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">{getActivityText(activity)}</p>
            <p className="text-xs text-muted-foreground">{formatTime(activity.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
