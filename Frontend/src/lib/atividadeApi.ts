import { apiGet } from '@/lib/api';
import type { EventoAtividade, TipoAtividade } from '@/types/atividade';

// DTO vindo do backend (timestamps como string ISO)
export interface AtividadeDTO {
  id: string;
  type: TipoAtividade;
  user: string;
  message?: string;
  timestamp: string; // ISO 8601
}

// Busca atividades desde um timestamp ISO (catch-up pós-conexão/login)
// Se o endpoint não existir ainda no backend, a função falha silenciosamente e retorna [].
export async function buscarAtividadesDesde(sinceIso?: string): Promise<EventoAtividade[]> {
  const query = sinceIso ? `?since=${encodeURIComponent(sinceIso)}` : '';
  try {
    const data = await apiGet<AtividadeDTO[]>(`/api/activity${query}`);
    if (!Array.isArray(data)) return [];
    return (data as AtividadeDTO[]).map(dto => ({
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
