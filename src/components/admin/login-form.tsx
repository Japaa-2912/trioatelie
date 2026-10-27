"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { loginAction, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, Input } from "@/components/ui/form";

const initialState: AuthState = {};

export function LoginForm({
  next,
  configured,
  accessError,
  linkError,
}: {
  next: string;
  configured: boolean;
  accessError: boolean;
  linkError: boolean;
}) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-brand">
        Área da proprietária
      </p>
      <h1 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
        Entrar no painel
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Use o e-mail e a senha cadastrados para administrar a loja.
      </p>

      {!configured ? (
        <Alert tone="warning" className="mt-5" title="Supabase não configurado">
          Preencha as variáveis de ambiente no arquivo <code>.env.local</code> e
          reinicie o servidor para habilitar o login.
        </Alert>
      ) : null}

      {accessError ? (
        <Alert tone="error" className="mt-5">
          Sua sessão expirou ou esta conta não tem permissão de administradora.
          Entre novamente.
        </Alert>
      ) : null}

      {linkError ? (
        <Alert tone="error" className="mt-5">
          O link de acesso é inválido ou expirou. Solicite um novo link de
          recuperação.
        </Alert>
      ) : null}

      {state.error ? (
        <Alert tone="error" className="mt-5">
          {state.error}
        </Alert>
      ) : null}

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next} />
        <Field
          label="E-mail"
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

        <Field
          label="Senha"
          htmlFor="password"
          required
          error={state.fieldErrors?.password}
        >
          <div className="relative">
            <LockKeyhole
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50"
              aria-hidden="true"
            />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Sua senha"
              className="pl-9 pr-11"
              disabled={pending || !configured}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted/60 transition hover:bg-cream hover:text-ink"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </Field>

        <Button
          type="submit"
          size="lg"
          loading={pending}
          disabled={!configured}
          className="w-full"
        >
          Entrar
          {!pending ? (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          ) : null}
        </Button>
      </form>

      <div className="mt-5 flex flex-col gap-2 text-center text-xs text-muted">
        <Link
          href="/admin/recuperar-senha"
          className="font-medium text-brand hover:underline"
        >
          Esqueci minha senha
        </Link>
        <p className="text-[0.68rem] leading-relaxed text-muted/70">
          Não há cadastro público. O acesso é criado manualmente pela
          proprietária.
        </p>
      </div>
    </div>
  );
}
