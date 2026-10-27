import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { ResetPasswordForm } from "@/components/admin/reset-password-form";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { buttonClasses } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Redefinir senha",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;

  if (!configured) {
    return (
      <div>
        <Alert tone="warning" title="Supabase não configurado">
          Preencha as variáveis de ambiente no arquivo <code>.env.local</code>{" "}
          para habilitar a redefinição de senha.
        </Alert>
        <div className="mt-5">
          <Link
            href="/admin/login"
            className={buttonClasses({ variant: "outline", size: "md" })}
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fbece8] text-[#95645b]">
          <CircleAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-3xl text-ink">
          Link expirado ou inválido
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Para redefinir sua senha, solicite um novo link de recuperação. O link
          enviado por e-mail tem prazo de validade.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Link
            href="/admin/recuperar-senha"
            className={buttonClasses({ variant: "primary", size: "lg" })}
          >
            Solicitar novo link
          </Link>
          <Link
            href="/admin/login"
            className={buttonClasses({ variant: "ghost", size: "md" })}
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm />;
}
