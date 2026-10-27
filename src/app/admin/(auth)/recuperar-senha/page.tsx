import type { Metadata } from "next";
import { RecoverForm } from "@/components/admin/recover-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Recuperar senha",
  robots: { index: false, follow: false },
};

export default function RecoverPage() {
  return <RecoverForm configured={isSupabaseConfigured()} />;
}
