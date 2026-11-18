# TASKS — Estado del proyecto

_Última actualización: 18 de noviembre de 2026 · Fase 1 completada._

## Verificación de la Fase 1

| Comprobación | Resultado |
|---|---|
| `npm run typecheck` | ✅ sin errores |
| `npm run lint` | ✅ sin errores ni avisos |
| `npm test` (Vitest) | ✅ 41/41 — 34 unitarias + 7 de integración con PostgreSQL real |
| `npm run build` | ✅ sin avisos; 24 artículos prerenderizados |
| `npm run test:e2e` (Playwright, contra el build de producción) | ✅ 15/15 — 13 escritorio + 2 móvil (Pixel 7) |
| Revisión visual | ✅ portada, artículo, atlas, línea de tiempo, Mi biblioteca, panel; claro/oscuro; escritorio/móvil |

Qué cubren las pruebas: permisos por rol; flujo editorial (incluido el bloqueo sin fuentes y la fecha de revisión
médica); saneado XSS del Markdown y de los fragmentos de búsqueda; validación de formularios; limitador de tasa;
anclas de pasajes; integridad del seed (referencias, fechas aproximadas honestas); seed idempotente; FTS sin
tildes; trigramas; unicidad de correo; Argon2id; borrado en cascada; restricciones de borrado; E2E de portada,
buscador, artículo, Sorpréndeme, línea de tiempo, AI, experiencias, 404, registro, biblioteca, control de acceso,
login fallido, flujo editorial completo y móvil sin desbordes.

## Hecho

- [x] Inspección del entorno y documentación inicial (PROJECT_PLAN, ARCHITECTURE, DATABASE_SCHEMA, CONTENT_SOURCES, ROADMAP)
- [x] Next.js 16 + TypeScript + Tailwind 4 + Drizzle + PostgreSQL (pg_trgm, unaccent, pgvector)
- [x] Esquema y migraciones; seed idempotente (397 categorías, 52 fuentes, 24 artículos, 25 relaciones, 45 acontecimientos, 12 experiencias, 2 rutas, 17 grupos de sinónimos)
- [x] Identidad visual y logotipo original; modo oscuro sin parpadeo; tamaño de lectura persistente
- [x] Cabecera con menú de ramas generado desde la base, menú móvil, buscador con Ctrl/⌘+K
- [x] Portada con 14 secciones con datos reales
- [x] Explorar (taxonomía completa) y páginas de rama con subramas y estado «en preparación»
- [x] Artículo: índice con sección activa, ficha, avisos editoriales, verificación, fuentes con estado, relaciones bidireccionales, cronología, palabras clave, TTS, compartir, imprimir, JSON-LD
- [x] Búsqueda: resultados con facetas, sugerencias, corrección, sinónimos, ramas y acontecimientos relacionados, paginación
- [x] Descubrir, Sorpréndeme, recomendaciones según el historial
- [x] Línea de tiempo con filtros (era, región, tema) e incertidumbre explícita
- [x] Experiencias (catálogo honesto) y atlas esquemático
- [x] Rutas de aprendizaje con progreso
- [x] ALEXANDRIA AI en modo recuperación
- [x] Cuentas: registro, login, logout, recuperación, perfil, preferencias, cambio de contraseña, borrado de cuenta
- [x] Mi biblioteca: favoritos, colecciones, notas, marcadores, historial (desactivable y borrable), progreso
- [x] CMS: artículos (crear, editar, vista previa, revisiones, flujo editorial, verificación, relaciones, categorías secundarias), categorías (crear, editar, mover con reescritura de rutas, archivar), fuentes, multimedia, usuarios (roles, desactivar), auditoría
- [x] Seguridad: Argon2id, sesiones con hash, permisos en cada acción, rate limiting, CSP y cabeceras, saneado, validación Zod
- [x] SEO: metadatos, Open Graph, sitemap, robots, JSON-LD; `/api/health`
- [x] Dockerfile, docker-compose y CI escritos (**no verificados**: ver «Bloqueos»)

## Pendiente inmediato (para retomar)

1. **Verificación editorial** de los 24 artículos y 52 fuentes (ver CONTENT_SOURCES.md › Proceso).
2. **Revisión legal** de la política de privacidad y decisión de la licencia del contenido propio (`allow_download`).
3. **CMS** para línea de tiempo, experiencias y rutas (hoy solo se cargan por seed).
4. **Object storage** S3 + subida de archivos multimedia con validación de tipo y tamaño.
5. Configurar **SMTP** en producción para la recuperación de contraseña.
6. Empezar la **Fase 2** (ingestión de Wikidata/Commons) cuando el entorno tenga acceso a Internet.

## Bloqueos y limitaciones conocidas

- **Sin acceso a Internet** en el entorno de desarrollo: no se pudieron verificar fuentes ni importar datos o imágenes.
- **Sin demonio Docker**: `Dockerfile` y `docker-compose.yml` están escritos pero no probados.
- **CI no ejecutada**: el proyecto aún no está en un repositorio remoto.
- El limitador de tasa es en memoria (válido para una instancia).
- La CSP permite scripts en línea (necesario para Next.js sin nonces).
- Las sesiones duran 30 días sin renovación deslizante.
- Un `notFound()` dentro de contenido en streaming devuelve la página 404 con código HTTP 200 (comportamiento del
  streaming de Next.js; la página incluye `noindex`). Las rutas inexistentes fuera de rutas dinámicas sí devuelven 404.

## Decisiones registradas

- Drizzle en lugar de Prisma (SQL explícito para FTS/trigramas/columnas generadas).
- Autenticación propia en lugar de una librería externa.
- Fase 1 sin proveedor de IA: modo recuperación honesto en lugar de simular respuestas.
- Sin imágenes externas hasta verificar licencias: portadas tipográficas decorativas.
- Contenido de demostración publicado pero marcado como «asistido por IA · sin verificación humana».
