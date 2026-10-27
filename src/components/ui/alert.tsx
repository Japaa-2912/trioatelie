import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function Alert({
  children,
  tone = "info",
  title,
  className,
}: {
  children?: ReactNode;
  tone?: "info" | "success" | "error" | "warning";
  title?: string;
  className?: string;
}) {
  const config = {
    info: {
      icon: Info,
      classes: "border-[#b9cbd1]/60 bg-[#f2f7f8] text-[#55717a]",
    },
    success: {
      icon: CircleCheck,
      classes: "border-[#a9bda2]/60 bg-[#f2f7ef] text-[#5e7556]",
    },
    error: {
      icon: CircleAlert,
      classes: "border-[#d8a9a1]/60 bg-[#fbf0ee] text-[#985b52]",
    },
    warning: {
      icon: CircleAlert,
      classes: "border-[#ddc39d]/70 bg-[#fbf5ea] text-[#8a6b3e]",
    },
  }[tone];
  const Icon = config.icon;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-xl border px-4 py-3 text-xs leading-relaxed",
        config.classes,
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={cn(title && "mt-1")}>{children}</div> : null}
      </div>
    </div>
  );
}
