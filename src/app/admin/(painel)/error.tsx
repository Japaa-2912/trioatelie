"use client";

import { useEffect } from "react";
import { CircleAlert, RefreshCw } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] erro de renderização", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fbece8] text-[#95645b]">
        <CircleAlert className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h1 className="mt-4 font-display text-3xl text-ink">
        Não foi possível carregar o painel
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
        Verifique sua conexão e tente novamente. Se o problema continuar, saia e
        entre novamente no painel.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button onClick={reset} variant="primary" size="md">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Tentar novamente
        </Button>
        <ButtonLink href="/admin" variant="outline" size="md">
          Voltar ao painel
        </ButtonLink>
      </div>
    </div>
  );
}
