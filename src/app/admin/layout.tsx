import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = { title: { default: "Administración", template: "%s · Administración" }, robots: { index: false, follow: false } };

const NAV = [
  ["/admin", "Panel", "layers"],
  ["/admin/articulos", "Artículos", "book"],
  ["/admin/categorias", "Categorías", "folder"],
  ["/admin/fuentes", "Fuentes", "scroll"],
  ["/admin/multimedia", "Multimedia", "palette"],
  ["/admin/usuarios", "Usuarios", "people"],
  ["/admin/auditoria", "Auditoría", "shield"],
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:px-8">
      <nav aria-label="Administración" className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Administración</p>
        <ul className="flex gap-1 overflow-x-auto lg:flex-col">
          {NAV.map(([href, label, icon]) => (
            <li key={href}>
              <Link href={href} className="flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm hover:bg-surface-2">
                <Icon name={icon} className="h-4 w-4 text-accent" /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
