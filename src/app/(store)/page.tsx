import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getCategories, getHomepageSections, getProducts, getStoreSettings } from "@/lib/data/store";
import { getSiteUrl } from "@/lib/site";
import { HeroSection } from "@/components/store/hero-section";
import { TrustStrip } from "@/components/store/trust-strip";
import { CategoryCard } from "@/components/store/category-card";
import { ProductCard } from "@/components/store/product-card";
import { SectionHeading } from "@/components/store/section-heading";
import { EmptyCatalog } from "@/components/store/empty-catalog";
import { CustomizationSection } from "@/components/store/customization-section";
import { HowItWorksSection } from "@/components/store/how-it-works";
import { HomeCtaSection } from "@/components/store/home-cta";
import { buttonClasses } from "@/components/ui/button";
import { serializeJsonLd } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  return {
    title: `${settings.brandName} — Lembrancinhas personalizadas`,
    description: settings.heroSubtitle,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [settings, sections, categories, products] = await Promise.all([
    getStoreSettings(),
    getHomepageSections(),
    getCategories(),
    getProducts(),
  ]);

  const sectionByKey = new Map(sections.map((section) => [section.key, section]));
  const categoriesSection = sectionByKey.get("categories");
  const productsSection = sectionByKey.get("products");
  const customizationSection = sectionByKey.get("customization");
  const howItWorksSection = sectionByKey.get("how_it_works");
  const ctaSection = sectionByKey.get("cta");

  const defaultSections = {
    categories: "Escolha por categoria",
    products: "Lembrancinhas para o seu tema",
    customization: "Personalização feita a quatro mãos",
    how_it_works: "Como funciona o pedido",
    cta: "Sua festa merece um detalhe feito com carinho",
  };

  const featured = products.filter((product) => product.isFeatured);
  const showcase = (featured.length ? featured : products).slice(0, 4);
  const featuredCategories = categories.filter(
    (category) => category.isFeatured,
  );
  const categoryShowcase = (
    featuredCategories.length > 0 ? featuredCategories : categories
  ).slice(0, 4);
  const countByCategory = new Map<string, number>();
  for (const product of products) {
    if (!product.categoryId) continue;
    countByCategory.set(
      product.categoryId,
      (countByCategory.get(product.categoryId) ?? 0) + 1,
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.brandName,
    url: getSiteUrl(),
    description: settings.tagline,
    ...(settings.logoUrl ? { logo: settings.logoUrl } : {}),
    ...(settings.instagramUrl ? { sameAs: [settings.instagramUrl] } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <HeroSection settings={settings} />
      <TrustStrip />

      {categoriesSection?.isVisible && categories.length > 0 ? (
        <section className="container-page py-16 md:py-24">
          <SectionHeading
            eyebrow={categoriesSection.eyebrow}
            title={categoriesSection.title ?? defaultSections.categories}
            description={categoriesSection.body}
            action={
              <Link
                href="/categorias"
                className={buttonClasses({
                  variant: "ghost",
                  size: "md",
                  className: "border border-line",
                })}
              >
                Ver todas
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryShowcase.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                productCount={countByCategory.get(category.id) ?? 0}
              />
            ))}
          </div>
        </section>
      ) : null}

      {productsSection?.isVisible ? (
        <section className="border-y border-line/60 bg-ivory/50 py-16 md:py-24">
          <div className="container-page">
            <SectionHeading
              eyebrow={
                featured.length > 0
                  ? productsSection.eyebrow
                  : "Novidades do ateliê"
              }
              title={productsSection.title ?? defaultSections.products}
              description={productsSection.body}
              action={
                products.length > 0 ? (
                  <Link
                    href="/produtos"
                    className={buttonClasses({
                      variant: "outline",
                      size: "md",
                    })}
                  >
                    Ver catálogo completo
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : null
              }
            />
            <div className="mt-9">
              {products.length === 0 ? (
                <EmptyCatalog settings={settings} />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {showcase.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      settings={settings}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {customizationSection ? (
        <CustomizationSection
          settings={settings}
          section={customizationSection}
        />
      ) : null}

      {howItWorksSection ? (
        <HowItWorksSection
          section={howItWorksSection}
          whatsappConfigured={Boolean(settings.whatsappNumber)}
        />
      ) : null}

      {settings.institutionalText ? (
        <section className="container-page py-14">
          <div className="mx-auto max-w-3xl text-center">
            <Sparkles
              className="mx-auto h-5 w-5 text-gold"
              strokeWidth={1.3}
              aria-hidden="true"
            />
            <p className="mt-4 font-display text-xl leading-relaxed text-ink/80 italic sm:text-2xl">
              “{settings.institutionalText}”
            </p>
            <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted/55">
              Sobre o ateliê
            </p>
          </div>
        </section>
      ) : null}

      {ctaSection ? (
        <HomeCtaSection settings={settings} section={ctaSection} />
      ) : null}
    </>
  );
}
