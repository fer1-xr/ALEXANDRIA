# ALEXANDRIA

**Biblioteca universal digital, interactiva e inteligente.**
_Todo el conocimiento de la humanidad, a un solo lugar de distancia._

ALEXANDRIA es una plataforma para estudiar, explorar y descubrir cualquier rama del conocimiento mediante
artículos interconectados, cronologías, mapas, experiencias interactivas y un asistente que cita sus fuentes.

> **Estado:** Fase 1 (Fundamentos) completada y probada. Ver [`TASKS.md`](TASKS.md) para el detalle de lo que
> funciona hoy y [`ROADMAP.md`](ROADMAP.md) para lo que falta.

## Qué funciona hoy

| Área | Funcionalidad |
|---|---|
| Portada | 14 secciones (buscador, AI, ramas, universo, viaje por la historia, monumentos, ciencia, conocimiento del día, personajes, 3D, continúa aprendiendo, recomendados, rutas) |
| Enciclopedia | Taxonomía de 17 ramas y 397 categorías; 24 artículos de demostración con fuentes; lectura con índice, ficha, avisos, modo oscuro, tamaño de letra, TTS del navegador, compartir, imprimir |
| Grafo | Relaciones tipadas y bidireccionales entre artículos, con justificación opcional |
| Búsqueda | Texto completo en español sin tildes, trigramas (errores ortográficos), sinónimos, preguntas naturales, facetas, «¿Quisiste decir…?», autocompletado accesible |
| Exploración | Explorar por ramas, Descubrir, «Sorpréndeme», línea de tiempo con 45 acontecimientos y filtros, atlas esquemático, catálogo honesto de experiencias 3D |
| ALEXANDRIA AI | **Modo recuperación**: pasajes citados con enlace a la sección y fuentes; reconoce cuando no hay información suficiente. Sin modelo generativo todavía (Fase 4) |
| Aprender | 2 rutas de aprendizaje con progreso calculado a partir del historial |
| Cuentas | Registro, inicio y cierre de sesión, recuperación de contraseña, perfil, preferencias, cambio de contraseña, borrado de cuenta |
| Mi biblioteca | Favoritos, colecciones, notas privadas, marcadores por sección, historial (desactivable), progreso |
| CMS | Artículos con flujo Borrador → En revisión → Aprobado → Publicado → Archivado, revisiones, verificación humana, relaciones, vista previa; categorías jerárquicas; fuentes con licencia y verificación; registro multimedia con derechos; usuarios y roles; auditoría |

## Requisitos

- Node.js 22 o superior.
- PostgreSQL 16 o superior con las extensiones `pg_trgm`, `unaccent` y `vector` (pgvector).

## Puesta en marcha (desarrollo)

```bash
cp .env.example .env            # y ajusta DATABASE_URL
npm install
npm run db:setup-local          # solo PostgreSQL local: rol, bases y extensiones (requiere sudo/postgres)
npm run db:migrate
npm run db:seed                 # taxonomía, fuentes, artículos de demostración, cronología…
ADMIN_EMAIL=tu@correo ADMIN_PASSWORD='una frase larga' npm run db:create-admin
npm run dev                     # http://localhost:3000
```

Las extensiones requieren privilegios de superusuario. En servicios gestionados (Supabase, Neon, RDS, Cloud SQL)
están disponibles pero deben activarse desde su panel o con un usuario administrador antes de migrar.

### Correo

