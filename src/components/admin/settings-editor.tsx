"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleAlert,
  LayoutTemplate,
  Mail,
  MessageCircle,
  Palette,
  Phone,
  Save,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { AdminSection } from "@/components/admin/admin-page-header";
import { InstagramIcon } from "@/components/brand/social-icons";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { saveSettingsAction } from "@/lib/actions/homepage";
import { formatWhatsAppForDisplay } from "@/lib/utils";
import type { StoreSettings } from "@/types/store";

export function SettingsEditor({ settings }: { settings: StoreSettings }) {
  const router = useRouter();
  const [brandName, setBrandName] = useState(settings.brandName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [whatsappNumber, setWhatsappNumber] = useState(
    settings.whatsappNumber ?? "",
  );
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl ?? "");
  const [email, setEmail] = useState(settings.email ?? "");
  const [phone, setPhone] = useState(settings.phone ?? "");
  const [announcementText, setAnnouncementText] = useState(
    settings.announcementText ?? "",
  );
  const [institutionalText, setInstitutionalText] = useState(
    settings.institutionalText ?? "",
  );
  const [footerText, setFooterText] = useState(settings.footerText ?? "");
  const [privacyText, setPrivacyText] = useState(settings.privacyText ?? "");
  const [brandColor, setBrandColor] = useState(settings.brandColor);
  const [blushColor, setBlushColor] = useState(settings.blushColor);
  const [sageColor, setSageColor] = useState(settings.sageColor);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const whatsappPreview = formatWhatsAppForDisplay(whatsappNumber);

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
      formData.set("whatsappNumber", whatsappNumber);
      formData.set("instagramUrl", instagramUrl);
      formData.set("email", email);
      formData.set("phone", phone);
      formData.set("announcementText", announcementText);
      formData.set("institutionalText", institutionalText);
      formData.set("footerText", footerText);
      formData.set("privacyText", privacyText);
      formData.set("brandColor", brandColor);
      formData.set("blushColor", blushColor);
      formData.set("sageColor", sageColor);

      const result = await saveSettingsAction(formData);
      if (!result.ok) {
        setFormError(result.message);
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      setSavedMessage(result.message ?? "Configurações salvas.");
      toast.success(result.message ?? "Configurações salvas.");
      router.refresh();
    } catch (error) {
      console.error(error);
      setFormError("Não foi possível salvar as configurações. Tente novamente.");
      toast.error("Não foi possível salvar as configurações.");
    } finally {
      setSaving(false);
    }
  };

  const errorFor = (key: string) => fieldErrors[key];

  return (
    <form onSubmit={submit} className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-5">
        {formError ? (
          <Alert tone="error" title="Revise antes de salvar">
            {formError}
          </Alert>
        ) : null}
        {savedMessage ? (
          <Alert tone="success" title="Configurações atualizadas">
            {savedMessage}
          </Alert>
        ) : null}

        <AdminSection
          title="Identidade"
          description="Nome e assinatura exibidos na loja. O logotipo e o banner ficam na página inicial."
          action={
            <Link
              href="/admin/home"
              className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-brand hover:underline"
            >
              <LayoutTemplate className="h-3.5 w-3.5" aria-hidden="true" />
              Editar marca e banner
            </Link>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
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

          <div className="mt-4">
            <Field
              label="Frase de anúncio"
              htmlFor="announcementText"
              optional
              hint="Barra no topo da loja. Deixe vazio para ocultar."
              error={errorFor("announcementText")}
            >
              <Input
                id="announcementText"
                value={announcementText}
                onChange={(event) => setAnnouncementText(event.target.value)}
                maxLength={180}
                disabled={saving}
              />
            </Field>
          </div>
        </AdminSection>

        <AdminSection
          title="WhatsApp e contato"
          description="O WhatsApp é o canal oficial de pedidos. Sem um número válido, os botões de pedido ficam desativados."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="WhatsApp com código do país"
              htmlFor="whatsappNumber"
              hint="Somente números. Ex.: 5511999999999."
              error={errorFor("whatsappNumber")}
            >
              <div className="relative">
                <WhatsAppIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d8a71]" />
                <Input
                  id="whatsappNumber"
                  value={whatsappNumber}
                  onChange={(event) => setWhatsappNumber(event.target.value)}
                  inputMode="tel"
                  placeholder="5511999999999"
                  maxLength={30}
                  className="pl-10"
                  disabled={saving}
                />
              </div>
              {whatsappNumber ? (
                <p className="text-[0.65rem] text-muted">
                  Exibido como:{" "}
                  <span className="font-semibold text-ink">
                    {whatsappPreview ?? "número inválido"}
                  </span>
                </p>
              ) : null}
            </Field>

            <Field
              label="Instagram"
              htmlFor="instagramUrl"
              optional
              hint="Link completo do perfil."
              error={errorFor("instagramUrl")}
            >
              <div className="relative">
                <InstagramIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50" />
                <Input
                  id="instagramUrl"
                  value={instagramUrl}
                  onChange={(event) => setInstagramUrl(event.target.value)}
                  placeholder="https://instagram.com/seu-perfil"
                  maxLength={300}
                  className="pl-10"
                  disabled={saving}
                />
              </div>
            </Field>

            <Field
              label="E-mail"
              htmlFor="email"
              optional
              error={errorFor("email")}
            >
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="contato@atelie.com"
                  maxLength={180}
                  className="pl-10"
                  disabled={saving}
                />
              </div>
            </Field>

            <Field
              label="Telefone para exibição"
              htmlFor="phone"
              optional
              hint="Opcional. Não é usado para pedidos automáticos."
              error={errorFor("phone")}
            >
              <div className="relative">
                <Phone
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50"
                  aria-hidden="true"
                />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="(11) 99999-9999"
                  maxLength={40}
                  className="pl-10"
                  disabled={saving}
                />
              </div>
            </Field>
          </div>

          {!whatsappNumber ? (
            <Alert tone="warning" className="mt-4">
              Sem WhatsApp configurado, a loja orienta as clientes a usar a
              página de contato e não abre conversas de pedido.
            </Alert>
          ) : null}
        </AdminSection>

        <AdminSection
          title="Textos institucionais"
          description="Aparecem no rodapé, na página de contato e na política de privacidade."
        >
          <div className="space-y-4">
            <Field
              label="Sobre o ateliê"
              htmlFor="institutionalText"
              optional
              hint="Um parágrafo curto sobre o trabalho e o cuidado com cada peça."
              error={errorFor("institutionalText")}
            >
              <Textarea
                id="institutionalText"
                value={institutionalText}
                onChange={(event) => setInstitutionalText(event.target.value)}
                maxLength={2000}
                className="min-h-24"
                disabled={saving}
              />
            </Field>

            <Field
              label="Texto do rodapé"
              htmlFor="footerText"
              optional
              error={errorFor("footerText")}
            >
              <Input
                id="footerText"
                value={footerText}
                onChange={(event) => setFooterText(event.target.value)}
                maxLength={300}
                disabled={saving}
              />
            </Field>

            <Field
              label="Política de privacidade"
              htmlFor="privacyText"
              optional
              hint={`${privacyText.length} de 10.000 caracteres. Separe parágrafos com uma linha em branco.`}
              error={errorFor("privacyText")}
            >
              <Textarea
                id="privacyText"
                value={privacyText}
                onChange={(event) => setPrivacyText(event.target.value)}
                maxLength={10000}
                className="min-h-48 text-xs"
                disabled={saving}
              />
            </Field>
          </div>
        </AdminSection>

        <AdminSection
          title="Cores da loja"
          description="Ajuste os tons principais. Use cores suaves para manter a identidade delicada."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Cor principal",
                hint: "Botões e destaques",
                value: brandColor,
                setValue: setBrandColor,
                name: "brandColor",
              },
              {
                label: "Rosa suave",
                hint: "Fundos e selos",
                value: blushColor,
                setValue: setBlushColor,
                name: "blushColor",
              },
              {
                label: "Verde sage",
                hint: "Apoio e detalhes",
                value: sageColor,
                setValue: setSageColor,
                name: "sageColor",
              },
            ].map((color) => (
              <Field
                key={color.name}
                label={color.label}
                htmlFor={color.name}
                hint={color.hint}
                error={errorFor(color.name)}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={/^#[0-9a-fA-F]{6}$/.test(color.value) ? color.value : "#a9786c"}
                    onChange={(event) => color.setValue(event.target.value)}
                    disabled={saving}
                    aria-label={`Escolher ${color.label}`}
                    className="h-11 w-12 shrink-0 cursor-pointer rounded-lg border border-line bg-ivory p-1"
                  />
                  <Input
                    id={color.name}
                    value={color.value}
                    onChange={(event) => color.setValue(event.target.value)}
                    maxLength={7}
                    placeholder="#a9786c"
                    className="font-mono text-xs uppercase"
                    disabled={saving}
                  />
                </div>
              </Field>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-line">
            <div
              className="flex flex-wrap items-center gap-3 px-4 py-4"
              style={{
                background: `linear-gradient(120deg, ${blushColor}, var(--cream) 55%, ${sageColor})`,
              }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-ivory"
                style={{ background: brandColor }}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-lg leading-tight text-ink">
                  {brandName || "Sua marca"}
                </p>
                <p className="text-[0.6rem] uppercase tracking-[0.16em] text-muted">
                  {tagline || "Assinatura da loja"}
                </p>
              </div>
              <span
                className="ml-auto rounded-full px-3 py-1.5 text-[0.6rem] font-semibold text-ivory"
                style={{ background: brandColor }}
              >
                Explorar
              </span>
            </div>
          </div>

          <p className="mt-3 flex items-start gap-1.5 text-[0.62rem] leading-relaxed text-muted/70">
            <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            A prévia é aproximada. Se uma cor inválida for informada, a loja usa o
            tom padrão do ateliê.
          </p>
        </AdminSection>

        <div className="flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5 text-[0.65rem] text-muted/70">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Somente administradoras autenticadas podem salvar.
          </p>
          <Button type="submit" size="lg" loading={saving}>
            {!saving ? <Save className="h-4 w-4" aria-hidden="true" /> : null}
            Salvar configurações
          </Button>
        </div>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <div className="rounded-2xl border border-line/80 bg-ivory p-4">
          <p className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted/60">
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Como a cliente pede
          </p>
          <ol className="mt-3 space-y-2.5 text-[0.65rem] leading-relaxed text-muted">
            <li className="flex gap-2">
              <span className="font-semibold text-brand">1.</span>
              Escolhe as peças e ajusta as quantidades no carrinho.
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-brand">2.</span>
              Preenche tema, nome, idade, data e observações.
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-brand">3.</span>
              O site abre o WhatsApp com o resumo do pedido.
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-brand">4.</span>
              Você confirma disponibilidade, prazo e valor final.
            </li>
          </ol>
        </div>

        <div className="rounded-2xl border border-line/80 bg-blush/15 p-4">
          <p className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-brand">
            <Palette className="h-3.5 w-3.5" aria-hidden="true" />
            Paleta atual
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { color: brandColor, label: "Principal" },
              { color: blushColor, label: "Rosa" },
              { color: sageColor, label: "Sage" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <span
                  className="mx-auto block h-10 w-full rounded-lg border border-black/5"
                  style={{ background: item.color }}
                  aria-hidden="true"
                />
                <span className="mt-1 block text-[0.55rem] text-muted">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line/70 bg-cream/50 p-3">
          <p className="text-[0.62rem] font-semibold text-ink">
            Número no formato internacional
          </p>
          <p className="mt-1 text-[0.6rem] leading-relaxed text-muted">
            Use código do país + DDD + número, apenas dígitos. Exemplo Brasil:
            55 11 99999-9999 → 5511999999999.
          </p>
        </div>
      </aside>
    </form>
  );
}
