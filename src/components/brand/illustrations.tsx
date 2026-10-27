import {
  Gift,
  Heart,
  NotebookPen,
  Package,
  Ribbon as RibbonIcon,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryIcon, CategoryTone } from "@/types/store";

const iconMap: Record<CategoryIcon, LucideIcon> = {
  gift: Gift,
  notebook: NotebookPen,
  package: Package,
  sparkles: Sparkles,
  heart: Heart,
  star: Star,
  ribbon: RibbonIcon,
};

const toneClasses: Record<CategoryTone, string> = {
  blush: "bg-[#f6e5e1] text-[#9b675e]",
  sage: "bg-[#e8eee3] text-[#6e8067]",
  sky: "bg-[#e6eef1] text-[#627b84]",
  peach: "bg-[#f8e9dc] text-[#9c7458]",
  sand: "bg-[#f1e9dd] text-[#826f5b]",
};

const toneHex: Record<CategoryTone, { base: string; deep: string; pale: string }> = {
  blush: { base: "#f4dfda", deep: "#c5968d", pale: "#fbf1ee" },
  sage: { base: "#e2e9dd", deep: "#8fa287", pale: "#f4f7f1" },
  sky: { base: "#e1eaed", deep: "#8fa8b1", pale: "#f3f7f8" },
  peach: { base: "#f6e7da", deep: "#bd967b", pale: "#fcf5ef" },
  sand: { base: "#eee4d6", deep: "#a58e74", pale: "#f9f5ef" },
};

export function CategoryGlyph({
  icon,
  className,
}: {
  icon: CategoryIcon;
  className?: string;
}) {
  const Icon = iconMap[icon] ?? Gift;
  return <Icon className={cn("h-6 w-6", className)} strokeWidth={1.5} />;
}

export function categoryToneClass(tone: CategoryTone) {
  return toneClasses[tone] ?? toneClasses.blush;
}

