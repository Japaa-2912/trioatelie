import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth";
import { getAdminCategories, getAdminProductById } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Editar produto",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  if (!z.uuid().safeParse(id).success) {
    notFound();
  }

  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getAdminCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductForm product={product} categories={categories} />;
}
