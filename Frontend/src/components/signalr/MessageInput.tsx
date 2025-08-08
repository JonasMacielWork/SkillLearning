import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

// Componente responsável apenas pelo input e envio de mensagem.
// Mantém a UI desacoplada da regra de negócio (envio em si fica no componente pai).
export function MessageInput({
  username,
  setUsername,
  message,
  setMessage,
  onSend,
  disabled,
}: {
  username: string;
  setUsername: (v: string) => void;
  message: string;
  setMessage: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Seu nome"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="glass-card border-glass-border w-32"
        />
        <Input
          placeholder={disabled ? 'Aguardando conexão...' : 'Digite uma mensagem...'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          disabled={!!disabled}
          className="glass-card border-glass-border flex-1"
        />
        <Button onClick={onSend} disabled={!!disabled || !message.trim()} className="glass-button">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
