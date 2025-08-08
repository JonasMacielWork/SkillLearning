import { useEffect, useMemo, useState, useCallback } from 'react';
import type { ActivityEvent } from '@/types/activity';

// Chave usada no localStorage para persistir o feed
const STORAGE_KEY = 'signalr.activities';

// Hook responsável por centralizar o estado e a persistência do feed de atividades.
// Mantém o histórico entre navegações e facilita testes/reutilização.
export function useActivityLog() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  // Hidrata do localStorage apenas uma vez ao montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as (Omit<ActivityEvent, 'timestamp'> & { timestamp: string })[];
        setActivities(parsed.map(a => ({ ...a, timestamp: new Date(a.timestamp) })));
      } else {
        // Seed inicial (opcional) para demonstrar a UI ao primeiro acesso
        setActivities([
          { id: '1', type: 'user_joined', user: 'Jonas Maciel', timestamp: new Date(Date.now() - 300000) },
          { id: '2', type: 'user_login', user: 'Maria Silva', timestamp: new Date(Date.now() - 180000) },
        ]);
      }
    } catch {
      // Em caso de erro, mantemos a lista vazia para não quebrar a UI
      setActivities([]);
    }
  }, []);

  // Persiste toda vez que a lista mudar
  useEffect(() => {
    try {
      const toSave = activities.map(a => ({ ...a, timestamp: a.timestamp.toISOString() }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Ignorar erros de quota/permissão
    }
  }, [activities]);

  // Adiciona uma atividade no topo e limita a 10 itens para manter a UI leve
  const addActivity = useCallback((e: Omit<ActivityEvent, 'id'> & { id?: string }) => {
    const withId: ActivityEvent = {
      id: e.id ?? Date.now().toString(),
      type: e.type,
      user: e.user,
      message: e.message,
      timestamp: e.timestamp,
    };
    setActivities(prev => [withId, ...prev].slice(0, 10));
  }, []);

  // Adiciona várias atividades de uma vez (útil para catch-up do backend)
  // - Faz deduplicação por id
  // - Ordena por timestamp desc
  // - Limita a 10 itens para manter a UI performática
  const addActivities = useCallback((batch: ActivityEvent[]) => {
    setActivities(prev => {
      const byId = new Map<string, ActivityEvent>();
      // Indexa existentes
      for (const a of prev) byId.set(a.id, a);
      // Insere/atualiza novos
      for (const a of batch) byId.set(a.id, a);
      const merged = Array.from(byId.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      return merged.slice(0, 10);
    });
  }, []);

  // Retorna o timestamp mais recente conhecido (para pedir eventos since=...)
  const getLastTimestamp = useCallback((): Date | undefined => {
    if (!activities.length) return undefined;
    return activities.reduce((max, a) => (a.timestamp > max ? a.timestamp : max), activities[0].timestamp);
  }, [activities]);

  // Utilitário para exibir tempo relativo simples (ótimo para feed)
  const formatTime = useCallback((date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}min`;
    return `${Math.floor(minutes / 60)}h`;
  }, []);

  return useMemo(() => ({ activities, setActivities, addActivity, addActivities, getLastTimestamp, formatTime }), [activities, addActivity, addActivities, getLastTimestamp, formatTime]);
}
