"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, LoaderCircle, Trash, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getBrowserSupabase } from "@/lib/supabase/client";
import {
  IMAGE_ACCEPT,
  removeUploadedImage,
  uploadImage,
  type UploadFolder,
} from "@/lib/upload";
import { storagePublicUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

export function ImageField({
  id,
  label,
  hint,
  folder,
  path,
  initialUrl,
  onChange,
  aspect = "aspect-[4/3]",
  disabled = false,
}: {
  id: string;
  label: string;
  hint?: string;
  folder: UploadFolder;
  path: string;
  initialUrl?: string | null;
  onChange: (next: { path: string; url: string | null }) => void;
  aspect?: string;
  disabled?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastUploadedPath = useRef<string | null>(null);
  const previousPath = useRef(path);
  const configured = Boolean(getBrowserSupabase());

  useEffect(() => {
    if (path === previousPath.current) return;
    previousPath.current = path;
    setPreview(path ? storagePublicUrl(path) : null);
  }, [path]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const uploaded = await uploadImage(file, folder);
      const previous = lastUploadedPath.current;
      if (previous && previous !== uploaded.path) {
        void removeUploadedImage(previous);
      }
      lastUploadedPath.current = uploaded.path;
      previousPath.current = uploaded.path;
      setPreview(uploaded.url);
      onChange({ path: uploaded.path, url: uploaded.url });
      toast.success("Imagem enviada", {
        description: "Salve o formulário para publicar a alteração.",
      });
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Não foi possível enviar a imagem.";
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    if (!path) return;
    if (lastUploadedPath.current === path) {
      void removeUploadedImage(path);
    }
    lastUploadedPath.current = null;
    previousPath.current = "";
    setPreview(null);
    onChange({ path: "", url: null });
    setError(null);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-xs font-semibold text-ink">
          {label}
        </label>
        {hint ? (
          <span className="text-[0.62rem] text-muted/70">{hint}</span>
        ) : null}
      </div>

      <div
        className={cn(
          "mt-1.5 overflow-hidden rounded-xl border border-dashed border-line bg-cream/50",
          preview ? "border-solid" : "",
        )}
      >
        <div className={cn("relative w-full", aspect)}>
          {preview ? (
            <Image
              src={preview}
              alt={label}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted/60">
              <ImagePlus className="h-8 w-8" strokeWidth={1.2} aria-hidden="true" />
              <span className="text-[0.68rem]">Nenhuma imagem enviada</span>
            </div>
          )}
          {uploading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/45 text-cream backdrop-blur-sm">
              <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span className="text-[0.68rem] font-medium">Enviando…</span>
            </div>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={IMAGE_ACCEPT}
        className="sr-only"
        disabled={disabled || uploading}
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || uploading || !configured}
          onClick={() => inputRef.current?.click()}
        >
          {preview ? (
            <>
              <Upload className="h-3.5 w-3.5" aria-hidden="true" />
              Trocar imagem
            </>
          ) : (
            <>
              <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
              Selecionar imagem
            </>
          )}
        </Button>
        {preview ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled || uploading}
            onClick={handleRemove}
            className="text-[#a34f47] hover:bg-[#fbeeeb]"
          >
            <Trash className="h-3.5 w-3.5" aria-hidden="true" />
            Remover
          </Button>
        ) : null}
      </div>

      {!configured ? (
        <p className="mt-1.5 text-[0.65rem] leading-relaxed text-[#8a6b3e]">
          Configure o Supabase no .env.local para habilitar o envio de imagens.
        </p>
      ) : (
        <p className="mt-1.5 text-[0.65rem] leading-relaxed text-muted/70">
          JPEG, PNG ou WebP • até 5 MB. A imagem é enviada ao Storage antes de
          salvar.
        </p>
      )}
      {error ? (
        <p role="alert" className="mt-1 text-[0.68rem] font-medium text-[#a34f47]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
