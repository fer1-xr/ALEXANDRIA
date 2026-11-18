/**
 * Máquina de estados editorial:
 *   Borrador → En revisión → Aprobado → Publicado → Archivado
 * con retornos explícitos (devolver a borrador, despublicar, restaurar).
 * Función pura: se prueba en tests/unit/workflow.test.ts.
 */
import type { ContentNotice, EditorialStatus } from "@/server/db/schema";
import { can, type Permission, type Role } from "@/server/auth/permissions";

type Transition = { to: EditorialStatus; permission: Permission; label: string };

export const TRANSITIONS: Record<EditorialStatus, Transition[]> = {
  draft: [
    { to: "in_review", permission: "article:submit", label: "Enviar a revisión" },
    { to: "archived", permission: "article:archive", label: "Archivar" },
  ],
  in_review: [
    { to: "approved", permission: "article:review", label: "Aprobar" },
    { to: "draft", permission: "article:review", label: "Devolver a borrador" },
  ],
  approved: [
    { to: "published", permission: "article:publish", label: "Publicar" },
    { to: "in_review", permission: "article:review", label: "Reabrir revisión" },
  ],
  published: [
    { to: "approved", permission: "article:publish", label: "Despublicar" },
    { to: "archived", permission: "article:archive", label: "Archivar" },
  ],
  archived: [{ to: "draft", permission: "article:archive", label: "Restaurar como borrador" }],
};

export type PublishCheckInput = {
  sourceCount: number;
  summary: string;
  content: string;
  notices: ContentNotice[];
  reviewedAt: Date | null;
};

/** Requisitos de calidad mínimos para publicar. */
export function publishBlockers(a: PublishCheckInput): string[] {
  const problems: string[] = [];
  if (a.sourceCount < 1) problems.push("Debe citar al menos una fuente.");
  if (a.summary.trim().length < 40) problems.push("El resumen es demasiado corto (mínimo 40 caracteres).");
  if (a.content.trim().length < 200) problems.push("El contenido es demasiado corto (mínimo 200 caracteres).");
  if (a.notices.includes("medical") && !a.reviewedAt)
    problems.push("Los contenidos médicos requieren una fecha de revisión antes de publicarse.");
  return problems;
}

export type TransitionCheck = { ok: true } | { ok: false; reason: string };

export function checkTransition(
  role: Role,
  from: EditorialStatus,
  to: EditorialStatus,
  publishInput?: PublishCheckInput,
): TransitionCheck {
  const transition = TRANSITIONS[from].find((t) => t.to === to);
  if (!transition) return { ok: false, reason: `No se puede pasar de «${from}» a «${to}».` };
  if (!can(role, transition.permission)) return { ok: false, reason: "No tienes permiso para esta transición." };
  if (to === "published") {
    if (!publishInput) return { ok: false, reason: "Faltan datos para validar la publicación." };
    const blockers = publishBlockers(publishInput);
    if (blockers.length) return { ok: false, reason: blockers.join(" ") };
  }
  return { ok: true };
}

export function availableTransitions(role: Role, from: EditorialStatus): Transition[] {
  return TRANSITIONS[from].filter((t) => can(role, t.permission));
}
