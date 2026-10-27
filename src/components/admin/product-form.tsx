"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ExternalLink,
  Info,
  LoaderCircle,
  Save,
  WandSparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AdminSection } from "@/components/admin/admin-page-header";
import { ImageField } from "@/components/admin/image-field";
import {
  GalleryField,
  type GalleryImageItem,
} from "@/components/admin/gallery-field";
import { Alert } from "@/components/ui/alert";
import { Button, buttonClasses } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { saveProductAction } from "@/lib/actions/products";
import type { z } from "zod";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validations/product";
import { slugify } from "@/lib/utils";
import type { Category, Product } from "@/types/store";

export function ProductForm({
  product,
  categories,
}: {
  product?: Product | null;
  categories: Category[];
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const initialGallery: GalleryImageItem[] = (product?.images ?? [])
    .filter((image) => Boolean(image.storagePath))
    .map((image) => ({
      url: image.url,
      path: image.storagePath ?? "",
      alt: image.altText ?? "",
    }));

  const [gallery, setGallery] = useState<GalleryImageItem[]>(initialGallery);

  const form = useForm<
    z.input<typeof productFormSchema>,
    unknown,
    ProductFormValues
  >({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      categoryId: product?.categoryId ?? "",
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      price:
        product?.price !== null && product?.price !== undefined
          ? product.price.toFixed(2).replace(".", ",")
          : "",
      priceOnRequest: product?.priceOnRequest ?? false,
      isCustomizable: product?.isCustomizable ?? true,
      customizationNotes: product?.customizationNotes ?? "",
      dimensions: product?.dimensions ?? "",
      materials: product?.materials ?? "",
      productionTime: product?.productionTime ?? "",
      minQuantity: product?.minQuantity ?? 1,
      mainImageUrl: product?.mainImageUrl ?? "",
      mainImagePath: product?.mainImagePath ?? "",
      mainImageAlt: product?.mainImageAlt ?? "",
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      sortOrder: product?.sortOrder ?? 0,
      galleryJson: JSON.stringify(initialGallery),
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = form;

  const priceOnRequest = useWatch({ control, name: "priceOnRequest" });
  const mainImagePath = useWatch({ control, name: "mainImagePath" });
  const isCustomizable = useWatch({ control, name: "isCustomizable" });
  const name = useWatch({ control, name: "name" });
  const slugValue = useWatch({ control, name: "slug" });

  const updateGallery = (items: GalleryImageItem[]) => {
    setGallery(items);
    setValue("galleryJson", JSON.stringify(items), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSaving(true);
    try {
      const formData = new FormData();
      if (product?.id) formData.set("id", product.id);
      formData.set("name", values.name);
      formData.set("slug", values.slug);
      formData.set("categoryId", values.categoryId);
      formData.set("shortDescription", values.shortDescription);
      formData.set("description", values.description);
      formData.set("price", values.price);
      formData.set("priceOnRequest", String(values.priceOnRequest));
      formData.set("isCustomizable", String(values.isCustomizable));
      formData.set("customizationNotes", values.customizationNotes);
      formData.set("dimensions", values.dimensions);
      formData.set("materials", values.materials);
      formData.set("productionTime", values.productionTime);
      formData.set("minQuantity", String(values.minQuantity));
      formData.set("mainImageUrl", values.mainImageUrl);
      formData.set("mainImagePath", values.mainImagePath);
      formData.set("mainImageAlt", values.mainImageAlt);
      formData.set("isActive", String(values.isActive));
      formData.set("isFeatured", String(values.isFeatured));
      formData.set("sortOrder", String(values.sortOrder));
      formData.set(
        "galleryJson",
        JSON.stringify(
          gallery.map((item) => ({
            url: item.url,
            path: item.path,
            alt: item.alt,
          })),
        ),
      );

      const result = await saveProductAction(formData);
      if (!result.ok) {
        setFormError(result.message);
        if (result.fieldErrors) {
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            if (key === "_form") continue;
            setError(key as keyof ProductFormValues, {
              type: "server",
              message: messages[0],
            });
          }
        }
        toast.error(result.message);
        return;
      }

      toast.success(
        result.message ?? "Produto salvo com sucesso.",
      );
      router.push(
        `/admin/produtos?ok=${product ? "atualizado" : "criado"}`,
      );
      router.refresh();
    } catch (submitError) {
      console.error(submitError);
      setFormError("Não foi possível salvar o produto. Tente novamente.");
      toast.error("Não foi possível salvar o produto.");
    } finally {
      setSaving(false);
    }
  });

  return (
    <div className="pb-20">
      <header className="flex flex-col gap-4 border-b border-line/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/produtos"
            className="inline-flex items-center gap-1.5 text-[0.68rem] font-medium text-muted transition hover:text-brand"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Produtos
          </Link>
          <h1 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
            {product ? "Editar produto" : "Novo produto"}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {product
              ? "Atualize as informações e salve para refletir na loja."
              : "Preencha os dados principais. Você poderá ajustar depois."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {product ? (
            <a
              href={`/produtos/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: "ghost", size: "md" })}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Ver na loja
            </a>
          ) : null}
          <Button
            type="submit"
            form="product-form"
            size="md"
            loading={saving}
          >
            {!saving ? <Save className="h-4 w-4" aria-hidden="true" /> : null}
            {product ? "Salvar alterações" : "Criar produto"}
          </Button>
        </div>
      </header>

      {formError ? (
        <Alert tone="error" className="mt-5">
          {formError}
        </Alert>
      ) : null}

      <form
        id="product-form"
        onSubmit={onSubmit}
        className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]"
      >
        <div className="space-y-5">
          <AdminSection
            title="Informações principais"
            description="Nome, endereço no site e descrições apresentadas ao cliente."
          >
            <div className="grid gap-4">
              <Field
                label="Nome do produto"
                htmlFor="name"
                required
                error={errors.name?.message}
              >
                <Input
                  id="name"
                  placeholder="Ex.: Caixinha jardim encantado"
                  maxLength={120}
                  {...register("name")}
                />
              </Field>

              <Field
                label="Endereço no site (slug)"
                htmlFor="slug"
                hint={`A página ficará em /produtos/${slugValue || slugify(name || "") || "nome-do-produto"}`}
                error={errors.slug?.message}
              >
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    placeholder="caixinha-jardim-encantado"
                    maxLength={80}
                    {...register("slug")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() =>
                      setValue("slug", slugify(name || ""), {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    disabled={!name}
                    className="shrink-0"
                  >
                    <WandSparkles className="h-4 w-4" aria-hidden="true" />
                    Gerar
                  </Button>
                </div>
              </Field>

              <Field
                label="Descrição curta"
                htmlFor="shortDescription"
                optional
                hint="Aparece na vitrine, com até 2 linhas."
                error={errors.shortDescription?.message}
              >
                <Textarea
                  id="shortDescription"
                  placeholder="Uma frase delicada que resume a peça."
                  maxLength={220}
                  className="min-h-20"
                  {...register("shortDescription")}
                />
              </Field>

              <Field
                label="Descrição completa"
                htmlFor="description"
                optional
                hint="Detalhes, inspirações e o que está incluso."
                error={errors.description?.message}
              >
                <Textarea
                  id="description"
                  placeholder="Conte a história do produto, materiais e possibilidades."
                  maxLength={6000}
                  className="min-h-36"
                  {...register("description")}
                />
              </Field>
            </div>
          </AdminSection>

          <AdminSection
            title="Preço e pedido"
            description="Valores são referências e sempre confirmados com a cliente."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Preço unitário"
                htmlFor="price"
                optional
                hint={
                  priceOnRequest
                    ? "Desativado porque o valor está sob consulta."
                    : "Use vírgula para centavos. Ex.: 12,50."
                }
                error={errors.price?.message}
              >
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted">
                    R$
                  </span>
                  <Input
                    id="price"
                    inputMode="decimal"
                    placeholder="0,00"
                    maxLength={20}
                    className="pl-9"
                    disabled={priceOnRequest}
                    {...register("price")}
                  />
                </div>
              </Field>

              <Field
                label="Quantidade mínima"
                htmlFor="minQuantity"
                required
                hint="Mínimo de unidades por encomenda."
                error={errors.minQuantity?.message}
              >
                <Input
                  id="minQuantity"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={9999}
                  {...register("minQuantity", { valueAsNumber: true })}
                />
              </Field>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-line bg-cream/40 p-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-line accent-[var(--brand)]"
                  {...register("priceOnRequest")}
                />
                <span>
                  <span className="block text-xs font-semibold text-ink">
                    Preço sob consulta
                  </span>
                  <span className="mt-0.5 block text-[0.65rem] text-muted">
                    Exibe “Sob consulta” no lugar do valor.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-line bg-cream/40 p-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-line accent-[var(--brand)]"
                  {...register("isCustomizable")}
                />
                <span>
                  <span className="block text-xs font-semibold text-ink">
                    Produto personalizável
                  </span>
                  <span className="mt-0.5 block text-[0.65rem] text-muted">
                    Mostra o selo “Personalizável” na loja.
                  </span>
                </span>
              </label>
            </div>

            {isCustomizable ? (
              <div className="mt-4">
                <Field
                  label="Observações de personalização"
                  htmlFor="customizationNotes"
                  optional
                  hint="O que pode ser combinado (tema, cores, nome, etc.)."
                  error={errors.customizationNotes?.message}
                >
                  <Textarea
                    id="customizationNotes"
                    placeholder="Ex.: capa com nome e idade, cores alinhadas ao tema."
                    maxLength={1200}
                    {...register("customizationNotes")}
                  />
                </Field>
              </div>
            ) : null}
          </AdminSection>

          <AdminSection
            title="Detalhes técnicos"
            description="Informações opcionais. Campos vazios não aparecem na loja."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Dimensões"
                htmlFor="dimensions"
                optional
                error={errors.dimensions?.message}
              >
                <Input
                  id="dimensions"
                  placeholder="Ex.: 10 × 10 × 8 cm"
                  maxLength={160}
                  {...register("dimensions")}
                />
              </Field>
              <Field
                label="Materiais"
                htmlFor="materials"
                optional
                error={errors.materials?.message}
              >
                <Input
                  id="materials"
                  placeholder="Ex.: papel cartão, fita de cetim"
                  maxLength={240}
                  {...register("materials")}
                />
              </Field>
              <Field
                label="Prazo estimado"
                htmlFor="productionTime"
                optional
                error={errors.productionTime?.message}
              >
                <Input
                  id="productionTime"
                  placeholder="Ex.: 10 dias úteis"
                  maxLength={160}
                  {...register("productionTime")}
                />
              </Field>
              <Field
                label="Ordem de exibição"
                htmlFor="sortOrder"
                hint="Números menores aparecem primeiro."
                error={errors.sortOrder?.message}
              >
                <Input
                  id="sortOrder"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={9999}
                  {...register("sortOrder", { valueAsNumber: true })}
                />
              </Field>
            </div>
          </AdminSection>

          <AdminSection
            title="Galeria de imagens"
            description="Fotos adicionais que aparecem na página do produto."
          >
            <GalleryField items={gallery} onChange={updateGallery} />
            {errors.galleryJson?.message ? (
              <p role="alert" className="mt-2 text-[0.68rem] text-[#a34f47]">
                {errors.galleryJson.message}
              </p>
            ) : null}
          </AdminSection>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <AdminSection
            title="Publicação"
            description="Controle onde o produto aparece."
          >
            <div className="space-y-2">
              <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-line bg-cream/40 p-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-line accent-[var(--brand)]"
                  {...register("isActive")}
                />
                <span>
                  <span className="block text-xs font-semibold text-ink">
                    Produto ativo
                  </span>
                  <span className="mt-0.5 block text-[0.65rem] text-muted">
                    Inativos não aparecem na loja pública.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-line bg-cream/40 p-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-line accent-[var(--brand)]"
                  {...register("isFeatured")}
                />
                <span>
                  <span className="block text-xs font-semibold text-ink">
                    Destaque na homepage
                  </span>
                  <span className="mt-0.5 block text-[0.65rem] text-muted">
                    Aparece na vitrine principal.
                  </span>
                </span>
              </label>
            </div>

            {errors.isActive?.message ? (
              <p className="mt-2 text-[0.68rem] text-[#a34f47]">
                {errors.isActive.message}
              </p>
            ) : null}

            <div className="mt-4">
              <Button
                type="submit"
                size="md"
                loading={saving}
                className="w-full"
              >
                {!saving ? (
                  <Save className="h-4 w-4" aria-hidden="true" />
                ) : null}
                {product ? "Salvar alterações" : "Criar produto"}
              </Button>
              <Link
                href="/admin/produtos"
                className="mt-2 block text-center text-[0.7rem] font-medium text-muted hover:text-ink"
              >
                Cancelar e voltar
              </Link>
            </div>
          </AdminSection>

          <AdminSection title="Categoria" description="Ajuda a organizar a vitrine.">
            <Field
              label="Categoria"
              htmlFor="categoryId"
              optional
              error={errors.categoryId?.message}
            >
              <Select id="categoryId" {...register("categoryId")}>
                <option value="">Sem categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </Field>
            {categories.length === 0 ? (
              <p className="mt-2 text-[0.68rem] leading-relaxed text-muted">
                Nenhuma categoria cadastrada. Você pode criar uma em{" "}
                <Link
                  href="/admin/categorias"
                  className="font-semibold text-brand hover:underline"
                >
                  Categorias
                </Link>
                .
              </p>
            ) : null}
          </AdminSection>

          <AdminSection
            title="Imagem principal"
            description="A primeira foto que aparece na vitrine e no detalhe."
          >
            <div className="space-y-4">
              <ImageField
                id="main-image"
                label="Foto de capa"
                folder="products"
                path={mainImagePath}
                initialUrl={product?.mainImageUrl ?? null}
                aspect="aspect-[4/5]"
                onChange={(next) => {
                  setValue("mainImagePath", next.path, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setValue("mainImageUrl", next.url ?? "", {
                    shouldDirty: true,
                  });
                }}
              />

              <Field
                label="Texto alternativo da capa"
                htmlFor="mainImageAlt"
                optional
                hint="Descreva a foto para acessibilidade e SEO."
                error={errors.mainImageAlt?.message}
              >
                <Input
                  id="mainImageAlt"
                  placeholder="Ex.: caixinha rosa com laço de cetim"
                  maxLength={180}
                  {...register("mainImageAlt")}
                />
              </Field>

              {errors.mainImagePath?.message ? (
                <p role="alert" className="text-[0.68rem] text-[#a34f47]">
                  {errors.mainImagePath.message}
                </p>
              ) : null}
            </div>
          </AdminSection>

          <div className="rounded-xl border border-line/70 bg-blush/15 p-4">
            <p className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand">
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              Valores e prazo
            </p>
            <p className="mt-1.5 text-[0.68rem] leading-relaxed text-muted">
              Preço, disponibilidade, frete e prazo são referências. A cliente
              confirma tudo com você pelo WhatsApp.
            </p>
          </div>
        </aside>
      </form>

      {saving ? (
        <div className="fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-medium text-cream shadow-lg">
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          Salvando produto…
        </div>
      ) : null}
    </div>
  );
}
