import { getBrowserSupabase } from "./supabase/client";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, STORAGE_BUCKET } from "./supabase/config";
import { slugify } from "./utils";

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

export type UploadFolder = "hero" | "logo" | "products" | "categories";

export type UploadedImage = {
  path: string;
  url: string;
};

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new ImageUploadError(
      "Formato não permitido. Envie uma imagem JPEG, PNG ou WebP.",
    );
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ImageUploadError(
      `A imagem deve ter no máximo ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)} MB.`,
    );
  }
}

function extensionFor(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

function uniqueToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  }
  return `${Date.now()}${Math.random().toString(36).slice(2, 10)}`;
}

export async function uploadImage(
  file: File,
  folder: UploadFolder,
): Promise<UploadedImage> {
  validateImageFile(file);

  const supabase = getBrowserSupabase();
  if (!supabase) {
    throw new ImageUploadError(
      "O Supabase ainda não está configurado. Preencha o .env.local para enviar imagens.",
    );
  }

  const baseName = slugify(file.name.replace(/\.[^.]+$/, "")) || "imagem";
  const path = `${folder}/${Date.now()}-${uniqueToken()}-${baseName.slice(0, 40)}.${extensionFor(file.type)}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new ImageUploadError(
      error.message.toLowerCase().includes("row-level security")
        ? "Sua sessão não tem permissão para enviar imagens. Entre novamente no painel."
        : "Não foi possível enviar a imagem. Verifique sua conexão e tente novamente.",
    );
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function removeUploadedImage(path: string | null | undefined) {
  if (!path) return;
  const supabase = getBrowserSupabase();
  if (!supabase) return;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) {
    console.error("[upload] não foi possível remover imagem temporária", error);
  }
}
