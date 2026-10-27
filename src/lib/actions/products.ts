"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertAdmin, UnauthorizedError } from "@/lib/auth";
import { isSafeStoragePath, storagePublicUrl } from "@/lib/images";
import { removeStorageObjects } from "@/lib/storage-server";
import { parsePriceToNumber, slugify } from "@/lib/utils";
import {
  galleryItemSchema,
  productFormSchema,
} from "@/lib/validations/product";
import {
  actionError,
  actionSuccess,
  zodFieldErrors,
  type ActionResult,
} from "./result";

const zGallery = z.array(galleryItemSchema).max(10);

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function revalidateStore(slug?: string, categorySlug?: string) {
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/categorias");
  revalidatePath("/admin");
  revalidatePath("/admin/produtos");
  if (slug) revalidatePath(`/produtos/${slug}`);
  if (categorySlug) revalidatePath(`/categorias/${categorySlug}`);
}

export async function saveProductAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const { supabase } = await assertAdmin();

    const raw = {
      name: text(formData, "name"),
      slug: text(formData, "slug"),
      categoryId: text(formData, "categoryId"),
      shortDescription: text(formData, "shortDescription"),
      description: text(formData, "description"),
      price: text(formData, "price"),
      priceOnRequest: checked(formData, "priceOnRequest"),
      isCustomizable: checked(formData, "isCustomizable"),
      customizationNotes: text(formData, "customizationNotes"),
      dimensions: text(formData, "dimensions"),
      materials: text(formData, "materials"),
      productionTime: text(formData, "productionTime"),
      minQuantity: text(formData, "minQuantity") || "1",
      mainImageUrl: text(formData, "mainImageUrl"),
      mainImagePath: text(formData, "mainImagePath"),
      mainImageAlt: text(formData, "mainImageAlt"),
      isActive: checked(formData, "isActive"),
      isFeatured: checked(formData, "isFeatured"),
      sortOrder: text(formData, "sortOrder") || "0",
      galleryJson: text(formData, "galleryJson") || "[]",
    };

    const parsed = productFormSchema.safeParse(raw);
    if (!parsed.success) {
      return actionError(
        "Revise os campos destacados antes de salvar.",
        zodFieldErrors(parsed.error),
      );
    }
    const data = parsed.data;
    const id = text(formData, "id");
    const isEditing = Boolean(id);

    const slug = data.slug || slugify(data.name);
    if (!slug) {
      return actionError("Não foi possível gerar um endereço para o produto.", {
        slug: ["Informe um endereço (slug) válido."],
      });
    }

    let mainImagePath: string | null = null;
    let mainImageUrl: string | null = null;
    if (data.mainImagePath) {
      if (!isSafeStoragePath(data.mainImagePath)) {
        return actionError("A imagem principal enviada é inválida.", {
          mainImageUrl: ["Envie novamente a imagem principal."],
        });
      }
      mainImagePath = data.mainImagePath;
      mainImageUrl = storagePublicUrl(data.mainImagePath);
    }

    const gallery: { url: string; path: string; alt: string }[] = [];
    try {
      const parsedGallery = zGallery.parse(JSON.parse(data.galleryJson || "[]"));
      for (const [index, item] of parsedGallery.entries()) {
        if (!item.path || !isSafeStoragePath(item.path)) {
          return actionError("Uma das imagens da galeria é inválida.", {
            galleryJson: ["Remova a imagem inválida e envie novamente."],
          });
        }
        const url = storagePublicUrl(item.path);
        if (!url) {
          return actionError("Não foi possível gerar a URL da galeria.");
        }
        gallery.push({
          url,
          path: item.path,
          alt: item.alt?.trim() || `${data.name} — imagem ${index + 1}`,
        });
      }
    } catch {
      return actionError("A galeria de imagens é inválida.", {
        galleryJson: ["Atualize a página e tente novamente."],
      });
    }

    const priceNumber = data.priceOnRequest
      ? null
      : parsePriceToNumber(data.price);

    if (priceNumber !== null && (!Number.isFinite(priceNumber) || priceNumber < 0)) {
      return actionError("Informe um preço válido.", {
        price: ["Informe um preço válido."],
      });
    }

    let categorySlug: string | undefined;
    if (data.categoryId) {
      const { data: category } = await supabase
        .from("categories")
        .select("slug")
        .eq("id", data.categoryId)
        .maybeSingle();
      if (!category) {
        return actionError("A categoria selecionada não existe.", {
          categoryId: ["Selecione uma categoria válida."],
        });
      }
      categorySlug = category.slug;
    }

    const { data: slugConflict } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (slugConflict && slugConflict.id !== id) {
      return actionError("Já existe um produto com esse endereço.", {
        slug: ["Escolha outro endereço para o produto."],
      });
    }

    let previousSlug: string | undefined;
    let previousMainImagePath: string | null = null;
    let previousGalleryPaths: string[] = [];
    if (isEditing) {
      const [previousResult, previousImagesResult] = await Promise.all([
        supabase
          .from("products")
          .select("slug, main_image_path")
          .eq("id", id)
          .maybeSingle(),
        supabase
          .from("product_images")
          .select("storage_path")
          .eq("product_id", id),
      ]);
      previousSlug = previousResult.data?.slug;
      previousMainImagePath = previousResult.data?.main_image_path ?? null;
      previousGalleryPaths =
        previousImagesResult.data
          ?.map((image) => image.storage_path)
          .filter((path): path is string => Boolean(path)) ?? [];
    }

    const payload = {
      name: data.name,
      slug,
      category_id: data.categoryId || null,
      short_description: data.shortDescription || null,
      description: data.description || null,
      price: priceNumber,
      price_on_request: data.priceOnRequest,
      is_customizable: data.isCustomizable,
      customization_notes: data.customizationNotes || null,
      dimensions: data.dimensions || null,
      materials: data.materials || null,
      production_time: data.productionTime || null,
      min_quantity: data.minQuantity,
      main_image_url: mainImageUrl,
      main_image_path: mainImagePath,
      main_image_alt: mainImagePath ? data.mainImageAlt || data.name : null,
      is_active: data.isActive,
      is_featured: data.isFeatured,
      sort_order: data.sortOrder,
    };

    let productId = id;

    if (isEditing) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id);
      if (error) {
        console.error(`[admin] atualizar produto: ${error.message}`);
        if (error.code === "23505") {
          return actionError("Já existe um produto com esse endereço.", {
            slug: ["Escolha outro endereço para o produto."],
          });
        }
        return actionError("Não foi possível salvar o produto. Tente novamente.");
      }
      const { error: deleteImagesError } = await supabase
        .from("product_images")
        .delete()
        .eq("product_id", id);
      if (deleteImagesError) {
        console.error(`[admin] limpar galeria: ${deleteImagesError.message}`);
      }
    } else {
      const { data: inserted, error } = await supabase
        .from("products")
        .insert(payload)
        .select("id")
        .single();
      if (error || !inserted) {
        console.error(`[admin] criar produto: ${error?.message}`);
        if (error?.code === "23505") {
          return actionError("Já existe um produto com esse endereço.", {
            slug: ["Escolha outro endereço para o produto."],
          });
        }
        return actionError("Não foi possível criar o produto. Tente novamente.");
      }
      productId = inserted.id;
    }

    if (gallery.length > 0) {
      const { error: galleryError } = await supabase
        .from("product_images")
        .insert(
          gallery.map((item, index) => ({
            product_id: productId,
            url: item.url,
            storage_path: item.path,
            alt_text: item.alt,
            sort_order: index * 10,
          })),
        );
      if (galleryError) {
        console.error(`[admin] salvar galeria: ${galleryError.message}`);
        return actionError(
          "O produto foi salvo, mas a galeria não pôde ser atualizada. Abra o produto e tente novamente.",
        );
      }
    }

    if (isEditing) {
      const currentPaths = new Set(
        [mainImagePath, ...gallery.map((item) => item.path)].filter(
          (path): path is string => Boolean(path),
        ),
      );
      const stalePaths = [previousMainImagePath, ...previousGalleryPaths]
        .filter((path): path is string => Boolean(path))
        .filter((path) => !currentPaths.has(path));
      await removeStorageObjects(supabase, stalePaths);
    }

    revalidateStore(slug, categorySlug);
    if (previousSlug && previousSlug !== slug) {
      revalidatePath(`/produtos/${previousSlug}`);
    }

    return actionSuccess(
      isEditing ? "Produto atualizado com sucesso." : "Produto criado com sucesso.",
      productId,
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return actionError("Sua sessão expirou. Entre novamente no painel.");
    }
    console.error("[admin] erro inesperado ao salvar produto", error);
    return actionError("Não foi possível salvar o produto. Tente novamente.");
  }
}

