"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Gift,
  Info,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { QuantityStepper } from "@/components/store/quantity-stepper";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { Button, ButtonLink } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, Input, Textarea } from "@/components/ui/form";
import { absoluteUrl } from "@/lib/site";
import { formatPrice } from "@/lib/utils";
import { buildQuoteMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { StoreSettings } from "@/types/store";

export type CartCatalogItem = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number | null;
  priceOnRequest: boolean;
  minQuantity: number;
};

type Details = {
  theme: string;
  childName: string;
  childAge: string;
  colors: string;
  partyDate: string;
  notes: string;
};

const emptyDetails: Details = {
  theme: "",
  childName: "",
  childAge: "",
  colors: "",
  partyDate: "",
  notes: "",
};

export function CartPageContent({
  settings,
  catalog,
}: {
  settings: StoreSettings;
  catalog: CartCatalogItem[];
}) {
  const {
    items,
    hydrated,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const [details, setDetails] = useState<Details>(emptyDetails);

  const catalogById = new Map(
    catalog.map((product) => [product.id, product]),
  );

  const enriched = items.map((item) => {
    const current = catalogById.get(item.productId) ?? null;
    return {
      item,
      current,
      available: Boolean(current),
      quantity: current
        ? Math.max(item.quantity, current.minQuantity)
        : item.quantity,
      unitPrice: current ? current.price : item.unitPrice,
      priceOnRequest: current
        ? current.priceOnRequest || current.price === null
        : item.priceOnRequest || item.unitPrice === null,
      name: current?.name ?? item.name,
      slug: current?.slug ?? item.slug,
      imageUrl: current?.imageUrl ?? item.imageUrl,
      minQuantity: current?.minQuantity ?? item.minQuantity,
    };
  });

  const available = enriched.filter((entry) => entry.available);
  const unavailable = enriched.filter((entry) => !entry.available);
  const priced = available.filter(
    (entry) => !entry.priceOnRequest && entry.unitPrice !== null,
  );
  const subtotal = priced.reduce(
    (sum, entry) => sum + (entry.unitPrice ?? 0) * entry.quantity,
    0,
  );
  const hasOnRequest = priced.length !== available.length;
  const availableUnits = available.reduce(
    (sum, entry) => sum + entry.quantity,
    0,
  );

  const whatsappUrl =
    available.length === 0
      ? null
      : buildWhatsAppUrl(
          settings.whatsappNumber,
          buildQuoteMessage({
            brandName: settings.brandName,
            items: available.map((entry) => ({
              name: entry.name,
              quantity: entry.quantity,
              unitPrice: entry.unitPrice,
              priceOnRequest: entry.priceOnRequest,
              url: absoluteUrl(`/produtos/${entry.slug}`),
            })),
            details,
            storeUrl: absoluteUrl("/"),
          }),
        );

  const updateDetail = (key: keyof Details, value: string) => {
    setDetails((current) => ({ ...current, [key]: value }));
  };

  if (!hydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="space-y-3">
          {[0, 1].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-2xl bg-ivory" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-2xl bg-ivory" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[2rem] border border-dashed border-line bg-ivory/60 px-6 py-16 text-center md:py-20">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blush/50 text-brand">
          <ShoppingBag className="h-8 w-8" strokeWidth={1.4} aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-display text-3xl text-ink">
          Seu carrinho está vazio
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          Explore o catálogo e adicione as lembrancinhas que combinam com a sua
          festa. Depois, é só preencher os detalhes e enviar pelo WhatsApp.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/produtos" size="lg">
            Explorar lembrancinhas
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/categorias" variant="outline" size="lg">
            Ver categorias
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.12fr_.88fr] lg:items-start">
      <div className="space-y-6">
        <section aria-labelledby="itens-title">
          <div className="flex items-center justify-between gap-4">
            <h2 id="itens-title" className="font-display text-2xl text-ink">
              Itens escolhidos
            </h2>
            <button
              type="button"
              onClick={clearCart}
              className="text-[0.68rem] font-medium text-muted underline decoration-line underline-offset-4 transition hover:text-[#a34f47]"
            >
              Esvaziar carrinho
            </button>
          </div>

          {unavailable.length > 0 ? (
            <Alert tone="warning" className="mt-3" title="Alguns itens precisam de atenção">
              Produtos removidos do catálogo ou desativados não entram no
              orçamento. Remova-os do carrinho para manter o resumo organizado.
            </Alert>
          ) : null}

          <ul className="mt-3 space-y-3">
            {enriched.map((entry) => (
              <li
                key={entry.item.productId}
                className={`rounded-2xl border bg-ivory p-3.5 md:p-4 ${
                  entry.available ? "border-line/80" : "border-[#ddc39d]/70"
                }`}
              >
                <div className="flex gap-3.5">
                  <Link
                    href={entry.available ? `/produtos/${entry.slug}` : "/produtos"}
                    className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream"
                  >
                    {entry.imageUrl ? (
                      <Image
                        src={entry.imageUrl}
                        alt={entry.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-brand/45">
                        <Gift className="h-7 w-7" strokeWidth={1.3} aria-hidden="true" />
                      </span>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {entry.available ? (
                          <Link
                            href={`/produtos/${entry.slug}`}
                            className="font-display text-lg leading-tight text-ink transition hover:text-brand"
                          >
                            {entry.name}
                          </Link>
                        ) : (
                          <p className="font-display text-lg leading-tight text-muted">
                            {entry.name}
                          </p>
                        )}
                        <p className="mt-1 text-[0.65rem] uppercase tracking-[0.12em] text-muted/55">
                          {entry.available
                            ? entry.priceOnRequest || entry.unitPrice === null
                              ? "Valor sob consulta"
                              : `${formatPrice(entry.unitPrice)} por unidade`
                            : "Indisponível no catálogo"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(entry.item.productId)}
                        aria-label={`Remover ${entry.name} do carrinho`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted/70 transition hover:bg-[#fbeeeb] hover:text-[#a34f47]"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    {entry.available ? (
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <QuantityStepper
                          value={entry.quantity}
                          onChange={(value) =>
                            updateQuantity(
                              entry.item.productId,
                              value,
                              entry.minQuantity,
                            )
                          }
                          min={entry.minQuantity}
                          size="sm"
                          label={`Quantidade de ${entry.name}`}
                        />
                        <span className="text-sm font-semibold tabular-nums text-ink">
                          {entry.priceOnRequest || entry.unitPrice === null
                            ? "Sob consulta"
                            : formatPrice(entry.unitPrice * entry.quantity)}
                        </span>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeItem(entry.item.productId)}
                        className="mt-3"
                      >
                        Remover item
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {available.length > 0 ? (
          <section
            aria-labelledby="detalhes-title"
            className="rounded-2xl border border-line/80 bg-ivory/80 p-5"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
              <h2 id="detalhes-title" className="text-sm font-semibold text-ink">
                Detalhes da personalização
              </h2>
            </div>
            <p className="mt-1 text-[0.7rem] leading-relaxed text-muted">
              Esses dados acompanham a mensagem enviada ao WhatsApp. Preencha o
              que já sabe.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Tema da festa" htmlFor="cart-tema" optional>
                <Input
                  id="cart-tema"
                  value={details.theme}
                  onChange={(event) => updateDetail("theme", event.target.value)}
                  placeholder="Ex.: fundo do mar"
                  maxLength={120}
                />
              </Field>
              <Field label="Nome da criança" htmlFor="cart-nome" optional>
                <Input
                  id="cart-nome"
                  value={details.childName}
                  onChange={(event) =>
                    updateDetail("childName", event.target.value)
                  }
                  placeholder="Ex.: Theo"
                  maxLength={80}
                />
              </Field>
              <Field label="Idade comemorada" htmlFor="cart-idade" optional>
                <Input
                  id="cart-idade"
                  value={details.childAge}
                  onChange={(event) => updateDetail("childAge", event.target.value)}
                  placeholder="Ex.: 2 anos"
                  maxLength={30}
                />
              </Field>
              <Field label="Cores desejadas" htmlFor="cart-cores" optional>
                <Input
                  id="cart-cores"
                  value={details.colors}
                  onChange={(event) => updateDetail("colors", event.target.value)}
                  placeholder="Ex.: azul, branco e areia"
                  maxLength={120}
                />
              </Field>
              <Field label="Data da festa" htmlFor="cart-data" optional>
                <div className="relative">
                  <CalendarDays
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50"
                    aria-hidden="true"
                  />
                  <Input
                    id="cart-data"
                    type="date"
                    value={details.partyDate}
                    onChange={(event) =>
                      updateDetail("partyDate", event.target.value)
                    }
                    className="pl-9"
                  />
                </div>
              </Field>
              <Field
                label="Observações adicionais"
                htmlFor="cart-obs"
                optional
                className="sm:col-span-2"
              >
                <Textarea
                  id="cart-obs"
                  value={details.notes}
                  onChange={(event) => updateDetail("notes", event.target.value)}
                  placeholder="Quantidades por convidado, embalagem, prazo especial..."
                  maxLength={800}
                  className="min-h-24"
                />
              </Field>
            </div>
          </section>
        ) : null}
      </div>

      <aside className="lg:sticky lg:top-28">
        <div className="rounded-2xl border border-line/80 bg-ivory p-5 shadow-[0_20px_50px_-40px_rgba(61,52,46,.35)]">
          <h2 className="font-display text-2xl text-ink">Resumo do pedido</h2>

          <dl className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Itens disponíveis</dt>
              <dd className="font-medium text-ink">{available.length}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Unidades</dt>
              <dd className="font-medium text-ink">{availableUnits}</dd>
            </div>
            <div className="h-px bg-line/70" />
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
                {hasOnRequest ? "Subtotal parcial" : "Subtotal estimado"}
              </dt>
              <dd className="font-display text-2xl text-ink">
                {priced.length > 0 ? formatPrice(subtotal) : "Sob consulta"}
              </dd>
            </div>
          </dl>

          <p className="mt-2 text-[0.65rem] leading-relaxed text-muted/80">
            {hasOnRequest
              ? "Alguns itens têm valor sob consulta e não entram no subtotal."
              : "Os valores são estimativos e serão confirmados pela proprietária."}
          </p>

          <div className="mt-5 space-y-2">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // Nada é enviado automaticamente: apenas abrimos o WhatsApp.
                }}
                className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#4f7d5d] px-6 text-sm font-semibold text-white transition hover:bg-[#426b4e]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Enviar pedido pelo WhatsApp
              </a>
            ) : (
              <Button variant="secondary" size="lg" disabled className="w-full">
                WhatsApp em configuração
              </Button>
            )}

            <ButtonLink
              href="/produtos"
              variant="ghost"
              size="sm"
              className="w-full text-muted"
            >
              Continuar escolhendo
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </ButtonLink>
          </div>

          {!settings.whatsappNumber ? (
            <Alert tone="warning" className="mt-4">
              O WhatsApp da loja ainda não foi configurado. Se você é a
              responsável, acesse{" "}
              <Link
                href="/admin/configuracoes"
                className="font-semibold underline underline-offset-2"
              >
                Configurações
              </Link>{" "}
              no painel para cadastrar o número.
            </Alert>
          ) : (
            <div className="mt-4 space-y-2 rounded-xl border border-line/70 bg-cream/60 p-3.5 text-[0.65rem] leading-relaxed text-muted">
              <p className="flex items-start gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                O botão apenas abre o WhatsApp com o resumo. O pedido não é
                confirmado automaticamente.
              </p>
              <p className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" aria-hidden="true" />
                Disponibilidade, prazo, frete e valor final são combinados
                diretamente com a proprietária.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-line/70 bg-blush/20 p-4">
          <p className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Sem pagamento online
          </p>
          <p className="mt-2 text-[0.68rem] leading-relaxed text-muted">
            Esta loja não cobra nada pelo site. O combinado é feito diretamente
            com a proprietária, com toda a segurança de uma conversa.
          </p>
        </div>
      </aside>
    </div>
  );
}
