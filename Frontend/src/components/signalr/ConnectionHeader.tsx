import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Cabeçalho do card de conexão, exibe status atual e título/contexto.
export function ConnectionHeader({ isConnected }: { isConnected: boolean }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          {isConnected ? <Wifi className="w-5 h-5 text-white" /> : <WifiOff className="w-5 h-5 text-white" />}
        </div>
        <div>
          <h3 className="text-xl font-semibold">SignalR Demo</h3>
          <p className="text-sm text-muted-foreground">Notificações em tempo real</p>
        </div>
      </div>

      <Badge variant={isConnected ? 'default' : 'destructive'} className={isConnected ? 'bg-accent' : ''}>
        {isConnected ? 'Online' : 'Connecting...'}
      </Badge>
    </div>
  );
}
