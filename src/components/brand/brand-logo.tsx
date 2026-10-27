import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  brandName: string;
  tagline?: string | null;
  logoUrl?: string | null;
  className?: string;
  tone?: "default" | "inverse";
  size?: "sm" | "md" | "lg";
  href?: string | null;
};

const nameSize = {
  sm: "text-lg",
  md: "text-xl md:text-2xl",
  lg: "text-2xl md:text-3xl",
};

export function BrandLogo({
  brandName,
  tagline,
  logoUrl,
  className,
  tone = "default",
  size = "md",
  href = "/",
}: BrandLogoProps) {
  const content = (
    <span className={cn("group inline-flex items-center gap-3", className)}>
      {logoUrl ? (
        <span
          className={cn(
            "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border",
            tone === "inverse"
              ? "border-white/20 bg-white/90"
              : "border-line bg-ivory",
          )}
        >
          <Image
            src={logoUrl}
            alt={`Logotipo de ${brandName}`}
            width={44}
            height={44}
            className="h-full w-full object-contain p-1"
          />
        </span>
      ) : (
        <BrandMark
          className={cn(
            "shrink-0 transition-transform duration-500 group-hover:rotate-6",
            size === "sm" ? "h-9 w-9" : "h-11 w-11",
            tone === "inverse" && "drop-shadow-sm",
          )}
        />
      )}
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "font-display leading-none tracking-tight",
            nameSize[size],
            tone === "inverse" ? "text-cream" : "text-ink",
          )}
        >
          {brandName}
        </span>
        {tagline ? (
          <span
            className={cn(
              "mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.22em]",
              tone === "inverse" ? "text-cream/60" : "text-muted/80",
            )}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label={`${brandName} — página inicial`}>
      {content}
    </Link>
  );
}
