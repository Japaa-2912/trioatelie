import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Serializa JSON-LD para uso dentro de <script>. O escape de "<" impede que
 * um texto editável no painel feche a tag e injete HTML.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Normaliza WhatsApp para o formato internacional exigido pelo wa.me. */
export function normalizeWhatsAppNumber(value: string | null | undefined) {
  if (!value) return null;
  const digits = onlyDigits(value);
  if (digits.length < 10 || digits.length > 15) return null;
  if (digits.startsWith("0")) return null;
  return digits;
}

export function isValidWhatsAppNumber(value: string | null | undefined) {
  return Boolean(normalizeWhatsAppNumber(value));
}

export function formatWhatsAppForDisplay(value: string | null | undefined) {
  const digits = normalizeWhatsAppNumber(value);
  if (!digits) return null;
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    const ddd = digits.slice(2, 4);
    const first = digits.slice(4, digits.length - 4);
    const last = digits.slice(-4);
    return `+55 (${ddd}) ${first}-${last}`;
  }
  return `+${digits}`;
}

export function formatPrice(value: number | null | undefined): string | null {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

export function parsePriceToNumber(value: string): number | null {
  const cleaned = value
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatDateBR(value: string | null | undefined): string | null {
  if (!value) return null;
  const datePart = value.includes("T") ? value.slice(0, 10) : value;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);
  if (!match) return value;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function formatDateTimeBR(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function truncate(value: string, max = 160) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}…`;
}

export function safeNextPath(value: string | null | undefined, fallback = "/admin") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  if (value.includes("\\") || /[\u0000-\u001f]/.test(value)) {
    return fallback;
  }
  return value;
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function hexColor(value: string, fallback: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}
