# ROADMAP — ALEXANDRIA

Leyenda: ✅ hecho y probado · 🟡 parcial · ⬜ pendiente

## Fase 1 — Fundamentos ✅

| Entregable | Estado |
|---|---|
| Inspección del entorno, arquitectura, plan y riesgos | ✅ |
| Identidad visual (paleta, tipografías, logotipo original, modo oscuro) | ✅ |
| Base de datos (25 tablas, 3 migraciones) | ✅ |
| Autenticación, sesiones, roles y permisos | ✅ |
| Navegación (escritorio y móvil) y página principal (14 secciones) | ✅ |
| Sistema de categorías jerárquico y extensible | ✅ |
| Artículos (lectura completa) | ✅ |
| Buscador inicial (FTS + trigramas + sinónimos + sugerencias) | ✅ |
| Panel administrativo (artículos, categorías, fuentes, multimedia, usuarios, auditoría) | ✅ |
| Adelantos de otras fases: biblioteca personal, línea de tiempo, rutas, Descubrir, AI en modo recuperación | ✅ |

## Fase 2 — Enciclopedia ⬜

- Ingestión de fuentes abiertas: Wikidata (metadatos), Wikimedia Commons (imágenes con licencia por archivo),
  NASA, Smithsonian Open Access, Europeana. Tabla `ingestion_jobs`, deduplicación por `external_id`, revisión editorial.
- Verificación editorial de los 24 artículos y 52 fuentes de demostración.
- Ampliación progresiva: civilizaciones, biografías, países (ficha completa: historia, geografía, población, cultura,
  economía, gobierno, idiomas, religiones, gastronomía, patrimonio…), acontecimientos.
- Módulo Paraguay y América Latina en profundidad.
- Galerías multimedia en artículos (`article_media`) con subida a object storage S3 + CDN y optimización de imágenes.
- Explorador visual del grafo de conocimiento.
- CMS: gestión de línea de tiempo, experiencias y rutas (hoy solo por seed); traducciones con marca de traducción
  automática y revisión.
- Fichas de especies (taxonomía, hábitat, conservación…) con datos de fuentes abiertas.

## Fase 3 — Experiencias interactivas ⬜

- Atlas interactivo con MapLibre + teselas (OSM con política de uso o proveedor); mapas históricos.
- Línea de tiempo visual con escala logarítmica para el tiempo profundo.
- Sistema solar 3D (React Three Fiber) con modo escala real / escala ilustrativa.
- Monumentos: modelos glTF/GLB con licencia verificada (Sketchfab CC, Smithsonian 3D, fotogrametría propia),
  carga progresiva (Draco/meshopt), puntos de interés, recorridos guiados, comparación entre épocas, pantalla completa.
- CesiumJS para el globo 3D si los costes de Cesium ion lo justifican.
- Anatomía interactiva (modelo con licencia; p. ej. BodyParts3D, CC BY-SA).

## Fase 4 — Inteligencia artificial ⬜

- Implementar `LanguageModelProvider` (proveedor intercambiable) con clave en el servidor.
- `article_chunks` + embeddings en pgvector; búsqueda híbrida léxica + semántica (fusión de rangos) y reranking.
- Respuestas con citas obligatorias, separación hechos/hipótesis/controversias, «no lo sé» explícito.
- Seis niveles de explicación (infantil → especializado), resúmenes, comparaciones, cuestionarios y rutas generadas
  — siempre marcados como generados por IA y pendientes de revisión si se guardan como contenido.
- Análisis de documentos subidos por el usuario (con permisos y límites de tamaño).
- Registro de trazabilidad de cada respuesta (pasajes usados).

## Fase 5 — Educación ⬜

- Cursos, lecciones, módulos, cuestionarios, ejercicios, flashcards con repetición espaciada.
- Seguimiento de progreso, objetivos personales y certificados internos de finalización.

## Fase 6 — Escalabilidad ⬜

- Internacionalización completa (es/en/pt) de interfaz y contenido.
- CSP con nonces, limitador distribuido (Redis/Valkey), verificación de correo, 2FA para el panel.
- Analítica respetuosa con consentimiento; monetización opcional (plan premium sin limitar la exploración básica).
- Infraestructura: Docker verificado, CI/CD, entornos de pruebas, backups automáticos y PITR, monitorización
  (OpenTelemetry), logs estructurados, CDN.
- Evaluar Meilisearch/OpenSearch si el volumen de contenido lo exige.
