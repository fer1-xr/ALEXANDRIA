/**
 * Esquema de datos de ALEXANDRIA.
 *
 * Convenciones:
 *  - Claves primarias UUID (gen_random_uuid) salvo tablas de unión.
 *  - Fechas en UTC (timestamptz).
 *  - Los años históricos usan numeración astronómica: 1 a. C. = 0, 2 a. C. = -1…
 *    Para el tiempo profundo se usa `bigint` (p. ej. -13 787 000 000).
 *  - El idioma se expresa con etiquetas BCP-47 cortas ("es", "en", "pt").
 *
 * Ver DATABASE_SCHEMA.md para la explicación completa.
 */
import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  customType,
  date,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/* ───────────────────────────── Enumeraciones ───────────────────────────── */

export const userRole = pgEnum("user_role", ["registered", "student", "editor", "admin"]);
export const userPlan = pgEnum("user_plan", ["free", "premium"]);

export const editorialStatus = pgEnum("editorial_status", [
  "draft",
  "in_review",
  "approved",
  "published",
  "archived",
]);

/** Grado de verificación humana del contenido, independiente del estado editorial. */
export const verificationStatus = pgEnum("verification_status", [
  "unverified",
  "editor_reviewed",
  "expert_verified",
]);

export const entityType = pgEnum("entity_type", [
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
]);

/** 1 Infantil · 2 Principiante · 3 Intermedio · 4 Avanzado · 5 Universitario · 6 Especializado */
export const difficultyLevel = pgEnum("difficulty_level", [
  "children",
  "beginner",
  "intermediate",
  "advanced",
  "university",
  "specialist",
]);

/** Avisos de contexto que se muestran al lector. */
export const contentNotice = pgEnum("content_notice", [
  "medical",
  "esoteric",
  "religious",
  "contested",
  "evolving",
]);

export const translationKind = pgEnum("translation_kind", ["original", "human", "machine"]);

export const sourceKind = pgEnum("source_kind", [
  "book",
  "journal_article",
  "website",
  "dataset",
  "api",
  "archive",
  "official_document",
  "other",
]);

/** Qué se puede hacer legalmente con una fuente (ver CONTENT_SOURCES.md). */
export const reusePolicy = pgEnum("reuse_policy", [
  "external_link",
  "api_query",
  "open_data",
  "reusable",
  "commercial_license",
  "copyrighted",
]);

export const sourceVerification = pgEnum("source_verification", [
  "pending",
  "verified",
  "broken",
  "rejected",
]);

export const ingestionMethod = pgEnum("ingestion_method", ["manual", "api", "file_import", "seed"]);

export const relationType = pgEnum("relation_type", [
  "related",
  "part_of",
  "located_in",
  "influenced",
  "preceded",
  "contemporary_of",
  "created_by",
  "participated_in",
  "studied_by",
  "example_of",
  "contrasts_with",
]);

export const mediaKind = pgEnum("media_kind", [
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
]);

export const rightsStatus = pgEnum("rights_status", ["pending", "verified", "rejected"]);

/** Tipo honesto de experiencia: nunca se presenta una foto como modelo 3D. */
export const experienceType = pgEnum("experience_type", [
  "model_3d",
  "panorama_360",
  "photo_tour",
  "simplified_model",
  "artistic_reconstruction",
]);

export const experienceAvailability = pgEnum("experience_availability", [
  "available",
  "in_production",
  "planned",
]);

export const datePrecision = pgEnum("date_precision", [
  "day",
  "year",
  "decade",
  "century",
  "millennium",
  "approximate",
  "geological",
]);

export const themePreference = pgEnum("theme_preference", ["system", "light", "dark"]);

/* ───────────────────────────── Usuarios y sesiones ───────────────────────────── */

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    displayName: text("display_name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRole("role").notNull().default("registered"),
    plan: userPlan("plan").notNull().default("free"),
    locale: text("locale").notNull().default("es"),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    disabledAt: timestamp("disabled_at", { withTimezone: true }),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [uniqueIndex("users_email_unique").on(sql`lower(${t.email})`)],
);

/** El id de la sesión es el SHA-256 del token: el token en claro solo existe en la cookie. */
export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId), index("sessions_expires_idx").on(t.expiresAt)],
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text("id").primaryKey(), // SHA-256 del token
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("password_reset_user_idx").on(t.userId)],
);

