"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "./cart-provider";
import { QuantityStepper } from "@/components/store/quantity-stepper";
import { Button, ButtonLink } from "@/components/ui/button";
import { calculateCartSubtotal } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    hydrated,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => closeCart();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [closeCart]);

  const subtotal = calculateCartSubtotal(items);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cart-drawer-title"
      onCancel={(event) => {
        event.preventDefault();
        closeCart();
      }}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-[30rem] border-0 border-l border-line bg-ivory p-0 shadow-2xl"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-brand">
              Sua seleção
            </p>
            <h2
              id="cart-drawer-title"
              className="font-display text-2xl text-ink"
            >
              Carrinho
              {items.length > 0 ? (
                <span className="ml-2 text-sm font-sans font-medium text-muted">
                  {items.length} {items.length === 1 ? "item" : "itens"}
                </span>
              ) : null}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Fechar carrinho"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-cream text-muted transition hover:text-ink"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {!hydrated ? (
            <div className="space-y-3" aria-hidden="true">
              {[0, 1].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-2xl bg-cream"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blush/50 text-brand">
                <ShoppingBag className="h-8 w-8" strokeWidth={1.4} aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-2xl text-ink">
                Seu carrinho está vazio
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                Explore as lembrancinhas e adicione suas favoritas para montar o
                pedido.
              </p>
              <ButtonLink
                href="/produtos"
                className="mt-6"
                onClick={() => closeCart()}
              >
                Ver lembrancinhas
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-3 rounded-2xl border border-line/80 bg-white/60 p-3"
                >
                  <Link
                    href={`/produtos/${item.slug}`}
                    onClick={closeCart}
                    className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-cream"
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-brand/50">
                        <Gift className="h-6 w-6" strokeWidth={1.4} aria-hidden="true" />
                      </span>
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/produtos/${item.slug}`}
                        onClick={closeCart}
                        className="line-clamp-2 text-sm font-semibold leading-snug text-ink hover:text-brand"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remover ${item.name}`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted/70 transition hover:bg-[#fbeeeb] hover:text-[#a34f47]"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {item.priceOnRequest || item.unitPrice === null
                        ? "Valor sob consulta"
                        : `${formatPrice(item.unitPrice)} / un.`}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QuantityStepper
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.productId, value)}
                        min={item.minQuantity}
                        size="sm"
                        label={`Quantidade de ${item.name}`}
                      />
                      <span className="text-sm font-semibold tabular-nums text-ink">
                        {item.priceOnRequest || item.unitPrice === null
                          ? "—"
                          : formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 ? (
            <button
              type="button"
              onClick={clearCart}
              className="mt-4 text-xs font-medium text-muted underline decoration-line underline-offset-4 transition hover:text-[#a34f47]"
            >
              Esvaziar carrinho
            </button>
          ) : null}
        </div>

        {items.length > 0 ? (
          <footer className="border-t border-line bg-cream/70 px-5 py-5">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                {subtotal.hasOnRequestItems ? "Subtotal parcial" : "Subtotal estimado"}
              </span>
              <span className="font-display text-2xl text-ink">
                {formatPrice(subtotal.total)}
              </span>
            </div>
            <p className="mt-2 text-[0.68rem] leading-relaxed text-muted">
              Valores estimativos. Disponibilidade, frete, prazo e valor final
              serão confirmados pela proprietária pelo WhatsApp.
            </p>
            <ButtonLink
              href="/carrinho"
              onClick={closeCart}
              size="lg"
              className="mt-4 w-full"
            >
              Revisar pedido
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={closeCart}
              className="mt-1 w-full"
            >
              Continuar escolhendo
            </Button>
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}
