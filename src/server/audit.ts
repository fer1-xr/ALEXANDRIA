import "server-only";
import { db } from "@/server/db/client";
import { auditLog } from "@/server/db/schema";

/** Registro de actividad administrativa (inmutable desde la aplicación). */
export async function audit(
  actorId: string | null,
  action: string,
  entityType: string,
  entityId: string | null,
  details: Record<string, unknown> = {},
) {
  await db.insert(auditLog).values({ actorId, action, entityType, entityId, details });
}
