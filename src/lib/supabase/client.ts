"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import {
  isSupabaseConfigured,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from "./config";

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Cliente do Supabase para componentes no navegador.
 * Retorna null quando o projeto ainda não foi configurado.
 */
export function getBrowserSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
    );
  }
  return browserClient;
}
