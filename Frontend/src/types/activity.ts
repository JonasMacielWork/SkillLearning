// Tipos relacionados a atividades em tempo real do demo de SignalR
export type ActivityType = 'user_joined' | 'user_login' | 'message_sent';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  user: string;
  message?: string;
  timestamp: Date;
}
