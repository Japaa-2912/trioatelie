"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CircleAlert, RefreshCw } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[loja] erro de renderização", error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fbece8] text-[#95645b]">
        <CircleAlert className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-display text-3xl text-ink sm:text-4xl">
        Algo não carregou como esperado
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        Tivemos um problema ao exibir esta página. Tente recarregar. Se o erro
        continuar, fale com o ateliê pelos canais de contato.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button onClick={reset} variant="primary" size="lg">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Tentar novamente
        </Button>
        <ButtonLink href="/" variant="outline" size="lg">
          Voltar para a loja
        </ButtonLink>
      </div>
      {error.digest ? (
        <p className="mt-5 text-[0.65rem] uppercase tracking-[0.16em] text-muted/50">
          Código do erro: {error.digest}
        </p>
      ) : (
        <p className="mt-5 text-[0.65rem] text-muted/50">
          Se precisar,{" "}
          <Link href="/contato" className="underline underline-offset-2">
            fale com o ateliê
          </Link>
          .
        </p>
      )}
    </div>
  );
}
