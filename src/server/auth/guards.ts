import "server-only";
import { redirect } from "next/navigation";
import { can, type Permission } from "./permissions";
import { getCurrentUser, type SessionUser } from "./session";

export class ForbiddenError extends Error {
  constructor(message = "No tienes permiso para realizar esta acción.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** Para páginas: redirige al inicio de sesión si no hay usuario. */
export async function requireUser(next?: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(next ? `/cuenta/ingresar?next=${encodeURIComponent(next)}` : "/cuenta/ingresar");
  return user;
}

/** Para páginas: exige un permiso. Devuelve null si el usuario no lo tiene (la página muestra 403). */
export async function requirePermissionForPage(
  permission: Permission,
  next?: string,
): Promise<SessionUser | null> {
  const user = await requireUser(next);
  return can(user.role, permission) ? user : null;
}

/** Para Server Actions: lanza si no hay permiso. Nunca confiar en la interfaz. */
export async function authorize(permission: Permission): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new ForbiddenError("Debes iniciar sesión.");
  if (!can(user.role, permission)) throw new ForbiddenError();
  return user;
}
