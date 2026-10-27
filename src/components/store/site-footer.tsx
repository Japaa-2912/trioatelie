import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { InstagramIcon } from "@/components/brand/social-icons";
import {
  buildSimpleWhatsAppUrl,
} from "@/lib/whatsapp";
import { formatWhatsAppForDisplay } from "@/lib/utils";
import type { StoreSettings } from "@/types/store";

const navLinks = [
  { href: "/produtos", label: "Produtos" },
  { href: "/categorias", label: "Categorias" },
  { href: "/personalizacao", label: "Personalização" },
  { href: "/contato", label: "Contato" },
  { href: "/carrinho", label: "Meu carrinho" },
];

export function SiteFooter({ settings }: { settings: StoreSettings }) {
  const whatsappUrl = buildSimpleWhatsAppUrl(
    settings.whatsappNumber,
    settings.brandName,
  );
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden bg-ink text-cream/80">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-cream/5"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full border border-cream/[0.04]"
        aria-hidden="true"
      />

      <div className="container-page relative py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_.7fr_.9fr]">
          <div>
            <BrandLogo
              brandName={settings.brandName}
              tagline={settings.tagline}
              logoUrl={settings.logoUrl}
              tone="inverse"
              size="lg"
              href="/"
            />
            {settings.footerText ? (
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/60">
                {settings.footerText}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-cream/15 px-3.5 py-2 text-xs font-medium text-cream/85 transition hover:border-cream/35 hover:text-cream"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#a9c6a5]" />
                  WhatsApp
                </a>
              ) : null}
              {settings.instagramUrl ? (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-cream/15 px-3.5 py-2 text-xs font-medium text-cream/85 transition hover:border-cream/35 hover:text-cream"
                >
                  <InstagramIcon className="h-4 w-4 text-blush" />
                  Instagram
                </a>
              ) : null}
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-cream/15 px-3.5 py-2 text-xs font-medium text-cream/85 transition hover:border-cream/35 hover:text-cream"
                >
                  <Mail className="h-4 w-4 text-peach" />
                  E-mail
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-cream/45">
              Navegue
            </h2>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-sm text-cream/65 transition hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-cream/45">
              Contato
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-cream/65">
              {settings.whatsappNumber ? (
                <li className="flex items-start gap-2">
                  <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#a9c6a5]" />
                  <span>{formatWhatsAppForDisplay(settings.whatsappNumber)}</span>
                </li>
              ) : null}
              {settings.phone ? (
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blush" />
                  <span>{settings.phone}</span>
                </li>
              ) : null}
              {settings.email ? (
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-peach" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="break-all transition hover:text-cream"
                  >
                    {settings.email}
                  </a>
                </li>
              ) : null}
              {!settings.whatsappNumber &&
              !settings.phone &&
              !settings.email ? (
                <li className="text-cream/45">
                  Os canais de contato estão sendo configurados.
                </li>
              ) : null}
            </ul>

            <div className="mt-6 rounded-xl border border-cream/10 bg-cream/[0.04] p-4">
              <p className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-cream/55">
                <ShieldCheck className="h-3.5 w-3.5 text-sage" aria-hidden="true" />
                Pedido com carinho
              </p>
              <p className="mt-2 text-[0.7rem] leading-relaxed text-cream/50">
                O envio pelo WhatsApp abre uma conversa. Disponibilidade, prazo,
                frete e valor final são confirmados pela proprietária.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 h-px bg-cream/10" />

        <div className="mt-6 flex flex-col gap-4 text-[0.68rem] text-cream/45 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-blush/70" aria-hidden="true" />
            © {year} {settings.brandName}. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacidade"
              className="transition hover:text-cream"
            >
              Política de privacidade
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 transition hover:text-cream"
            >
              Área da proprietária
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
