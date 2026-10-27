import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { AdminProfile } from "@/types/store";
import { createServerSupabase } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

export class UnauthorizedError extends Error {
  constructor() {
    super("Acesso não autorizado.");
    this.name = "UnauthorizedError";
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createServerSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getAdminProfile(): Promise<{
  profile: AdminProfile;
  supabase: SupabaseClient<Database>;
} | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createServerSupabase();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data || data.role !== "admin") return null;

  return {
    profile: {
      id: data.id,
      email: user.email,
      fullName: data.full_name,
      role: data.role,
    },
    supabase,
  };
}

/**
 * Garante acesso administrativo em Server Components/páginas.
 * Redireciona para o login quando necessário.
 */
export async function requireAdmin() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?config=1");
  }
  const auth = await getAdminProfile();
  if (!auth) {
    redirect("/admin/login?erro=acesso");
  }
  return auth;
}

/**
 * Garante acesso administrativo em Server Actions.
 * Lança UnauthorizedError, que as actions convertem em mensagem segura.
 */
export async function assertAdmin(): Promise<{
  profile: AdminProfile;
  supabase: SupabaseClient<Database>;
}> {
  const auth = await getAdminProfile();
  if (!auth) throw new UnauthorizedError();
  return auth;
}
