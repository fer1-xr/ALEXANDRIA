"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { cx } from "@/components/ui/primitives";
import { EXPERIENCE_LINKS, LEARN_LINKS } from "./nav-config";

export type NavCategory = { name: string; path: string; icon: string | null; articleCount: number };

type MenuKey = "explorar" | "experiencias" | "aprender" | null;

/** Cierra el menú al pulsar cualquier enlace de su interior (sin depender de usePathname). */
function closeOnLinkClick(close: () => void) {
  return (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) close();
  };
}

export function MainNav({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState<MenuKey>(null);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const trigger = (key: Exclude<MenuKey, null>, label: string) => (
    <button
      type="button"
      aria-expanded={open === key}
      aria-controls={`menu-${key}`}
      onClick={() => setOpen(open === key ? null : key)}
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-2 text-[0.92rem] font-medium transition hover:bg-surface-2",
        open === key && "bg-surface-2",
      )}
    >
      {label}
      <Icon name="chevronDown" className={cx("h-4 w-4 transition", open === key && "rotate-180")} />
    </button>
  );

  return (
    <div ref={ref} className="hidden items-center gap-0.5 whitespace-nowrap xl:flex">
      <Link href="/" className="rounded-full px-2.5 py-2 text-[0.92rem] font-medium hover:bg-surface-2">
        Inicio
      </Link>
      {trigger("explorar", "Explorar")}
      {trigger("experiencias", "Experiencias")}
      {trigger("aprender", "Aprender")}
      <Link
        href="/ai"
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[0.92rem] font-medium hover:bg-surface-2"
      >
        <Icon name="spark" className="h-4 w-4 text-accent" /> ALEXANDRIA AI
      </Link>
      <Link href="/mi-biblioteca" className="rounded-full px-2.5 py-2 text-[0.92rem] font-medium hover:bg-surface-2">
        Mi biblioteca
      </Link>

      {open && (
        <div
          id={`menu-${open}`}
          onClick={closeOnLinkClick(close)}
          className="absolute inset-x-0 top-full border-b border-line bg-surface shadow-[var(--shadow-card)]"
        >
          <div className="mx-auto max-w-7xl px-8 py-7">
            {open === "explorar" && (
              <MenuPanel title="Ramas del conocimiento" footer={<Link href="/explorar" className="text-sm font-medium text-link hover:underline">Ver la taxonomía completa →</Link>}>
                <ul className="grid grid-cols-4 gap-1">
                  {categories.map((c) => (
                    <li key={c.path}>
                      <Link href={`/explorar/${c.path}`} className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-surface-2">
                        <Icon name={c.icon ?? "book"} className="h-5 w-5 text-accent" />
                        <span className="text-sm font-medium">{c.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </MenuPanel>
            )}
            {open === "experiencias" && <LinkGrid links={EXPERIENCE_LINKS} title="Experiencias" />}
            {open === "aprender" && <LinkGrid links={LEARN_LINKS} title="Aprender" />}
          </div>
        </div>
      )}
    </div>
  );
}

function MenuPanel({ title, children, footer }: { title: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{title}</p>
      {children}
      {footer && <div className="mt-4 border-t border-line pt-3">{footer}</div>}
    </div>
  );
}

function LinkGrid({ links, title }: { links: readonly { href: string; label: string; icon: string; note: string }[]; title: string }) {
  return (
    <MenuPanel title={title}>
      <ul className="grid grid-cols-3 gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-surface-2">
              <Icon name={l.icon} className="mt-0.5 h-5 w-5 text-accent" />
              <span>
                <span className="block text-sm font-medium">{l.label}</span>
                <span className="block text-xs text-muted">{l.note}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </MenuPanel>
  );
}

/** Menú lateral para móviles y tabletas. */
export function MobileNav({ categories, userSlot }: { categories: NavCategory[]; userSlot: ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full p-2 hover:bg-surface-2"
        aria-label="Abrir menú"
        aria-expanded={open}
      >
        <Icon name="menu" className="h-6 w-6" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menú principal">
          <button type="button" className="absolute inset-0 bg-night/60" aria-label="Cerrar menú" onClick={() => setOpen(false)} />
          <nav onClick={closeOnLinkClick(close)} className="absolute right-0 top-0 flex h-full w-[min(22rem,88vw)] flex-col overflow-y-auto bg-surface p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-lg font-semibold tracking-[0.15em]">MENÚ</span>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-surface-2" aria-label="Cerrar menú">
                <Icon name="close" />
              </button>
            </div>
            <div className="mb-4">{userSlot}</div>
            <MobileSection title="General">
              <MobileLink href="/" label="Inicio" icon="columns" />
              <MobileLink href="/buscar" label="Buscar" icon="search" />
              <MobileLink href="/ai" label="ALEXANDRIA AI" icon="spark" />
              <MobileLink href="/mi-biblioteca" label="Mi biblioteca" icon="book" />
            </MobileSection>
            <MobileSection title="Explorar">
              {categories.map((c) => (
                <MobileLink key={c.path} href={`/explorar/${c.path}`} label={c.name} icon={c.icon ?? "book"} />
              ))}
            </MobileSection>
            <MobileSection title="Experiencias">
              {EXPERIENCE_LINKS.map((l) => (
                <MobileLink key={l.href} href={l.href} label={l.label} icon={l.icon} />
              ))}
            </MobileSection>
            <MobileSection title="Aprender">
              {LEARN_LINKS.map((l) => (
                <MobileLink key={l.href} href={l.href} label={l.label} icon={l.icon} />
              ))}
            </MobileSection>
          </nav>
        </div>
      )}
    </div>
  );
}

function MobileSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-line py-3">
      <p className="mb-1 px-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">{title}</p>
      <ul>{children}</ul>
    </div>
  );
}

function MobileLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-3 rounded-lg px-2 py-2 text-[0.95rem] hover:bg-surface-2">
        <Icon name={icon} className="h-5 w-5 text-accent" /> {label}
      </Link>
    </li>
  );
}
