"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "./button";

export function ConfirmAction({
  action,
  fields,
  trigger,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
}: {
  action: (formData: FormData) => void | Promise<void>;
  fields: Record<string, string>;
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setOpen(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  return (
    <form ref={formRef} action={action}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center justify-center rounded-full px-2.5 text-xs font-medium text-muted transition hover:bg-cream hover:text-ink"
      >
        {trigger}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="m-auto w-[min(92vw,28rem)] rounded-2xl border border-line bg-ivory p-0 shadow-2xl"
      >
        <div className="p-6">
          <h2 id={titleId} className="font-display text-2xl text-ink">
            {title}
          </h2>
          <p id={descriptionId} className="mt-2 text-sm leading-relaxed text-muted">
            {description}
          </p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={variant}
              size="sm"
              onClick={() => {
                setOpen(false);
                formRef.current?.requestSubmit();
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </dialog>
    </form>
  );
}
