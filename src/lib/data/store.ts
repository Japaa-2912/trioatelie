import "server-only";
import { createPublicSupabase } from "../supabase/server";
import { DEFAULT_SECTIONS, DEFAULT_SETTINGS, mergeSections, mergeSettings } from "../defaults";
import type {
  Category,
  CategoryIcon,
  CategoryTone,
  HomepageSection,
  Product,
  ProductImage,
  StoreSettings,
} from "@/types/store";
import type {
  CategoryRow,
  HomepageSectionRow,
  ProductImageRow,
  ProductRow,
  StoreSettingsRow,
} from "@/types/database";

function logDataError(context: string, message?: string) {
  console.error(`[dados] ${context}: ${message ?? "erro desconhecido"}`);
}

export function mapSettings(row: StoreSettingsRow | null): StoreSettings {
  if (!row) return DEFAULT_SETTINGS;
  return mergeSettings({
    id: row.id,
    brandName: row.brand_name,
    tagline: row.tagline,
    logoUrl: row.logo_url,
    logoPath: row.logo_path,
    whatsappNumber: row.whatsapp_number,
    instagramUrl: row.instagram_url,
    email: row.email,
    phone: row.phone,
    announcementText: row.announcement_text,
    heroEyebrow: row.hero_eyebrow,
    heroTitle: row.hero_title ?? DEFAULT_SETTINGS.heroTitle,
    heroSubtitle: row.hero_subtitle ?? DEFAULT_SETTINGS.heroSubtitle,
    heroPrimaryCta: row.hero_primary_cta ?? DEFAULT_SETTINGS.heroPrimaryCta,
    heroSecondaryCta:
      row.hero_secondary_cta ?? DEFAULT_SETTINGS.heroSecondaryCta,
    heroImageUrl: row.hero_image_url,
    heroImagePath: row.hero_image_path,
    heroImageAlt: row.hero_image_alt ?? DEFAULT_SETTINGS.heroImageAlt,
    institutionalText: row.institutional_text,
    footerText: row.footer_text,
    privacyText: row.privacy_text,
    brandColor: row.brand_color,
    blushColor: row.blush_color,
    sageColor: row.sage_color,
  });
}

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon as CategoryIcon,
    tone: row.tone as CategoryTone,
    imageUrl: row.image_url,
    imagePath: row.image_path,
    sortOrder: row.sort_order,
    isFeatured: row.is_featured,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapProductImage(row: ProductImageRow): ProductImage {
  return {
    id: row.id,
    productId: row.product_id,
    url: row.url,
    storagePath: row.storage_path,
    altText: row.alt_text,
    sortOrder: row.sort_order,
  };
}

export function mapProduct(
  row: ProductRow,
  category: Category | null = null,
  images: ProductImage[] = [],
): Product {
  return {
    id: row.id,
    categoryId: row.category_id,
    category,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    price: row.price === null ? null : Number(row.price),
    priceOnRequest: row.price_on_request,
    isCustomizable: row.is_customizable,
    customizationNotes: row.customization_notes,
    dimensions: row.dimensions,
    materials: row.materials,
    productionTime: row.production_time,
    minQuantity: row.min_quantity,
    mainImageUrl: row.main_image_url,
    mainImagePath: row.main_image_path,
    mainImageAlt: row.main_image_alt,
    isActive: row.is_active,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    images,
  };
}

export function mapSection(row: HomepageSectionRow): HomepageSection {
  return {
    key: row.key,
    label: row.label,
    eyebrow: row.eyebrow,
    title: row.title,
    body: row.body,
    isVisible: row.is_visible,
    sortOrder: row.sort_order,
  };
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const supabase = createPublicSupabase();
  if (!supabase) return DEFAULT_SETTINGS;
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    logDataError("configurações da loja", error.message);
    return DEFAULT_SETTINGS;
  }
  return mapSettings(data);
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  const supabase = createPublicSupabase();
  if (!supabase) return DEFAULT_SECTIONS;
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    logDataError("seções da home", error.message);
    return DEFAULT_SECTIONS;
  }
  return mergeSections((data ?? []).map(mapSection));
}

export async function getCategories(options?: {
  includeInactive?: boolean;
}): Promise<Category[]> {
  const supabase = createPublicSupabase();
  if (!supabase) return [];
  let query = supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (!options?.includeInactive) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) {
    logDataError("categorias", error.message);
    return [];
  }
  return (data ?? []).map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createPublicSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) {
    logDataError("categoria", error.message);
    return null;
  }
  return data ? mapCategory(data) : null;
}

