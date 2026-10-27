"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";
import {
  requestPasswordResetAction,
  type AuthState,
} from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, Input } from "@/components/ui/form";

const initialState: AuthState = {};

export function RecoverForm({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  return (
    <div>
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-brand">
        Recuperação de acesso
      </p>
      <h1 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
        Redefinir sua senha
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Informe o e-mail cadastrado. Enviaremos um link para você criar uma nova
        senha.
      </p>

      {!configured ? (
        <Alert tone="warning" className="mt-5">
          O Supabase ainda não está configurado. Preencha o{" "}
          <code>.env.local</code> para habilitar a recuperação.
        </Alert>
      ) : null}

      {state.error ? (
        <Alert tone="error" className="mt-5">
          {state.error}
        </Alert>
      ) : null}

      {state.success ? (
        <Alert tone="success" className="mt-5">
          {state.success}
        </Alert>
      ) : null}

      <form action={formAction} className="mt-6 space-y-4">
        <Field
          label="E-mail cadastrado"
          htmlFor="email"
          required
          error={state.fieldErrors?.email}
        >
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50"
              aria-hidden="true"
            />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="voce@exemplo.com"
              className="pl-9"
              disabled={pending || !configured}
            />
          </div>
        </Field>

        <Button
          type="submit"
          size="lg"
          loading={pending}
          disabled={!configured}
          className="w-full"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Enviar link de recuperação
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Voltar para o login
        </Link>
      </div>
      <p className="mt-4 text-center text-[0.65rem] leading-relaxed text-muted/60">
        Por segurança, não informamos se um e-mail está cadastrado. Verifique
        também a caixa de spam.
      </p>
    </div>
  );
}
