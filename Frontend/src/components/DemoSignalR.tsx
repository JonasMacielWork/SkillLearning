// Demo do SignalR: renderiza UI; escuta eventos do hub, faz catch-up via REST e usa useActivityLog para feed persistente (localStorage).
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAtividadesSignalR } from '@/hooks/useAtividadesSignalR';
import { useRegistroAtividades } from '@/hooks/useRegistroAtividades';
import { ActivityList as ListaAtividades } from '@/components/signalr/ListaAtividades';
import { MessageInput as EntradaMensagem } from '@/components/signalr/EntradaMensagem';
import { ConnectionHeader as CabecalhoConexao } from '@/components/signalr/CabecalhoConexao';
import { ConnectionErrorAlert as AlertaErroConexao } from '@/components/signalr/AlertaErroConexao';
import { buscarAtividadesDesde } from '@/lib/atividadeApi';

interface PropsDemoSignalR {
  isConnected: boolean;
  onConnectionChange: (connected: boolean) => void;
}

// Tipos de atividades foram movidos para src/types/activity.ts

const DemoSignalR: React.FC<PropsDemoSignalR> = ({ isConnected, onConnectionChange }) => {
  const { activities, addActivity, addActivities, getLastTimestamp, formatTime } = useRegistroAtividades();
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('Você');
  const [connectError, setConnectError] = useState<string | null>(null);
  const [depsKey, setDepsKey] = useState(0);
  const unmountingRef = useRef(false);
  useEffect(() => {
    return () => {
      unmountingRef.current = true;
    };
  }, []);
  useAtividadesSignalR({
    depsKey,
    onConnectedChange: (connected) => {
      onConnectionChange(connected);
      if (connected) {
        setConnectError(null);
        toast({ title: 'Conectado!', description: 'Conexão com SignalR estabelecida.' });
      } else {
        if (!unmountingRef.current) {
          toast({ title: 'Desconectado', description: 'Conexão com SignalR perdida.', variant: 'destructive' });
        }
      }
    },
    onUserLoggedIn: (username) => {
      addActivity({ type: 'user_login', user: username, timestamp: new Date() });
    },
    onNewUserRegistered: (username) => {
      addActivity({ type: 'user_joined', user: username, timestamp: new Date() });
    },
    onError: (msg) => setConnectError(msg),
  });

  // Real-time activities agora vêm dos eventos do hub SignalR

  // Catch-up: ao conectar (ou reconectar), busca eventos desde o último timestamp salvo
  useEffect(() => {
    if (!isConnected) return;
    let cancelled = false;
    (async () => {
      const sinceIso = getLastTimestamp()?.toISOString();
      const events = await buscarAtividadesDesde(sinceIso);
      if (!cancelled && events.length) addActivities(events);
    })();
    return () => { cancelled = true; };
  }, [isConnected, getLastTimestamp, addActivities]);

  const handleSendMessage = () => {
    if (!message.trim() || !isConnected) return;
    addActivity({ type: 'message_sent', user: username, message: message.trim(), timestamp: new Date() });
    setMessage('');
    toast({ title: 'Mensagem enviada', description: 'Sua mensagem foi enviada via SignalR.' });
  };

  /* Ícones e textos agora vivem em ActivityList */

  /* formatTime agora vem do useActivityLog */

  return (
    <Card className="glass-card p-6 h-full">
      <CabecalhoConexao isConnected={isConnected} />

      {/* Connection Error */}
      {connectError && (
        <AlertaErroConexao message={connectError} onRetry={() => setDepsKey((k) => k + 1)} />
      )}

      {/* Activities List */}
      <div className="mb-6">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          Atividades em Tempo Real
        </h4>
        
        <ListaAtividades activities={activities} formatTime={formatTime} />
      </div>

      {/* Message Input */}
      <EntradaMensagem
        username={username}
        setUsername={setUsername}
        message={message}
        setMessage={setMessage}
        onSend={handleSendMessage}
        disabled={!isConnected}
      />

      <p className="mt-4 text-xs text-muted-foreground">
        {isConnected
          ? 'Conectado ao hub SignalR. Mensagens são enviadas em tempo real.'
          : 'Estabelecendo conexão com o SignalR Hub...'}
      </p>
    </Card>
  );
};

export default DemoSignalR;