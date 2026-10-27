import { z } from "zod";
import {
  hexColorSchema,
  optionalEmail,
  optionalPhone,
  storeUrlSchema,
  whatsappSchema,
} from "./shared";

export const settingsFormSchema = z.object({
  brandName: z
    .string()
    .trim()
    .min(2, "Informe o nome da marca.")
    .max(80, "O nome deve ter no máximo 80 caracteres."),
  tagline: z
    .string()
    .trim()
    .max(120, "Use no máximo 120 caracteres."),
  whatsappNumber: whatsappSchema,
  instagramUrl: storeUrlSchema,
  email: optionalEmail,
  phone: optionalPhone,
  announcementText: z
    .string()
    .trim()
    .max(180, "Use no máximo 180 caracteres."),
  institutionalText: z
    .string()
    .trim()
    .max(2000, "Use no máximo 2000 caracteres."),
  footerText: z
    .string()
    .trim()
    .max(300, "Use no máximo 300 caracteres."),
  privacyText: z
    .string()
    .trim()
    .max(10000, "Use no máximo 10000 caracteres."),
  brandColor: hexColorSchema,
  blushColor: hexColorSchema,
  sageColor: hexColorSchema,
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

const homepageSectionInputSchema = z.object({
  key: z.enum([
    "categories",
    "products",
    "customization",
    "how_it_works",
    "cta",
  ]),
  eyebrow: z.string().trim().max(120),
  title: z.string().trim().max(180),
  body: z.string().trim().max(1200),
  isVisible: z.boolean(),
});

export const homepageFormSchema = z.object({
  brandName: z
    .string()
    .trim()
    .min(2, "Informe o nome da marca.")
    .max(80, "O nome deve ter no máximo 80 caracteres."),
  tagline: z.string().trim().max(120, "Use no máximo 120 caracteres."),
  logoUrl: z.string().trim().max(2048),
  logoPath: z.string().trim().max(1024),
  announcementText: z
    .string()
    .trim()
    .max(180, "Use no máximo 180 caracteres."),
  heroEyebrow: z.string().trim().max(120, "Use no máximo 120 caracteres."),
  heroTitle: z
    .string()
    .trim()
    .min(10, "Escreva um título com pelo menos 10 caracteres.")
    .max(180, "Use no máximo 180 caracteres."),
  heroSubtitle: z
    .string()
    .trim()
    .min(10, "Escreva um subtítulo com pelo menos 10 caracteres.")
    .max(400, "Use no máximo 400 caracteres."),
  heroPrimaryCta: z
    .string()
    .trim()
    .max(60, "Use no máximo 60 caracteres."),
  heroSecondaryCta: z
    .string()
    .trim()
    .max(60, "Use no máximo 60 caracteres."),
  heroImageUrl: z.string().trim().max(2048),
  heroImagePath: z.string().trim().max(1024),
  heroImageAlt: z.string().trim().max(180, "Use no máximo 180 caracteres."),
  sectionsJson: z
    .string()
    .max(20000, "O conteúdo das seções é muito grande.")
    .refine((value) => {
      try {
        const parsed = JSON.parse(value || "[]");
        return z.array(homepageSectionInputSchema).max(10).safeParse(parsed).success;
      } catch {
        return false;
      }
    }, "O conteúdo das seções é inválido."),
});

export type HomepageFormValues = z.infer<typeof homepageFormSchema>;
export type HomepageSectionInput = z.infer<typeof homepageSectionInputSchema>;