export async function toggleProductActiveAction(formData: FormData) {
  try {
    const { supabase } = await assertAdmin();
    const id = text(formData, "id");
    const next = checked(formData, "next");
    if (!z.uuid().safeParse(id).success) {
      redirect("/admin/produtos?erro=dados");
    }
    const { data: product } = await supabase
      .from("products")
      .select("slug")
      .eq("id", id)
      .maybeSingle();
    const { error } = await supabase
      .from("products")
      .update({ is_active: next })
      .eq("id", id);
    if (error) {
      console.error(`[admin] alternar status: ${error.message}`);
      redirect("/admin/produtos?erro=status");
    }
    revalidateStore(product?.slug);
    redirect(
      next ? "/admin/produtos?ok=ativado" : "/admin/produtos?ok=desativado",
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/admin/login");
    }
    throw error;
  }
}

export async function toggleProductFeaturedAction(formData: FormData) {
  try {
    const { supabase } = await assertAdmin();
    const id = text(formData, "id");
    const next = checked(formData, "next");
    if (!z.uuid().safeParse(id).success) {
      redirect("/admin/produtos?erro=dados");
    }
    const { error } = await supabase
      .from("products")
      .update({ is_featured: next })
      .eq("id", id);
    if (error) {
      console.error(`[admin] alternar destaque: ${error.message}`);
      redirect("/admin/produtos?erro=destaque");
    }
    revalidateStore();
    redirect(
      next ? "/admin/produtos?ok=destaque" : "/admin/produtos?ok=sem-destaque",
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/admin/login");
    }
    throw error;
  }
}

export async function deleteProductAction(formData: FormData) {
  try {
    const { supabase } = await assertAdmin();
    const id = text(formData, "id");
    if (!z.uuid().safeParse(id).success) {
      redirect("/admin/produtos?erro=dados");
    }

    const { data: product } = await supabase
      .from("products")
      .select("slug, main_image_path")
      .eq("id", id)
      .maybeSingle();
    const { data: images } = await supabase
      .from("product_images")
      .select("storage_path")
      .eq("product_id", id);

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error(`[admin] excluir produto: ${error.message}`);
      redirect("/admin/produtos?erro=excluir");
    }

    const paths = [
      product?.main_image_path,
      ...(images?.map((image) => image.storage_path) ?? []),
    ];
    await removeStorageObjects(supabase, paths);

    revalidateStore(product?.slug);
    redirect("/admin/produtos?ok=excluido");
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/admin/login");
    }
    throw error;
  }
}
