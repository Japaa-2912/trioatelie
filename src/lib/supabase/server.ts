import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import {
  isSupabaseConfigured,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from "./config";

/**
 * Cliente autenticado (cookies de sessão) para Server Components,
 * Server Actions e Route Handlers. Respeita RLS.
 */
export async function createServerSupabase(): Promise<
  SupabaseClient<Database> | null
> {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Chamado de um Server Component: a atualização de cookies é feita
          // pelo proxy. Podemos ignorar com segurança.
        }
      },
    },
  });
}

/**
 * Cliente público (sem cookies) para leitura de conteúdo da loja.
 * Nunca use este cliente para mutações administrativas.
 */
export function createPublicSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
