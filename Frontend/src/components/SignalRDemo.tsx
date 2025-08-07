import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Send, User, LogIn } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface SignalRDemoProps {
  isConnected: boolean;
  onConnectionChange: (connected: boolean) => void;
}

interface ActivityEvent {
  id: string;
  type: 'user_joined' | 'user_login' | 'message_sent';
  user: string;
  message?: string;
  timestamp: Date;
}

const SignalRDemo: React.FC<SignalRDemoProps> = ({ isConnected, onConnectionChange }) => {
  const [activities, setActivities] = useState<ActivityEvent[]>([
    {
      id: '1',
      type: 'user_joined',
      user: 'Jonas Maciel',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      type: 'user_login',
      user: 'Maria Silva',
      timestamp: new Date(Date.now() - 180000)
    }
  ]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('Você');

  // Simulate SignalR connection
  useEffect(() => {
    const timer = setTimeout(() => {
      onConnectionChange(true);
      toast({
        title: "Conectado!",
        description: "SignalR connection estabelecida com sucesso."
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [onConnectionChange]);

  // Simulate incoming activities
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      const users = ['Ana Costa', 'Pedro Santos', 'Lucas Lima', 'Julia Rocha'];
      const types: ActivityEvent['type'][] = ['user_joined', 'user_login'];
      
      const newActivity: ActivityEvent = {
        id: Date.now().toString(),
        type: types[Math.floor(Math.random() * types.length)],
        user: users[Math.floor(Math.random() * users.length)],
        timestamp: new Date()
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 8000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleSendMessage = () => {
    if (!message.trim() || !isConnected) return;

    const newActivity: ActivityEvent = {
      id: Date.now().toString(),
      type: 'message_sent',
      user: username,
      message: message.trim(),
      timestamp: new Date()
    };

    setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    setMessage('');
    
    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada via SignalR."
    });
  };

  const getActivityIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'user_joined':
        return <User className="w-4 h-4 text-primary" />;
      case 'user_login':
        return <LogIn className="w-4 h-4 text-accent" />;
      case 'message_sent':
        return <Send className="w-4 h-4 text-secondary" />;
    }
  };

  const getActivityText = (activity: ActivityEvent) => {
    switch (activity.type) {
      case 'user_joined':
        return `${activity.user} se juntou à plataforma`;
      case 'user_login':
        return `${activity.user} fez login`;
      case 'message_sent':
        return `${activity.user}: ${activity.message}`;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}min`;
    return `${Math.floor(minutes / 60)}h`;
  };

  return (
    <Card className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-white" />
            ) : (
              <WifiOff className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold">SignalR Demo</h3>
            <p className="text-sm text-muted-foreground">Real-time notifications</p>
          </div>
        </div>
        
        <Badge 
          variant={isConnected ? "default" : "destructive"}
          className={isConnected ? "bg-accent" : ""}
        >
          {isConnected ? 'Online' : 'Connecting...'}
        </Badge>
      </div>

      {/* Activities List */}
      <div className="mb-6">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          Atividades em Tempo Real
        </h4>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors animate-fade-in"
            >
              <div className="mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{getActivityText(activity)}</p>
                <p className="text-xs text-muted-foreground">{formatTime(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input 
            placeholder="Seu nome"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="glass-card border-glass-border w-32"
          />
          <Input 
            placeholder={isConnected ? "Digite uma mensagem..." : "Aguardando conexão..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={!isConnected}
            className="glass-card border-glass-border flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!isConnected || !message.trim()}
            className="glass-button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          {isConnected 
            ? "Conectado ao hub SignalR. Mensagens são enviadas em tempo real."
            : "Estabelecendo conexão com o SignalR Hub..."
          }
        </p>
      </div>
    </Card>
  );
};

export default SignalRDemo;