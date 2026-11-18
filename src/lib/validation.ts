/**
 * Esquemas de validación compartidos por los formularios y las Server Actions.
 * Toda entrada externa se valida aquí antes de tocar la base de datos.
 */
import { z } from "zod";
import { SLUG_PATTERN } from "./slug";

const trimmed = (min: number, max: number, label: string) =>
  z
    .string({ error: `${label}: campo obligatorio.` })
    .trim()
    .min(min, `${label}: mínimo ${min} caracteres.`)
    .max(max, `${label}: máximo ${max} caracteres.`);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

export const emailSchema = z
  .string({ error: "Correo: campo obligatorio." })
  .trim()
  .toLowerCase()
  .max(254)
  .pipe(z.email({ error: "Introduce un correo electrónico válido." }));

export const passwordSchema = z
  .string({ error: "Contraseña: campo obligatorio." })
  .min(10, "La contraseña debe tener al menos 10 caracteres.")
  .max(200, "La contraseña es demasiado larga.");

export const registerSchema = z
  .object({
    displayName: trimmed(2, 80, "Nombre"),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string(),
    acceptPrivacy: z.literal("on", { error: "Debes aceptar la política de privacidad." }),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Las contraseñas no coinciden.",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Introduce tu contraseña.").max(200),
});

export const resetRequestSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({
    token: z.string().min(20).max(200),
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Las contraseñas no coinciden.",
  });

export const profileSchema = z.object({
  displayName: trimmed(2, 80, "Nombre"),
  locale: z.enum(["es", "en", "pt"]),
});

export const preferencesSchema = z.object({
  theme: z.enum(["system", "light", "dark"]),
  fontScale: z.coerce.number().int().min(80).max(150),
  readingLevel: z.enum(["children", "beginner", "intermediate", "advanced", "university", "specialist"]),
  historyEnabled: z.preprocess((v) => v === "on" || v === true, z.boolean()),
  analyticsConsent: z.preprocess((v) => v === "on" || v === true, z.boolean()),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(200),
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Las contraseñas no coinciden.",
  });

/* ── Contenido ─────────────────────────────────────────────────────────── */

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(SLUG_PATTERN, "El slug solo admite minúsculas, números y guiones.");

const factsSchema = z
  .string()
  .optional()
  .transform((raw, ctx) => {
    // Formato: una línea por dato «Etiqueta: valor».
    const lines = (raw ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
    const facts: { label: string; value: string }[] = [];
    for (const line of lines) {
      const idx = line.indexOf(":");
      if (idx < 1) {
        ctx.addIssue({ code: "custom", message: `Dato mal formado: «${line}». Usa «Etiqueta: valor».` });
        return z.NEVER;
      }
      facts.push({ label: line.slice(0, idx).trim().slice(0, 60), value: line.slice(idx + 1).trim().slice(0, 300) });
    }
    return facts.slice(0, 20);
  });

export const articleInputSchema = z.object({
  title: trimmed(2, 200, "Título"),
  subtitle: optionalText(300),
  slug: slugSchema,
  summary: trimmed(10, 1200, "Resumen"),
  content: trimmed(1, 200_000, "Contenido"),
  categoryId: z.uuid("Selecciona una categoría."),
  entityType: z.enum([
    "article",
    "concept",
    "person",
    "place",
    "monument",
    "event",
    "period",
    "civilization",
    "country",
    "species",
    "celestial_body",
    "invention",
    "work",
    "theory",
    "discipline",
    "religion",
    "organization",
  ]),
  difficulty: z.enum(["children", "beginner", "intermediate", "advanced", "university", "specialist"]),
  keywords: z
    .string()
    .optional()
    .transform((v) =>
      Array.from(
        new Set(
          (v ?? "")
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
            .map((k) => k.slice(0, 60)),
        ),
      ).slice(0, 30),
    ),
  facts: factsSchema,
  notices: z.array(z.enum(["medical", "esoteric", "religious", "contested", "evolving"])).default([]),
  aiAssisted: z.preprocess((v) => v === "on" || v === true, z.boolean()),
  authorCredit: optionalText(200),
  locale: z.enum(["es", "en", "pt"]).default("es"),
  sourceIds: z.array(z.uuid()).max(100).default([]),
  changeNote: optionalText(500),
});

export const categoryInputSchema = z.object({
  name: trimmed(2, 120, "Nombre"),
  slug: slugSchema,
  description: optionalText(1000),
  parentId: z
    .string()
    .optional()
    .transform((v) => (v ? v : null))
    .pipe(z.uuid().nullable()),
  sortOrder: z.coerce.number().int().min(0).max(10_000).default(0),
  icon: optionalText(40),
});

const optionalUrl = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .transform((v) => (v ? v : null))
  .pipe(z.url({ protocol: /^https?$/, error: "URL no válida (usa http o https)." }).nullable());

export const sourceInputSchema = z.object({
  kind: z.enum(["book", "journal_article", "website", "dataset", "api", "archive", "official_document", "other"]),
  title: trimmed(2, 500, "Título"),
  authors: optionalText(500),
  publisher: optionalText(300),
  year: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : null))
    .pipe(z.number().int().min(-3000).max(2100).nullable()),
  url: optionalUrl,
  doi: optionalText(200),
  isbn: optionalText(40),
  provider: optionalText(200),
  license: optionalText(200),
  reusePolicy: z.enum(["external_link", "api_query", "open_data", "reusable", "commercial_license", "copyrighted"]),
  verification: z.enum(["pending", "verified", "broken", "rejected"]),
  accessedAt: z
    .string()
    .optional()
    .transform((v) => (v ? v : null))
    .pipe(z.iso.date().nullable()),
  notes: optionalText(2000),
});

export const mediaInputSchema = z.object({
  kind: z.enum([
    "image",
    "illustration",
    "infographic",
    "video",
    "audio",
    "model_3d",
    "panorama_360",
    "map",
    "diagram",
    "document",
  ]),
  title: trimmed(2, 300, "Título"),
  url: z.url({ protocol: /^https?$/, error: "URL no válida." }),
  originalUrl: optionalUrl,
  author: optionalText(300),
  provider: optionalText(200),
  license: trimmed(2, 200, "Licencia"),
  licenseUrl: optionalUrl,
  credit: optionalText(500),
  usageConditions: optionalText(1000),
  altText: optionalText(500),
  rightsStatus: z.enum(["pending", "verified", "rejected"]),
});

export const noteSchema = z.object({
  articleId: z.uuid(),
  body: trimmed(1, 5000, "Nota"),
});

export const collectionSchema = z.object({
  name: trimmed(1, 120, "Nombre"),
  description: optionalText(500),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().max(200).default(""),
  type: z.string().trim().max(40).optional(),
  category: z.string().trim().max(200).optional(),
  page: z.coerce.number().int().min(1).max(100).default(1),
});

/** Extrae el primer mensaje legible de un error de Zod. */
export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Datos no válidos.";
}

/** Mapa campo → mensaje para mostrar errores junto a cada campo. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_");
    out[key] ??= issue.message;
  }
  return out;
}
