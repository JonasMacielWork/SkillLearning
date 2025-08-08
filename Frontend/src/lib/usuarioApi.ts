// API de Usuário (JWT): GET por username e PUT do email usando authFetch (injeta Bearer e renova token em 401).
import { authFetch as buscaAutenticada } from "@/lib/auth";

export type UsuarioDto = {
  id: string;
  username: string;
  email: string;
  role: number;
};

export async function obterUsuarioPorUsername(username: string): Promise<UsuarioDto> {
  const res = await buscaAutenticada(`/api/Users/${encodeURIComponent(username)}`, {
    headers: { Accept: "application/json" },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || res.statusText);
  return text ? (JSON.parse(text) as UsuarioDto) : ({} as any);
}

export async function atualizarEmailUsuario(id: string, email: string): Promise<{ email: string }> {
  const res = await buscaAutenticada(`/api/Users/${encodeURIComponent(id)}/email`, {
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
