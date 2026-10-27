import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { EmptyCatalogIllustration } from "@/components/brand/illustrations";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { buttonClasses } from "@/components/ui/button";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";
import type { StoreSettings } from "@/types/store";

export function EmptyCatalog({
  settings,
  compact = false,
}: {
  settings: StoreSettings;
  compact?: boolean;
}) {
  const whatsappUrl = buildSimpleWhatsAppUrl(
    settings.whatsappNumber,
    settings.brandName,
  );

  return (
    <div
      className={`relative flex flex-col items-center overflow-hidden rounded-[1.75rem] border border-dashed border-line bg-ivory/70 px-6 text-center ${
        compact ? "py-12" : "py-16 md:py-20"
      }`}
    >
      <div
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blush/20 to-transparent"
        aria-hidden="true"
      />
      <EmptyCatalogIllustration className="relative" />
      <p className="relative mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-brand">
        Em preparação
      </p>
      <h3 className="relative mt-2 font-display text-3xl text-ink">
        O catálogo está sendo preparado
      </h3>
      <p className="relative mt-3 max-w-md text-sm leading-relaxed text-muted">
        Estamos organizando as primeiras peças do ateliê. Enquanto isso, fale
        com a gente para conhecer as possibilidades de personalização.
      </p>
      <div className="relative mt-6 flex flex-col gap-2 sm:flex-row">
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: "primary", size: "md" })}
          >
            <WhatsAppIcon className="h-4 w-4" />
            Conversar no WhatsApp
          </a>
        ) : (
          <Link
            href="/contato"
            className={buttonClasses({ variant: "primary", size: "md" })}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Ver canais de contato
          </Link>
        )}
        <Link
          href="/personalizacao"
          className={buttonClasses({ variant: "outline", size: "md" })}
        >
          Sobre personalização
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
