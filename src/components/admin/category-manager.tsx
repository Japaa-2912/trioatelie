"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CircleCheck,
  CircleSlash,
  FolderOpen,
  Pencil,
  Plus,
  Save,
  Star,
  Trash,
  WandSparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  CategoryGlyph,
  categoryToneClass,
} from "@/components/brand/illustrations";
import { ImageField } from "@/components/admin/image-field";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmAction } from "@/components/ui/confirm-dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import {
  deleteCategoryAction,
  saveCategoryAction,
  toggleCategoryActiveAction,
  toggleCategoryFeaturedAction,
} from "@/lib/actions/categories";
import { slugify } from "@/lib/utils";
import type { Category, CategoryIcon, CategoryTone } from "@/types/store";

const ICON_OPTIONS: { value: CategoryIcon; label: string }[] = [
  { value: "gift", label: "Presente" },
  { value: "notebook", label: "Caderno" },
  { value: "package", label: "Caixa" },
  { value: "sparkles", label: "Encantamento" },
  { value: "heart", label: "Coração" },
  { value: "star", label: "Estrela" },
  { value: "ribbon", label: "Laço" },
];

const TONE_OPTIONS: {
  value: CategoryTone;
  label: string;
  swatch: string;
}[] = [
  { value: "blush", label: "Rosa suave", swatch: "#f4dfda" },
  { value: "sage", label: "Verde sage", swatch: "#e2e9dd" },
  { value: "sky", label: "Azul poeira", swatch: "#e1eaed" },
  { value: "peach", label: "Pêssego", swatch: "#f6e7da" },
  { value: "sand", label: "Areia", swatch: "#eee4d6" },
];

