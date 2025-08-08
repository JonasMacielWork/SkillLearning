import { apiGet } from '@/lib/api';
import type { ActivityEvent, ActivityType } from '@/types/activity';

// DTO vindo do backend (timestamps como string ISO)
export interface ActivityDTO {
  id: string;
  type: ActivityType;
  user: string;
  message?: string;
  timestamp: string; // ISO 8601
}

// Busca atividades desde um timestamp ISO (catch-up pós-conexão/login)
// Se o endpoint não existir ainda no backend, a função falha silenciosamente e retorna [].
export async function fetchActivitiesSince(sinceIso?: string): Promise<ActivityEvent[]> {
  const query = sinceIso ? `?since=${encodeURIComponent(sinceIso)}` : '';
  try {
    const data = await apiGet<ActivityDTO[]>(`/api/activity${query}`);
    if (!Array.isArray(data)) return [];
    return (data as ActivityDTO[]).map(dto => ({
      id: dto.id,
      type: dto.type,
      user: dto.user,
      message: dto.message,
      timestamp: new Date(dto.timestamp),
    }));
  } catch {
    return [];
  }
}
