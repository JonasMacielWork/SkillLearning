export type ApiParse = "json" | "text";

// Centralized API helpers using Vite proxy (see vite.config.ts)
export async function apiGet<T = unknown>(path: string, init?: RequestInit, parse: ApiParse = "json"): Promise<T | string> {
  const res = await fetch(path, {
    method: "GET",
    headers: {
      "Accept": parse === "json" ? "application/json" : "text/plain",
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status}: ${body || res.statusText}`);
  }

  if (parse === "text") return res.text();
  // Try JSON, fallback to text when content-type not JSON
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return res.text();
  return res.json();
}

export async function apiPost<T = unknown>(path: string, body?: any, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...init,
  });

  const text = await res.text();
  const tryJson = () => {
    try { return text ? JSON.parse(text) : undefined; } catch { return text as any; }
  };

  if (!res.ok) {
    throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
  }

  return tryJson();
}
