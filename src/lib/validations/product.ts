import { z } from "zod";
import { slugInput, priceInput } from "./shared";

export { galleryItemSchema } from "./shared";

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),
  slug: slugInput,
  categoryId: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || z.uuid().safeParse(value).success,
      "Selecione uma categoria válida.",
    ),
  shortDescription: z
    .string()
    .trim()
    .max(220, "A descrição curta deve ter no máximo 220 caracteres."),
  description: z
    .string()
    .trim()
    .max(6000, "A descrição completa deve ter no máximo 6000 caracteres."),
  price: priceInput,
  priceOnRequest: z.boolean(),
  isCustomizable: z.boolean(),
  customizationNotes: z
    .string()
    .trim()
    .max(1200, "Use no máximo 1200 caracteres."),
  dimensions: z.string().trim().max(160, "Use no máximo 160 caracteres."),
  materials: z.string().trim().max(240, "Use no máximo 240 caracteres."),
  productionTime: z.string().trim().max(160, "Use no máximo 160 caracteres."),
  minQuantity: z.coerce
    .number()
    .int("Informe um número inteiro.")
    .min(1, "A quantidade mínima deve ser pelo menos 1.")
    .max(9999, "A quantidade mínima deve ser no máximo 9999."),
  mainImageUrl: z.string().trim().max(2048),
  mainImagePath: z.string().trim().max(1024),
  mainImageAlt: z.string().trim().max(180, "Use no máximo 180 caracteres."),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  sortOrder: z.coerce
    .number()
    .int("Informe um número inteiro.")
    .min(0, "A ordem não pode ser negativa.")
    .max(9999, "A ordem deve ser no máximo 9999."),
  galleryJson: z
    .string()
    .max(20000, "A galeria é muito grande.")
    .refine((value) => {
      try {
        const parsed = JSON.parse(value || "[]");
        return Array.isArray(parsed) && parsed.length <= 10;
      } catch {
        return false;
      }
    }, "A galeria de imagens é inválida."),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const productIdSchema = z.uuid("Produto inválido.");
