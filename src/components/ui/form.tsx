import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const baseField =
  "w-full rounded-xl border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink shadow-[inset_0_1px_0_rgba(255,255,255,.6)] transition placeholder:text-muted/55 focus:border-brand/55 focus:outline-none focus:ring-2 focus:ring-brand/15 disabled:cursor-not-allowed disabled:bg-cream disabled:opacity-70";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(baseField, "min-h-11", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(baseField, "min-h-28 resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(baseField, "min-h-11 appearance-none pr-9", className)}
      {...props}
    >
      {children}
    </select>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
  optional,
}: {
  label: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string | string[];
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const errorText = Array.isArray(error) ? error[0] : error;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-baseline justify-between gap-3 text-xs font-semibold text-ink"
      >
        <span>
          {label}
          {required ? <span className="ml-0.5 text-brand">*</span> : null}
        </span>
        {optional ? (
          <span className="text-[0.625rem] font-medium text-muted/70">
            opcional
          </span>
        ) : null}
      </label>
      {children}
      {hint && !errorText ? (
        <p className="text-[0.7rem] leading-relaxed text-muted/80">{hint}</p>
      ) : null}
      {errorText ? (
        <p role="alert" className="text-[0.7rem] font-medium text-[#a34f47]">
          {errorText}
        </p>
      ) : null}
    </div>
  );
}

export function CheckboxField({
  label,
  description,
  id,
  name,
  checked,
  defaultChecked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  id: string;
  name: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-ivory/70 p-3.5 transition hover:border-brand/30",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-[var(--brand)]"
      />
      <span>
        <span className="block text-xs font-semibold text-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-[0.7rem] leading-relaxed text-muted">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
