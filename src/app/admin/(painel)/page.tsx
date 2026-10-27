import Link from "next/link";
import {
  ArrowRight,
  CircleCheck,
  CircleAlert,
  FolderOpen,
  ImagePlus,
  LayoutTemplate,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  Settings,
  Sparkles,
  Star,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import {
  getAdminCounts,
  getAdminProducts,
  getAdminSettings,
} from "@/lib/data/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { formatDateTimeBR } from "@/lib/utils";

export const metadata = { title: "Visão geral" };

const quickActions = [
  {
    href: "/admin/produtos/novo",
    label: "Novo produto",
    description: "Cadastre uma peça no catálogo",
    icon: Plus,
  },
  {
    href: "/admin/home",
    label: "Página inicial",
    description: "Banner, textos e seções",
    icon: LayoutTemplate,
  },
  {
    href: "/admin/categorias",
    label: "Categorias",
    description: "Organize a vitrine",
    icon: FolderOpen,
  },
  {
    href: "/admin/configuracoes",
    label: "Configurações",
    description: "Marca, contato e cores",
    icon: Settings,
  },
];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ senha?: string }>;
}) {
  const { profile } = await requireAdmin();
  const params = await searchParams;
  const [counts, settings, products] = await Promise.all([
    getAdminCounts(),
    getAdminSettings(),
    getAdminProducts(),
  ]);

  const recent = products.slice(0, 5);

  const checklist = [
    {
      done: Boolean(settings.whatsappNumber),
      title: "Configurar o WhatsApp da loja",
      description:
        "Sem o número, os botões de pedido ficam desativados na loja.",
      href: "/admin/configuracoes",
      action: "Configurar",
    },
    {
      done: Boolean(settings.heroImagePath),
      title: "Enviar a imagem principal do banner",
      description:
        "Enquanto não houver foto, a loja exibe uma ilustração elegante.",
      href: "/admin/home",
      action: "Enviar imagem",
    },
    {
      done: counts.totalProducts > 0,
      title: "Cadastrar o primeiro produto",
      description:
        "A vitrine mostra uma mensagem acolhedora enquanto o catálogo está vazio.",
      href: "/admin/produtos/novo",
      action: "Criar produto",
    },
    {
      done: counts.activeCategories > 0,
      title: "Revisar as categorias",
      description:
        "Categorias ativas aparecem na home e na página de categorias.",
      href: "/admin/categorias",
      action: "Revisar",
    },
  ];

  const pending = checklist.filter((item) => !item.done);
  const firstName = (profile.fullName || "").split(" ")[0];

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Painel da loja"
        title={`Olá${firstName ? `, ${firstName}` : ""}!`}
        description="Aqui você atualiza o catálogo, o banner e as informações da loja. Tudo o que salvar aparece imediatamente no site."
        action={
          <Link
            href="/admin/produtos/novo"
            className={buttonClasses({ variant: "primary", size: "md" })}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Novo produto
          </Link>
        }
      />

      {params.senha === "atualizada" ? (
        <Alert tone="success" title="Senha atualizada">
          Sua nova senha já está ativa. Guarde-a em um lugar seguro.
        </Alert>
      ) : null}

      <section aria-label="Resumo do catálogo" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Produtos cadastrados",
            value: counts.totalProducts,
            detail: `${counts.activeProducts} ativos • ${counts.inactiveProducts} inativos`,
            icon: Package,
            href: "/admin/produtos",
          },
          {
            label: "Produtos ativos",
            value: counts.activeProducts,
            detail: "Visíveis na loja pública",
            icon: CircleCheck,
            href: "/admin/produtos?status=active",
          },
          {
            label: "Categorias ativas",
            value: counts.activeCategories,
            detail: `${counts.totalCategories} cadastradas no total`,
            icon: FolderOpen,
            href: "/admin/categorias",
          },
          {
            label: "Destaques na home",
            value: counts.featuredProducts,
            detail: "Produtos marcados como destaque",
            icon: Star,
            href: "/admin/produtos",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-2xl border border-line/80 bg-ivory p-5 transition hover:border-brand/25 hover:shadow-[0_18px_40px_-38px_rgba(61,52,46,.4)]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted/60">
                  {card.label}
                </p>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-brand transition group-hover:bg-blush/40">
                  <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
                </span>
              </div>
              <p className="mt-2 font-display text-4xl leading-none text-ink">
                {card.value}
              </p>
              <p className="mt-2 text-[0.68rem] text-muted">{card.detail}</p>
            </Link>
          );
        })}
      </section>

      <section aria-labelledby="atalhos-title">
        <h2
          id="atalhos-title"
          className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted/60"
        >
          Atalhos
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-3 rounded-2xl border border-line/80 bg-ivory p-4 transition hover:border-brand/25"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-ink">
                    {action.label}
                  </span>
                  <span className="mt-0.5 block text-[0.65rem] text-muted">
                    {action.description}
                  </span>
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-muted/40 transition group-hover:translate-x-0.5 group-hover:text-brand"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <section
          aria-labelledby="recent-title"
          className="rounded-2xl border border-line/80 bg-ivory"
        >
          <div className="flex items-center justify-between gap-4 border-b border-line/70 px-5 py-4">
            <div>
              <h2 id="recent-title" className="font-display text-xl text-ink">
                Catálogo recente
              </h2>
              <p className="mt-0.5 text-[0.68rem] text-muted">
                Últimos produtos cadastrados ou atualizados.
              </p>
            </div>
            <Link
              href="/admin/produtos"
              className="inline-flex items-center gap-1 text-[0.68rem] font-medium text-brand hover:underline"
            >
              Ver todos
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>

          {recent.length > 0 ? (
            <ul className="divide-y divide-line/60">
              {recent.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-brand/70">
                    <Package className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ink">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-[0.62rem] text-muted">
                      {product.category?.name ?? "Sem categoria"} •{" "}
                      {formatDateTimeBR(product.updatedAt) ?? "—"}
                    </p>
                  </div>
                  <Badge tone={product.isActive ? "sage" : "neutral"}>
                    {product.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                  <Link
                    href={`/admin/produtos/${product.id}`}
                    aria-label={`Editar ${product.name}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition hover:border-brand/40 hover:text-brand"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blush/40 text-brand">
                <Package className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">
                Nenhum produto cadastrado ainda
              </p>
              <p className="mx-auto mt-1 max-w-xs text-[0.72rem] leading-relaxed text-muted">
                Crie a primeira peça para que a vitrine comece a ganhar vida.
              </p>
              <Link
                href="/admin/produtos/novo"
                className={buttonClasses({
                  variant: "primary",
                  size: "sm",
                  className: "mt-4",
                })}
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Criar produto
              </Link>
            </div>
          )}
        </section>

        <section
          aria-labelledby="checklist-title"
          className="rounded-2xl border border-line/80 bg-ivory p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="checklist-title" className="font-display text-xl text-ink">
                Para deixar a loja pronta
              </h2>
              <p className="mt-0.5 text-[0.68rem] text-muted">
                {pending.length === 0
                  ? "Tudo encaminhado por aqui."
                  : `${pending.length} ${pending.length === 1 ? "item pendente" : "itens pendentes"}.`}
              </p>
            </div>
            <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
          </div>

          {pending.length === 0 ? (
            <div className="mt-4 rounded-xl border border-[#a9bda2]/50 bg-[#f2f7ef] p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-[#5e7556]">
                <CircleCheck className="h-4 w-4" aria-hidden="true" />
                Loja com o essencial configurado
              </p>
              <p className="mt-1.5 text-[0.7rem] leading-relaxed text-[#5e7556]/80">
                Continue revisando produtos, textos e fotos para manter o
                catálogo atualizado.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {pending.map((item) => (
                <li
                  key={item.title}
                  className="rounded-xl border border-line/70 bg-cream/40 p-3.5"
                >
                  <div className="flex items-start gap-2.5">
                    <CircleAlert
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#b58d5e]"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-ink">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[0.65rem] leading-relaxed text-muted">
                        {item.description}
                      </p>
                      <Link
                        href={item.href}
                        className="mt-2 inline-flex items-center gap-1 text-[0.65rem] font-semibold text-brand hover:underline"
                      >
                        {item.action}
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {pending.some((item) => item.href === "/admin/configuracoes") ? (
            <p className="mt-4 flex items-center gap-1.5 text-[0.62rem] text-muted/70">
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              O WhatsApp é o canal oficial de pedidos.
            </p>
          ) : (
            <p className="mt-4 flex items-center gap-1.5 text-[0.62rem] text-muted/70">
              <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
              Fotos reais dos produtos valorizam a vitrine.
            </p>
          )}
        </section>
      </div>

      <Alert tone="info" title="Sobre os números deste painel">
        Exibimos apenas contagens reais do catálogo. Não há métricas de vendas,
        pagamentos ou pedidos confirmados porque esta versão não processa
        pagamentos e os pedidos são combinados diretamente pelo WhatsApp.
      </Alert>
    </div>
  );
}
