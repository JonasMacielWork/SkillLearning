import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button.tsx';

// Exibe erros de conexão e oferece ação de tentar novamente.
export function ConnectionErrorAlert({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Alert variant="destructive" className="glass-card border-destructive/50 mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Falha ao conectar ao SignalR</AlertTitle>
      <AlertDescription>
        <div className="flex flex-col gap-2">
          <span className="text-sm">{message}</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onRetry} className="glass-button">
              <RefreshCcw className="w-4 h-4 mr-1" /> Tentar novamente
            </Button>
            <span className="text-xs text-muted-foreground">
              Dica: defina ?hub=URL_DO_SEU_BACKEND/hubs/activity para sobrescrever.
            </span>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
