import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, KeyRound, MessageCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsEditor } from "@/components/admin/settings-editor";
import { Alert } from "@/components/ui/alert";
import { buttonClasses } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getAdminSettings } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Configurações",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ senha?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const settings = await getAdminSettings();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Loja"
        title="Configurações"
        description="Contato, textos institucionais, privacidade e a paleta de cores da loja."
        action={
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: "outline", size: "md" })}
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            Abrir loja
          </Link>
        }
      />

      {params.senha === "atualizada" ? (
        <Alert tone="success" title="Senha atualizada">
          Sua nova senha já está ativa.
        </Alert>
      ) : null}

      {!settings.whatsappNumber ? (
        <Alert tone="warning" title="Configure o WhatsApp para receber pedidos">
          Sem o número, a loja não consegue encaminhar o resumo do carrinho e os
          botões de pedido ficam desativados. Informe o número com código do país
          (ex.: 5511999999999).
        </Alert>
      ) : null}

      <SettingsEditor settings={settings} />

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-line/80 bg-ivory p-4">
          <p className="flex items-center gap-2 text-xs font-semibold text-ink">
            <MessageCircle className="h-4 w-4 text-brand" aria-hidden="true" />
            Pedidos pelo WhatsApp
          </p>
          <p className="mt-1.5 text-[0.68rem] leading-relaxed text-muted">
            O site monta a mensagem com produtos, quantidades, subtotal e
            detalhes da festa. Nenhum pedido é confirmado automaticamente — a
            confirmação acontece na conversa.
          </p>
        </div>

        <div className="rounded-2xl border border-line/80 bg-ivory p-4">
          <p className="flex items-center gap-2 text-xs font-semibold text-ink">
            <KeyRound className="h-4 w-4 text-brand" aria-hidden="true" />
            Acesso e segurança
          </p>
          <p className="mt-1.5 text-[0.68rem] leading-relaxed text-muted">
            Não há cadastro público de administradoras. Para alterar a senha,
            saia do painel e use “Esqueci minha senha” na tela de login.
          </p>
        </div>
      </section>
    </div>
  );
}
