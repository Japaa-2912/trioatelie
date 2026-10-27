import type { Metadata } from "next";
import Link from "next/link";
import { getProducts, getStoreSettings } from "@/lib/data/store";
import { CartPageContent, type CartCatalogItem } from "@/components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "Carrinho e orçamento",
  description:
    "Revise as lembrancinhas escolhidas, informe os detalhes da personalização e envie seu pedido pelo WhatsApp.",
  alternates: { canonical: "/carrinho" },
  robots: { index: false, follow: true },
};

export default async function CartPage() {
  const [settings, products] = await Promise.all([
    getStoreSettings(),
    getProducts(),
  ]);

  const catalog: CartCatalogItem[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    imageUrl: product.mainImageUrl,
    price: product.price,
    priceOnRequest: product.priceOnRequest,
    minQuantity: product.minQuantity,
  }));

  return (
    <div className="container-page py-10 md:py-14">
      <nav
        aria-label="Você está aqui"
        className="flex items-center gap-2 text-[0.68rem] text-muted"
      >
        <Link href="/" className="transition hover:text-brand">
          Início
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">Carrinho</span>
      </nav>

      <div className="mt-7 max-w-2xl">
        <p className="eyebrow">Seu pedido</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
          Revise e envie pelo WhatsApp
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
          Confira as peças escolhidas, ajuste as quantidades e conte os detalhes
          da festa. O pedido só é confirmado após a conversa com a proprietária.
        </p>
      </div>

      <div className="mt-9">
        <CartPageContent settings={settings} catalog={catalog} />
      </div>
    </div>
  );
}
