import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { getStoreSettings } from "@/lib/data/store";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { InstagramIcon } from "@/components/brand/social-icons";
import { buttonClasses } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  buildSimpleWhatsAppUrl,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";
import { formatWhatsAppForDisplay } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com o ateliê para tirar dúvidas, consultar disponibilidade e solicitar um orçamento de lembrancinhas personalizadas.",
  alternates: { canonical: "/contato" },
};

export default async function ContactPage() {
  const settings = await getStoreSettings();
  const simpleWhatsApp = buildSimpleWhatsAppUrl(
    settings.whatsappNumber,
    settings.brandName,
  );
  const quoteWhatsApp = buildWhatsAppUrl(
    settings.whatsappNumber,
    `Olá, ${settings.brandName}! Gostaria de solicitar um orçamento para lembrancinhas personalizadas.`,
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
        <span className="text-ink">Contato</span>
      </nav>

      <div className="mt-7 max-w-2xl">
        <p className="eyebrow">Fale com o ateliê</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
          Vamos conversar sobre a sua festa
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
          Tire dúvidas, consulte disponibilidade e alinhe os detalhes da
          personalização. O atendimento é feito diretamente pela proprietária.
        </p>
      </div>

      <div className="mt-9 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
        <section className="rounded-[1.75rem] border border-line/80 bg-ivory p-6 md:p-8">
          <h2 className="font-display text-2xl text-ink">Canais de contato</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            O WhatsApp é o canal principal para orçamentos. Os demais canais
            podem ser usados para assuntos gerais.
          </p>

          <ul className="mt-6 space-y-3">
            {simpleWhatsApp ? (
              <li>
                <a
                  href={simpleWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-xl border border-line/80 bg-cream/50 p-4 transition hover:border-[#9fb09a]/60 hover:bg-[#f2f7ef]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7f0e3] text-[#5f7c63]">
                    <WhatsAppIcon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-ink">
                      WhatsApp
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">
                      {formatWhatsAppForDisplay(settings.whatsappNumber)}
                    </span>
                    <span className="mt-1 block text-[0.68rem] text-muted/70">
                      Toque para abrir a conversa
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-3 h-4 w-4 text-muted/50 transition group-hover:translate-x-0.5 group-hover:text-ink"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ) : null}

            {settings.instagramUrl ? (
              <li>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-xl border border-line/80 bg-cream/50 p-4 transition hover:border-brand/30 hover:bg-blush/20"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush/60 text-brand">
                    <InstagramIcon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-ink">
                      Instagram
                    </span>
                    <span className="mt-0.5 block break-all text-sm text-muted">
                      {settings.instagramUrl
                        .replace(/^https?:\/\/(www\.)?instagram\.com\//, "@")
                        .replace(/\/$/, "")}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-3 h-4 w-4 text-muted/50 transition group-hover:translate-x-0.5 group-hover:text-ink"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ) : null}

            {settings.email ? (
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="group flex items-start gap-3 rounded-xl border border-line/80 bg-cream/50 p-4 transition hover:border-brand/30 hover:bg-blush/20"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f8e9dc] text-[#9c7458]">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-ink">
                      E-mail
                    </span>
                    <span className="mt-0.5 block break-all text-sm text-muted">
                      {settings.email}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-3 h-4 w-4 text-muted/50 transition group-hover:translate-x-0.5 group-hover:text-ink"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ) : null}

            {settings.phone ? (
              <li className="flex items-start gap-3 rounded-xl border border-line/80 bg-cream/50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6eef1] text-[#627b84]">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-ink">
                    Telefone
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {settings.phone}
                  </span>
                </span>
              </li>
            ) : null}
          </ul>

          {!settings.whatsappNumber ? (
            <Alert tone="warning" className="mt-5">
              O número de WhatsApp da loja ainda não foi configurado. Se você é a
              proprietária, cadastre-o no painel administrativo em{" "}
              <Link
                href="/admin/configuracoes"
                className="font-semibold underline underline-offset-2"
              >
                Configurações
              </Link>
              .
            </Alert>
          ) : null}

          {simpleWhatsApp ? (
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <a
                href={quoteWhatsApp ?? simpleWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: "primary", size: "lg" })}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Solicitar orçamento
              </a>
              <Link
                href="/produtos"
                className={buttonClasses({ variant: "outline", size: "lg" })}
              >
                Ver produtos
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line/70 bg-blush/20 p-5">
            <p className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              Atendimento
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Respondemos pelo WhatsApp assim que possível. Para pedidos com data
              marcada, o ideal é conversar com antecedência para alinhar prazo de
              produção.
            </p>
          </div>

          <div className="rounded-2xl border border-line/70 bg-ivory p-5">
            <p className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted">
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Como pedir
            </p>
            <ol className="mt-3 space-y-2.5 text-xs leading-relaxed text-muted">
              <li className="flex gap-2">
                <span className="font-semibold text-brand">1.</span>
                Escolha as lembrancinhas no catálogo e adicione ao carrinho.
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-brand">2.</span>
                Informe tema, nome, idade, cores, quantidade e data.
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-brand">3.</span>
                Envie pelo WhatsApp e aguarde a confirmação da proprietária.
              </li>
            </ol>
            <Link
              href="/carrinho"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
            >
              Ir para o carrinho
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="rounded-2xl border border-line/70 bg-ivory p-5">
            <p className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#61775a]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Sem pagamento online
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Esta loja não processa pagamentos. Disponibilidade, frete, prazo e
              valor final são combinados diretamente com a proprietária.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
