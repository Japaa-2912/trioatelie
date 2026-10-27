"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { updatePasswordAction, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, Input } from "@/components/ui/form";

const initialState: AuthState = {};

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePasswordAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-brand">
        Nova senha
      </p>
      <h1 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
        Crie uma senha segura
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Use pelo menos 8 caracteres. Depois de salvar, você será levada ao
        painel.
      </p>

      {state.error ? (
        <Alert tone="error" className="mt-5">
          {state.error}
        </Alert>
      ) : null}

      <form action={formAction} className="mt-6 space-y-4">
        <Field
          label="Nova senha"
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
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Mínimo de 8 caracteres"
              className="pl-9 pr-11"
              disabled={pending}
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

        <Field
          label="Confirmar nova senha"
          htmlFor="confirmPassword"
          required
          error={state.fieldErrors?.confirmPassword}
        >
          <div className="relative">
            <ShieldCheck
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50"
              aria-hidden="true"
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Repita a nova senha"
              className="pl-9"
              disabled={pending}
            />
          </div>
        </Field>

        <Button
          type="submit"
          size="lg"
          loading={pending}
          className="w-full"
        >
          Salvar nova senha
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/admin/login"
          className="text-xs font-medium text-muted transition hover:text-brand"
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
