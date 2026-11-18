-- Fija el search_path de las funciones auxiliares (aviso 0011 del linter de Supabase).
-- Ambas referencian solo objetos de pg_catalog o calificados con public.
ALTER FUNCTION f_unaccent(text) SET search_path = pg_catalog, public;--> statement-breakpoint
ALTER FUNCTION f_array_text(text[]) SET search_path = pg_catalog, public;
