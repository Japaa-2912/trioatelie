"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductPlaceholder } from "@/components/brand/illustrations";
import type { CategoryIcon, CategoryTone } from "@/types/store";
import { cn } from "@/lib/utils";

export type GalleryImage = {
  url: string;
  alt: string;
};

export function ProductGallery({
  images,
  name,
  icon = "gift",
  tone = "blush",
}: {
  images: GalleryImage[];
  name: string;
  icon?: CategoryIcon;
  tone?: CategoryTone;
}) {
  const uniqueImages = useMemo(() => {
    const seen = new Set<string>();
    return images.filter((image) => {
      if (!image.url || seen.has(image.url)) return false;
      seen.add(image.url);
      return true;
    });
  }, [images]);

  const [active, setActive] = useState(0);
  const current = uniqueImages[active];

  const go = (direction: number) => {
    setActive((value) =>
      uniqueImages.length === 0
        ? 0
        : (value + direction + uniqueImages.length) % uniqueImages.length,
    );
  };

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-line/70 bg-cream shadow-[0_24px_60px_-48px_rgba(61,52,46,.45)]">
        {current ? (
          <Image
            key={current.url}
            src={current.url}
            alt={current.alt || name}
            fill
            priority
            sizes="(max-width: 1024px) 92vw, 46vw"
            className="animate-fade-in object-cover"
          />
        ) : (
          <ProductPlaceholder
            icon={icon}
            tone={tone}
            label={`Ilustração de ${name}`}
          />
        )}

        {uniqueImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-ivory/80 text-ink backdrop-blur transition hover:bg-ivory"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima imagem"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-ivory/80 text-ink backdrop-blur transition hover:bg-ivory"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 text-[0.6rem] font-medium tracking-wide text-cream backdrop-blur">
              {active + 1} / {uniqueImages.length}
            </span>
          </>
        ) : null}
      </div>

      {uniqueImages.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {uniqueImages.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver imagem ${index + 1} de ${name}`}
              aria-current={index === active ? "true" : undefined}
              className={cn(
                "relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-cream transition",
                index === active
                  ? "border-brand"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
