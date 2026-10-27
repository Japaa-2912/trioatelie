"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  FolderOpen,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Menu,
  Package,
  Settings,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: FolderOpen },
  { href: "/admin/home", label: "Página inicial", icon: LayoutTemplate },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminNav({
  brandName,
  logoUrl,
  userName,
  userEmail,
}: {
  brandName: string;
  logoUrl: string | null;
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const nav = (
    <nav aria-label="Navegação do painel" className="flex-1 px-3 py-4">
      <p className="px-3 pb-2 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-muted/50">
        Administração
      </p>
      <ul className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href, link.exact);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.8rem] font-medium transition",
                  active
                    ? "bg-brand text-ivory shadow-sm"
                    : "text-ink/70 hover:bg-cream hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 rounded-xl border border-line/80 bg-cream/60 p-3">
        <p className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted/60">
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          Loja pública
        </p>
        <p className="mt-1.5 text-[0.68rem] leading-relaxed text-muted">
          As alterações salvas aparecem imediatamente no site.
        </p>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 inline-flex items-center gap-1 text-[0.7rem] font-semibold text-brand hover:underline"
        >
          Abrir site
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </nav>
  );

  const footer = (
    <div className="border-t border-line p-3">
      <div className="rounded-xl bg-cream/70 px-3 py-2.5">
        <p className="truncate text-xs font-semibold text-ink">{userName}</p>
        <p className="truncate text-[0.62rem] text-muted">{userEmail}</p>
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[0.75rem] font-medium text-muted transition hover:bg-[#fbeeeb] hover:text-[#a34f47]"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sair do painel
        </button>
      </form>
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-ivory lg:flex">
        <div className="border-b border-line px-4 py-5">
          <BrandLogo
            brandName={brandName}
            tagline="Painel da loja"
            logoUrl={logoUrl}
            size="sm"
            href="/admin"
          />
        </div>
        {nav}
        {footer}
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-cream/95 px-4 backdrop-blur lg:hidden">
        <BrandLogo
          brandName={brandName}
          tagline="Painel"
          logoUrl={logoUrl}
          size="sm"
          href="/admin"
        />
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1 rounded-full border border-line bg-ivory px-3 text-[0.68rem] font-medium text-muted"
          >
            Ver loja
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu do painel"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-ivory text-ink"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        aria-labelledby="admin-mobile-nav-title"
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
        className="m-0 h-dvh max-h-none w-[min(88vw,20rem)] border-0 border-r border-line bg-ivory p-0"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line px-4 py-4">
            <span id="admin-mobile-nav-title" className="sr-only">
              Menu do painel
            </span>
            <BrandLogo
              brandName={brandName}
              tagline="Painel da loja"
              logoUrl={logoUrl}
              size="sm"
              href="/admin"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          {nav}
          {footer}
        </div>
      </dialog>
    </>
  );
}
