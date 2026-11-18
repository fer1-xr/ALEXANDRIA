"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

export function UserDropdown({
  name,
  roleLabel,
  canAdmin,
  logout,
}: {
  name: string;
  roleLabel: string;
  canAdmin: boolean;
  logout: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm hover:border-accent/60"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-fg">{initials}</span>
        <span className="max-w-[9rem] truncate">{name}</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="text-xs text-muted">{roleLabel}</p>
          </div>
          <MenuLink href="/mi-biblioteca" icon="book" label="Mi biblioteca" onClick={() => setOpen(false)} />
          <MenuLink href="/cuenta/perfil" icon="settings" label="Perfil y preferencias" onClick={() => setOpen(false)} />
          {canAdmin && <MenuLink href="/admin" icon="shield" label="Administración" onClick={() => setOpen(false)} />}
          <form action={logout} className="border-t border-line">
            <button role="menuitem" className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm hover:bg-surface-2">
              <Icon name="logout" className="h-4 w-4" /> Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, icon, label, onClick }: { href: string; icon: string; label: string; onClick: () => void }) {
  return (
    <Link role="menuitem" href={href} onClick={onClick} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-surface-2">
      <Icon name={icon} className="h-4 w-4 text-accent" /> {label}
    </Link>
  );
}
