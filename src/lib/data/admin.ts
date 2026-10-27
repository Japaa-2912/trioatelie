import "server-only";
import { createServerSupabase } from "../supabase/server";
import {
  mapCategory,
  mapProduct,
  mapProductImage,
  mapSection,
  mapSettings,
} from "./store";
import { DEFAULT_SECTIONS, DEFAULT_SETTINGS } from "../defaults";
import type {
  Category,
  HomepageSection,
  Product,
  StoreSettings,
} from "@/types/store";

async function getAdminClient() {
  return createServerSupabase();
}

export async function getAdminProducts(options?: {
  search?: string;
  status?: "all" | "active" | "inactive";
  categoryId?: string;
}): Promise<Product[]> {
  const supabase = await getAdminClient();
  if (!supabase) return [];

  let query = supabase.from("products").select("*");
  if (options?.status === "active") query = query.eq("is_active", true);
  if (options?.status === "inactive") query = query.eq("is_active", false);
  if (options?.categoryId) query = query.eq("category_id", options.categoryId);
  if (options?.search?.trim()) {
    const term = options.search.trim().replace(/[%_,]/g, " ");
    query = query.or(
      `name.ilike.%${term}%,short_description.ilike.%${term}%`,
    );
  }
  query = query
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const [productsResult, categoriesResult] = await Promise.all([
    query,
    supabase.from("categories").select("*"),
  ]);

  if (productsResult.error) {
    console.error(`[admin] produtos: ${productsResult.error.message}`);
    return [];
  }

  const categories = new Map(
    (categoriesResult.data ?? []).map((row) => [row.id, mapCategory(row)]),
  );

  return (productsResult.data ?? []).map((row) =>
    mapProduct(row, row.category_id ? categories.get(row.category_id) ?? null : null),
  );
}

export async function getAdminProductById(id: string): Promise<Product | null> {
  const supabase = await getAdminClient();
  if (!supabase) return null;

  const { data: productRow, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !productRow) {
    if (error) console.error(`[admin] produto: ${error.message}`);
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

export async function getAdminCategories(): Promise<Category[]> {
  const supabase = await getAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) {
    console.error(`[admin] categorias: ${error.message}`);
    return [];
  }
  return (data ?? []).map(mapCategory);
}

export async function getAdminSettings(): Promise<StoreSettings> {
  const supabase = await getAdminClient();
  if (!supabase) return DEFAULT_SETTINGS;
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    console.error(`[admin] configurações: ${error.message}`);
    return DEFAULT_SETTINGS;
  }
  return mapSettings(data);
}

export async function getAdminSections(): Promise<HomepageSection[]> {
  const supabase = await getAdminClient();
  if (!supabase) return DEFAULT_SECTIONS;
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error(`[admin] seções: ${error.message}`);
    return DEFAULT_SECTIONS;
  }
  return data?.length ? data.map(mapSection) : DEFAULT_SECTIONS;
}

export async function getAdminCounts() {
  const supabase = await getAdminClient();
  if (!supabase) {
    return {
      totalProducts: 0,
      activeProducts: 0,
      inactiveProducts: 0,
      totalCategories: 0,
      activeCategories: 0,
      featuredProducts: 0,
    };
  }

  const [
    totalProducts,
    activeProducts,
    inactiveProducts,
    totalCategories,
    activeCategories,
    featuredProducts,
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", false),
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
    inactiveProducts: inactiveProducts.count ?? 0,
    totalCategories: totalCategories.count ?? 0,
    activeCategories: activeCategories.count ?? 0,
    featuredProducts: featuredProducts.count ?? 0,
  };
}
