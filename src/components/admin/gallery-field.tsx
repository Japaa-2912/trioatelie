"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  LoaderCircle,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import {
  IMAGE_ACCEPT,
  removeUploadedImage,
  uploadImage,
  type UploadFolder,
} from "@/lib/upload";

export type GalleryImageItem = {
  url: string;
  path: string;
  alt: string;
};

const MAX_GALLERY = 10;

export function GalleryField({
  items,
  onChange,
  folder = "products",
  disabled = false,
}: {
  items: GalleryImageItem[];
  onChange: (items: GalleryImageItem[]) => void;
  folder?: UploadFolder;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const sessionUploads = useRef<Set<string>>(new Set());

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const remaining = MAX_GALLERY - items.length;
    if (remaining <= 0) {
      toast.error(`A galeria aceita no máximo ${MAX_GALLERY} imagens.`);
      return;
    }
    const selected = Array.from(files).slice(0, remaining);
    if (files.length > remaining) {
      toast.info(
        `Apenas ${remaining} ${remaining === 1 ? "imagem foi adicionada" : "imagens foram adicionadas"} por limite da galeria.`,
      );
    }

    setUploading(true);
    try {
      const results = await Promise.allSettled(
        selected.map((file) => uploadImage(file, folder)),
      );
      const uploaded: GalleryImageItem[] = [];
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          sessionUploads.current.add(result.value.path);
          uploaded.push({ ...result.value, alt: "" });
        }
      });
      const failed = results.filter((result) => result.status === "rejected");
      if (uploaded.length > 0) {
        onChange([...items, ...uploaded]);
        toast.success(
          uploaded.length === 1
            ? "Imagem adicionada à galeria"
            : `${uploaded.length} imagens adicionadas à galeria`,
        );
      }
      if (failed.length > 0) {
        toast.error(
          failed.length === 1
            ? "Uma imagem não pôde ser enviada. Verifique o formato e o tamanho."
            : `${failed.length} imagens não puderam ser enviadas.`,
        );
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const update = (index: number, patch: Partial<GalleryImageItem>) => {
    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  };

  const remove = (index: number) => {
    const item = items[index];
    if (item?.path && sessionUploads.current.has(item.path)) {
      void removeUploadedImage(item.path);
      sessionUploads.current.delete(item.path);
    }
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-semibold text-ink">Galeria de imagens</p>
        <span className="text-[0.62rem] text-muted/70">
          {items.length} de {MAX_GALLERY}
        </span>
      </div>
      <p className="mt-1 text-[0.65rem] leading-relaxed text-muted/70">
        A primeira imagem principal aparece separadamente. Aqui você pode
        adicionar fotos extras do produto.
      </p>

      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={`${item.path}-${index}`}
            className="overflow-hidden rounded-xl border border-line bg-cream/40"
          >
            <div className="relative aspect-[4/3] w-full bg-cream">
              <Image
                src={item.url}
                alt={item.alt || `Imagem ${index + 1} da galeria`}
                fill
                sizes="(max-width: 640px) 90vw, 260px"
                className="object-cover"
              />
              <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-[0.55rem] font-semibold text-cream">
                {index + 1}
              </span>
            </div>
            <div className="p-2.5">
              <label
                htmlFor={`gallery-alt-${index}`}
                className="text-[0.6rem] font-medium text-muted"
              >
                Texto alternativo
              </label>
              <Input
                id={`gallery-alt-${index}`}
                value={item.alt}
                onChange={(event) => update(index, { alt: event.target.value })}
                placeholder="Descreva a imagem"
                maxLength={180}
                disabled={disabled}
                className="mt-1 min-h-9 px-2.5 py-1.5 text-xs"
              />
              <div className="mt-2 flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0 || disabled}
                    aria-label={`Mover imagem ${index + 1} para cima`}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-white hover:text-ink disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1 || disabled}
                    aria-label={`Mover imagem ${index + 1} para baixo`}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-white hover:text-ink disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={disabled}
                  className="inline-flex h-7 items-center gap-1 rounded-full px-2 text-[0.65rem] font-medium text-[#a34f47] transition hover:bg-[#fbeeeb]"
                >
                  <Trash className="h-3 w-3" aria-hidden="true" />
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        multiple
        className="sr-only"
        disabled={disabled || uploading}
        onChange={(event) => handleFiles(event.target.files)}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading || items.length >= MAX_GALLERY}
        className="mt-3"
      >
        {uploading ? (
          <>
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Enviando…
          </>
        ) : (
          <>
            <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
            Adicionar imagens
          </>
        )}
      </Button>
      <p className="mt-1.5 text-[0.65rem] leading-relaxed text-muted/70">
        JPEG, PNG ou WebP • até 5 MB por imagem. Salve o produto para publicar a
        galeria.
      </p>
    </div>
  );
}
