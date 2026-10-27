import { z } from "zod";
import {
  categoryIcons,
  categoryTones,
  imagePayloadSchema,
  slugInput,
} from "./shared";

export const categoryFormSchema = z.object({
  id: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || z.uuid().safeParse(value).success,
      "Categoria inválida.",
    ),
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres.")
    .max(80, "O nome deve ter no máximo 80 caracteres."),
  slug: slugInput,
  description: z
    .string()
    .trim()
    .max(400, "A descrição deve ter no máximo 400 caracteres."),
  icon: z.enum(categoryIcons),
  tone: z.enum(categoryTones),
  imageUrl: imagePayloadSchema.shape.url,
  imagePath: z.string().trim().max(1024),
  sortOrder: z.coerce
    .number()
    .int("Informe um número inteiro.")
    .min(0, "A ordem não pode ser negativa.")
    .max(9999, "A ordem deve ser no máximo 9999."),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const categoryIdSchema = z.uuid("Categoria inválida.");
