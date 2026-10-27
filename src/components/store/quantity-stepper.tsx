"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CART_MAX_QUANTITY } from "@/lib/cart";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = CART_MAX_QUANTITY,
  size = "md",
  label = "Quantidade",
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  const buttonSize = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const inputWidth = size === "sm" ? "w-8 text-xs" : "w-11 text-sm";
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-ivory p-1",
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Diminuir quantidade"
        className={cn(
          "flex items-center justify-center rounded-full text-muted transition hover:bg-cream hover:text-ink disabled:opacity-35",
          buttonSize,
        )}
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        className={cn(
          "text-center font-semibold tabular-nums text-ink",
          inputWidth,
        )}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
        className={cn(
          "flex items-center justify-center rounded-full text-muted transition hover:bg-cream hover:text-ink disabled:opacity-35",
          buttonSize,
        )}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
