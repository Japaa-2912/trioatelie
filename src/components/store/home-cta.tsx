import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { buttonClasses } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { HomepageSection, StoreSettings } from "@/types/store";

export function HomeCtaSection({
  settings,
  section,
}: {
  settings: StoreSettings;
  section: HomepageSection;
}) {
  if (!section.isVisible) return null;
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber,
    `Olá, ${settings.brandName}! Gostaria de solicitar um orçamento para lembrancinhas personalizadas.`,
  );

  return (
    <section className="container-page py-16 md:py-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-center text-cream md:px-12 md:py-16">
        <div
          className="pointer-events-none absolute -left-20 -top-32 h-80 w-80 rounded-full bg-brand/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-40 -right-16 h-96 w-96 rounded-full bg-sage/15 blur-3xl"
          aria-hidden="true"
        />
        <svg
          viewBox="0 0 120 120"
          className="pointer-events-none absolute -right-4 top-6 h-28 w-28 text-cream/[0.07]"
          aria-hidden="true"
        >
          <path
            d="M60 14c3 24 22 43 46 46-24 3-43 22-46 46-3-24-22-43-46-46 24-3 43-22 46-46Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>

        <div className="relative mx-auto max-w-2xl">
          {section.eyebrow ? (
            <p className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-blush">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {section.eyebrow}
            </p>
          ) : null}
          <h2 className="mt-4 font-display text-3xl leading-[1.08] text-cream sm:text-4xl md:text-[2.9rem]">
            {section.title}
          </h2>
          {section.body ? (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/60">
              {section.body}
            </p>
          ) : null}
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({
                  variant: "secondary",
                  size: "lg",
                  className: "w-full sm:w-auto",
                })}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Solicitar orçamento
              </a>
            ) : (
              <Link
                href="/contato"
                className={buttonClasses({
                  variant: "secondary",
                  size: "lg",
                  className: "w-full sm:w-auto",
                })}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Ver canais de contato
              </Link>
            )}
            <Link
              href="/produtos"
              className={buttonClasses({
                variant: "ghost",
                size: "lg",
                className:
                  "w-full border border-cream/15 text-cream hover:bg-cream/10 sm:w-auto",
              })}
            >
              Explorar o catálogo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-4 text-[0.65rem] text-cream/35">
            Sem pagamento online. O pedido é combinado diretamente com a
            proprietária.
          </p>
        </div>
      </div>
    </section>
  );
}
