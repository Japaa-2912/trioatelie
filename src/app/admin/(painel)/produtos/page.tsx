import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CircleCheck,
  CircleSlash,
  ExternalLink,
  ImageOff,
  Package,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash,
  X,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { ConfirmAction } from "@/components/ui/confirm-dialog";
import { Field, Input, Select } from "@/components/ui/form";
import {
  deleteProductAction,
  toggleProductActiveAction,
  toggleProductFeaturedAction,
} from "@/lib/actions/products";
import { requireAdmin } from "@/lib/auth";
import { getAdminCategories, getAdminProducts } from "@/lib/data/admin";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Produtos",
  robots: { index: false, follow: false },
};

const successMessages: Record<string, string> = {
  criado: "Produto criado com sucesso.",
  atualizado: "Produto atualizado com sucesso.",
  ativado: "Produto ativado e visível na loja.",
  desativado: "Produto desativado. Ele não aparece mais na loja.",
  destaque: "Produto marcado como destaque na homepage.",
  "sem-destaque": "Produto removido dos destaques da homepage.",
  excluido: "Produto excluído.",
};

const errorMessages: Record<string, string> = {
  dados: "Os dados enviados eram inválidos. Atualize a página e tente novamente.",
  status: "Não foi possível alterar a visibilidade do produto.",
  destaque: "Não foi possível alterar o destaque do produto.",
  excluir: "Não foi possível excluir o produto. Tente novamente.",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    categoria?: string;
    ok?: string;
    erro?: string;
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const status =
    params.status === "active" || params.status === "inactive"
      ? params.status
      : "all";
  const search = params.q?.trim() ?? "";
  const categoryFilter = params.categoria ?? "";

  const [products, categories] = await Promise.all([
    getAdminProducts({
      search: search || undefined,
      status,
      categoryId: categoryFilter || undefined,
    }),
    getAdminCategories(),
  ]);

  const hasFilters = Boolean(search || categoryFilter || status !== "all");
  const okMessage = params.ok ? successMessages[params.ok] : null;
  const errorMessage = params.erro ? errorMessages[params.erro] : null;
  const categoryById = new Map(categories.map((category) => [category.id, category]));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Catálogo"
        title="Produtos"
        description="Cadastre, organize e publique as peças do ateliê. As alterações aparecem na loja assim que forem salvas."
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

      <form
        method="get"
        className="rounded-2xl border border-line/80 bg-ivory p-4 md:p-5"
        aria-label="Filtrar produtos"
      >
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_11rem_12rem_auto] md:items-end">
          <Field label="Buscar" htmlFor="q">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50"
                aria-hidden="true"
              />
              <Input
                id="q"
                name="q"
                type="search"
                defaultValue={search}
                placeholder="Nome ou descrição"
                className="pl-9"
              />
            </div>
          </Field>

          <Field label="Visibilidade" htmlFor="status">
            <Select id="status" name="status" defaultValue={status}>
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </Select>
          </Field>

          <Field label="Categoria" htmlFor="categoria">
            <Select
              id="categoria"
              name="categoria"
              defaultValue={categoryFilter}
              disabled={categories.length === 0}
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>

          <div className="flex items-center gap-2">
            <Button type="submit" variant="dark" size="md">
              Filtrar
            </Button>
            {hasFilters ? (
              <Link
                href="/admin/produtos"
                className={buttonClasses({ variant: "ghost", size: "md" })}
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Limpar
              </Link>
            ) : null}
          </div>
        </div>
      </form>

      <section aria-label="Lista de produtos" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <p className="text-[0.68rem] font-medium text-muted">
            {products.length === 0
              ? "Nenhum produto encontrado"
              : `${products.length} ${products.length === 1 ? "produto" : "produtos"}`}
            {hasFilters ? " com os filtros atuais" : " no catálogo"}
          </p>
          <p className="text-[0.62rem] text-muted/60">
            Use a busca e os filtros para encontrar uma peça.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-ivory px-6 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blush/35 text-brand">
              {hasFilters ? (
                <Search className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Package className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
              )}
            </span>
            <h2 className="mt-4 font-display text-2xl text-ink">
              {hasFilters
                ? "Nada encontrado com esses filtros"
                : "O catálogo ainda está vazio"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              {hasFilters
                ? "Tente outro termo de busca ou limpe os filtros para ver todos os produtos."
                : "Crie a primeira peça para que a vitrine comece a ganhar vida. Você poderá adicionar fotos, preço e personalização."}
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
              {hasFilters ? (
                <Link
                  href="/admin/produtos"
                  className={buttonClasses({ variant: "outline", size: "md" })}
                >
                  Limpar filtros
                </Link>
              ) : null}
              <Link
                href="/admin/produtos/novo"
                className={buttonClasses({ variant: "primary", size: "md" })}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Criar produto
              </Link>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {products.map((product) => {
              const price =
                product.priceOnRequest || product.price === null
                  ? "Sob consulta"
                  : formatPrice(product.price);
              const category =
                product.category ??
                (product.categoryId
                  ? categoryById.get(product.categoryId) ?? null
                  : null);

              return (
                <li
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-line/80 bg-ivory transition hover:border-brand/25"
                >
                  <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                    <Link
                      href={`/admin/produtos/${product.id}`}
                      className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl border border-line/70 bg-cream md:h-20 md:w-20"
                      aria-label={`Editar ${product.name}`}
                    >
                      {product.mainImageUrl ? (
                        <Image
                          src={product.mainImageUrl}
                          alt=""
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-muted/40">
                          <ImageOff
                            className="h-6 w-6"
                            strokeWidth={1.4}
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge tone={product.isActive ? "sage" : "neutral"}>
                          {product.isActive ? (
                            <>
                              <CircleCheck className="h-3 w-3" aria-hidden="true" />
                              Ativo
                            </>
                          ) : (
                            <>
                              <CircleSlash className="h-3 w-3" aria-hidden="true" />
                              Inativo
                            </>
                          )}
                        </Badge>
                        {product.isFeatured ? (
                          <Badge tone="brand">
                            <Star className="h-3 w-3" aria-hidden="true" />
                            Destaque
                          </Badge>
                        ) : null}
                        {product.priceOnRequest ? (
                          <Badge tone="sky">Sob consulta</Badge>
                        ) : null}
                      </div>

                      <Link
                        href={`/admin/produtos/${product.id}`}
                        className="mt-2 block truncate font-display text-xl leading-tight text-ink transition hover:text-brand"
                      >
                        {product.name}
                      </Link>

                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.68rem] text-muted">
                        <span>{category?.name ?? "Sem categoria"}</span>
                        <span aria-hidden="true">•</span>
                        <span className="font-semibold text-brand">{price}</span>
                        <span aria-hidden="true">•</span>
                        <span>
                          Mín. {product.minQuantity}{" "}
                          {product.minQuantity === 1 ? "unidade" : "unidades"}
                        </span>
                      </p>
                      <p className="mt-1 truncate text-[0.65rem] text-muted/60">
                        /produtos/{product.slug}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 md:justify-end">
                      <Link
                        href={`/produtos/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Abrir ${product.name} na loja`}
                        title="Ver na loja"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-brand/40 hover:text-brand"
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>

                      <form action={toggleProductFeaturedAction}>
                        <input type="hidden" name="id" value={product.id} />
                        <input
                          type="hidden"
                          name="next"
                          value={String(!product.isFeatured)}
                        />
                        <button
                          type="submit"
                          aria-label={
                            product.isFeatured
                              ? `Remover ${product.name} dos destaques`
                              : `Destacar ${product.name} na homepage`
                          }
                          title={
                            product.isFeatured
                              ? "Remover dos destaques"
                              : "Destacar na homepage"
                          }
                          className={
                            product.isFeatured
                              ? "flex h-9 w-9 items-center justify-center rounded-full border border-brand/25 bg-brand/10 text-brand transition hover:bg-brand/15"
                              : "flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-brand/40 hover:text-brand"
                          }
                        >
                          <Star
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                            fill={product.isFeatured ? "currentColor" : "none"}
                          />
                        </button>
                      </form>

                      <form action={toggleProductActiveAction}>
                        <input type="hidden" name="id" value={product.id} />
                        <input
                          type="hidden"
                          name="next"
                          value={String(!product.isActive)}
                        />
                        <button
                          type="submit"
                          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-line px-3 text-[0.65rem] font-semibold text-muted transition hover:border-brand/40 hover:text-ink"
                        >
                          {product.isActive ? "Desativar" : "Ativar"}
                        </button>
                      </form>

                      <Link
                        href={`/admin/produtos/${product.id}`}
                        className={buttonClasses({
                          variant: "outline",
                          size: "sm",
                          className: "px-3",
                        })}
                      >
                        <Pencil className="h-3 w-3" aria-hidden="true" />
                        Editar
                      </Link>

                      <ConfirmAction
                        action={deleteProductAction}
                        fields={{ id: product.id }}
                        title="Excluir produto?"
                        description={`"${product.name}" será removido do catálogo, junto com as imagens da galeria. Esta ação não pode ser desfeita.`}
                        confirmLabel="Excluir produto"
                        trigger={
                          <>
                            <Trash className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="sr-only">
                              Excluir {product.name}
                            </span>
                          </>
                        }
                      />
                    </div>
                  </div>

                  {!product.mainImageUrl ? (
                    <p className="flex items-center gap-1.5 border-t border-line/60 bg-cream/50 px-4 py-2 text-[0.62rem] text-[#8a6b3e]">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      Sem foto de capa — a loja exibe uma ilustração. Envie uma
                      imagem para valorizar o produto.
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
