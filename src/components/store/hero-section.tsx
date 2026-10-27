import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { HeroIllustration } from "@/components/brand/illustrations";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { buttonClasses } from "@/components/ui/button";
import { buildSimpleWhatsAppUrl, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { StoreSettings } from "@/types/store";

function SplitHeroTitle({ title }: { title: string }) {
  const words = title.trim().split(/\s+/);
  if (words.length <= 3) {
    return <em className="not-italic text-brand">{title}</em>;
  }
  const tailCount = words.length > 6 ? 3 : 2;
  const head = words.slice(0, -tailCount).join(" ");
  const tail = words.slice(-tailCount).join(" ");
  return (
    <>
      {head}{" "}
      <span className="relative inline-block font-display italic text-brand">
        {tail}
        <svg
          viewBox="0 0 220 12"
          className="absolute -bottom-2 left-0 h-2 w-full text-blush"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M2 8c40-5 82-6 122-4 32 1 62 4 94 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </>
  );
}

export function HeroSection({ settings }: { settings: StoreSettings }) {
  const whatsappUrl =
    buildSimpleWhatsAppUrl(settings.whatsappNumber, settings.brandName) ??
    buildWhatsAppUrl(
      settings.whatsappNumber,
      `Olá, ${settings.brandName}! Gostaria de conversar sobre as lembrancinhas personalizadas.`,
    );
  const secondaryLabel = whatsappUrl
    ? settings.heroSecondaryCta
    : "Ver formas de contato";

  return (
    <section className="relative overflow-hidden paper-texture">
      <div
        className="pointer-events-none absolute -left-32 top-16 h-96 w-96 rounded-full bg-blush/35 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-sage/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative grid items-center gap-12 pb-16 pt-10 md:pt-14 lg:grid-cols-[1.02fr_.98fr] lg:gap-16 lg:pb-24 lg:pt-16">
        <div className="animate-fade-up">
          <p className="eyebrow">{settings.heroEyebrow}</p>
          <h1 className="display-title mt-5 max-w-[14ch] text-[2.7rem] text-ink sm:max-w-[15ch] sm:text-[3.6rem] lg:text-[4.3rem] xl:text-[4.7rem]">
            <SplitHeroTitle title={settings.heroTitle} />
          </h1>
          <p className="mt-7 max-w-lg text-[0.95rem] leading-relaxed text-muted sm:text-base">
            {settings.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/produtos"
              className={buttonClasses({
                variant: "primary",
                size: "lg",
                className: "group",
              })}
            >
              {settings.heroPrimaryCta}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({
                  variant: "outline",
                  size: "lg",
                  className: "group",
                })}
              >
                <WhatsAppIcon className="h-4 w-4 text-[#5c8a6a]" />
                {secondaryLabel}
              </a>
            ) : (
              <Link
                href="/contato"
                className={buttonClasses({
                  variant: "outline",
                  size: "lg",
                })}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {secondaryLabel}
              </Link>
            )}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[0.7rem] font-medium text-muted/85">
            <span className="inline-flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-brand/70" aria-hidden="true" />
              Feito à mão
            </span>
            <span className="hidden h-3 w-px bg-line sm:block" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5 text-sage" aria-hidden="true" />
              Personalização a combinar
            </span>
            <span className="hidden h-3 w-px bg-line sm:block" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              Atendimento direto
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[31rem] animate-fade-in lg:max-w-none">
          <div
            className="absolute -left-5 top-16 z-10 hidden -rotate-6 rounded-2xl border border-line/80 bg-ivory/95 px-4 py-3 shadow-[0_18px_40px_-26px_rgba(61,52,46,.35)] backdrop-blur sm:block"
            aria-hidden="true"
          >
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-muted/60">
              Feito sob encomenda
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-display text-lg text-ink">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              para a sua festa
            </p>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-3 rounded-[15rem_15rem_2rem_2rem] border border-brand/15"
              aria-hidden="true"
            />
            <div className="arch-frame relative aspect-[4/5] w-full overflow-hidden bg-[#f6e3dd] shadow-[0_30px_80px_-45px_rgba(61,52,46,.55)]">
              {settings.heroImageUrl ? (
                <Image
                  src={settings.heroImageUrl}
                  alt={settings.heroImageAlt || settings.brandName}
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-cover object-center"
                />
              ) : (
                <HeroIllustration />
              )}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#4b3a32]/20 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                <div className="rounded-2xl border border-white/30 bg-ivory/85 px-4 py-3 backdrop-blur-md">
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-muted/70">
                    Lembrancinhas
                  </p>
                  <p className="font-display text-lg leading-tight text-ink">
                    {settings.tagline}
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-ivory/80 text-brand backdrop-blur-md">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>

          <svg
            viewBox="0 0 120 120"
            className="absolute -bottom-7 -left-2 h-20 w-20 animate-float text-sage/60"
            aria-hidden="true"
          >
            <path
              d="M60 14c3 24 22 43 46 46-24 3-43 22-46 46-3-24-22-43-46-46 24-3 43-22 46-46Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle cx="60" cy="60" r="4" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="h-px w-full soft-line" />
    </section>
  );
}
