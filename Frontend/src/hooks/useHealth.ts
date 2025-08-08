import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export type HealthData = {
  healthy: boolean;
  statusText: string;
};

function normalizeHealth(raw: unknown | string): HealthData {
  // ASP.NET HealthChecks can return plain text or JSON depending on configuration
  try {
    if (typeof raw === "string") {
      const text = raw.trim();
      const isHealthy = /healthy/i.test(text);
      return { healthy: isHealthy, statusText: text || (isHealthy ? "Healthy" : "Unhealthy") };
    }
    if (raw && typeof raw === "object" && "status" in (raw as any)) {
      const status = String((raw as any).status);
      return { healthy: /healthy/i.test(status), statusText: status };
    }
  } catch {}
  return { healthy: false, statusText: "Unknown" };
}

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      // Try JSON first, fallback handled in apiGet
      const result = await apiGet("/health", undefined, "text");
      return normalizeHealth(result);
    },
    refetchInterval: 15000,
    staleTime: 10000,
  });
}
