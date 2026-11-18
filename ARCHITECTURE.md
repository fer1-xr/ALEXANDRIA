# ARCHITECTURE — ALEXANDRIA

## Visión general

```
Navegador ──HTTPS──▶ Next.js 16 (Node.js)
                     ├─ Rutas App Router (RSC + streaming)
                     │   ├─ Contenido público: `use cache` + etiquetas → prerender parcial (PPR)
                     │   └─ Contenido personal: lectura de sesión dentro de <Suspense>
                     ├─ Server Actions (mutaciones; validación Zod; autorización por permiso)
                     ├─ Route Handlers: /api/search/suggest, /api/health, /descubrir/sorprendeme
                     └─ Capa de servidor (src/server)
                          ├─ db (Drizzle + postgres.js) ──▶ PostgreSQL 16 (+ pg_trgm, unaccent, pgvector)
                          ├─ auth, editorial, search, ai, content, mail
                          └─ audit
```

Es un **monolito modular**: un único despliegue con módulos separados por dominio (`src/server/*`). Cuando el
crecimiento lo justifique, los candidatos naturales a servicio independiente son la búsqueda, la ingestión de fuentes
y la IA (RAG), porque ya están detrás de interfaces propias.

## Modelo de renderizado y caché (Cache Components)

- **Datos públicos** (`src/server/queries/content.ts`, `src/server/search/search.ts`): funciones con `"use cache"`,
  `cacheLife(...)` y `cacheTag("articles" | "article:<slug>" | "categories" | "timeline" | "experiences" | "paths")`.
  Forman parte del shell estático y se sirven al instante.
- **Invalidación**: las Server Actions del CMS llaman a `updateTag(...)` tras cada cambio (lectura de lo propio).
- **Datos personales**: `getCurrentUser()` llama a `connection()` y lee la cookie; siempre se usa dentro de
  `<Suspense>`, de modo que la página pública se prerenderiza y la parte personal llega en streaming.
- **Artículos**: `generateStaticParams` prerenderiza los publicados; los nuevos se generan bajo demanda.
- **Aleatoriedad** («Sorpréndeme», «Hoy podrías descubrir»): `connection()` + `ORDER BY random()` en la petición.

## Seguridad

| Requisito | Implementación |
|---|---|
| Contraseñas | Argon2id (m=19 MiB, t=2, p=1 — OWASP); igualación de tiempos si el usuario no existe |
| Sesiones | Token de 256 bits en cookie `httpOnly`, `SameSite=Lax`, `Secure` y prefijo `__Host-` en producción; en BD solo el SHA-256; caducidad 30 días comparada en SQL; cierre de todas las sesiones al cambiar/restablecer contraseña o desactivar la cuenta |
| Recuperación de contraseña | Token de un solo uso, hash en BD, 60 min; respuesta idéntica exista o no la cuenta |
| Autorización | Matriz de permisos pura (`src/server/auth/permissions.ts`); cada Server Action llama a `authorize(permiso)`; la UI nunca es la barrera |
| Datos personales | Las consultas de biblioteca obtienen el usuario de la sesión; nunca aceptan un `userId` del cliente; las colecciones se comprueban por propietario |
| SQL injection | Consultas parametrizadas (Drizzle / plantillas `sql`); comodines LIKE escapados |
| XSS | React escapa por defecto; Markdown saneado con rehype-sanitize; fragmentos de búsqueda escapados antes de resaltar; JSON-LD con `<` escapado |
| CSRF | Server Actions con comprobación de origen de Next.js; cookies `SameSite=Lax`; los Route Handlers son GET sin efectos |
| Redirecciones abiertas | `next` solo admite rutas internas |
| Rate limiting | Ventana deslizante por IP/cuenta en login, registro, recuperación, sugerencias y cambio de contraseña (en memoria: ver F6) |
| Cabeceras | CSP (sin terceros), `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS en producción |
| Secretos | Solo variables de entorno del servidor; `.env*` excluido de git (salvo `.env.example`) |
| Auditoría | Tabla `audit_log` para toda acción administrativa (no editable desde la app) |

**Pendiente (F6)**: CSP con nonces (eliminar `'unsafe-inline'`), limitador distribuido, verificación de correo,
2FA para editores y administradores, escaneo de archivos subidos cuando exista la subida directa.

## Búsqueda

1. `websearch_to_tsquery` (todos los términos) y una consulta OR derivada de `plainto_tsquery` (preguntas naturales).
2. Configuración `es_unaccent` = `spanish` + `unaccent` → «evolución» = «evolucion», con lematización.
3. Vector ponderado: título (A), subtítulo y palabras clave (B), resumen (C), contenido (D) — columna generada + GIN.
4. Trigramas (`pg_trgm`) sobre `f_unaccent(lower(title))` para errores ortográficos y autocompletado.
5. Sinónimos desde la tabla `search_synonyms`.
6. Puntuación: `ts_rank_cd` + bonificación por coincidir todos los términos + similitud del título + título exacto.
7. «¿Quisiste decir…?» con la similitud de títulos y palabras clave cuando hay menos de 3 resultados.

## ALEXANDRIA AI

- **Fase 1 (implementado)**: recuperación — búsqueda híbrida → división por secciones (anclas idénticas a las del
  artículo) → `ts_rank_cd` por pasaje → extractos resaltados + fuentes de los artículos usados + umbral de
  «información insuficiente».
- **Fase 4**: `src/server/ai/providers.ts` define `LanguageModelProvider` (respuesta con citas obligatorias y
  bandera de información insuficiente). Se añadirán embeddings en pgvector (`article_chunks`), búsqueda híbrida
  léxica + semántica con fusión de rangos, reranking y generación con niveles de explicación.

## Rendimiento

- Prerender parcial: shell estático + streaming; artículos prerenderizados en el build.
- Fuentes autoalojadas (`@fontsource`) sin peticiones externas.
- Sin imágenes externas en F1; F2 usará `next/image` + CDN.
- Índices: GIN (FTS y trigramas), compuestos por estado/categoría/fecha, únicos por `(locale, slug)`.
- Componentes 3D (F3) cargados con `dynamic()` solo en sus páginas.

## Accesibilidad

Enlace «Saltar al contenido», jerarquía de encabezados, `aria-*` en combobox, menús y diálogos, foco visible,
`prefers-reduced-motion`, contraste AA en ambos temas, formularios con etiquetas y errores asociados,
navegación por teclado (Esc, flechas, Ctrl/⌘+K).

## Despliegue

- `Dockerfile` multi-etapa y `docker-compose.yml` (PostgreSQL con pgvector + app). **No verificados en este entorno**
  (sin demonio Docker). El build necesita la base: compilar con `network: host` contra la base publicada.
- CI: `.github/workflows/ci.yml` (lint, tipos, pruebas unitarias e integración, build y E2E con PostgreSQL de
  servicio). **No ejecutado todavía** (requiere un repositorio en GitHub).
- Entornos: desarrollo (`.env`), pruebas (`TEST_DATABASE_URL`), producción (variables del proveedor).
- Copias de seguridad: `pg_dump` diario + PITR del proveedor gestionado (F6).
- Monitorización: `/api/health` (estado de la base); logs estructurados y trazas OpenTelemetry en F6.
