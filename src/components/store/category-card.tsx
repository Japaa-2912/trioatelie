import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  CategoryGlyph,
  categoryToneClass,
} from "@/components/brand/illustrations";
import type { Category } from "@/types/store";
import { cn } from "@/lib/utils";

export function CategoryCard({
  category,
  productCount,
}: {
  category: Category;
  productCount?: number;
}) {
  return (
    <Link
      href={`/categorias/${category.slug}`}
      className="group relative flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-line/80 bg-ivory p-5 transition-all duration-500 hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_50px_-38px_rgba(61,52,46,.45)] sm:p-6"
    >
      {category.imageUrl ? (
        <>
          <Image
            src={category.imageUrl}
            alt={`Categoria ${category.name}`}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span
            className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent"
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          <span
            className={cn(
              "absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-70",
              categoryToneClass(category.tone),
            )}
            aria-hidden="true"
          />
          <span
            className="absolute -bottom-16 -left-14 h-36 w-36 rounded-full border border-current opacity-10"
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative flex items-start justify-between gap-4">
        <span
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl border",
            category.imageUrl
              ? "border-white/25 bg-ivory/15 text-ivory backdrop-blur"
              : categoryToneClass(category.tone),
          )}
        >
          <CategoryGlyph icon={category.icon} className="h-5 w-5" />
        </span>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 group-hover:rotate-45",
            category.imageUrl
              ? "border-white/25 text-ivory"
              : "border-line bg-ivory/60 text-muted",
          )}
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <div className="relative mt-10">
        <h3
          className={cn(
            "font-display text-2xl leading-tight",
            category.imageUrl ? "text-ivory" : "text-ink",
          )}
        >
          {category.name}
        </h3>
        {category.description ? (
          <p
            className={cn(
              "mt-2 line-clamp-2 text-xs leading-relaxed",
              category.imageUrl ? "text-cream/75" : "text-muted",
            )}
          >
            {category.description}
          </p>
        ) : null}
        <p
          className={cn(
            "mt-4 text-[0.6rem] font-semibold uppercase tracking-[0.18em]",
            category.imageUrl ? "text-cream/60" : "text-muted/55",
          )}
        >
          {typeof productCount === "number"
            ? `${productCount} ${productCount === 1 ? "produto" : "produtos"}`
            : "Ver categoria"}
        </p>
      </div>
    </Link>
  );
}
