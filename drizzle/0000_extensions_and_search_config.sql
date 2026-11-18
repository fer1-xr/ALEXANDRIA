-- Extensiones requeridas. En servicios gestionados (RDS, Supabase, Neon…) están disponibles
-- pero pueden requerir privilegios: ver README.md › Base de datos.
CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS unaccent;--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint

-- Configuración de búsqueda en español que ignora tildes y diéresis
-- ("Egipto" = "egipto", "evolución" = "evolucion").
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_ts_config WHERE cfgname = 'es_unaccent') THEN
    CREATE TEXT SEARCH CONFIGURATION es_unaccent (COPY = spanish);
    ALTER TEXT SEARCH CONFIGURATION es_unaccent
      ALTER MAPPING FOR hword, hword_part, word WITH unaccent, spanish_stem;
  END IF;
END
$$;--> statement-breakpoint

-- unaccent() no es IMMUTABLE; este envoltorio sí, para poder indexar expresiones.
CREATE OR REPLACE FUNCTION f_unaccent(text) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
  AS $func$ SELECT public.unaccent('public.unaccent'::regdictionary, $1) $func$;
--> statement-breakpoint

-- array_to_string() es STABLE; para text[] el resultado es determinista.
CREATE OR REPLACE FUNCTION f_array_text(text[]) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE
  AS $func$ SELECT coalesce(array_to_string($1, ' '), '') $func$;
