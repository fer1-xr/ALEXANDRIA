import Link from "next/link";
import type { ReactNode } from "react";
import { requirePermissionForPage } from "@/server/auth/guards";
import type { Permission } from "@/server/auth/permissions";
import type { SessionUser } from "@/server/auth/session";

/** Comprueba el permiso (dentro de <Suspense>) y muestra 403 si falta. */
export async function AdminGate({ permission, next, children }: { permission: Permission; next: string; children: (user: SessionUser) => ReactNode | Promise<ReactNode> }) {
  const user = await requirePermissionForPage(permission, next);
  if (!user) {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 text-center">
        <p className="font-display text-3xl font-semibold">Acceso restringido</p>
        <p className="mt-2 text-muted">Tu perfil no tiene permiso para esta sección del panel.</p>
        <Link href="/" className="mt-4 inline-block text-link underline">Volver al inicio</Link>
      </div>
    );
  }
  return <>{await children(user)}</>;
}