export const userPreferences = pgTable("user_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  theme: themePreference("theme").notNull().default("system"),
  /** Escala de letra en porcentaje (80–150). */
  fontScale: smallint("font_scale").notNull().default(100),
  readingLevel: difficultyLevel("reading_level").notNull().default("intermediate"),
  /** Si es false, no se registra el historial de lectura. */
  historyEnabled: boolean("history_enabled").notNull().default(true),
  /** Consentimiento explícito para analítica (desactivado por defecto). */
  analyticsConsent: boolean("analytics_consent").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/* ───────────────────────────── Taxonomía ───────────────────────────── */

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    parentId: uuid("parent_id").references((): AnyPgColumn => categories.id, {
      onDelete: "restrict",
    }),
    /** Ruta materializada de slugs: "historia/civilizaciones/egipto". */
    path: text("path").notNull(),
    depth: smallint("depth").notNull().default(0),
    sortOrder: integer("sort_order").notNull().default(0),
    /** Clave de icono del sistema de diseño (ver components/ui/category-icon.tsx). */
    icon: text("icon"),
    /** Las ramas archivadas no se muestran, pero conservan sus artículos. */
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("categories_path_unique").on(t.path),
    index("categories_parent_idx").on(t.parentId, t.sortOrder),
  ],
);

/* ───────────────────────────── Multimedia ───────────────────────────── */

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: mediaKind("kind").notNull(),
    title: text("title").notNull(),
    /** URL servida por ALEXANDRIA (object storage/CDN) o del proveedor si se enlaza. */
    url: text("url").notNull(),
    originalUrl: text("original_url"),
    author: text("author"),
    provider: text("provider"),
    license: text("license").notNull(),
    licenseUrl: text("license_url"),
    credit: text("credit"),
    usageConditions: text("usage_conditions"),
    altText: text("alt_text"),
    width: integer("width"),
    height: integer("height"),
    bytes: bigint("bytes", { mode: "number" }),
    rightsStatus: rightsStatus("rights_status").notNull().default("pending"),
    addedById: uuid("added_by_id").references(() => users.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [index("media_kind_idx").on(t.kind), index("media_rights_idx").on(t.rightsStatus)],
);

/* ───────────────────────────── Artículos ───────────────────────────── */

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    locale: text("locale").notNull().default("es"),
    /** Agrupa las versiones del mismo artículo en distintos idiomas. */
    translationGroupId: uuid("translation_group_id").notNull().defaultRandom(),
    translationKind: translationKind("translation_kind").notNull().default("original"),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    summary: text("summary").notNull(),
    /** Markdown (GFM). Se sanea al renderizar. */
    content: text("content").notNull(),
    entityType: entityType("entity_type").notNull().default("article"),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    keywords: text("keywords").array().notNull().default(sql`'{}'::text[]`),
    /** Ficha rápida: [{ label, value }]. */
    facts: jsonb("facts").$type<{ label: string; value: string }[]>().notNull().default([]),
    heroMediaId: uuid("hero_media_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    difficulty: difficultyLevel("difficulty").notNull().default("intermediate"),
    readingMinutes: smallint("reading_minutes").notNull().default(1),
    status: editorialStatus("status").notNull().default("draft"),
    verification: verificationStatus("verification").notNull().default("unverified"),
    /** Redactado total o parcialmente con IA. Se muestra siempre al lector. */
    aiAssisted: boolean("ai_assisted").notNull().default(false),
    notices: contentNotice("notices").array().notNull().default(sql`'{}'::content_notice[]`),
    /** Fecha de la última revisión de contenido (obligatoria en temas médicos). */
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewedById: uuid("reviewed_by_id").references(() => users.id, { onDelete: "set null" }),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    /** Responsable editorial visible (persona o equipo). */
    authorCredit: text("author_credit"),
    contentLicense: text("content_license"),
    allowDownload: boolean("allow_download").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`setweight(to_tsvector('es_unaccent'::regconfig, coalesce(title, '')), 'A') ||
          setweight(to_tsvector('es_unaccent'::regconfig, coalesce(subtitle, '')), 'B') ||
          setweight(to_tsvector('es_unaccent'::regconfig, f_array_text(keywords)), 'B') ||
          setweight(to_tsvector('es_unaccent'::regconfig, coalesce(summary, '')), 'C') ||
          setweight(to_tsvector('es_unaccent'::regconfig, coalesce(content, '')), 'D')`,
    ),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("articles_locale_slug_unique").on(t.locale, t.slug),
    index("articles_category_idx").on(t.categoryId, t.status),
    index("articles_status_published_idx").on(t.status, t.publishedAt),
    index("articles_entity_idx").on(t.entityType, t.status),
    index("articles_translation_idx").on(t.translationGroupId),
    index("articles_search_idx").using("gin", t.searchVector),
  ],
);

