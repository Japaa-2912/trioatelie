"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, Sparkles } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { ProductPlaceholder } from "@/components/brand/illustrations";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/site";
import { formatPrice } from "@/lib/utils";
import { buildQuoteMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Product, StoreSettings } from "@/types/store";

export function ProductCard({
  product,
  settings,
}: {
  product: Product;
  settings: StoreSettings;
}) {
  const { addItem } = useCart();
  const price = formatPrice(product.price);
  const whatsappMessage = buildQuoteMessage({
    brandName: settings.brandName,
    items: [
      {
        name: product.name,
        quantity: Math.max(1, product.minQuantity),
        unitPrice: product.price,
        priceOnRequest: product.priceOnRequest,
        url: absoluteUrl(`/produtos/${product.slug}`),
      },
    ],
    storeUrl: absoluteUrl("/"),
  });
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber,
    whatsappMessage,
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-line/80 bg-ivory shadow-[0_18px_40px_-36px_rgba(61,52,46,.35)] transition-all duration-500 hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_28px_50px_-32px_rgba(61,52,46,.28)]">
      <Link
        href={`/produtos/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-cream"
        aria-label={`Ver detalhes de ${product.name}`}
      >
        {product.mainImageUrl ? (
          <Image
            src={product.mainImageUrl}
            alt={product.mainImageAlt || product.name}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
          />
        ) : (
          <ProductPlaceholder
            icon={product.category?.icon ?? "gift"}
            tone={product.category?.tone ?? "blush"}
            label={`Ilustração de ${product.name}`}
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.isFeatured ? (
            <Badge tone="dark" className="shadow-sm">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Destaque
            </Badge>
          ) : null}
          {product.isCustomizable ? (
            <Badge className="bg-ivory/90 shadow-sm backdrop-blur-sm">
              Personalizável
            </Badge>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/produtos/${product.slug}`}
              className="font-display text-xl leading-tight text-ink transition hover:text-brand"
            >
              {product.name}
            </Link>
            {product.category ? (
              <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted/65">
                {product.category.name}
              </p>
            ) : null}
          </div>
          <p className="shrink-0 text-right">
            <span className="block text-[0.58rem] font-medium uppercase tracking-[0.12em] text-muted/60">
              {product.priceOnRequest ? "Orçamento" : "Valor"}
            </span>
            <span className="mt-0.5 block text-sm font-bold text-brand">
              {product.priceOnRequest || !price ? "Sob consulta" : price}
            </span>
          </p>
        </div>

        {product.shortDescription ? (
          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted">
            {product.shortDescription}
          </p>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-4">
          <Link
            href={`/produtos/${product.slug}`}
            className={buttonClasses({
              variant: "outline",
              size: "sm",
              className: "flex-1",
            })}
          >
            Ver detalhes
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Solicitar ${product.name} pelo WhatsApp`}
              title="Solicitar pelo WhatsApp"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#9fb09a]/40 bg-[#f2f7ef] text-[#5f7c63] transition hover:bg-[#e7f0e3]"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          ) : null}

          <button
            type="button"
            onClick={() => {
              addItem({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                imageUrl: product.mainImageUrl,
                unitPrice: product.price,
                priceOnRequest: product.priceOnRequest || product.price === null,
                minQuantity: product.minQuantity,
              });
            }}
            aria-label={`Adicionar ${product.name} ao carrinho`}
            title="Adicionar ao carrinho"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-ivory transition hover:bg-[#96665a]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
