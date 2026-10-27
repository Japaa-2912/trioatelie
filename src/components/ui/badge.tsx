import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "sage" | "rose" | "sky" | "dark";
  className?: string;
}) {
  const tones = {
    neutral: "border-line bg-cream text-muted",
    brand: "border-brand/20 bg-brand/10 text-brand",
    sage: "border-[#9fb09a]/30 bg-[#eef3ea] text-[#61775a]",
    rose: "border-[#d6a79d]/30 bg-[#fbece8] text-[#95645b]",
    sky: "border-[#a9c2cb]/40 bg-[#eef5f7] text-[#5d7d88]",
    dark: "border-ink/10 bg-ink text-cream",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
