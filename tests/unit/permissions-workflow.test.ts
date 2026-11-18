import { describe, expect, it } from "vitest";
import { can } from "@/server/auth/permissions";
import { availableTransitions, checkTransition, publishBlockers } from "@/server/editorial/workflow";

const okInput = { sourceCount: 2, summary: "x".repeat(60), content: "y".repeat(400), notices: [] as never[], reviewedAt: null };

describe("permisos por rol", () => {
  it("los visitantes no pueden usar la biblioteca personal", () => {
    expect(can("visitor", "library:use")).toBe(false);
    expect(can(null, "library:use")).toBe(false);
  });
  it("usuarios y estudiantes usan la biblioteca pero no el panel", () => {
    for (const r of ["registered", "student"] as const) {
      expect(can(r, "library:use")).toBe(true);
      expect(can(r, "admin:access")).toBe(false);
      expect(can(r, "article:publish")).toBe(false);
    }
  });
  it("los editores publican pero no gestionan usuarios ni auditoría", () => {
    expect(can("editor", "article:publish")).toBe(true);
    expect(can("editor", "user:manage")).toBe(false);
    expect(can("editor", "audit:read")).toBe(false);
    expect(can("editor", "category:archive")).toBe(false);
  });
  it("los administradores lo pueden todo", () => {
    expect(can("admin", "user:manage")).toBe(true);
    expect(can("admin", "audit:read")).toBe(true);
  });
});

describe("flujo editorial", () => {
  it("sigue Borrador → En revisión → Aprobado → Publicado → Archivado", () => {
    expect(checkTransition("editor", "draft", "in_review")).toEqual({ ok: true });
    expect(checkTransition("editor", "in_review", "approved")).toEqual({ ok: true });
    expect(checkTransition("editor", "approved", "published", okInput)).toEqual({ ok: true });
    expect(checkTransition("editor", "published", "archived")).toEqual({ ok: true });
  });
  it("no permite saltarse la revisión", () => {
    expect(checkTransition("admin", "draft", "published", okInput).ok).toBe(false);
    expect(checkTransition("admin", "in_review", "published", okInput).ok).toBe(false);
  });
  it("impide publicar sin fuentes", () => {
    const r = checkTransition("editor", "approved", "published", { ...okInput, sourceCount: 0 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/fuente/);
  });
  it("exige fecha de revisión en contenidos médicos", () => {
    expect(publishBlockers({ ...okInput, notices: ["medical"] })).toHaveLength(1);
    expect(publishBlockers({ ...okInput, notices: ["medical"], reviewedAt: new Date() })).toHaveLength(0);
  });
  it("un usuario registrado no tiene transiciones disponibles", () => {
    expect(availableTransitions("registered", "draft")).toHaveLength(0);
    expect(checkTransition("registered", "draft", "in_review").ok).toBe(false);
  });
});
