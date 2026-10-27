import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Clock,
  Layers,
  Package,
  Ruler,
  Sparkles,
} from "lucide-react";
import {
  getProductBySlug,
  getRelatedProducts,
  getStoreSettings,
} from "@/lib/data/store";
import { getSiteUrl } from "@/lib/site";
import { ProductGallery } from "@/components/store/product-gallery";
import { ProductPurchasePanel } from "@/components/store/product-purchase-panel";
import { ProductCard } from "@/components/store/product-card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { truncate, serializeJsonLd } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produto não encontrado" };
  const description = truncate(
    product.shortDescription ??
      product.description ??
      `Conheça ${product.name}, uma lembrancinha personalizada do ateliê.`,
    160,
  );
  return {
    title: product.name,
    description,
    alternates: { canonical: `/produtos/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: `/produtos/${product.slug}`,
      ...(product.mainImageUrl
        ? {
            images: [
              {
                url: product.mainImageUrl,
                alt: product.mainImageAlt || product.name,
              },
            ],
          }
        : {}),
    },
    robots: product.isActive ? undefined : { index: false, follow: false },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [settings, related] = await Promise.all([
    getStoreSettings(),
    getRelatedProducts(product, 3),
  ]);

  const galleryImages = [
    ...(product.mainImageUrl
      ? [
          {
            url: product.mainImageUrl,
            alt: product.mainImageAlt || product.name,
          },
        ]
      : []),
    ...product.images.map((image) => ({
      url: image.url,
      alt: image.altText || product.name,
    })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ??
      product.shortDescription ??
      `Lembrancinha personalizada ${product.name}.`,
    sku: product.id,
    ...(product.mainImageUrl ? { image: [product.mainImageUrl] } : {}),
    ...(product.category ? { category: product.category.name } : {}),
    brand: {
      "@type": "Brand",
      name: settings.brandName,
    },
    ...(product.price !== null && !product.priceOnRequest
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "BRL",
            price: product.price.toFixed(2),
            availability: "https://schema.org/InStock",
            url: `${getSiteUrl()}/produtos/${product.slug}`,
          },
        }
      : {}),
  };

  const specifications = [
    product.dimensions
      ? { icon: Ruler, label: "Dimensões", value: product.dimensions }
      : null,
    product.materials
      ? { icon: Layers, label: "Materiais", value: product.materials }
      : null,
    product.productionTime
      ? {
          icon: Clock,
          label: "Prazo estimado",
          value: product.productionTime,
        }
      : null,
    product.minQuantity > 1
      ? {
          icon: Package,
          label: "Quantidade mínima",
          value: `${product.minQuantity} unidades`,
        }
      : null,
  ].filter((item): item is { icon: typeof Ruler; label: string; value: string } =>
    Boolean(item),
  );

  return (
    <div className="container-page py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <nav aria-label="Você está aqui" className="flex flex-wrap items-center gap-2 text-[0.68rem] text-muted">
        <Link href="/" className="transition hover:text-brand">
          Início
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/produtos" className="transition hover:text-brand">
          Produtos
        </Link>
        {product.category ? (
          <>
            <span aria-hidden="true">/</span>
            <Link
              href={`/categorias/${product.category.slug}`}
              className="transition hover:text-brand"
            >
              {product.category.name}
            </Link>
          </>
        ) : null}
        <span aria-hidden="true">/</span>
        <span className="line-clamp-1 text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-12">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery
            images={galleryImages}
            name={product.name}
            icon={product.category?.icon ?? "gift"}
            tone={product.category?.tone ?? "blush"}
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.category ? (
              <Link
                href={`/categorias/${product.category.slug}`}
                className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand transition hover:underline"
              >
                {product.category.name}
              </Link>
            ) : null}
            {product.isFeatured ? (
              <Badge tone="brand">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Destaque
              </Badge>
            ) : null}
            {product.isCustomizable ? (
              <Badge tone="sage">Personalizável</Badge>
            ) : null}
          </div>

          <h1 className="mt-3 font-display text-4xl leading-[1.02] text-ink sm:text-5xl">
            {product.name}
          </h1>

          {product.shortDescription ? (
            <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
              {product.shortDescription}
            </p>
          ) : null}

          <ProductPurchasePanel product={product} settings={settings} />

          {product.description ? (
            <section className="mt-8">
              <h2 className="font-display text-2xl text-ink">
                Sobre esta lembrancinha
              </h2>
              <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
                {product.description}
              </div>
            </section>
          ) : null}

          {product.customizationNotes ? (
            <section className="mt-7 rounded-2xl border border-line/80 bg-[#fdf8f2] p-5">
              <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Possibilidades de personalização
              </h2>
              <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-muted">
                {product.customizationNotes}
              </p>
              <p className="mt-3 text-[0.65rem] leading-relaxed text-muted/70">
                As opções são confirmadas pela proprietária antes do fechamento
                do pedido.
              </p>
            </section>
          ) : null}

          {specifications.length > 0 ? (
            <section className="mt-7">
              <h2 className="font-display text-2xl text-ink">Detalhes</h2>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {specifications.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 rounded-xl border border-line/70 bg-ivory/70 p-3.5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-brand">
                        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <div>
                        <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted/60">
                          {item.label}
                        </dt>
                        <dd className="mt-0.5 text-xs leading-relaxed text-ink">
                          {item.value}
                        </dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </section>
          ) : null}

          <Alert tone="info" className="mt-6">
            Frete, disponibilidade, prazo e valor final não são calculados
            automaticamente. Tudo é confirmado diretamente com a proprietária
            pelo WhatsApp.
          </Alert>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-line/70 pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Continue escolhendo</p>
              <h2 className="mt-2 font-display text-3xl text-ink">
                Você também pode gostar
              </h2>
            </div>
            <Link
              href="/produtos"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline"
            >
              Ver catálogo
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} settings={settings} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
