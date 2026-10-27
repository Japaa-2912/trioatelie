import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .max(200),
});

export const recoverSchema = z.object({
  email: z.email("Informe um e-mail válido."),
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "A nova senha deve ter pelo menos 8 caracteres.")
      .max(200),
    confirmPassword: z.string().min(8, "Confirme a nova senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });
