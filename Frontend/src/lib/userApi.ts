// API de Usuário (JWT): GET por username e PUT do email usando authFetch (injeta Bearer e renova token em 401).
import { authFetch } from "@/lib/auth";

export type UserDto = {
  id: string;
  username: string;
  email: string;
  role: number;
};

export async function getUserByUsername(username: string): Promise<UserDto> {
  const res = await authFetch(`/api/Users/${encodeURIComponent(username)}`, {
    headers: { Accept: "application/json" },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || res.statusText);
  return text ? (JSON.parse(text) as UserDto) : ({} as any);
}

export async function updateUserEmail(id: string, email: string): Promise<{ email: string }> {
  const res = await authFetch(`/api/Users/${encodeURIComponent(id)}/email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || res.statusText);
  try {
    const data = text ? JSON.parse(text) : {};
    if (data && typeof data === "object" && "email" in data) return { email: (data as any).email as string };
  } catch {
    // ignore parse errors, fallback to requested email
  }
  return { email };
}
