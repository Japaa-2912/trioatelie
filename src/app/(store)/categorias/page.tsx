import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories, getProducts } from "@/lib/data/store";
import { CategoryCard } from "@/components/store/category-card";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Categorias",
  description:
    "Explore as categorias de lembrancinhas personalizadas: caixas, cadernos, kits e outros detalhes.",
  alternates: { canonical: "/categorias" },
};

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const countByCategory = new Map<string, number>();
  for (const product of products) {
    if (!product.categoryId) continue;
    countByCategory.set(
      product.categoryId,
      (countByCategory.get(product.categoryId) ?? 0) + 1,
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      <nav aria-label="Você está aqui" className="flex items-center gap-2 text-[0.68rem] text-muted">
        <Link href="/" className="transition hover:text-brand">
          Início
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">Categorias</span>
      </nav>

      <div className="mt-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Encontre o seu estilo</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
            Categorias de lembrancinhas
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            Organizamos as peças por tipo para facilitar a sua escolha. Todas
            podem ser conversadas e personalizadas conforme a disponibilidade do
            ateliê.
          </p>
        </div>
        <Link
          href="/produtos"
          className={buttonClasses({ variant: "outline", size: "md" })}
        >
          Ver todos os produtos
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {categories.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              productCount={countByCategory.get(category.id) ?? 0}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-ivory/60 px-6 py-16 text-center">
          <h2 className="font-display text-3xl text-ink">
            As categorias estão sendo organizadas
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Em breve você encontrará aqui as coleções do ateliê. Enquanto isso,
            fale com a gente para conhecer as possibilidades.
          </p>
          <Link
            href="/contato"
            className={buttonClasses({ variant: "primary", size: "md", className: "mt-6" })}
          >
            Entrar em contato
          </Link>
        </div>
      )}
    </div>
  );
}