/** Categorías secundarias (un artículo vive en una principal y puede aparecer en otras). */
export const articleCategories = pgTable(
  "article_categories",
  {
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.articleId, t.categoryId] }),
    index("article_categories_cat_idx").on(t.categoryId),
  ],
);

export const articleRevisions = pgTable(
  "article_revisions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    snapshot: jsonb("snapshot").notNull(),
    fromStatus: editorialStatus("from_status"),
    toStatus: editorialStatus("to_status").notNull(),
    changeNote: text("change_note"),
    changedById: uuid("changed_by_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("article_revisions_version_unique").on(t.articleId, t.version)],
);

export const articleMedia = pgTable(
  "article_media",
  {
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "cascade" }),
    position: smallint("position").notNull().default(0),
    caption: text("caption"),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.mediaId] })],
);

/* ───────────────────────────── Fuentes ───────────────────────────── */

export const sources = pgTable(
  "sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Identificador estable para deduplicar (DOI, ISBN, Q-id de Wikidata, URL canónica…). */
    externalId: text("external_id"),
    kind: sourceKind("kind").notNull(),
    title: text("title").notNull(),
    authors: text("authors"),
    publisher: text("publisher"),
    year: smallint("year"),
    url: text("url"),
    doi: text("doi"),
    isbn: text("isbn"),
    /** Proveedor o institución (NASA, UNESCO, Project Gutenberg…). */
    provider: text("provider"),
    license: text("license"),
    reusePolicy: reusePolicy("reuse_policy").notNull().default("external_link"),
    /** Fecha en que una persona o un proceso consultó realmente la fuente. */
    accessedAt: date("accessed_at"),
    verification: sourceVerification("verification").notNull().default("pending"),
    ingestionMethod: ingestionMethod("ingestion_method").notNull().default("manual"),
    notes: text("notes"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("sources_external_id_unique").on(t.externalId),
    index("sources_title_idx").on(t.title),
  ],
);

export const articleSources = pgTable(
  "article_sources",
  {
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "restrict" }),
    position: smallint("position").notNull().default(0),
    /** Páginas, capítulo o sección concreta. */
    locator: text("locator"),
  },
  (t) => [
    primaryKey({ columns: [t.articleId, t.sourceId] }),
    index("article_sources_source_idx").on(t.sourceId),
  ],
);

/* ───────────────────────────── Grafo de conocimiento ───────────────────────────── */

