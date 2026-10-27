import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { BrandMark } from "@/components/brand/brand-mark";
import { getStoreSettings } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings();

  return (
    <main className="grid min-h-dvh bg-cream lg:grid-cols-[.92fr_1.08fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-10 text-cream lg:flex">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-sage/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative">
          <BrandLogo
            brandName={settings.brandName}
            tagline={settings.tagline}
            logoUrl={settings.logoUrl}
            tone="inverse"
            size="md"
            href="/"
          />
        </div>

        <div className="relative max-w-sm">
          <BrandMark className="h-16 w-16 animate-float" />
          <h1 className="mt-6 font-display text-4xl leading-[1.08] text-cream">
            Um cantinho só seu para cuidar da loja.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-cream/55">
            Atualize produtos, imagens e textos sem tocar em código. As mudanças
            aparecem na loja assim que você salvar.
          </p>
          <p className="mt-6 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-cream/40">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Acesso restrito à proprietária
          </p>
        </div>

        <Link
          href="/"
          className="relative inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-cream/50 transition hover:text-cream"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Voltar para a loja
        </Link>
      </aside>

      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-line/70 px-5 py-4 lg:hidden">
          <BrandLogo
            brandName={settings.brandName}
            tagline={settings.tagline}
            logoUrl={settings.logoUrl}
            size="sm"
            href="/"
          />
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[0.68rem] font-medium text-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Loja
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <div className="border-t border-line/60 px-5 py-4 text-center text-[0.62rem] text-muted/60">
          {settings.brandName} — painel administrativo
        </div>
      </div>
    </main>
  );
}