export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 620 760"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Ilustração de caixas e cadernos personalizados dispostos sobre uma mesa"
    >
      <defs>
        <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f9eee9" />
          <stop offset=".55" stopColor="#f6e5df" />
          <stop offset="1" stopColor="#e9ded0" />
        </linearGradient>
        <linearGradient id="box-lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7e9e4" />
          <stop offset="1" stopColor="#e9c8c0" />
        </linearGradient>
        <filter id="hero-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="hero-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#5f4b41" floodOpacity=".16" />
        </filter>
      </defs>

      <rect width="620" height="760" fill="url(#hero-bg)" />
      <circle cx="470" cy="160" r="180" fill="#fffaf4" opacity=".5" />
      <circle cx="130" cy="600" r="160" fill="#f1dcd6" opacity=".45" />
      <ellipse cx="310" cy="650" rx="230" ry="32" fill="#8c6b5d" opacity=".12" filter="url(#hero-soft)" />

      <path d="M60 650h500" stroke="#b99b8c" strokeOpacity=".35" strokeWidth="1.5" strokeLinecap="round" />

      <g opacity=".8">
        <path d="M160 130c0-20 16-36 36-36s36 16 36 36-36 60-36 60-36-40-36-60Z" fill="#fffaf5" opacity=".75" />
        <circle cx="196" cy="128" r="9" fill="#d8b4a9" />
        <path d="M470 330c0-15 12-27 27-27s27 12 27 27-27 45-27 45-27-30-27-45Z" fill="#fffaf5" opacity=".65" />
        <circle cx="497" cy="329" r="6" fill="#b7c6ae" />
      </g>

      <g filter="url(#hero-shadow)">
        <g transform="rotate(-4 260 520)">
          <rect x="120" y="360" width="270" height="235" rx="14" fill="#f2d7d1" />
          <rect x="120" y="360" width="270" height="235" rx="14" fill="none" stroke="#d9b3a9" strokeOpacity=".6" />
          <rect x="105" y="320" width="300" height="66" rx="12" fill="url(#box-lid)" />
          <rect x="105" y="320" width="300" height="66" rx="12" fill="none" stroke="#d3a99e" strokeOpacity=".5" />
          <rect x="238" y="320" width="34" height="275" fill="#fffaf5" opacity=".85" />
          <rect x="238" y="320" width="34" height="275" fill="none" stroke="#d3a99e" strokeOpacity=".25" />
          <path
            d="M255 322c-30-3-62-13-68-37-5-20 11-35 29-30 22 6 35 36 39 67Z"
            fill="#fbf3ed"
            stroke="#d3a99e"
            strokeOpacity=".45"
          />
          <path
            d="M255 322c29-4 60-16 64-40 3-19-13-33-30-27-22 7-31 38-34 67Z"
            fill="#fbf3ed"
            stroke="#d3a99e"
            strokeOpacity=".45"
          />
          <circle cx="255" cy="322" r="9" fill="#cfa297" />
          <path d="M160 420c23-15 54-18 68 2 8 11 6 27-5 34-14 9-36 4-63-36Z" fill="#fffaf5" opacity=".65" />
        </g>
      </g>

      <g filter="url(#hero-shadow)" transform="rotate(7 420 520)">
        <rect x="342" y="410" width="196" height="258" rx="18" fill="#fdf9f4" />
        <rect x="342" y="410" width="196" height="258" rx="18" fill="none" stroke="#cdb7a7" />
        <rect x="342" y="410" width="54" height="258" rx="18" fill="#aebda5" />
        <rect x="374" y="410" width="22" height="258" fill="#aebda5" />
        <g fill="none" stroke="#7f9178" strokeWidth="4" strokeLinecap="round">
          <path d="M362 448h20" />
          <path d="M362 486h20" />
          <path d="M362 524h20" />
          <path d="M362 562h20" />
          <path d="M362 600h20" />
        </g>
        <rect x="420" y="472" width="86" height="58" rx="8" fill="#f7efe6" />
        <text
          x="463"
          y="496"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="11"
          fill="#8f7768"
          letterSpacing="2"
        >
          PARA VOCÊ
        </text>
        <path d="M446 510h34" stroke="#cfb8a8" strokeLinecap="round" />
        <path d="M440 598c15-20 31-22 47-8 13-20 34-20 46 0" fill="none" stroke="#d7b8ab" strokeWidth="2" />
        <path d="M455 612h56" stroke="#d7b8ab" strokeWidth="2" strokeLinecap="round" />
      </g>

      <g filter="url(#hero-shadow)" transform="rotate(-11 210 250)">
        <rect x="160" y="190" width="140" height="100" rx="6" fill="#fffaf5" />
        <rect x="160" y="190" width="140" height="100" rx="6" fill="none" stroke="#d9c5b5" />
        <path d="M190 240c0-10 8-18 18-18s18 8 18 18-18 28-18 28-18-18-18-28Z" fill="#e6c1b7" />
        <path d="M242 224h38M242 238h38M242 252h24" stroke="#cbb8aa" strokeWidth="2" strokeLinecap="round" />
      </g>

      <g opacity=".9">
        <path d="M108 300v22M97 311h22" stroke="#b6c5ae" strokeWidth="2" strokeLinecap="round" />
        <path d="M512 560v16M504 568h16" stroke="#c7a99d" strokeWidth="2" strokeLinecap="round" />
        <circle cx="530" cy="422" r="4" fill="#c7a99d" />
        <circle cx="96" cy="480" r="3" fill="#a9b8a1" />
        <circle cx="364" cy="176" r="5" fill="#d6bcb0" opacity=".8" />
      </g>

      <g transform="translate(486 636)">
        <path d="M0 0c8-20 24-25 37-18 12-10 28-4 29 10 13 4 16 20 5 27-10 7-54 3-63-2-8-5-12-11-8-17Z" fill="#aebda5" opacity=".85" />
        <path d="M12 14c18 6 30 4 46-3" stroke="#fdf9f4" strokeWidth="2" strokeLinecap="round" opacity=".8" />
      </g>
    </svg>
  );
}

export function ProductPlaceholder({
  icon = "gift",
  tone = "blush",
  className,
  label,
}: {
  icon?: CategoryIcon;
  tone?: CategoryTone;
  className?: string;
  label?: string;
}) {
  const colors = toneHex[tone] ?? toneHex.blush;
  const Icon = iconMap[icon] ?? Gift;
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        className,
      )}
      style={{ background: colors.pale }}
      role="img"
      aria-label={label ?? "Ilustração de lembrancinha personalizada"}
    >
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="58" cy="58" r="110" fill={colors.base} opacity=".7" />
        <circle cx="358" cy="340" r="130" fill={colors.base} opacity=".55" />
        <path
          d="M312 78c0-12 10-22 22-22s22 10 22 22-22 36-22 36-22-24-22-36Z"
          fill="#fffaf4"
          opacity=".8"
        />
        <path d="M76 286v22M65 297h22" stroke={colors.deep} strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" />
        <circle cx="330" cy="146" r="3.5" fill={colors.deep} opacity=".55" />
        <circle cx="92" cy="112" r="2.5" fill={colors.deep} opacity=".4" />
        <path
          d="M64 340c34-28 62-30 96-8 28-22 60-18 84 6"
          fill="none"
          stroke={colors.deep}
          strokeOpacity=".22"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div
        className="relative flex h-28 w-28 items-center justify-center rounded-full border shadow-sm"
        style={{
          background: "rgba(255,253,249,.78)",
          borderColor: colors.base,
          color: colors.deep,
        }}
      >
        <Icon className="h-12 w-12" strokeWidth={1.15} aria-hidden="true" />
      </div>
      <span className="absolute bottom-5 text-[0.6rem] font-semibold uppercase tracking-[0.22em]" style={{ color: colors.deep, opacity: .65 }}>
        feito à mão
      </span>
    </div>
  );
}