export function CategoryManager({
  categories,
  productCounts,
}: {
  categories: Category[];
  productCounts: Record<string, number>;
}) {
  const [editing, setEditing] = useState<Category | "new" | null>(null);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.68rem] font-medium text-muted">
          {categories.length === 0
            ? "Nenhuma categoria cadastrada"
            : `${categories.length} ${categories.length === 1 ? "categoria" : "categorias"} no total`}
        </p>
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => setEditing("new")}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nova categoria
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-line bg-ivory px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blush/35 text-brand">
            <FolderOpen className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-2xl text-ink">
            Organize a vitrine por categorias
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            Crie categorias como caixinhas, cadernos ou kits para ajudar as
            clientes a encontrar o que procuram. Os produtos também podem ficar
            sem categoria.
          </p>
          <Button
            type="button"
            variant="primary"
            size="md"
            className="mt-5"
            onClick={() => setEditing("new")}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Criar primeira categoria
          </Button>
        </div>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {categories.map((category) => {
            const count = productCounts[category.id] ?? 0;
            return (
              <li
                key={category.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line/80 bg-ivory transition hover:border-brand/25"
              >
                <div className="flex gap-3 p-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line/70 bg-cream">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt=""
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    ) : (
                      <span
                        className={`flex h-full w-full items-center justify-center ${categoryToneClass(category.tone)}`}
                      >
                        <CategoryGlyph icon={category.icon} className="h-7 w-7" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone={category.isActive ? "sage" : "neutral"}>
                        {category.isActive ? "Ativa" : "Inativa"}
                      </Badge>
                      {category.isFeatured ? (
                        <Badge tone="brand">
                          <Star className="h-3 w-3" aria-hidden="true" />
                          Home
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1.5 truncate font-display text-xl leading-tight text-ink">
                      {category.name}
                    </p>
                    <p className="mt-0.5 truncate text-[0.65rem] text-muted/70">
                      /categorias/{category.slug}
                    </p>
                    <p className="mt-1 text-[0.62rem] text-muted">
                      {count === 0
                        ? "Nenhum produto vinculado"
                        : `${count} ${count === 1 ? "produto" : "produtos"}`}{" "}
                      • ordem {category.sortOrder}
                    </p>
                  </div>
                </div>

                {category.description ? (
                  <p className="mx-4 -mt-1 line-clamp-2 text-[0.68rem] leading-relaxed text-muted">
                    {category.description}
                  </p>
                ) : null}

                <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-line/60 bg-cream/40 px-4 py-2.5">
                  <Link
                    href={`/categorias/${category.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1 rounded-full px-2 text-[0.62rem] font-medium text-muted transition hover:bg-ivory hover:text-ink"
                  >
                    Ver na loja
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>

                  <form action={toggleCategoryFeaturedAction}>
                    <input type="hidden" name="id" value={category.id} />
                    <input
                      type="hidden"
                      name="next"
                      value={String(!category.isFeatured)}
                    />
                    <button
                      type="submit"
                      title={
                        category.isFeatured
                          ? "Remover da homepage"
                          : "Destacar na homepage"
                      }
                      className={
                        category.isFeatured
                          ? "flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand"
                          : "flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-ivory hover:text-brand"
                      }
                    >
                      <Star
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                        fill={category.isFeatured ? "currentColor" : "none"}
                      />
                      <span className="sr-only">
                        {category.isFeatured
                          ? `Remover ${category.name} dos destaques`
                          : `Destacar ${category.name} na homepage`}
                      </span>
                    </button>
                  </form>

                  <form action={toggleCategoryActiveAction}>
                    <input type="hidden" name="id" value={category.id} />
                    <input
                      type="hidden"
                      name="next"
                      value={String(!category.isActive)}
                    />
                    <button
                      type="submit"
                      className="inline-flex h-8 items-center gap-1 rounded-full px-2 text-[0.62rem] font-semibold text-muted transition hover:bg-ivory hover:text-ink"
                    >
                      {category.isActive ? (
                        <CircleSlash className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <CircleCheck className="h-3 w-3" aria-hidden="true" />
                      )}
                      {category.isActive ? "Desativar" : "Ativar"}
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={() => setEditing(category)}
                    className="ml-auto inline-flex h-8 items-center gap-1 rounded-full border border-line px-2.5 text-[0.62rem] font-semibold text-muted transition hover:border-brand/40 hover:text-ink"
                  >
                    <Pencil className="h-3 w-3" aria-hidden="true" />
                    Editar
                  </button>

                  <ConfirmAction
                    action={deleteCategoryAction}
                    fields={{ id: category.id }}
                    title="Excluir categoria?"
                    description={
                      count > 0
                        ? `"${category.name}" será excluída. Os ${count} ${count === 1 ? "produto vinculado continuará" : "produtos vinculados continuarão"} no catálogo, mas sem categoria. Esta ação não pode ser desfeita.`
                        : `"${category.name}" será excluída do catálogo. Esta ação não pode ser desfeita.`
                    }
                    confirmLabel="Excluir categoria"
                    trigger={
                      <>
                        <Trash className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only">
                          Excluir {category.name}
                        </span>
                      </>
                    }
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Nova categoria" : "Editar categoria"}
        description="A categoria organiza a vitrine. Você pode deixá-la oculta enquanto prepara o conteúdo."
        wide
      >
        {editing !== null ? (
          <CategoryForm
            key={editing === "new" ? "new" : editing.id}
            category={editing === "new" ? null : editing}
            nextSortOrder={
              categories.reduce(
                (highest, item) => Math.max(highest, item.sortOrder),
                0,
              ) + 10
            }
            onDone={() => setEditing(null)}
          />
        ) : null}
      </Modal>
    </>
  );
}

function CategoryForm({
  category,
  nextSortOrder,
  onDone,
}: {
  category: Category | null;
  nextSortOrder: number;
  onDone: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [icon, setIcon] = useState<CategoryIcon>(category?.icon ?? "gift");
  const [tone, setTone] = useState<CategoryTone>(category?.tone ?? "blush");
  const [sortOrder, setSortOrder] = useState(
    String(category?.sortOrder ?? nextSortOrder),
  );
  const [isFeatured, setIsFeatured] = useState(category?.isFeatured ?? false);
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [imagePath, setImagePath] = useState(category?.imagePath ?? "");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    setFieldErrors({});

    try {
      const formData = new FormData();
      if (category?.id) formData.set("id", category.id);
      formData.set("name", name);
      formData.set("slug", slug);
      formData.set("description", description);
      formData.set("icon", icon);
      formData.set("tone", tone);
      formData.set("imagePath", imagePath);
      formData.set("sortOrder", sortOrder || "0");
      formData.set("isFeatured", String(isFeatured));
      formData.set("isActive", String(isActive));

      const result = await saveCategoryAction(formData);
      if (!result.ok) {
        setFormError(result.message);
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      toast.success(result.message ?? "Categoria salva.");
      router.refresh();
      onDone();
    } catch (error) {
      console.error(error);
      setFormError("Não foi possível salvar a categoria. Tente novamente.");
      toast.error("Não foi possível salvar a categoria.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {formError ? <Alert tone="error">{formError}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nome da categoria"
          htmlFor="category-name"
          required
          error={fieldErrors.name}
        >
          <Input
            id="category-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Caixinhas"
            maxLength={80}
            required
            disabled={saving}
          />
        </Field>

        <Field
          label="Endereço no site (slug)"
          htmlFor="category-slug"
          hint={`/categorias/${slug || slugify(name) || "nome-da-categoria"}`}
          error={fieldErrors.slug}
        >
          <div className="flex gap-2">
            <Input
              id="category-slug"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="caixinhas"
              maxLength={80}
              disabled={saving}
            />
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setSlug(slugify(name))}
              disabled={saving || !name}
              className="shrink-0"
              title="Gerar endereço a partir do nome"
            >
              <WandSparkles className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Gerar endereço</span>
            </Button>
          </div>
        </Field>
      </div>

      <Field
        label="Descrição"
        htmlFor="category-description"
        optional
        hint="Aparece no card da categoria e na página correspondente."
        error={fieldErrors.description}
      >
        <Textarea
          id="category-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Ex.: Caixinhas e embalagens delicadas para a mesa de doces."
          maxLength={400}
          className="min-h-20"
          disabled={saving}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ícone" htmlFor="category-icon" error={fieldErrors.icon}>
          <Select
            id="category-icon"
            value={icon}
            onChange={(event) => setIcon(event.target.value as CategoryIcon)}
            disabled={saving}
          >
            {ICON_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Tom de cor" htmlFor="category-tone" error={fieldErrors.tone}>
          <Select
            id="category-tone"
            value={tone}
            onChange={(event) => setTone(event.target.value as CategoryTone)}
            disabled={saving}
          >
            {TONE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-line bg-cream/40 p-3">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${categoryToneClass(tone)}`}
        >
          <CategoryGlyph icon={icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-ink">Prévia do ícone</p>
          <p className="mt-0.5 text-[0.65rem] text-muted">
            Usado quando a categoria não tem imagem.
          </p>
        </div>
      </div>

      <ImageField
        id="category-image"
        label="Imagem da categoria"
        hint="Opcional"
        folder="categories"
        path={imagePath}
        initialUrl={category?.imageUrl ?? null}
        onChange={(next) => setImagePath(next.path)}
      />
      {fieldErrors.imageUrl ? (
        <p role="alert" className="text-[0.68rem] font-medium text-[#a34f47]">
          {fieldErrors.imageUrl[0]}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
        <Field
          label="Ordem"
          htmlFor="category-order"
          hint="Menor aparece antes."
          error={fieldErrors.sortOrder}
        >
          <Input
            id="category-order"
            type="number"
            inputMode="numeric"
            min={0}
            max={9999}
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            disabled={saving}
          />
        </Field>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-line bg-cream/40 p-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              disabled={saving}
              className="mt-0.5 h-4 w-4 rounded border-line accent-[var(--brand)]"
            />
            <span>
              <span className="block text-xs font-semibold text-ink">
                Categoria ativa
              </span>
              <span className="mt-0.5 block text-[0.65rem] text-muted">
                Visível na loja pública.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-line bg-cream/40 p-3">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(event) => setIsFeatured(event.target.checked)}
              disabled={saving}
              className="mt-0.5 h-4 w-4 rounded border-line accent-[var(--brand)]"
            />
            <span>
              <span className="block text-xs font-semibold text-ink">
                Destaque na home
              </span>
              <span className="mt-0.5 block text-[0.65rem] text-muted">
                Aparece na vitrine principal.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onDone}
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="md" loading={saving}>
          {!saving ? <Save className="h-4 w-4" aria-hidden="true" /> : null}
          {category ? "Salvar alterações" : "Criar categoria"}
        </Button>
      </div>

      {!category ? (
        <p className="text-center text-[0.62rem] leading-relaxed text-muted/60">
          A categoria é criada imediatamente.{" "}
          <Link href="/admin/produtos" className="underline underline-offset-2">
            Depois, vincule produtos a ela
          </Link>
          .
        </p>
      ) : null}
    </form>
  );
}
