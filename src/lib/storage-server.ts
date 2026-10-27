import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { STORAGE_BUCKET } from "./supabase/config";

export async function removeStorageObjects(
  supabase: SupabaseClient<Database>,
  paths: (string | null | undefined)[],
) {
  const safePaths = [...new Set(paths.filter((path): path is string => Boolean(path)))];
  if (safePaths.length === 0) return;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove(safePaths);
  if (error) {
    console.error(`[storage] Falha ao remover arquivos: ${error.message}`);
  }
}
