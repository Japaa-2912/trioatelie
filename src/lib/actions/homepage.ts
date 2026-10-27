"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin, UnauthorizedError } from "@/lib/auth";
import { isSafeStoragePath, storagePublicUrl } from "@/lib/images";
import { removeStorageObjects } from "@/lib/storage-server";
import {
  DEFAULT_SECTIONS,
} from "@/lib/defaults";
import { normalizeWhatsAppNumber } from "@/lib/utils";
import {
  homepageFormSchema,
  settingsFormSchema,
  type HomepageSectionInput,
} from "@/lib/validations/settings";
import {
  actionError,
  actionSuccess,
  zodFieldErrors,
  type ActionResult,
} from "./result";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function revalidateStore() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/categorias");
  revalidatePath("/personalizacao");
  revalidatePath("/contato");
  revalidatePath("/privacidade");
  revalidatePath("/admin");
  revalidatePath("/admin/home");
  revalidatePath("/admin/configuracoes");
}

export async function saveSettingsAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const { supabase } = await assertAdmin();
    const parsed = settingsFormSchema.safeParse({
      brandName: text(formData, "brandName"),
      tagline: text(formData, "tagline"),
      whatsappNumber: text(formData, "whatsappNumber"),
      instagramUrl: text(formData, "instagramUrl"),
      email: text(formData, "email"),
      phone: text(formData, "phone"),
      announcementText: text(formData, "announcementText"),
      institutionalText: text(formData, "institutionalText"),
      footerText: text(formData, "footerText"),
      privacyText: text(formData, "privacyText"),
      brandColor: text(formData, "brandColor"),
      blushColor: text(formData, "blushColor"),
      sageColor: text(formData, "sageColor"),
    });

    if (!parsed.success) {
      return actionError(
        "Revise os campos destacados antes de salvar.",
        zodFieldErrors(parsed.error),
      );
    }
    const data = parsed.data;

    const { error } = await supabase.from("store_settings").upsert(
      {
        id: 1,
        brand_name: data.brandName,
        tagline: data.tagline,
        whatsapp_number: normalizeWhatsAppNumber(data.whatsappNumber),
        instagram_url: data.instagramUrl || null,
        email: data.email || null,
        phone: data.phone || null,
        announcement_text: data.announcementText || null,
        institutional_text: data.institutionalText || null,
        footer_text: data.footerText || null,
        privacy_text: data.privacyText || null,
        brand_color: data.brandColor,
        blush_color: data.blushColor,
        sage_color: data.sageColor,
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error(`[admin] salvar configurações: ${error.message}`);
      return actionError("Não foi possível salvar as configurações.");
    }

    revalidateStore();
    return actionSuccess("Configurações salvas. A loja já foi atualizada.");
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return actionError("Sua sessão expirou. Entre novamente no painel.");
    }
    console.error("[admin] erro inesperado ao salvar configurações", error);
    return actionError("Não foi possível salvar as configurações.");
  }
}

export async function saveHomepageAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const { supabase } = await assertAdmin();
    const parsed = homepageFormSchema.safeParse({
      brandName: text(formData, "brandName"),
      tagline: text(formData, "tagline"),
      logoUrl: text(formData, "logoUrl"),
      logoPath: text(formData, "logoPath"),
      announcementText: text(formData, "announcementText"),
      heroEyebrow: text(formData, "heroEyebrow"),
      heroTitle: text(formData, "heroTitle"),
      heroSubtitle: text(formData, "heroSubtitle"),
      heroPrimaryCta: text(formData, "heroPrimaryCta"),
      heroSecondaryCta: text(formData, "heroSecondaryCta"),
      heroImageUrl: text(formData, "heroImageUrl"),
      heroImagePath: text(formData, "heroImagePath"),
      heroImageAlt: text(formData, "heroImageAlt"),
      sectionsJson: text(formData, "sectionsJson") || "[]",
    });

    if (!parsed.success) {
      return actionError(
        "Revise os campos destacados antes de salvar.",
        zodFieldErrors(parsed.error),
      );
    }
    const data = parsed.data;

    let logoPath: string | null = null;
    let logoUrl: string | null = null;
    if (data.logoPath) {
      if (!isSafeStoragePath(data.logoPath)) {
        return actionError("O logotipo enviado é inválido.", {
          logoUrl: ["Envie novamente o logotipo."],
        });
      }
      logoPath = data.logoPath;
      logoUrl = storagePublicUrl(logoPath);
    }

    let heroImagePath: string | null = null;
    let heroImageUrl: string | null = null;
    if (data.heroImagePath) {
      if (!isSafeStoragePath(data.heroImagePath)) {
        return actionError("A imagem do banner é inválida.", {
          heroImageUrl: ["Envie novamente a imagem do banner."],
        });
      }
      heroImagePath = data.heroImagePath;
      heroImageUrl = storagePublicUrl(heroImagePath);
    }

    const { data: previousSettings } = await supabase
      .from("store_settings")
      .select("logo_path, hero_image_path")
      .eq("id", 1)
      .maybeSingle();

    const { error: settingsError } = await supabase
      .from("store_settings")
      .update({
        brand_name: data.brandName,
        tagline: data.tagline,
        logo_url: logoUrl,
        logo_path: logoPath,
        announcement_text: data.announcementText || null,
        hero_eyebrow: data.heroEyebrow || null,
        hero_title: data.heroTitle,
        hero_subtitle: data.heroSubtitle,
        hero_primary_cta: data.heroPrimaryCta,
        hero_secondary_cta: data.heroSecondaryCta,
        hero_image_url: heroImageUrl,
        hero_image_path: heroImagePath,
        hero_image_alt: data.heroImageAlt || "Lembrancinhas personalizadas",
      })
      .eq("id", 1);

    if (settingsError) {
      console.error(`[admin] salvar home: ${settingsError.message}`);
      return actionError("Não foi possível salvar a página inicial.");
    }

    const staleImages = [
      previousSettings?.logo_path !== logoPath
        ? previousSettings?.logo_path
        : null,
      previousSettings?.hero_image_path !== heroImagePath
        ? previousSettings?.hero_image_path
        : null,
    ];
    await removeStorageObjects(supabase, staleImages);

    let sections: HomepageSectionInput[];
    try {
      sections = JSON.parse(data.sectionsJson) as HomepageSectionInput[];
    } catch {
      return actionError("O conteúdo das seções é inválido.");
    }

    const labelByKey = new Map(
      DEFAULT_SECTIONS.map((section) => [section.key, section.label]),
    );
    const orderByKey = new Map(
      DEFAULT_SECTIONS.map((section) => [section.key, section.sortOrder]),
    );

    for (const section of sections) {
      const { error } = await supabase.from("homepage_sections").upsert(
        {
          key: section.key,
          label: labelByKey.get(section.key) ?? section.key,
          eyebrow: section.eyebrow || null,
          title: section.title || null,
          body: section.body || null,
          is_visible: section.isVisible,
          sort_order: orderByKey.get(section.key) ?? 0,
        },
        { onConflict: "key" },
      );
      if (error) {
        console.error(`[admin] salvar seção ${section.key}: ${error.message}`);
        return actionError(
          "As informações do banner foram salvas, mas uma seção não pôde ser atualizada.",
        );
      }
    }

    revalidateStore();
    return actionSuccess("Página inicial atualizada. Confira a prévia abaixo.");
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return actionError("Sua sessão expirou. Entre novamente no painel.");
    }
    console.error("[admin] erro inesperado ao salvar home", error);
    return actionError("Não foi possível salvar a página inicial.");
  }
}
