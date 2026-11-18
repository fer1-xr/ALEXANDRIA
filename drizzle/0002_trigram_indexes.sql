-- Índices de trigramas para autocompletado y tolerancia a errores ortográficos.
CREATE INDEX IF NOT EXISTS articles_title_trgm_idx
  ON articles USING gin (f_unaccent(lower(title)) gin_trgm_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS categories_name_trgm_idx
  ON categories USING gin (f_unaccent(lower(name)) gin_trgm_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS timeline_events_title_trgm_idx
  ON timeline_events USING gin (f_unaccent(lower(title)) gin_trgm_ops);
