import "server-only";
import { headers } from "next/headers";
import { getSiteUrl } from "./site";

export async function getRequestOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  try {
    const headerStore = await headers();
    const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
    const proto = headerStore.get("x-forwarded-proto") ?? "http";
    if (host) return `${proto}://${host}`;
  } catch {
    // headers() indisponível (por exemplo, em build estático)
  }
  return getSiteUrl();
}