export function CustomizationIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 480"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="Ilustração de papelaria artesanal, amostras de cores e laços"
    >
      <defs>
        <filter id="custom-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#5f4b41" floodOpacity=".13" />
        </filter>
      </defs>
      <rect x="18" y="18" width="524" height="444" rx="28" fill="#f7ece4" />
      <circle cx="460" cy="92" r="86" fill="#e8d6ca" opacity=".55" />
      <path d="M70 382c82-20 150-16 208 4 72 25 136 16 214-10" fill="none" stroke="#c9a99a" strokeOpacity=".4" strokeWidth="1.5" />

      <g filter="url(#custom-shadow)" transform="rotate(-5 240 250)">
        <rect x="112" y="120" width="208" height="260" rx="14" fill="#fffaf5" />
        <rect x="112" y="120" width="208" height="260" rx="14" fill="none" stroke="#dcc7b7" />
        <rect x="112" y="120" width="54" height="260" rx="14" fill="#f1d9d3" />
        <rect x="142" y="120" width="24" height="260" fill="#f1d9d3" />
        <g stroke="#c9a89e" strokeWidth="4" strokeLinecap="round">
          <path d="M126 160h20" />
          <path d="M126 202h20" />
          <path d="M126 244h20" />
          <path d="M126 286h20" />
          <path d="M126 328h20" />
        </g>
        <text x="216" y="205" textAnchor="middle" fontFamily="Georgia, serif" fontSize="24" fill="#7b675b">
          A festa
        </text>
        <text x="216" y="232" textAnchor="middle" fontFamily="Georgia, serif" fontSize="24" fill="#7b675b" fontStyle="italic">
          da sua vida
        </text>
        <path d="M178 260h76" stroke="#d7b9ab" strokeWidth="2" strokeLinecap="round" />
        <path d="M164 330c18-18 32-30 52-30 16 0 28 10 28 24 0 16-16 24-34 24-20 0-34-7-46-18Z" fill="#e7c7bd" opacity=".8" />
      </g>

      <g filter="url(#custom-shadow)" transform="rotate(8 400 240)">
        <rect x="342" y="150" width="152" height="200" rx="12" fill="#fffaf5" />
        <rect x="342" y="150" width="152" height="200" rx="12" fill="none" stroke="#d8c6b6" />
        <circle cx="377" cy="196" r="16" fill="#cfa9a0" />
        <circle cx="423" cy="196" r="16" fill="#aebda5" />
        <circle cx="469" cy="196" r="16" fill="#b7cbd3" />
        <circle cx="377" cy="246" r="16" fill="#eccdb8" />
        <circle cx="423" cy="246" r="16" fill="#ded0ba" />
        <path d="M366 296h104M366 312h78" stroke="#d5bfaf" strokeWidth="2" strokeLinecap="round" />
        <path d="M406 336c0-8 7-15 15-15s15 7 15 15-15 24-15 24-15-16-15-24Z" fill="#e6c4ba" />
      </g>

      <g filter="url(#custom-shadow)">
        <path d="M350 386c18-28 46-30 64-8 16-24 44-24 58 3 13-12 30-8 34 4l-6 28-144-2-6-25Z" fill="#aebda5" />
        <circle cx="414" cy="390" r="7" fill="#f9f2e9" opacity=".75" />
      </g>
      <g fill="none" stroke="#b58d7e" strokeWidth="2" strokeLinecap="round" opacity=".6">
        <path d="M76 92v18M67 101h18" />
        <path d="M474 390v14M467 397h14" />
      </g>
    </svg>
  );
}

export function EmptyCatalogIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 180"
      className={cn("h-auto w-56", className)}
      role="img"
      aria-label="Ilustração de uma caixinha vazia aguardando produtos"
    >
      <ellipse cx="120" cy="156" rx="72" ry="9" fill="#8c6b5d" opacity=".1" />
      <path d="M54 92h132v56a10 10 0 0 1-10 10H64a10 10 0 0 1-10-10V92Z" fill="#f4e1db" />
      <path d="M46 72h148v28H46z" fill="#faf0ea" />
      <path d="M112 72h16v86h-16z" fill="#fffaf5" opacity=".8" />
      <path d="M120 72c-14-2-26-10-26-22 0-8 8-12 14-9 10 5 12 19 12 31Z" fill="#fbf3ed" stroke="#ccaa9f" />
      <path d="M120 72c14-3 25-11 24-23-1-8-9-12-15-8-9 6-10 20-9 31Z" fill="#fbf3ed" stroke="#ccaa9f" />
      <circle cx="120" cy="72" r="5" fill="#c9a095" />
      <path d="M194 40v12M188 46h12" stroke="#aebda5" strokeWidth="2" strokeLinecap="round" />
      <circle cx="48" cy="48" r="3" fill="#d5b7ab" />
    </svg>
  );
}
