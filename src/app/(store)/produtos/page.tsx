import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Search, SlidersHorizontal, X } from "lucide-react";
import { getCategories, getProducts, getStoreSettings } from "@/lib/data/store";
import { ProductCard } from "@/components/store/product-card";
import { EmptyCatalog } from "@/components/store/empty-catalog";
import { buttonClasses } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Conheça as caixas, cadernos e kits de lembrancinhas personalizadas do ateliê.",
  alternates: { canonical: "/produtos" },
};

type SearchParams = Promise<{ q?: string; categoria?: string }>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim().slice(0, 80);
  const categorySlug = (params.categoria ?? "").trim();

  const [settings, categories, allProducts] = await Promise.all([
    getStoreSettings(),
    getCategories(),
    getProducts({ search: query || undefined }),
  ]);

  const selectedCategory = categories.find(
    (category) => category.slug === categorySlug,
  );
  const products = selectedCategory
    ? allProducts.filter((product) => product.categoryId === selectedCategory.id)
    : allProducts;

  const filterHref = (slug?: string) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (slug) search.set("categoria", slug);
    const value = search.toString();
    return value ? `/produtos?${value}` : "/produtos";
  };

  return (
    <div className="container-page py-10 md:py-14">
      <nav aria-label="Você está aqui" className="flex items-center gap-2 text-[0.68rem] text-muted">
        <Link href="/" className="transition hover:text-brand">
          Início
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">Produtos</span>
      </nav>

      <div className="mt-7 max-w-2xl">
        <p className="eyebrow">Catálogo do ateliê</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
          Lembrancinhas para celebrar cada detalhe
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
          Escolha as peças que combinam com a sua festa. As possibilidades de
          personalização são confirmadas diretamente com a proprietária.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-line/80 bg-ivory/70 p-3 md:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <form action="/produtos" method="get" role="search" className="relative flex-1 lg:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/60"
              aria-hidden="true"
            />
            <label htmlFor="busca-produtos" className="sr-only">
              Buscar produtos
            </label>
            <Input
              id="busca-produtos"
              name="q"
              defaultValue={query}
              placeholder="Buscar por nome ou detalhe"
              className="pl-10 pr-10"
            />
            {selectedCategory ? (
              <input type="hidden" name="categoria" value={selectedCategory.slug} />
            ) : null}
            {query ? (
              <Link
                href={filterHref(selectedCategory?.slug)}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-cream"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ) : null}
          </form>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="hidden items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted/60 sm:flex">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              Filtrar
            </span>
            <Link
              href={filterHref()}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition",
                !selectedCategory
                  ? "border-brand bg-brand text-ivory"
                  : "border-line bg-ivory text-muted hover:border-brand/30 hover:text-ink",
              )}
            >
              Todos
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={filterHref(category.slug)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition",
                  selectedCategory?.id === category.id
                    ? "border-brand bg-brand text-ivory"
                    : "border-line bg-ivory text-muted hover:border-brand/30 hover:text-ink",
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <p className="text-xs text-muted">
          {products.length === 0
            ? "Nenhum produto encontrado"
            : `${products.length} ${products.length === 1 ? "produto" : "produtos"}`}
          {selectedCategory ? ` em “${selectedCategory.name}”` : ""}
          {query ? ` para “${query}”` : ""}
        </p>
        {query || selectedCategory ? (
          <Link
            href="/produtos"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Limpar filtros
          </Link>
        ) : null}
      </div>

      <div className="mt-5">
        {products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} settings={settings} />
            ))}
          </div>
        ) : allProducts.length === 0 ? (
          <EmptyCatalog settings={settings} />
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-ivory/60 px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream text-muted">
              <Search className="h-6 w-6" strokeWidth={1.4} aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-display text-2xl text-ink">
              Não encontramos nada por aqui
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Tente outro termo ou veja todas as lembrancinhas disponíveis.
            </p>
            <Link
              href="/produtos"
              className={buttonClasses({ variant: "outline", size: "md", className: "mt-5" })}
            >
              Ver todos os produtos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
