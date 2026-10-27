"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ExternalLink,
  ImagePlus,
  LayoutTemplate,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AdminSection } from "@/components/admin/admin-page-header";
import { ImageField } from "@/components/admin/image-field";
import { HeroIllustration } from "@/components/brand/illustrations";
import { Alert } from "@/components/ui/alert";
import { Button, buttonClasses } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { saveHomepageAction } from "@/lib/actions/homepage";
import type { HomepageSection, StoreSettings } from "@/types/store";

export function HomepageEditor({
  settings,
  sections,
}: {
  settings: StoreSettings;
  sections: HomepageSection[];
}) {
  const router = useRouter();
  const [brandName, setBrandName] = useState(settings.brandName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [announcementText, setAnnouncementText] = useState(
    settings.announcementText ?? "",
  );
  const [heroEyebrow, setHeroEyebrow] = useState(settings.heroEyebrow ?? "");
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle);
  const [heroPrimaryCta, setHeroPrimaryCta] = useState(settings.heroPrimaryCta);
  const [heroSecondaryCta, setHeroSecondaryCta] = useState(
    settings.heroSecondaryCta,
  );
  const [heroImageAlt, setHeroImageAlt] = useState(settings.heroImageAlt);
  const [logoPath, setLogoPath] = useState(settings.logoPath ?? "");
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [heroImagePath, setHeroImagePath] = useState(
    settings.heroImagePath ?? "",
  );
  const [heroImageUrl, setHeroImageUrl] = useState(settings.heroImageUrl);
  const [sectionValues, setSectionValues] = useState<HomepageSection[]>(
    sections.length > 0 ? sections : [],
  );
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const updateSection = (
    key: string,
    patch: Partial<Pick<HomepageSection, "eyebrow" | "title" | "body" | "isVisible">>,
  ) => {
    setSectionValues((current) =>
      current.map((section) =>
        section.key === key ? { ...section, ...patch } : section,
      ),
    );
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    setSavedMessage(null);
    setFieldErrors({});

    try {
      const formData = new FormData();
      formData.set("brandName", brandName);
      formData.set("tagline", tagline);
      formData.set("logoPath", logoPath);
      formData.set("logoUrl", logoUrl ?? "");
      formData.set("announcementText", announcementText);
      formData.set("heroEyebrow", heroEyebrow);
      formData.set("heroTitle", heroTitle);
      formData.set("heroSubtitle", heroSubtitle);
      formData.set("heroPrimaryCta", heroPrimaryCta);
      formData.set("heroSecondaryCta", heroSecondaryCta);
      formData.set("heroImagePath", heroImagePath);
      formData.set("heroImageUrl", heroImageUrl ?? "");
      formData.set("heroImageAlt", heroImageAlt);
      formData.set(
        "sectionsJson",
        JSON.stringify(
          sectionValues.map((section) => ({
            key: section.key,
            eyebrow: section.eyebrow ?? "",
            title: section.title ?? "",
            body: section.body ?? "",
            isVisible: section.isVisible,
          })),
        ),
      );

      const result = await saveHomepageAction(formData);
      if (!result.ok) {
        setFormError(result.message);
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      setSavedMessage(result.message ?? "Página inicial atualizada.");
      toast.success(result.message ?? "Página inicial atualizada.");
      router.refresh();
    } catch (error) {
      console.error(error);
      setFormError("Não foi possível salvar a página inicial. Tente novamente.");
      toast.error("Não foi possível salvar a página inicial.");
    } finally {
      setSaving(false);
    }
  };

  const errorFor = (key: string) => fieldErrors[key];

  return (
    <form
      onSubmit={submit}
      className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]"
    >
      <div className="space-y-5">
        {formError ? (
          <Alert tone="error" title="Revise antes de salvar">
            {formError}
          </Alert>
        ) : null}
        {savedMessage ? (
          <Alert tone="success" title="Página inicial atualizada">
            {savedMessage}
          </Alert>
        ) : null}

        <AdminSection
          title="Marca"
          description="Nome, assinatura e logotipo usados no topo da loja, no rodapé e no painel."
        >
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_11rem]">
            <div className="space-y-4">
              <Field
                label="Nome da marca"
                htmlFor="brandName"
                required
                error={errorFor("brandName")}
              >
                <Input
                  id="brandName"
                  value={brandName}
                  onChange={(event) => setBrandName(event.target.value)}
                  maxLength={80}
                  required
                  disabled={saving}
                />
              </Field>

              <Field
                label="Assinatura curta"
                htmlFor="tagline"
                optional
                hint="Aparece abaixo do nome da marca."
                error={errorFor("tagline")}
              >
                <Input
                  id="tagline"
                  value={tagline}
                  onChange={(event) => setTagline(event.target.value)}
                  maxLength={120}
                  disabled={saving}
                />
              </Field>
            </div>

            <ImageField
              id="logoPath"
              label="Logotipo"
              hint="Opcional"
              folder="logo"
              path={logoPath}
              initialUrl={logoUrl}
              aspect="aspect-square"
              disabled={saving}
              onChange={(next) => {
                setLogoPath(next.path);
                setLogoUrl(next.url);
              }}
            />
          </div>

          <div className="mt-4">
            <Field
              label="Frase de anúncio"
              htmlFor="announcementText"
              optional
              hint="Barra fina no topo do site. Deixe vazio para ocultar."
              error={errorFor("announcementText")}
            >
              <Input
                id="announcementText"
                value={announcementText}
                onChange={(event) => setAnnouncementText(event.target.value)}
                maxLength={180}
                placeholder="Feito à mão • Personalização a combinar"
                disabled={saving}
              />
            </Field>
          </div>
        </AdminSection>

        <AdminSection
          title="Banner principal"
          description="A primeira impressão da loja. Textos curtos e uma imagem vertical delicada funcionam melhor."
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="space-y-4">
              <Field
                label="Sobretítulo"
                htmlFor="heroEyebrow"
                optional
                error={errorFor("heroEyebrow")}
              >
                <Input
                  id="heroEyebrow"
                  value={heroEyebrow}
                  onChange={(event) => setHeroEyebrow(event.target.value)}
                  maxLength={120}
                  placeholder="Ateliê de lembrancinhas"
                  disabled={saving}
                />
              </Field>

              <Field
                label="Título"
                htmlFor="heroTitle"
                required
                hint="Evite textos muito longos. Até 180 caracteres."
                error={errorFor("heroTitle")}
              >
                <Textarea
                  id="heroTitle"
                  value={heroTitle}
                  onChange={(event) => setHeroTitle(event.target.value)}
                  maxLength={180}
                  className="min-h-24 font-display text-lg"
                  required
                  disabled={saving}
                />
              </Field>

              <Field
                label="Subtítulo"
                htmlFor="heroSubtitle"
                required
                error={errorFor("heroSubtitle")}
              >
                <Textarea
                  id="heroSubtitle"
                  value={heroSubtitle}
                  onChange={(event) => setHeroSubtitle(event.target.value)}
                  maxLength={400}
                  disabled={saving}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Botão principal"
                  htmlFor="heroPrimaryCta"
                  optional
                  error={errorFor("heroPrimaryCta")}
                >
                  <Input
                    id="heroPrimaryCta"
                    value={heroPrimaryCta}
                    onChange={(event) => setHeroPrimaryCta(event.target.value)}
                    maxLength={60}
                    disabled={saving}
                  />
                </Field>
                <Field
                  label="Botão secundário"
                  htmlFor="heroSecondaryCta"
                  optional
                  hint="Abre o WhatsApp quando configurado."
                  error={errorFor("heroSecondaryCta")}
                >
                  <Input
                    id="heroSecondaryCta"
                    value={heroSecondaryCta}
                    onChange={(event) =>
                      setHeroSecondaryCta(event.target.value)
                    }
                    maxLength={60}
                    disabled={saving}
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-4">
              <ImageField
                id="heroImagePath"
                label="Imagem do banner"
                hint="Vertical, até 5 MB"
                folder="hero"
                path={heroImagePath}
                initialUrl={heroImageUrl}
                aspect="aspect-[4/5]"
                disabled={saving}
                onChange={(next) => {
                  setHeroImagePath(next.path);
                  setHeroImageUrl(next.url);
                }}
              />

              <Field
                label="Texto alternativo"
                htmlFor="heroImageAlt"
                optional
                hint="Descreva a imagem para acessibilidade."
                error={errorFor("heroImageAlt")}
              >
                <Input
                  id="heroImageAlt"
                  value={heroImageAlt}
                  onChange={(event) => setHeroImageAlt(event.target.value)}
                  maxLength={180}
                  disabled={saving}
                />
              </Field>

              <p className="text-[0.65rem] leading-relaxed text-muted/70">
                Sem imagem enviada, a loja usa uma ilustração exclusiva. Você
                pode trocar ou remover a foto quando quiser.
              </p>
            </div>
          </div>
        </AdminSection>

        <AdminSection
          title="Seções da homepage"
          description="Ative, desative e ajuste os textos de cada bloco abaixo do banner."
        >
          {errorFor("sectionsJson") ? (
            <Alert tone="error" className="mb-4">
              {errorFor("sectionsJson")?.[0]}
            </Alert>
          ) : null}

          <div className="space-y-3">
            {sectionValues.map((section) => (
              <div
                key={section.key}
                className="rounded-xl border border-line/80 bg-cream/30 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ivory text-brand">
                      <LayoutTemplate
                        className="h-4 w-4"
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-ink">
                        {section.label}
                      </p>
                      <p className="text-[0.6rem] text-muted/70">
                        {section.isVisible ? "Visível na loja" : "Oculta"}
                      </p>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-ivory px-3 py-1.5">
                    <input
                      type="checkbox"
                      checked={section.isVisible}
                      onChange={(event) =>
                        updateSection(section.key, {
                          isVisible: event.target.checked,
                        })
                      }
                      disabled={saving}
                      className="h-3.5 w-3.5 rounded border-line accent-[var(--brand)]"
                    />
                    <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-ink">
                      {section.isVisible ? (
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      Exibir
                    </span>
                  </label>
                </div>

                <div className="mt-3 grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
                    <Field
                      label="Sobretítulo"
                      htmlFor={`${section.key}-eyebrow`}
                      optional
                    >
                      <Input
                        id={`${section.key}-eyebrow`}
                        value={section.eyebrow ?? ""}
                        onChange={(event) =>
                          updateSection(section.key, {
                            eyebrow: event.target.value,
                          })
                        }
                        maxLength={120}
                        disabled={saving || !section.isVisible}
                        className="min-h-9 py-1.5 text-xs"
                      />
                    </Field>
                    <Field
                      label="Título"
                      htmlFor={`${section.key}-title`}
                      optional
                    >
                      <Input
                        id={`${section.key}-title`}
                        value={section.title ?? ""}
                        onChange={(event) =>
                          updateSection(section.key, {
                            title: event.target.value,
                          })
                        }
                        maxLength={180}
                        disabled={saving || !section.isVisible}
                        className="min-h-9 py-1.5 text-xs"
                      />
                    </Field>
                  </div>
                  <Field
                    label="Texto de apoio"
                    htmlFor={`${section.key}-body`}
                    optional
                  >
                    <Textarea
                      id={`${section.key}-body`}
                      value={section.body ?? ""}
                      onChange={(event) =>
                        updateSection(section.key, { body: event.target.value })
                      }
                      maxLength={1200}
                      disabled={saving || !section.isVisible}
                      className="min-h-16 py-2 text-xs"
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </AdminSection>

        <div className="flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[0.68rem] font-medium text-muted transition hover:text-brand"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Abrir a loja em outra aba
          </Link>
          <Button type="submit" size="lg" loading={saving}>
            {!saving ? <Save className="h-4 w-4" aria-hidden="true" /> : null}
            Salvar página inicial
          </Button>
        </div>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <div className="rounded-2xl border border-line/80 bg-ivory p-4">
          <p className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted/60">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Prévia do banner
          </p>

          <div className="mt-3 overflow-hidden rounded-xl border border-line/70 bg-cream">
            {announcementText ? (
              <p className="truncate bg-ink px-3 py-1.5 text-center text-[0.55rem] font-medium uppercase tracking-[0.1em] text-cream/80">
                {announcementText}
              </p>
            ) : null}

            <div className="flex items-center justify-between gap-2 border-b border-line/60 px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                {logoUrl ? (
                  <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-line bg-ivory">
                    <Image
                      src={logoUrl}
                      alt=""
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush/60 font-display text-sm text-brand">
                    {brandName.slice(0, 1) || "L"}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-display text-sm leading-tight text-ink">
                    {brandName || "Nome da marca"}
                  </p>
                  <p className="truncate text-[0.5rem] uppercase tracking-[0.14em] text-muted/70">
                    {tagline}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-brand/10 px-2 py-1 text-[0.5rem] font-semibold text-brand">
                Carrinho
              </span>
            </div>

            <div className="grid gap-2 p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-blush/20">
                {heroImageUrl ? (
                  <Image
                    src={heroImageUrl}
                    alt=""
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-2">
                    <HeroIllustration />
                  </div>
                )}
              </div>
              <p className="text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-brand">
                {heroEyebrow || "Sobretítulo"}
              </p>
              <p className="font-display text-lg leading-[1.08] text-ink">
                {heroTitle || "Título do banner"}
              </p>
              <p className="line-clamp-3 text-[0.6rem] leading-relaxed text-muted">
                {heroSubtitle}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-brand px-2.5 py-1 text-[0.5rem] font-semibold text-ivory">
                  {heroPrimaryCta || "Explorar"}
                </span>
                {heroSecondaryCta ? (
                  <span className="rounded-full border border-line bg-ivory px-2.5 py-1 text-[0.5rem] font-semibold text-ink">
                    {heroSecondaryCta}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <p className="mt-2 text-[0.6rem] leading-relaxed text-muted/60">
            A prévia é aproximada. Confira a versão final na loja depois de
            salvar.
          </p>
        </div>

        <div className="rounded-2xl border border-line/80 bg-ivory p-4">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted/60">
            Seções visíveis
          </p>
          <ul className="mt-2 space-y-1.5">
            {sectionValues.map((section) => (
              <li
                key={section.key}
                className="flex items-center justify-between gap-2 text-[0.65rem]"
              >
                <span
                  className={
                    section.isVisible ? "text-ink" : "text-muted/40 line-through"
                  }
                >
                  {section.label}
                </span>
                <span
                  className={
                    section.isVisible
                      ? "font-semibold text-[#61775a]"
                      : "text-muted/40"
                  }
                >
                  {section.isVisible ? "visível" : "oculta"}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/configuracoes"
            className={buttonClasses({
              variant: "outline",
              size: "sm",
              className: "mt-3 w-full",
            })}
          >
            Editar contato e cores
          </Link>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-line/70 bg-cream/50 p-3">
          <ImagePlus
            className="mt-0.5 h-4 w-4 shrink-0 text-brand"
            aria-hidden="true"
          />
          <p className="text-[0.62rem] leading-relaxed text-muted">
            As imagens são enviadas ao Supabase Storage. Use JPEG, PNG ou WebP
            com até 5 MB.
          </p>
        </div>
      </aside>
    </form>
  );
}
