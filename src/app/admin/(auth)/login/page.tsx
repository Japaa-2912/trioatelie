import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminProfile } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeNextPath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Entrar no painel",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; erro?: string; config?: string }>;
}) {
  const params = await searchParams;
  const requested = safeNextPath(params.next, "/admin");
  // Evita laço quando o parâmetro `next` aponta para a própria tela de login.
  const next = requested.startsWith("/admin/login") ? "/admin" : requested;
  const configured = isSupabaseConfigured();

  // Quem já está autenticado como admin não precisa ver o formulário de login.
  // Contas sem papel de admin (viewer) continuam vendo o formulário com o aviso.
  if (configured) {
    const session = await getAdminProfile();
    if (session) redirect(next);
  }

  return (
    <LoginForm
      next={next}
      configured={configured}
      accessError={params.erro === "acesso"}
      linkError={params.erro === "link"}
    />
  );
}
