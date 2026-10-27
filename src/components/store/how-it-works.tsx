import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import type { HomepageSection } from "@/types/store";

const steps = [
  {
    number: "01",
    icon: ShoppingBag,
    title: "Escolha suas lembrancinhas",
    description:
      "Navegue pelo catálogo e adicione ao carrinho as peças que combinam com a sua festa.",
  },
  {
    number: "02",
    icon: WandSparkles,
    title: "Conte os detalhes",
    description:
      "Informe quantidade, tema, nome da criança, idade, cores e a data prevista da celebração.",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Envie pelo WhatsApp",
    description:
      "A conversa abre com o resumo do pedido. A proprietária confirma disponibilidade, prazo e valor final.",
  },
];

export function HowItWorksSection({
  section,
  whatsappConfigured,
}: {
  section: HomepageSection;
  whatsappConfigured: boolean;
}) {
  if (!section.isVisible) return null;
  return (
    <section
      id="como-funciona"
      className="scroll-mt-24 border-y border-line/70 bg-blush/15 py-16 md:py-24"
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          {section.eyebrow ? <p className="eyebrow justify-center">{section.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-3xl leading-[1.08] text-ink sm:text-4xl">
            {section.title}
          </h2>
          {section.body ? (
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {section.body}
            </p>
          ) : null}
        </div>

        <ol className="relative mt-12 grid gap-4 md:grid-cols-3">
          <div
            className="absolute left-[16%] right-[16%] top-12 hidden border-t border-dashed border-brand/25 md:block"
            aria-hidden="true"
          />
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <li
                key={step.number}
                className="relative rounded-2xl border border-line/70 bg-ivory/90 p-6 shadow-[0_18px_38px_-36px_rgba(61,52,46,.35)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-cream text-brand">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="font-display text-2xl text-brand/25">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/carrinho"
            className={buttonClasses({ variant: "dark", size: "md" })}
          >
            Montar meu pedido
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <p className="flex max-w-sm items-center gap-2 text-center text-[0.68rem] leading-relaxed text-muted sm:text-left">
            <Sparkles className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
            {whatsappConfigured
              ? "O WhatsApp apenas inicia a conversa. O pedido é confirmado diretamente com a proprietária."
              : "O contato pelo WhatsApp está em configuração. Enquanto isso, use a página de contato."}
          </p>
        </div>
      </div>
    </section>
  );
}
