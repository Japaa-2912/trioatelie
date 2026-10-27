"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertAdmin, UnauthorizedError } from "@/lib/auth";
import { isSafeStoragePath, storagePublicUrl } from "@/lib/images";
import { removeStorageObjects } from "@/lib/storage-server";
import { slugify } from "@/lib/utils";
import { categoryFormSchema } from "@/lib/validations/category";
import {
  actionError,
  actionSuccess,
  zodFieldErrors,
  type ActionResult,
} from "./result";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}
function checked(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}
function revalidateCategories(slug?: string) {
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/categorias");
  revalidatePath("/admin");
  revalidatePath("/admin/categorias");
  if (slug) revalidatePath(`/categorias/${slug}`);
}

export async function saveCategoryAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const { supabase } = await assertAdmin();
    const raw = {
      id: text(formData, "id"),
      name: text(formData, "name"),
      slug: text(formData, "slug"),
      description: text(formData, "description"),
      icon: text(formData, "icon") || "gift",
      tone: text(formData, "tone") || "blush",
      imageUrl: text(formData, "imageUrl"),
      imagePath: text(formData, "imagePath"),
      sortOrder: text(formData, "sortOrder") || "0",
      isFeatured: checked(formData, "isFeatured"),
      isActive: checked(formData, "isActive"),
    };

    const parsed = categoryFormSchema.safeParse(raw);
    if (!parsed.success) {
      return actionError(
        "Revise os campos destacados antes de salvar.",
        zodFieldErrors(parsed.error),
      );
    }
    const data = parsed.data;
    const slug = data.slug || slugify(data.name);
    if (!slug) {
      return actionError("Informe um endereço (slug) válido.", {
        slug: ["Informe um endereço válido."],
      });
    }

    let imageUrl: string | null = null;
    let imagePath: string | null = null;
    if (data.imagePath) {
      if (!isSafeStoragePath(data.imagePath)) {
        return actionError("A imagem da categoria é inválida.", {
          imageUrl: ["Envie novamente a imagem."],
        });
      }
      imagePath = data.imagePath;
      imageUrl = storagePublicUrl(imagePath);
    }

    const { data: conflict } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (conflict && conflict.id !== data.id) {
      return actionError("Já existe uma categoria com esse endereço.", {
        slug: ["Escolha outro endereço."],
      });
    }

    let previousSlug: string | undefined;
    let previousImagePath: string | null = null;
    if (data.id) {
      const { data: previous } = await supabase
        .from("categories")
        .select("slug, image_path")
        .eq("id", data.id)
        .maybeSingle();
      previousSlug = previous?.slug;
      previousImagePath = previous?.image_path ?? null;
    }

    const payload = {
      name: data.name,
      slug,
      description: data.description || null,
      icon: data.icon,
      tone: data.tone,
      image_url: imageUrl,
      image_path: imagePath,
      sort_order: data.sortOrder,
      is_featured: data.isFeatured,
      is_active: data.isActive,
    };

    if (data.id) {
      const { error } = await supabase
        .from("categories")
        .update(payload)
        .eq("id", data.id);
      if (error) {
        console.error(`[admin] atualizar categoria: ${error.message}`);
        return actionError("Não foi possível salvar a categoria.");
      }
    } else {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) {
        console.error(`[admin] criar categoria: ${error.message}`);
        return actionError("Não foi possível criar a categoria.");
      }
    }

    if (previousImagePath && previousImagePath !== imagePath) {
      await removeStorageObjects(supabase, [previousImagePath]);
    }

    revalidateCategories(slug);
    if (previousSlug && previousSlug !== slug) {
      revalidatePath(`/categorias/${previousSlug}`);
    }
    return actionSuccess(
      data.id ? "Categoria atualizada com sucesso." : "Categoria criada com sucesso.",
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return actionError("Sua sessão expirou. Entre novamente no painel.");
    }
    console.error("[admin] erro inesperado ao salvar categoria", error);
    return actionError("Não foi possível salvar a categoria.");
  }
}

export async function toggleCategoryActiveAction(formData: FormData) {
  try {
    const { supabase } = await assertAdmin();
    const id = text(formData, "id");
    const next = checked(formData, "next");
    if (!z.uuid().safeParse(id).success) redirect("/admin/categorias?erro=dados");
    const { data: category } = await supabase
      .from("categories")
      .select("slug")
      .eq("id", id)
      .maybeSingle();
    const { error } = await supabase
      .from("categories")
      .update({ is_active: next })
      .eq("id", id);
    if (error) {
      console.error(`[admin] status categoria: ${error.message}`);
      redirect("/admin/categorias?erro=status");
    }
    revalidateCategories(category?.slug);
    redirect(next ? "/admin/categorias?ok=ativada" : "/admin/categorias?ok=desativada");
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/admin/login");
    throw error;
  }
}

export async function toggleCategoryFeaturedAction(formData: FormData) {
  try {
    const { supabase } = await assertAdmin();
    const id = text(formData, "id");
    const next = checked(formData, "next");
    if (!z.uuid().safeParse(id).success) redirect("/admin/categorias?erro=dados");
    const { error } = await supabase
      .from("categories")
      .update({ is_featured: next })
      .eq("id", id);
    if (error) {
      console.error(`[admin] destaque categoria: ${error.message}`);
      redirect("/admin/categorias?erro=destaque");
    }
    revalidateCategories();
    redirect(next ? "/admin/categorias?ok=destaque" : "/admin/categorias?ok=sem-destaque");
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/admin/login");
    throw error;
  }
}

export async function deleteCategoryAction(formData: FormData) {
  try {
    const { supabase } = await assertAdmin();
    const id = text(formData, "id");
    if (!z.uuid().safeParse(id).success) redirect("/admin/categorias?erro=dados");

    const { data: category } = await supabase
      .from("categories")
      .select("slug, image_path")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      console.error(`[admin] excluir categoria: ${error.message}`);
      redirect("/admin/categorias?erro=excluir");
    }

    await removeStorageObjects(supabase, [category?.image_path]);
    revalidateCategories(category?.slug);
    redirect("/admin/categorias?ok=excluida");
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/admin/login");
    throw error;
  }
}
