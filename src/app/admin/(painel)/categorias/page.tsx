import type { Metadata } from "next";
import Link from "next/link";
import { FolderOpen, Info } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoryManager } from "@/components/admin/category-manager";
import { Alert } from "@/components/ui/alert";
import { buttonClasses } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getAdminCategories, getAdminProducts } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Categorias",
  robots: { index: false, follow: false },
};

const successMessages: Record<string, string> = {
  ativada: "Categoria ativada e visível na loja.",
  desativada: "Categoria desativada. Ela não aparece mais na loja.",
  destaque: "Categoria destacada na homepage.",
  "sem-destaque": "Categoria removida dos destaques da homepage.",
  excluida: "Categoria excluída. Os produtos vinculados continuam no catálogo.",
};

const errorMessages: Record<string, string> = {
  dados: "Os dados enviados eram inválidos. Atualize a página e tente novamente.",
  status: "Não foi possível alterar a visibilidade da categoria.",
  destaque: "Não foi possível alterar o destaque da categoria.",
  excluir: "Não foi possível excluir a categoria. Tente novamente.",
};

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const [categories, products] = await Promise.all([
    getAdminCategories(),
    getAdminProducts(),
  ]);

  const productCounts: Record<string, number> = {};
  for (const product of products) {
    if (!product.categoryId) continue;
    productCounts[product.categoryId] =
      (productCounts[product.categoryId] ?? 0) + 1;
  }

  const okMessage = params.ok ? successMessages[params.ok] : null;
  const errorMessage = params.erro ? errorMessages[params.erro] : null;
  const featured = categories.filter((category) => category.isFeatured).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Organização"
        title="Categorias"
        description="Agrupe as peças por tipo de lembrancinha. Categorias ativas e em destaque aparecem na home e na página de categorias."
        action={
          <Link
            href="/admin/produtos"
            className={buttonClasses({ variant: "outline", size: "md" })}
          >
            <FolderOpen className="h-4 w-4" aria-hidden="true" />
            Ver produtos
          </Link>
        }
      />

      {okMessage ? (
        <Alert tone="success" title="Tudo certo">
          {okMessage}
        </Alert>
      ) : null}

      {errorMessage ? (
        <Alert tone="error" title="Não foi possível concluir">
          {errorMessage}
        </Alert>
      ) : null}

      <section
        aria-label="Resumo das categorias"
        className="grid gap-3 sm:grid-cols-3"
      >
        {[
          {
            label: "Categorias",
            value: categories.length,
            detail: "cadastradas no total",
          },
          {
            label: "Ativas",
            value: categories.filter((category) => category.isActive).length,
            detail: "visíveis na loja",
          },
          {
            label: "Em destaque",
            value: featured,
            detail: "na homepage",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-line/80 bg-ivory p-4"
          >
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted/60">
              {item.label}
            </p>
            <p className="mt-1.5 font-display text-3xl leading-none text-ink">
              {item.value}
            </p>
            <p className="mt-1 text-[0.65rem] text-muted">{item.detail}</p>
          </div>
        ))}
      </section>

      <CategoryManager categories={categories} productCounts={productCounts} />

      <Alert tone="info" title="Como as categorias aparecem">
        A loja exibe até quatro categorias em destaque na página inicial. Se
        nenhuma estiver marcada como destaque, mostramos as quatro primeiras
        categorias ativas na ordem definida. Ao excluir uma categoria, os
        produtos continuam no catálogo, apenas sem categoria.
      </Alert>

      <p className="flex items-center gap-1.5 px-1 text-[0.65rem] text-muted/70">
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
        As alterações aparecem na loja imediatamente após salvar.
      </p>
    </div>
  );
}
