import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, LayoutTemplate } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { HomepageEditor } from "@/components/admin/homepage-editor";
import { Alert } from "@/components/ui/alert";
import { buttonClasses } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getAdminSections, getAdminSettings } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Página inicial",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  await requireAdmin();
  const [settings, sections] = await Promise.all([
    getAdminSettings(),
    getAdminSections(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Conteúdo"
        title="Página inicial"
        description="Ajuste a marca, o banner e os blocos que aparecem na primeira página da loja. As alterações são publicadas assim que você salvar."
        action={
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: "outline", size: "md" })}
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            Ver loja
          </Link>
        }
      />

      {!settings.heroImagePath ? (
        <Alert tone="warning" title="O banner ainda usa uma ilustração">
          Envie uma foto vertical com a sua identidade para deixar a página
          inicial com a cara do ateliê. Você pode trocar ou remover depois.
        </Alert>
      ) : null}

      <div className="flex items-start gap-2 rounded-xl border border-line/70 bg-ivory px-4 py-3">
        <LayoutTemplate
          className="mt-0.5 h-4 w-4 shrink-0 text-brand"
          aria-hidden="true"
        />
        <p className="text-[0.68rem] leading-relaxed text-muted">
          Dica: os textos das seções funcionam melhor curtos e acolhedores. A
          disponibilidade de personalização e os prazos são sempre confirmados
          pelo WhatsApp — evite prometer prazos automáticos.
        </p>
      </div>

      <HomepageEditor settings={settings} sections={sections} />
    </div>
  );
}
