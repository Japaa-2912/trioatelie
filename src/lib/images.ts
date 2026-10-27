import { SUPABASE_URL } from "./supabase/config";

const SAFE_PATH = /^(hero|logo|categories|products)\/[a-zA-Z0-9][a-zA-Z0-9/_.-]*$/;

export function isSafeStoragePath(path: string | null | undefined): boolean {
  if (!path) return false;
  if (path.includes("..") || path.includes("\\") || path.length > 1024) {
    return false;
  }
  return SAFE_PATH.test(path);
}

export function storagePublicUrl(path: string | null | undefined): string | null {
  if (!path || !isSafeStoragePath(path) || !SUPABASE_URL) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/site-images/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

export function isAllowedStorageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    if (!parsed.hostname.endsWith(".supabase.co")) return false;
    return parsed.pathname.startsWith("/storage/v1/object/public/site-images/");
  } catch {
    return false;
  }
}