export const articleRelations = pgTable(
  "article_relations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fromArticleId: uuid("from_article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    toArticleId: uuid("to_article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    type: relationType("type").notNull().default("related"),
    description: text("description"),
    /** Fuente que justifica la relación, cuando no es obvia. */
    sourceId: uuid("source_id").references(() => sources.id, { onDelete: "set null" }),
    createdById: uuid("created_by_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("article_relations_unique").on(t.fromArticleId, t.toArticleId, t.type),
    index("article_relations_to_idx").on(t.toArticleId),
  ],
);

/* ───────────────────────────── Línea de tiempo ───────────────────────────── */

export const timelineEvents = pgTable(
  "timeline_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    /** Año astronómico (negativo = antes de la era común). */
    startYear: bigint("start_year", { mode: "number" }).notNull(),
    endYear: bigint("end_year", { mode: "number" }),
    precision: datePrecision("precision").notNull(),
    /** Etiqueta legible que respeta la incertidumbre: "c. 2560 a. C.", "hace ~13 800 Ma". */
    displayDate: text("display_date").notNull(),
    uncertainty: text("uncertainty"),
    era: text("era").notNull(),
    region: text("region"),
    theme: text("theme"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    articleId: uuid("article_id").references(() => articles.id, { onDelete: "set null" }),
    sourceId: uuid("source_id").references(() => sources.id, { onDelete: "set null" }),
    status: editorialStatus("status").notNull().default("draft"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("timeline_events_slug_unique").on(t.slug),
    index("timeline_events_start_idx").on(t.startYear),
  ],
);

/* ───────────────────────────── Experiencias (3D, 360°, fotos) ───────────────────────────── */

export const experiences = pgTable(
  "experiences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    /** Tipo de experiencia disponible o prevista. */
    experienceType: experienceType("experience_type").notNull(),
    availability: experienceAvailability("availability").notNull().default("planned"),
    country: text("country"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    /** Las coordenadas son aproximadas (centro del sitio). */
    coordinatesApproximate: boolean("coordinates_approximate").notNull().default(true),
    unescoId: text("unesco_id"),
    articleId: uuid("article_id").references(() => articles.id, { onDelete: "set null" }),
    assetId: uuid("asset_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [uniqueIndex("experiences_slug_unique").on(t.slug)],
);

/* ───────────────────────────── Aprendizaje ───────────────────────────── */

export const learningPaths = pgTable(
  "learning_paths",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    difficulty: difficultyLevel("difficulty").notNull().default("beginner"),
    status: editorialStatus("status").notNull().default("draft"),
    createdById: uuid("created_by_id").references(() => users.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [uniqueIndex("learning_paths_slug_unique").on(t.slug)],
);

export const learningPathSteps = pgTable(
  "learning_path_steps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pathId: uuid("path_id")
      .notNull()
      .references(() => learningPaths.id, { onDelete: "cascade" }),
    position: smallint("position").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    /** Null mientras el artículo del paso no exista: se muestra como «en preparación». */
    articleId: uuid("article_id").references(() => articles.id, { onDelete: "set null" }),
  },
  (t) => [uniqueIndex("learning_path_steps_unique").on(t.pathId, t.position)],
);

/* ───────────────────────────── Biblioteca personal ───────────────────────────── */

export const favorites = pgTable(
  "favorites",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.articleId] })],
);

export const readingHistory = pgTable(
  "reading_history",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    readCount: integer("read_count").notNull().default(1),
    /** Porcentaje leído (0–100). */
    progress: smallint("progress").notNull().default(0),
    firstReadAt: timestamp("first_read_at", { withTimezone: true }).notNull().defaultNow(),
    lastReadAt: timestamp("last_read_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.articleId] }),
    index("reading_history_recent_idx").on(t.userId, t.lastReadAt),
  ],
);

export const collections = pgTable(
  "collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    ...timestamps,
  },
  (t) => [index("collections_user_idx").on(t.userId)],
);

export const collectionItems = pgTable(
  "collection_items",
  {
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.collectionId, t.articleId] })],
);

export const notes = pgTable(
  "notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    ...timestamps,
  },
  (t) => [index("notes_user_article_idx").on(t.userId, t.articleId)],
);

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    /** id del encabezado (ancla) dentro del artículo. */
    anchor: text("anchor").notNull(),
    label: text("label").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("bookmarks_unique").on(t.userId, t.articleId, t.anchor)],
);

/* ───────────────────────────── Búsqueda ───────────────────────────── */

/** Sinónimos para ampliar consultas ("faraón" ⇄ "rey de Egipto"). */
export const searchSynonyms = pgTable("search_synonyms", {
  id: uuid("id").primaryKey().defaultRandom(),
  term: text("term").notNull().unique(),
  synonyms: text("synonyms").array().notNull(),
});

/* ───────────────────────────── Auditoría ───────────────────────────── */

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    details: jsonb("details").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("audit_log_created_idx").on(t.createdAt),
    index("audit_log_entity_idx").on(t.entityType, t.entityId),
  ],
);

export type User = typeof users.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Source = typeof sources.$inferSelect;
export type EditorialStatus = (typeof editorialStatus.enumValues)[number];
export type UserRole = (typeof userRole.enumValues)[number];
export type DifficultyLevel = (typeof difficultyLevel.enumValues)[number];
export type EntityType = (typeof entityType.enumValues)[number];
export type ContentNotice = (typeof contentNotice.enumValues)[number];
