type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type LoginRequest = { username: string; password: string };
// Adjust according to backend response shape
type LoginResponse = { accessToken: string; refreshToken: string; user?: { id?: string; email?: string; name?: string } };

type RegisterRequest = { username: string; email: string; password: string };

// RFC 7807 Problem Details shape (commonly returned by .NET APIs)
type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
  [key: string]: any;
};

function parseProblemDetails(text: string, fallbackStatusText?: string): { message: string; problem?: ProblemDetails } {
  try {
    const data = text ? (JSON.parse(text) as ProblemDetails) : undefined;
    if (data && (data.title || data.detail || data.errors)) {
      const parts: string[] = [];
      if (data.title) parts.push(data.title);
      if (data.detail) parts.push(data.detail);
      if (data.errors && typeof data.errors === "object") {
        const fieldMsgs = Object.entries(data.errors)
          .flatMap(([field, msgs]) => (Array.isArray(msgs) ? msgs.map((m) => `${field}: ${m}`) : []));
        if (fieldMsgs.length) parts.push(fieldMsgs.join(" • "));
      }
      const message = parts.filter(Boolean).join(" — ") || fallbackStatusText || "Erro na requisição";
      return { message, problem: data };
    }
  } catch {
    // fall through
  }
  const message = text || fallbackStatusText || "Erro na requisição";
  return { message };
}

const ACCESS_KEY = "auth.accessToken";
const REFRESH_KEY = "auth.refreshToken";
let memoryTokens: Tokens | null = null;
export const AuthEndpoints = {
  login: "/api/Auth/login",
  register: "/api/Auth/register",
  refresh: "/api/Auth/refresh",
};

export function getTokens(): Tokens | null {
  if (memoryTokens) return memoryTokens;
  const accessToken = sessionStorage.getItem(ACCESS_KEY) || "";
  const refreshToken = sessionStorage.getItem(REFRESH_KEY) || "";
  if (!accessToken || !refreshToken) return null;
  memoryTokens = { accessToken, refreshToken };
  return memoryTokens;
}

export function setTokens(t: Tokens) {
  memoryTokens = t;
  sessionStorage.setItem(ACCESS_KEY, t.accessToken);
  sessionStorage.setItem(REFRESH_KEY, t.refreshToken);
}

export function clearTokens() {
  memoryTokens = null;
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}

export function parseJwt(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}

export function isExpired(token: string, skewSeconds = 30): boolean {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return now >= (payload.exp - skewSeconds);
}

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshing) return refreshing;
  const tokens = getTokens();
  if (!tokens?.refreshToken) return null;

  refreshing = fetch(AuthEndpoints.refresh, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  })
    .then(async (res) => {
      const text = await res.text();
      if (!res.ok) throw new Error(text || res.statusText);
      const data = text ? JSON.parse(text) : {};
      const access = data.accessToken as string;
      const refresh = (data.refreshToken as string) || tokens.refreshToken;
      if (access) setTokens({ accessToken: access, refreshToken: refresh });
      return access || null;
    })
    .catch((err) => {
      console.error("Refresh token failed", err);
      clearTokens();
      return null;
    })
    .finally(() => {
      refreshing = null;
    });

  return refreshing;
}

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  let tokens = getTokens();
  let headers: HeadersInit = { ...(init.headers || {}) };

  if (tokens?.accessToken) {
    if (isExpired(tokens.accessToken)) {
      const newAccess = await refreshAccessToken();
      tokens = getTokens();
      if (newAccess && tokens) headers = { ...headers, Authorization: `Bearer ${newAccess}` };
    } else {
      headers = { ...headers, Authorization: `Bearer ${tokens.accessToken}` };
    }
  }

  const res = await fetch(input, { ...init, headers });
  if (res.status === 401 && tokens?.refreshToken) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      const retryHeaders = { ...headers, Authorization: `Bearer ${newAccess}` };
      return fetch(input, { ...init, headers: retryHeaders });
    }
  }
  return res;
}

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(AuthEndpoints.login, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(req),
  });
  const text = await res.text();
  if (!res.ok) {
    const { message, problem } = parseProblemDetails(text, res.statusText);
    const err = new Error(message);
    (err as any).problem = problem;
    throw err;
  }
  const data: LoginResponse = text ? JSON.parse(text) : ({} as any);
  if (data.accessToken && data.refreshToken) setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
}

export async function register(req: RegisterRequest): Promise<LoginResponse> {
  const res = await fetch(AuthEndpoints.register, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(req),
  });
  const text = await res.text();
  if (!res.ok) {
    const { message, problem } = parseProblemDetails(text, res.statusText);
    const err = new Error(message);
    (err as any).problem = problem;
    throw err;
  }
  const data: LoginResponse = text ? JSON.parse(text) : ({} as any);
  return data;
}
