import type { CSSProperties } from "react";
import { getStoreSettings } from "@/lib/data/store";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteHeader } from "@/components/store/site-header";
import { SiteFooter } from "@/components/store/site-footer";
import { hexColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings();
  const theme = {
    "--brand": hexColor(settings.brandColor, "#a9786c"),
    "--blush": hexColor(settings.blushColor, "#f2d9d4"),
    "--sage": hexColor(settings.sageColor, "#9fb09a"),
  } as CSSProperties;

  return (
    <div style={theme} className="flex min-h-dvh flex-col bg-cream">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-cream"
      >
        Ir para o conteúdo
      </a>
      <CartProvider>
        <SiteHeader settings={settings} />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <SiteFooter settings={settings} />
        <CartDrawer />
      </CartProvider>
    </div>
  );
}
