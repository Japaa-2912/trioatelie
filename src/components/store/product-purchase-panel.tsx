"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Info,
  MessageCircle,
  ShoppingBag,
  Sparkles,
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
import type { Product, StoreSettings } from "@/types/store";

export function ProductPurchasePanel({
  product,
  settings,
}: {
  product: Product;
  settings: StoreSettings;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(Math.max(1, product.minQuantity));
  const [details, setDetails] = useState({
    theme: "",
    childName: "",
    childAge: "",
    colors: "",
    partyDate: "",
    notes: "",
  });

  const price = formatPrice(product.price);
  const whatsappUrl = useMemo(() => {
    const message = buildQuoteMessage({
      brandName: settings.brandName,
      items: [
        {
          name: product.name,
          quantity,
          unitPrice: product.price,
          priceOnRequest: product.priceOnRequest,
          url: absoluteUrl(`/produtos/${product.slug}`),
        },
      ],
      details,
      storeUrl: absoluteUrl("/"),
    });
    return buildWhatsAppUrl(settings.whatsappNumber, message);
  }, [details, product, quantity, settings.brandName, settings.whatsappNumber]);

  const updateDetail = (key: keyof typeof details, value: string) => {
    setDetails((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="mt-7 rounded-2xl border border-line/80 bg-ivory/80 p-4 md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted/60">
            {product.priceOnRequest || !price ? "Orçamento" : "Valor de referência"}
          </p>
          <p className="mt-1 font-display text-3xl text-ink">
            {product.priceOnRequest || !price ? "Sob consulta" : price}
          </p>
          <p className="mt-1 text-[0.68rem] text-muted">
            Valor e disponibilidade confirmados pela proprietária.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted/60">
            Quantidade
          </span>
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            min={Math.max(1, product.minQuantity)}
            label="Quantidade desejada"
          />
          {product.minQuantity > 1 ? (
            <span className="text-[0.62rem] text-muted">
              Mínimo de {product.minQuantity} unidades
            </span>
          ) : null}
        </div>
      </div>

      <div className="my-5 h-px bg-line/70" />

      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-ink">
            Detalhes para personalizar
          </h2>
        </div>
        <p className="mt-1 text-[0.7rem] leading-relaxed text-muted">
          Preencha o que já sabe. A proprietária confirma as possibilidades
          antes de fechar o pedido.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Tema da festa" htmlFor="tema" optional>
            <Input
              id="tema"
              value={details.theme}
              onChange={(event) => updateDetail("theme", event.target.value)}
              placeholder="Ex.: jardim encantado"
              maxLength={120}
            />
          </Field>
          <Field label="Nome da criança" htmlFor="nome-crianca" optional>
            <Input
              id="nome-crianca"
              value={details.childName}
              onChange={(event) => updateDetail("childName", event.target.value)}
              placeholder="Ex.: Alice"
              maxLength={80}
            />
          </Field>
          <Field label="Idade comemorada" htmlFor="idade" optional>
            <Input
              id="idade"
              value={details.childAge}
              onChange={(event) => updateDetail("childAge", event.target.value)}
              placeholder="Ex.: 4 anos"
              maxLength={30}
            />
          </Field>
          <Field label="Cores desejadas" htmlFor="cores" optional>
            <Input
              id="cores"
              value={details.colors}
              onChange={(event) => updateDetail("colors", event.target.value)}
              placeholder="Ex.: rosa, creme e dourado"
              maxLength={120}
            />
          </Field>
          <Field label="Data da festa" htmlFor="data-festa" optional>
            <div className="relative">
              <CalendarDays
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50"
                aria-hidden="true"
              />
              <Input
                id="data-festa"
                type="date"
                value={details.partyDate}
                onChange={(event) => updateDetail("partyDate", event.target.value)}
                className="pl-9"
              />
            </div>
          </Field>
          <Field label="Observações" htmlFor="observacoes" optional className="sm:col-span-2">
            <Textarea
              id="observacoes"
              value={details.notes}
              onChange={(event) => updateDetail("notes", event.target.value)}
              placeholder="Conte mais detalhes, como preferências, embalagem ou prazo."
              maxLength={800}
              className="min-h-20"
            />
          </Field>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#4f7d5d] px-6 text-sm font-semibold text-white transition hover:bg-[#426b4e]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Solicitar pelo WhatsApp
          </a>
        ) : (
          <Button variant="secondary" size="lg" disabled className="w-full">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp em configuração
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() =>
            addItem({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              imageUrl: product.mainImageUrl,
              unitPrice: product.price,
              priceOnRequest: product.priceOnRequest || product.price === null,
              minQuantity: product.minQuantity,
            }, quantity)
          }
          className="w-full"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Adicionar ao carrinho
        </Button>

        {!whatsappUrl ? (
          <Alert tone="warning" className="mt-1">
            O contato pelo WhatsApp ainda não foi configurado. Você pode
            <Link href="/contato" className="mx-1 font-semibold underline underline-offset-2">
              ver os canais disponíveis
            </Link>
            ou tentar novamente mais tarde.
          </Alert>
        ) : (
          <p className="mt-1 flex items-start gap-1.5 text-[0.65rem] leading-relaxed text-muted/80">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Abrir o WhatsApp inicia a conversa com o resumo deste produto. O
            pedido não é confirmado automaticamente.
          </p>
        )}

        <ButtonLink
          href="/carrinho"
          variant="ghost"
          size="sm"
          className="mt-1 w-full text-muted"
        >
          Revisar carrinho e outros itens
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </ButtonLink>
      </div>
    </div>
  );
}
