/**
 * Matriz de permisos. Función pura (sin dependencias de servidor) para poder probarla
 * y reutilizarla en la interfaz (ocultar acciones) y en el servidor (autorizar).
 * La interfaz nunca es la barrera de seguridad: toda acción vuelve a comprobarse aquí.
 */
import type { UserRole } from "@/server/db/schema";

export type Role = UserRole | "visitor";

export type Permission =
  | "library:use" // favoritos, historial, colecciones, notas
  | "learning:track"
  | "admin:access"
  | "article:create"
  | "article:edit"
  | "article:submit"
  | "article:review" // aprobar o devolver
  | "article:publish"
  | "article:archive"
  | "article:verify" // marcar como revisado por humanos
  | "category:manage"
  | "category:archive"
  | "source:manage"
  | "media:manage"
  | "timeline:manage"
  | "experience:manage"
  | "path:manage"
  | "user:manage"
  | "audit:read";

const REGISTERED: Permission[] = ["library:use", "learning:track"];
const EDITOR: Permission[] = [
  ...REGISTERED,
  "admin:access",
  "article:create",
  "article:edit",
  "article:submit",
  "article:review",
  "article:publish",
  "article:archive",
  "article:verify",
  "category:manage",
  "source:manage",
  "media:manage",
  "timeline:manage",
  "experience:manage",
  "path:manage",
];
const ADMIN: Permission[] = [...EDITOR, "category:archive", "user:manage", "audit:read"];

const MATRIX: Record<Role, ReadonlySet<Permission>> = {
  visitor: new Set(),
  registered: new Set(REGISTERED),
  student: new Set(REGISTERED),
  editor: new Set(EDITOR),
  admin: new Set(ADMIN),
};

export function can(role: Role | null | undefined, permission: Permission): boolean {
  return MATRIX[role ?? "visitor"].has(permission);
}

/** Roles que un administrador puede asignar. */
export const ASSIGNABLE_ROLES: UserRole[] = ["registered", "student", "editor", "admin"];