Sin `SMTP_HOST`, los correos de recuperación **no se envían**: en desarrollo se imprimen en la consola del servidor
(marcados como «correo de desarrollo — NO enviado»); en producción se registra un error y el usuario ve un aviso.
Configura cualquier proveedor SMTP (Amazon SES, Postmark, Mailgun, Brevo…) con las variables de `.env.example`.

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` / `build` / `start` | Desarrollo, compilación y servidor de producción |
| `npm run typecheck` / `lint` | TypeScript estricto y ESLint |
| `npm test` | Pruebas unitarias e integración (Vitest). La integración usa `TEST_DATABASE_URL` y la reinicia |
| `npm run test:e2e` | Pruebas E2E (Playwright) contra `http://localhost:3000` (arranca `npm start` si no hay servidor) |
| `npm run db:migrate` / `db:seed` / `db:create-admin` | Migraciones, carga inicial idempotente y cuenta de administración |
| `npm run db:generate` | Genera una migración a partir de cambios en `src/server/db/schema.ts` |

> **Compilación:** con Cache Components, `next build` prerenderiza el contenido público y **necesita acceso a la base de
> datos**. Ejecuta las migraciones y el seed antes de compilar.

## Despliegue (Vercel + Supabase)

- **Base de datos**: proyecto Supabase con las extensiones `pg_trgm`, `unaccent` y `vector` creadas por el
  administrador, y un rol propio `alexandria_app` dueño de las tablas. Todas las tablas tienen RLS activado sin
  políticas, de modo que la API de datos pública de Supabase no expone nada; la app, como dueña, no se ve afectada.
- **Conexión**: a través del pooler de Supabase en modo transacción (puerto 6543, IPv4), con
  `DATABASE_PREPARE=false` y `DATABASE_POOL_MAX` bajo (1–3).
- **Build**: Vercel ejecuta `npm run vercel-build` = migraciones pendientes → (seed si `SEED_ON_BUILD=1`) → `next build`.
  Las vistas previas no migran (comparten la base de producción) salvo `MIGRATE_ON_PREVIEW=1`.
  **Usa `SEED_ON_BUILD=1` solo en el primer despliegue**: el seed restaura los artículos de demostración a su versión
  original y pisaría las ediciones hechas desde el CMS.
- **Variables**: `DATABASE_URL`, `DATABASE_PREPARE`, `DATABASE_POOL_MAX`, `APP_URL` y, opcionalmente, las de SMTP.

## Estructura

```
src/
  app/                 Rutas (App Router): público, cuenta, mi-biblioteca, admin, api
  components/          UI: layout, article, search, home, library, admin, forms, ui
  lib/                 Código compartido sin dependencias de servidor (validación, etiquetas, fechas)
  server/
    db/                Esquema Drizzle y cliente PostgreSQL
    auth/              Contraseñas, sesiones, permisos, limitación de tasa, guardas
    queries/           Lecturas (públicas cacheadas, personales, administración)
    actions/           Server Actions (auth, biblioteca, cuenta, admin)
    search/            Búsqueda híbrida
    ai/                Recuperación de pasajes y capa de proveedores de IA
    editorial/         Máquina de estados editorial
    content/           Markdown → HTML saneado
drizzle/               Migraciones SQL
scripts/               Migración, seed, creación de administrador, preparación de la base local
tests/                 unit, integration, e2e
```

## Documentación

- [`PROJECT_PLAN.md`](PROJECT_PLAN.md) — visión, análisis inicial, decisiones y riesgos.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — arquitectura técnica, seguridad, rendimiento y despliegue.
- [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md) — modelo de datos.
- [`CONTENT_SOURCES.md`](CONTENT_SOURCES.md) — política de fuentes, licencias y estado de verificación.
- [`ROADMAP.md`](ROADMAP.md) — fases 1 a 6.
- [`TASKS.md`](TASKS.md) — estado detallado y próximos pasos.

## Contenido de demostración: aviso importante

Los 24 artículos iniciales fueron **redactados con asistencia de IA** y se muestran con ese aviso y con el estado
«Sin verificación humana». Sus 52 referencias corresponden a obras e instituciones reales, pero no pudieron consultarse
desde el entorno de desarrollo (sin acceso a Internet), por lo que figuran como **pendientes de verificación** y sin
fecha de consulta. Antes de un lanzamiento público, el equipo editorial debe revisarlos desde el CMS.
