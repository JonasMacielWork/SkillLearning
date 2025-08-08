// Hook SignalR: cria/gerencia HubConnection com reconexão automática; usa ref p/ callbacks (evita stale closures) e aceita override de URL (?hub=...).
import { useEffect, useRef } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

interface Opcoes {
  onConnectedChange?: (connected: boolean) => void;
  onUserLoggedIn?: (username: string) => void;
  onNewUserRegistered?: (username: string) => void;
  onError?: (message: string) => void;
  url?: string; // permite sobrescrever a URL do hub (ex.: https://api.meuapp.com/hubs/activity)
  depsKey?: any; // alterar para forçar reconexão
}

// Centraliza a conexão com o Hub de atividades
// Conecta em /hubs/activity por padrão (Vite proxy lida com o alvo https://localhost:7140 em dev)
export function useAtividadesSignalR(options: Opcoes) {
  const optsRef = useRef(options);
  useEffect(() => {
    optsRef.current = options;
  }, [options]);

  useEffect(() => {
    const isDev = import.meta.env.MODE === "development";
    const searchOverride = isDev
      ? (() => {
          try {
            const p = new URLSearchParams(window.location.search);
            return p.get("hub") || undefined;
          } catch {
            return undefined;
          }
        })()
      : undefined;

    const hubUrl = options.url || searchOverride || "/hubs/activity";

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.on("UserLoggedIn", (username: string) => {
      optsRef.current.onUserLoggedIn?.(username);
    });

    connection.on("NewUserRegistered", (username: string) => {
      optsRef.current.onNewUserRegistered?.(username);
    });

    connection.onreconnecting(() => optsRef.current.onConnectedChange?.(false));
    connection.onreconnected(() => optsRef.current.onConnectedChange?.(true));
    connection.onclose(() => optsRef.current.onConnectedChange?.(false));

    let cancelled = false;
    (async () => {
      try {
        await connection.start();
        if (!cancelled) optsRef.current.onConnectedChange?.(true);
      } catch (err: any) {
        console.error("SignalR Connection Error:", err);
        const msg = err?.message || "Falha ao conectar ao hub SignalR.";
        optsRef.current.onError?.(msg);
        if (!cancelled) optsRef.current.onConnectedChange?.(false);
      }
    })();

    return () => {
      cancelled = true;
      connection.stop().catch(() => {});
    };
  }, [options?.depsKey]);
}
