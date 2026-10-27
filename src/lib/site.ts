/**
 * Normaliza a URL pública da loja.
 *
 * Aceita valores com ou sem protocolo (ex.: "loja.vercel.app") e devolve sempre
 * uma origem válida. Valores inválidos retornam null para que o build nunca
 * quebre por causa de uma variável de ambiente mal preenchida.
 */
function normalizeSiteUrl(value: string | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw)
    ? raw
    : `https://${raw}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname) return null;
    const path = url.pathname.replace(/\/+$/, "");
    return `${url.origin}${path}`;
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  return (
    normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    "http://localhost:3000"
  );
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
