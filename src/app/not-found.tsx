import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream px-5 py-16 text-center">
      <BrandMark className="h-14 w-14" title="Laço & Luz" />
      <p className="eyebrow mt-6">Página não encontrada</p>
      <h1 className="mt-3 max-w-xl font-display text-4xl leading-tight text-ink sm:text-5xl">
        Este detalhe não está mais por aqui
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        O endereço pode ter mudado ou o produto saiu do catálogo. Volte para a
        loja e continue escolhendo suas lembrancinhas.
      </p>
      <div className="mt-7 flex flex-col gap-2 sm:flex-row">
        <Link href="/" className={buttonClasses({ variant: "primary", size: "lg" })}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar para a loja
        </Link>
        <Link
          href="/produtos"
          className={buttonClasses({ variant: "outline", size: "lg" })}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Ver produtos
        </Link>
      </div>
    </main>
  );
}
