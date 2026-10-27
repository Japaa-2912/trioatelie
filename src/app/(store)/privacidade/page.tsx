import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getStoreSettings } from "@/lib/data/store";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Saiba como os dados compartilhados nesta loja são utilizados para apresentar o catálogo e encaminhar solicitações de orçamento.",
  alternates: { canonical: "/privacidade" },
};

export default async function PrivacyPage() {
  const settings = await getStoreSettings();
  const paragraphs = (settings.privacyText ?? "").split(/\n{2,}/).filter(Boolean);

  return (
    <div className="container-page py-10 md:py-14">
      <nav
        aria-label="Você está aqui"
        className="flex items-center gap-2 text-[0.68rem] text-muted"
      >
        <Link href="/" className="transition hover:text-brand">
          Início
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">Privacidade</span>
      </nav>

      <div className="mx-auto mt-7 max-w-3xl">
        <p className="eyebrow">Transparência</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
          Política de privacidade
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Esta página explica, de forma simples, como as informações
          compartilhadas nesta loja são utilizadas. O texto é administrável pela
          proprietária no painel.
        </p>

        <div className="mt-8 rounded-[1.75rem] border border-line/80 bg-ivory p-6 md:p-8">
          <div className="flex items-center gap-2 border-b border-line/70 pb-4">
            <ShieldCheck className="h-5 w-5 text-brand" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {settings.brandName}
            </p>
          </div>

          {paragraphs.length > 0 ? (
            <div className="mt-5 space-y-4">
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="whitespace-pre-line text-sm leading-relaxed text-muted"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm leading-relaxed text-muted">
              O texto da política de privacidade ainda está sendo configurado
              pela proprietária. Em caso de dúvidas, entre em contato pelos
              canais oficiais da loja.
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/contato"
            className={buttonClasses({ variant: "primary", size: "md" })}
          >
            Falar com o ateliê
          </Link>
          <Link
            href="/"
            className={buttonClasses({ variant: "ghost", size: "md" })}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}