export async function getProducts(options?: {
  categoryId?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
  includeInactive?: boolean;
  orderBy?: "recent" | "display";
}): Promise<Product[]> {
  const supabase = createPublicSupabase();
  if (!supabase) return [];

  const [categoriesResult, productsResult] = await Promise.all([
    supabase.from("categories").select("*"),
    (() => {
      let query = supabase.from("products").select("*");
      if (!options?.includeInactive) query = query.eq("is_active", true);
      if (options?.categoryId) query = query.eq("category_id", options.categoryId);
      if (options?.featured) query = query.eq("is_featured", true);
      if (options?.search?.trim()) {
        const term = options.search.trim().replace(/[%_,]/g, " ");
        query = query.or(
          `name.ilike.%${term}%,short_description.ilike.%${term}%,description.ilike.%${term}%`,
        );
      }
      if (options?.orderBy === "recent") {
        query = query.order("created_at", { ascending: false });
      } else {
        query = query
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });
      }
      if (options?.limit) query = query.limit(options.limit);
      return query;
    })(),
  ]);

  if (productsResult.error) {
    logDataError("produtos", productsResult.error.message);
    return [];
  }
  if (categoriesResult.error) {
    logDataError("categorias dos produtos", categoriesResult.error.message);
  }

  const categories = new Map(
    (categoriesResult.data ?? []).map((row) => [row.id, mapCategory(row)]),
  );

  return (productsResult.data ?? []).map((row) =>
    mapProduct(row, row.category_id ? categories.get(row.category_id) ?? null : null),
  );
}

export async function getProductBySlug(
  slug: string,
  options?: { includeInactive?: boolean },
): Promise<Product | null> {
  const supabase = createPublicSupabase();
  if (!supabase) return null;

  let query = supabase.from("products").select("*").eq("slug", slug);
  if (!options?.includeInactive) query = query.eq("is_active", true);
  const { data: productRow, error } = await query.maybeSingle();
  if (error) {
    logDataError("produto", error.message);
    return null;
  }
  if (!productRow) return null;

  const [categoryResult, imagesResult] = await Promise.all([
    productRow.category_id
      ? supabase
          .from("categories")
          .select("*")
          .eq("id", productRow.category_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productRow.id)
      .order("sort_order", { ascending: true }),
  ]);

  if (imagesResult.error) {
    logDataError("galeria do produto", imagesResult.error.message);
  }

  return mapProduct(
    productRow,
    categoryResult.data ? mapCategory(categoryResult.data) : null,
    (imagesResult.data ?? []).map(mapProductImage),
  );
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createPublicSupabase();
  if (!supabase) return null;
  const { data: productRow, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !productRow) {
    if (error) logDataError("produto por id", error.message);
    return null;
  }

  const [categoryResult, imagesResult] = await Promise.all([
    productRow.category_id
      ? supabase
          .from("categories")
          .select("*")
          .eq("id", productRow.category_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productRow.id)
      .order("sort_order", { ascending: true }),
  ]);

  return mapProduct(
    productRow,
    categoryResult.data ? mapCategory(categoryResult.data) : null,
    (imagesResult.data ?? []).map(mapProductImage),
  );
}

export async function getRelatedProducts(
  product: Product,
  limit = 3,
): Promise<Product[]> {
  if (!product.categoryId) {
    const products = await getProducts({ limit: limit + 1 });
    return products.filter((item) => item.id !== product.id).slice(0, limit);
  }
  const products = await getProducts({ categoryId: product.categoryId });
  return products.filter((item) => item.id !== product.id).slice(0, limit);
}

export async function getCatalogCounts(): Promise<{
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  activeCategories: number;
  featuredProducts: number;
}> {
  const supabase = createPublicSupabase();
  if (!supabase) {
    return {
      totalProducts: 0,
      activeProducts: 0,
      totalCategories: 0,
      activeCategories: 0,
      featuredProducts: 0,
    };
  }

  const [
    totalProducts,
    activeProducts,
    totalCategories,
    activeCategories,
    featuredProducts,
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase
      .from("categories")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_featured", true)
      .eq("is_active", true),
  ]);

  return {
    totalProducts: totalProducts.count ?? 0,
    activeProducts: activeProducts.count ?? 0,
    totalCategories: totalCategories.count ?? 0,
    activeCategories: activeCategories.count ?? 0,
    featuredProducts: featuredProducts.count ?? 0,
  };
}
