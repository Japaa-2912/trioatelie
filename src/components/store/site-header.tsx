"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Menu,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { useCart } from "@/components/cart/cart-provider";
import { buttonClasses } from "@/components/ui/button";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { StoreSettings } from "@/types/store";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/categorias", label: "Categorias" },
  { href: "/personalizacao", label: "Personalização" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader({ settings }: { settings: StoreSettings }) {
  const pathname = usePathname();
  const { totalItems, openCart, hydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const whatsappUrl = buildSimpleWhatsAppUrl(
    settings.whatsappNumber,
    settings.brandName,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const dialog = menuRef.current;
    if (!dialog) return;
    if (menuOpen && !dialog.open) dialog.showModal();
    if (!menuOpen && dialog.open) dialog.close();
  }, [menuOpen]);

  useEffect(() => {
    const dialog = menuRef.current;
    if (!dialog) return;
    const onClose = () => setMenuOpen(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {settings.announcementText ? (
        <div className="relative z-40 bg-ink px-4 py-2 text-center text-[0.62rem] font-medium uppercase tracking-[0.18em] text-cream/90">
          <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <Sparkles className="h-3 w-3 text-blush" aria-hidden="true" />
            <span>{settings.announcementText}</span>
            <Sparkles className="hidden h-3 w-3 text-blush sm:inline" aria-hidden="true" />
          </span>
        </div>
      ) : null}

      <header
        className={cn(
          "sticky top-0 z-30 border-b transition-all duration-300",
          scrolled
            ? "border-line/80 bg-cream/90 shadow-[0_10px_30px_-28px_rgba(61,52,46,.4)] backdrop-blur-xl"
            : "border-transparent bg-cream/70 backdrop-blur-md",
        )}
      >
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-4 md:h-20">
          <BrandLogo
            brandName={settings.brandName}
            tagline={settings.tagline}
            logoUrl={settings.logoUrl}
            size="md"
          />

          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-0.5 lg:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3 py-2 text-[0.78rem] font-medium transition-colors",
                  isActive(item.href)
                    ? "text-brand"
                    : "text-ink/75 hover:text-ink",
                )}
              >
                {item.label}
                {isActive(item.href) ? (
                  <span className="absolute inset-x-3 -bottom-0.5 h-px bg-brand/50" />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({
                  variant: "outline",
                  size: "sm",
                  className: "hidden xl:inline-flex",
                })}
              >
                <WhatsAppIcon className="h-4 w-4 text-[#5c8a6a]" />
                WhatsApp
              </a>
            ) : null}

            <button
              type="button"
              onClick={openCart}
              aria-label={
                hydrated && totalItems > 0
                  ? `Abrir carrinho com ${totalItems} ${totalItems === 1 ? "item" : "itens"}`
                  : "Abrir carrinho"
              }
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-ivory text-ink transition hover:border-brand/40 hover:text-brand"
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.6} aria-hidden="true" />
              {hydrated && totalItems > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[0.6rem] font-bold text-ivory">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-ivory text-ink transition hover:border-brand/40 hover:text-brand lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={menuRef}
        aria-labelledby="mobile-menu-title"
        onCancel={(event) => {
          event.preventDefault();
          setMenuOpen(false);
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none border-0 bg-cream p-0"
      >
        <div className="flex h-full flex-col paper-texture">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <span id="mobile-menu-title" className="sr-only">
              Menu de navegação
            </span>
            <BrandLogo
              brandName={settings.brandName}
              tagline={settings.tagline}
              logoUrl={settings.logoUrl}
              size="sm"
            />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-ivory text-ink"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Navegação mobile"
            className="flex-1 overflow-y-auto px-6 py-8"
          >
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-baseline justify-between border-b border-line/70 py-4 font-display text-3xl transition",
                      isActive(item.href) ? "text-brand" : "text-ink",
                    )}
                  >
                    <span>{item.label}</span>
                    <span className="font-sans text-[0.6rem] tracking-[0.2em] text-muted/40">
                      0{index + 1}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-line bg-ivory/80 p-5">
              <p className="eyebrow">Fale com o ateliê</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Tire dúvidas, consulte disponibilidade e monte sua lembrancinha
                personalizada.
              </p>
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses({
                    variant: "primary",
                    size: "md",
                    className: "mt-4 w-full",
                  })}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Conversar no WhatsApp
                </a>
              ) : (
                <Link
                  href="/contato"
                  onClick={() => setMenuOpen(false)}
                  className={buttonClasses({
                    variant: "outline",
                    size: "md",
                    className: "mt-4 w-full",
                  })}
                >
                  Ver canais de contato
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          </nav>

          <div className="border-t border-line px-6 py-5 text-[0.65rem] uppercase tracking-[0.18em] text-muted/70">
            {settings.tagline}
          </div>
        </div>
      </dialog>
    </>
  );
}
