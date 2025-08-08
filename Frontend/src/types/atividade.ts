// Tipos relacionados a atividades em tempo real do demo de SignalR
export type TipoAtividade = 'user_joined' | 'user_login' | 'message_sent';

export interface EventoAtividade {
  id: string;
  type: TipoAtividade;
  user: string;
  message?: string;
  timestamp: Date;
}
