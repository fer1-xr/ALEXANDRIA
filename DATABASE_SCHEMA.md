# DATABASE_SCHEMA — ALEXANDRIA

Fuente de verdad: [`src/server/db/schema.ts`](src/server/db/schema.ts) (Drizzle). Migraciones en [`drizzle/`](drizzle/).

## Convenciones

- Claves UUID (`gen_random_uuid()`), salvo tablas de unión (clave compuesta) y sesiones/tokens (SHA-256 del token).
- Fechas `timestamptz` en UTC.
- **Años históricos**: numeración astronómica (1 a. C. = 0, 2 a. C. = −1). Tiempo profundo en `bigint`
  (el Big Bang es −13 787 000 000 aprox.). La etiqueta visible (`display_date`) expresa la incertidumbre.
- Idioma: `locale` corto (`es`, `en`, `pt`). Las traducciones de un artículo comparten `translation_group_id`.

## Migraciones

| Archivo | Contenido |
|---|---|
| `0000_extensions_and_search_config.sql` | Extensiones `pg_trgm`, `unaccent`, `vector`; configuración `es_unaccent`; funciones inmutables `f_unaccent` y `f_array_text` |
| `0001_core_schema.sql` | Enumeraciones, 25 tablas, índices y claves foráneas |
| `0002_trigram_indexes.sql` | Índices GIN de trigramas sobre títulos y nombres |

## Diagrama (relaciones principales)

```
users ─┬─< sessions            categories ─┬─< categories (parent)
       ├─< password_reset_tokens            ├─< articles (categoría principal)
       ├── user_preferences                 └─< article_categories >─ articles
       ├─< favorites >──────────┐
       ├─< reading_history >────┤          articles ─┬─< article_sources >─ sources
       ├─< collections ─< collection_items >┤         ├─< article_relations (from/to) >─ articles
       ├─< notes >──────────────┤                     ├─< article_revisions
       ├─< bookmarks >──────────┘                     ├─< article_media >─ media_assets
       └─< audit_log (actor)                          ├─< timeline_events
                                                      ├─< experiences
learning_paths ─< learning_path_steps >───────────────┘
search_synonyms (independiente)
```

## Tablas

### Usuarios y seguridad
| Tabla | Propósito | Campos clave |
|---|---|---|
| `users` | Cuentas | `email` (único sin distinguir mayúsculas), `password_hash` (Argon2id), `role` (`registered`/`student`/`editor`/`admin`; el visitante es la ausencia de sesión), `plan` (`free`/`premium`), `locale`, `disabled_at` |
| `sessions` | Sesiones activas | `id` = SHA-256 del token, `expires_at`, `user_agent` |
| `password_reset_tokens` | Recuperación | hash del token, `expires_at`, `used_at` |
| `user_preferences` | Preferencias | `theme`, `font_scale`, `reading_level`, `history_enabled`, `analytics_consent` (falso por defecto) |

### Taxonomía y contenido
| Tabla | Propósito | Campos clave |
|---|---|---|
| `categories` | Árbol de ramas | `parent_id`, `path` materializado (`historia/civilizaciones/egipto`, único), `depth`, `sort_order`, `icon`, `archived_at` |
| `articles` | Artículos enciclopédicos | `slug` (único por `locale`), `title`, `subtitle`, `summary`, `content` (Markdown), `entity_type`, `category_id`, `keywords[]`, `facts` (jsonb), `difficulty` (6 niveles), `reading_minutes`, `status` (flujo editorial), `verification`, `ai_assisted`, `notices[]`, `reviewed_at/by`, `author_id`, `author_credit`, `content_license`, `allow_download`, `published_at`, `search_vector` (generada) |
| `article_categories` | Categorías secundarias | `(article_id, category_id)` |
| `article_revisions` | Historial | `version`, `snapshot` (jsonb), `from_status`, `to_status`, `change_note`, `changed_by_id` |
| `article_relations` | Grafo de conocimiento | `from/to_article_id`, `type` (11 tipos), `description`, `source_id` (justificación) — único por (from, to, type) |
| `media_assets` | Multimedia centralizada | `kind`, `url`, `original_url`, `author`, `provider`, `license`, `license_url`, `credit`, `usage_conditions`, `alt_text`, `rights_status` |
| `article_media` | Galería del artículo | `position`, `caption` |
| `sources` | Fuentes | `external_id` (DOI/URL; deduplicación), `kind`, `title`, `authors`, `publisher`, `year`, `url`, `doi`, `isbn`, `provider`, `license`, `reuse_policy`, `accessed_at`, `verification`, `ingestion_method`, `notes` |
| `article_sources` | Citas | `position` (orden), `locator` (páginas/capítulo). Una fuente citada no se puede borrar |

### Experiencias, cronología y aprendizaje
| Tabla | Propósito | Campos clave |
|---|---|---|
| `timeline_events` | «Viaja por la historia» | `start_year`, `end_year`, `precision`, `display_date`, `uncertainty`, `era`, `region`, `theme`, `lat/lon`, `article_id`, `source_id`, `status` |
| `experiences` | Catálogo 3D/360°/fotos | `experience_type` (modelo 3D, 360°, fotos, modelo simplificado, reconstrucción), `availability` (`available`/`in_production`/`planned`), `lat/lon` + `coordinates_approximate`, `unesco_id`, `asset_id` |
| `learning_paths`, `learning_path_steps` | Rutas | pasos ordenados; `article_id` nulo = paso «en preparación» |

### Biblioteca personal
`favorites`, `reading_history` (`progress` 0–100, `read_count`), `collections`, `collection_items`, `notes`,
`bookmarks` (ancla de sección). Todas con `ON DELETE CASCADE` desde `users`.

### Búsqueda y auditoría
`search_synonyms` (`term`, `synonyms[]`) y `audit_log` (`actor_id`, `action`, `entity_type`, `entity_id`, `details`).

## Índices destacados

- `articles_search_idx` — GIN sobre `search_vector`.
- `articles_title_trgm_idx`, `categories_name_trgm_idx`, `timeline_events_title_trgm_idx` — GIN `gin_trgm_ops`.
- `articles_locale_slug_unique`, `categories_path_unique`, `users_email_unique (lower(email))`.
- Compuestos: `(category_id, status)`, `(status, published_at)`, `(entity_type, status)`, `(user_id, last_read_at)`.

## Previsto (no creado todavía)

- `article_chunks` (Fase 4): `article_id`, `anchor`, `text`, `embedding vector(N)` con índice HNSW. `N` depende del
  modelo de embeddings elegido.
- `courses`, `lessons`, `quizzes`, `questions`, `attempts`, `certificates`, `flashcards` (Fase 5).
- `ingestion_jobs` (Fase 2) para trazar importaciones desde APIs abiertas.
- `category_translations` (Fase 6).
