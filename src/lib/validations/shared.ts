import { z } from "zod";
import { isValidWhatsAppNumber, parsePriceToNumber } from "@/lib/utils";

export const categoryIcons = [
  "gift",
  "notebook",
  "package",
  "sparkles",
  "heart",
  "star",
  "ribbon",
] as const;

export const categoryTones = ["blush", "sage", "sky", "peach", "sand"] as const;

export const priceInput = z
  .string()
  .trim()
  .max(20)
  .refine(
    (value) => value === "" || parsePriceToNumber(value) !== null,
    "Informe um preço válido (ex.: 12,50).",
  )
  .refine(
    (value) => value === "" || (parsePriceToNumber(value) ?? -1) >= 0,
    "O preço não pode ser negativo.",
  );

export const slugInput = z
  .string()
  .trim()
  .max(80)
  .refine(
    (value) => value === "" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
    "Use apenas letras minúsculas, números e hífens.",
  );

export const imagePayloadSchema = z.object({
  url: z.string().trim().max(2048),
  path: z.string().trim().max(1024).nullable().optional(),
  alt: z.string().trim().max(180).nullable().optional(),
});

export const galleryItemSchema = z.object({
  url: z.string().trim().min(1).max(2048),
  path: z.string().trim().max(1024).nullable().optional(),
  alt: z.string().trim().max(180).nullable().optional(),
});

export const whatsappSchema = z
  .string()
  .trim()
  .max(30)
  .refine(
    (value) => value === "" || isValidWhatsAppNumber(value),
    "Informe o número com código do país e DDD. Ex.: 5511999999999.",
  );

export const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, "Use uma cor no formato #RRGGBB.");

export const storeUrlSchema = z
  .string()
  .trim()
  .max(300)
  .refine(
    (value) =>
      value === "" ||
      /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/.test(value),
    "Informe um link do Instagram (https://instagram.com/seu-perfil).",
  );

export const optionalEmail = z
  .string()
  .trim()
  .max(180)
  .refine(
    (value) => value === "" || z.email().safeParse(value).success,
    "Informe um e-mail válido.",
  );

export const optionalPhone = z.string().trim().max(40);
