"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getRequestOrigin } from "@/lib/request";
import { safeNextPath } from "@/lib/utils";
import { loginSchema, recoverSchema, updatePasswordSchema } from "@/lib/validations/auth";
import { zodFieldErrors } from "./result";

export type AuthState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
};

function translateAuthError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos. Verifique os dados e tente novamente.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar.";
  }
  if (normalized.includes("too many requests") || normalized.includes("rate limit")) {
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  }
  if (normalized.includes("signup is disabled") || normalized.includes("signups")) {
    return "O cadastro está desativado. Peça acesso à administradora da loja.";
  }
  return "Não foi possível concluir a operação. Tente novamente em instantes.";
}

export async function loginAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "O Supabase ainda não está configurado. Preencha o arquivo .env.local antes de entrar.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return {
      error: "Verifique os campos destacados.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase indisponível." };

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: translateAuthError(error.message) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    await supabase.auth.signOut();
    return {
      error:
        "Esta conta não tem permissão de administradora. Fale com a responsável pela loja.",
    };
  }

  revalidatePath("/", "layout");
  redirect(safeNextPath(String(formData.get("next") ?? "/admin")));
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    await supabase?.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

export async function requestPasswordResetAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "O Supabase ainda não está configurado." };
  }

  const parsed = recoverSchema.safeParse({
    email: String(formData.get("email") ?? "").trim(),
  });
  if (!parsed.success) {
    return {
      error: "Informe um e-mail válido.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase indisponível." };

  const origin = await getRequestOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=/admin/redefinir-senha`,
  });

  if (error && !error.message.toLowerCase().includes("security")) {
    return { error: translateAuthError(error.message) };
  }

  return {
    success:
      "Se existir uma conta com esse e-mail, enviaremos um link para redefinir a senha. Verifique também a caixa de spam.",
  };
}

export async function updatePasswordAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "O Supabase ainda não está configurado." };
  }

  const parsed = updatePasswordSchema.safeParse({
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });
  if (!parsed.success) {
    return {
      error: "Verifique os campos destacados.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase indisponível." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      error:
        "O link de recuperação expirou ou não é válido. Solicite um novo link.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) return { error: translateAuthError(error.message) };

  revalidatePath("/", "layout");
  redirect("/admin?senha=atualizada");
}
