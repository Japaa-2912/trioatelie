import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
  getStoreSettings,
} from "@/lib/data/store";
import { CategoryGlyph, categoryToneClass } from "@/components/brand/illustrations";
import { ProductCard } from "@/components/store/product-card";
import { EmptyCatalog } from "@/components/store/empty-catalog";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Categoria não encontrada" };
  return {
    title: category.name,
    description:
      category.description ??
      `Conheça as lembrancinhas personalizadas da categoria ${category.name}.`,
    alternates: { canonical: `/categorias/${category.slug}` },
    openGraph: {
      title: category.name,
      description: category.description ?? undefined,
      url: `/categorias/${category.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [settings, products, categories] = await Promise.all([
    getStoreSettings(),
    getProducts({ categoryId: category.id }),
    getCategories(),
  ]);

  const otherCategories = categories
    .filter((item) => item.id !== category.id)
    .slice(0, 3);

  return (
    <div className="container-page py-10 md:py-14">
      <nav aria-label="Você está aqui" className="flex flex-wrap items-center gap-2 text-[0.68rem] text-muted">
        <Link href="/" className="transition hover:text-brand">
          Início
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/categorias" className="transition hover:text-brand">
          Categorias
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">{category.name}</span>
      </nav>

      <section className="relative mt-7 overflow-hidden rounded-[2rem] border border-line/70 bg-ivory">
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-full opacity-70 md:w-1/2",
            categoryToneClass(category.tone),
          )}
          aria-hidden="true"
        />
        {category.imageUrl ? (
          <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
            <Image
              src={category.imageUrl}
              alt={`Categoria ${category.name}`}
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/20 to-transparent"
              aria-hidden="true"
            />
          </div>
        ) : null}

        <div className="relative max-w-2xl px-6 py-10 md:px-10 md:py-14 lg:py-16">
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-ivory/80",
              categoryToneClass(category.tone),
            )}
          >
            <CategoryGlyph icon={category.icon} className="h-5 w-5" />
          </span>
          <p className="eyebrow mt-5">Categoria</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
            {category.name}
          </h1>
          {category.description ? (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              {category.description}
            </p>
          ) : null}
          <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted/60">
            {products.length} {products.length === 1 ? "produto" : "produtos"}{" "}
            nesta categoria
          </p>
        </div>
      </section>

      <div className="mt-10">
        {products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} settings={settings} />
            ))}
          </div>
        ) : (
          <EmptyCatalog settings={settings} compact />
        )}
      </div>

      {otherCategories.length > 0 ? (
        <section className="mt-14 border-t border-line/70 pt-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-ink">
              Continue explorando
            </h2>
            <Link
              href="/categorias"
              className={buttonClasses({ variant: "ghost", size: "sm" })}
            >
              Ver categorias
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {otherCategories.map((item) => (
              <Link
                key={item.id}
                href={`/categorias/${item.slug}`}
                className="rounded-full border border-line bg-ivory px-4 py-2 text-xs font-medium text-muted transition hover:border-brand/30 hover:text-ink"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-10">
        <Link
          href="/produtos"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted transition hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Ver todos os produtos
        </Link>
      </div>
    </div>
  );
}
