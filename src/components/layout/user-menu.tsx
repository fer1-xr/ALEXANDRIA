import Link from "next/link";
import { getCurrentUser } from "@/server/auth/session";
import { can } from "@/server/auth/permissions";
import { logoutAction } from "@/server/actions/auth";
import { Icon } from "@/components/ui/icon";
import { buttonClass } from "@/components/ui/primitives";
import { ROLE_LABELS } from "@/lib/labels";
import { UserDropdown } from "./user-dropdown";

export async function UserMenu() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <Link href="/cuenta/ingresar" className={buttonClass("secondary", "sm")}>
        <Icon name="user" className="h-4 w-4" /> Ingresar
      </Link>
    );
  }
  return (
    <UserDropdown
      name={user.displayName}
      roleLabel={ROLE_LABELS[user.role]}
      canAdmin={can(user.role, "admin:access")}
      logout={logoutAction}
    />
  );
}

export async function UserMenuMobile() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="flex gap-2">
        <Link href="/cuenta/ingresar" className={buttonClass("primary", "sm")}>Ingresar</Link>
        <Link href="/cuenta/registro" className={buttonClass("secondary", "sm")}>Crear cuenta</Link>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-line p-3">
      <p className="font-medium">{user.displayName}</p>
      <p className="text-xs text-muted">{ROLE_LABELS[user.role]}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/cuenta/perfil" className={buttonClass("secondary", "sm")}>Perfil</Link>
        {can(user.role, "admin:access") && (
          <Link href="/admin" className={buttonClass("secondary", "sm")}>Administración</Link>
        )}
        <form action={logoutAction}>
          <button className={buttonClass("ghost", "sm")}>Cerrar sesión</button>
        </form>
      </div>
    </div>
  );
}
