import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
  Package,
  Palette,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { getHomepageSections, getStoreSettings } from "@/lib/data/store";
import { CustomizationIllustration } from "@/components/brand/illustrations";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { buttonClasses } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Personalização",
  description:
    "Entenda como funciona a personalização das lembrancinhas: tema, nome, idade, cores, quantidade e data da festa.",
  alternates: { canonical: "/personalizacao" },
};

const steps = [
  {
    icon: Sparkles,
    title: "Escolha o tema",
    body: "Do jardim encantado ao fundo do mar, o tema guia cores, estampas e detalhes. Conte a referência que você já imaginou.",
  },
  {
    icon: UserRound,
    title: "Personalize o nome",
    body: "Nome da criança e idade comemorada podem aparecer em etiquetas, capas e cartões, conforme o produto.",
  },
  {
    icon: Palette,
    title: "Combine as cores",
    body: "Alinhamos a paleta com a decoração da festa. Tons pastéis, dourado e acabamentos delicados são os mais pedidos.",
  },
  {
    icon: Package,
    title: "Defina a quantidade",
    body: "Informe o número de convidados e a quantidade desejada. Alguns produtos têm quantidade mínima de encomenda.",
  },
  {
    icon: CalendarDays,
    title: "Informe a data",
    body: "A data da festa ajuda a organizar a produção. Prazos são sempre confirmados antes do fechamento do pedido.",
  },
  {
    icon: ShieldCheck,
    title: "Confirme os detalhes",
    body: "A proprietária valida as possibilidades, o prazo e o valor final. Nem toda combinação está disponível para todos os produtos.",
  },
];

export default async function CustomizationPage() {
  const [settings, sections] = await Promise.all([
    getStoreSettings(),
    getHomepageSections(),
  ]);
  const section = sections.find((item) => item.key === "customization");

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber,
    `Olá, ${settings.brandName}! Gostaria de conversar sobre a personalização das lembrancinhas para uma festa.`,
  );

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
        <span className="text-ink">Personalização</span>
      </nav>

      <section className="mt-7 grid items-center gap-10 overflow-hidden rounded-[2rem] border border-line/70 bg-ivory p-6 md:p-10 lg:grid-cols-[.95fr_1.05fr]">
        <div className="order-2 lg:order-1">
          <CustomizationIllustration />
        </div>
        <div className="order-1 lg:order-2">
          <p className="eyebrow">
            {section?.eyebrow ?? "Do seu jeitinho"}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.04] text-ink sm:text-5xl">
            {section?.title ?? "Personalização feita a quatro mãos"}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            {section?.body ??
              "Conte o tema da festa, o nome da criança e as cores que você ama. A disponibilidade de cada combinação é confirmada pela proprietária antes do fechamento do pedido."}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: "primary", size: "lg" })}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Conversar sobre meu tema
              </a>
            ) : (
              <Link
                href="/contato"
                className={buttonClasses({ variant: "primary", size: "lg" })}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Ver canais de contato
              </Link>
            )}
            <Link
              href="/produtos"
              className={buttonClasses({ variant: "outline", size: "lg" })}
            >
              Explorar produtos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="max-w-2xl">
          <p className="eyebrow">Informações que ajudam</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            O que podemos personalizar
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Cada produto tem suas possibilidades. Estes são os pontos que
            normalmente combinamos com você antes de iniciar a produção.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="rounded-2xl border border-line/80 bg-ivory/80 p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-cream text-brand">
                  <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-xl text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-[#ddc39d]/60 bg-[#fbf5ea] p-6 md:p-8">
        <div className="flex items-start gap-3">
          <ShieldCheck
            className="mt-0.5 h-5 w-5 shrink-0 text-[#8a6b3e]"
            aria-hidden="true"
          />
          <div>
            <h2 className="font-display text-2xl text-[#6f5836]">
              Sobre prazos e disponibilidade
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#7c653f]">
              Nem toda combinação de tema, cor e acabamento está disponível para
              todos os produtos. A proprietária confirma as possibilidades, o
              prazo de produção e o valor final diretamente pelo WhatsApp. O
              envio do pedido pelo site não representa confirmação automática.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line/70 pt-6">
        <p className="text-xs text-muted">
          Quer começar escolhendo as peças?
        </p>
        <Link
          href="/produtos"
          className={buttonClasses({ variant: "dark", size: "md" })}
        >
          Ver catálogo
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
