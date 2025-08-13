import React, { useState, useEffect, useRef } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Users, UserPlus, LogIn, Wifi, WifiOff, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import InteractiveGlass from './InteractiveGlass';

interface ActivityNotification {
  id: string;
  type: 'NewUserRegistered' | 'UserLoggedIn';
  username: string;
  timestamp: Date;
}

const RealTimeActivityPanel: React.FC = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activities, setActivities] = useState<ActivityNotification[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const activitiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7140/hubs/activity')
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('SignalR Connected!');
          setIsConnected(true);
          
          // Simular contagem de usuários online
          setOnlineUsers(Math.floor(Math.random() * 50) + 10);
        })
        .catch(err => {
          console.error('SignalR Connection Error: ', err);
          setIsConnected(false);
        });

      connection.onclose(() => {
        setIsConnected(false);
      });

      connection.onreconnected(() => {
        setIsConnected(true);
      });

      // Escutar eventos do backend
      connection.on('NewUserRegistered', (username: string) => {
        const newActivity: ActivityNotification = {
          id: Date.now().toString(),
          type: 'NewUserRegistered',
          username,
          timestamp: new Date()
        };
        
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Manter apenas 10 atividades
        setOnlineUsers(prev => prev + 1);
      });

      connection.on('UserLoggedIn', (username: string) => {
        const newActivity: ActivityNotification = {
          id: Date.now().toString(),
          type: 'UserLoggedIn',
          username,
          timestamp: new Date()
        };
        
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      });
    }
  }, [connection]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'NewUserRegistered':
        return <UserPlus className="h-4 w-4 text-green-400" />;
      case 'UserLoggedIn':
        return <LogIn className="h-4 w-4 text-blue-400" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityMessage = (activity: ActivityNotification) => {
    switch (activity.type) {
      case 'NewUserRegistered':
        return `${activity.username} se registrou`;
      case 'UserLoggedIn':
        return `${activity.username} fez login`;
      default:
        return 'Atividade desconhecida';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-md">
      <InteractiveGlass className="glass-panel toon-glass p-6 rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="h-6 w-6 text-brand" />
              {isConnected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">Atividades</h3>
              <p className="text-xs text-muted-foreground">Tempo Real</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
            <span className={cn(
              "text-xs font-medium",
              isConnected ? "text-green-400" : "text-red-400"
            )}>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-panel p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="h-4 w-4 text-brand" />
              <span className="text-2xl font-bold text-brand">{onlineUsers}</span>
            </div>
            <p className="text-xs text-muted-foreground">Usuários Online</p>
          </div>
          
          <div className="glass-panel p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-brand-2" />
              <span className="text-2xl font-bold text-brand-2">{activities.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">Atividades</p>
          </div>
        </div>

        {/* Activities Feed */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Feed de Atividades</h4>
          
          <div 
            ref={activitiesRef}
            className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
          >
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aguardando atividades...</p>
              </div>
            ) : (
              activities.map((activity, index) => (
                <div 
                  key={activity.id}
                  className={cn(
                    "glass-panel p-3 rounded-lg transition-all duration-500 ease-out",
                    "hover:bg-foreground/5",
                    index === 0 && "ring-1 ring-brand/20 bg-brand/5"
                  )}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: index === 0 ? 'slideInFromTop 0.5s ease-out' : undefined
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {getActivityMessage(activity)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 text-red-400">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">Conexão perdida</span>
            </div>
            <p className="text-xs text-red-300 mt-1">
              Tentando reconectar automaticamente...
            </p>
          </div>
        )}
      </InteractiveGlass>
    </div>
  );
};

export default RealTimeActivityPanel;