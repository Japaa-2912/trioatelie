import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth";
import { getAdminCategories } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Novo produto",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getAdminCategories();

  return <ProductForm categories={categories} />;
}
