import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
  Palette,
  Sparkles,
  UserRound,
} from "lucide-react";
import { CustomizationIllustration } from "@/components/brand/illustrations";
import { buttonClasses } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { HomepageSection, StoreSettings } from "@/types/store";

const details = [
  {
    icon: Sparkles,
    title: "Tema da festa",
    description: "Do universo favorito ao clima que você sonhou.",
  },
  {
    icon: UserRound,
    title: "Nome e idade",
    description: "Detalhes que tornam a lembrança única.",
  },
  {
    icon: Palette,
    title: "Cores e acabamentos",
    description: "Combinações alinhadas com a decoração.",
  },
  {
    icon: CalendarDays,
    title: "Quantidade e data",
    description: "Para planejar a produção com tranquilidade.",
  },
];

export function CustomizationSection({
  settings,
  section,
}: {
  settings: StoreSettings;
  section: HomepageSection;
}) {
  if (!section.isVisible) return null;
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber,
    `Olá, ${settings.brandName}! Gostaria de conversar sobre a personalização das lembrancinhas para uma festa.`,
  );

  return (
    <section className="container-page py-16 md:py-24">
      <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] border border-line/70 bg-ivory p-5 shadow-[0_30px_70px_-55px_rgba(61,52,46,.4)] md:p-8 lg:grid-cols-[.95fr_1.05fr] lg:gap-14 lg:p-10">
        <div className="order-2 lg:order-1">
          <CustomizationIllustration />
        </div>

        <div className="order-1 lg:order-2 lg:py-4">
          {section.eyebrow ? <p className="eyebrow">{section.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-3xl leading-[1.08] text-ink sm:text-4xl">
            {section.title}
          </h2>
          {section.body ? (
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {section.body}
            </p>
          ) : null}

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {details.map((detail) => {
              const Icon = detail.icon;
              return (
                <div
                  key={detail.title}
                  className="rounded-2xl border border-line/70 bg-cream/55 p-4"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ivory text-brand">
                    <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-xs font-semibold text-ink">
                    {detail.title}
                  </h3>
                  <p className="mt-1 text-[0.7rem] leading-relaxed text-muted">
                    {detail.description}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-5 rounded-xl border border-[#ddc39d]/50 bg-[#fbf5ea] px-4 py-3 text-[0.7rem] leading-relaxed text-[#7c653f]">
            Nem toda combinação está disponível para todos os produtos. A
            proprietária confirma as possibilidades, o prazo e o valor antes de
            fechar o pedido.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: "primary", size: "md" })}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Conversar sobre meu tema
              </a>
            ) : null}
            <Link
              href="/personalizacao"
              className={buttonClasses({ variant: "ghost", size: "md" })}
            >
              Entender a personalização
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
