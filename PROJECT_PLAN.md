# PROJECT_PLAN — ALEXANDRIA

## 1. Visión

Una biblioteca universal digital donde cualquier persona pueda entrar sin saber qué buscar y salir habiendo
descubierto algo nuevo. Combina enciclopedia multimedia, atlas, cronologías, experiencias inmersivas, aprendizaje
progresivo y un asistente de IA que **cita sus fuentes y reconoce lo que no sabe**.

Principios no negociables:

1. **Honestidad del producto**: nada se simula. Una experiencia 3D sin modelo se muestra como «planificada»; un
   asistente sin modelo generativo funciona en «modo recuperación» y lo dice; una fuente no consultada no tiene fecha
   de consulta.
2. **Trazabilidad**: cada artículo cita fuentes; cada fuente registra licencia, uso permitido y verificación; cada
   cambio editorial genera una revisión y una entrada de auditoría.
3. **Verificación humana**: el contenido asistido por IA nunca se presenta como verificado.
4. **Crecimiento sostenible**: la taxonomía, las experiencias y el contenido crecen desde el CMS, sin tocar código.

## 2. Análisis del entorno (inicio del proyecto)

| Elemento | Estado encontrado |
|---|---|
| Directorio de trabajo | Vacío: proyecto nuevo |
| Node.js / npm | 22 / 10.9 |
| PostgreSQL | 16 instalado (servidor detenido); se instaló `pgvector` desde el repositorio de la distribución |
| Docker | Solo el cliente; sin demonio disponible → los archivos Docker no se pudieron probar |
| Red | Registro npm accesible; **Internet general bloqueado** (UNESCO, NASA, Wikimedia, DOI…): no fue posible verificar fuentes ni importar datos abiertos |
| Navegador | Chromium + Playwright 1.63 preinstalados → pruebas E2E reales |

## 3. Decisiones técnicas (resumen; detalle en ARCHITECTURE.md)

| Decisión | Elección | Motivo |
|---|---|---|
| Framework | Next.js 16 (App Router, Cache Components) + React 19 + TypeScript estricto | SSR/streaming, prerender parcial, Server Actions, un solo despliegue |
| Estilos | Tailwind CSS 4 con tokens propios | Sistema de diseño consistente, modo oscuro por clase |
| Base de datos | PostgreSQL 16 | Relacional, FTS nativo en español, trigramas, pgvector para la Fase 4 |
| ORM | **Drizzle** (en lugar de Prisma) | SQL explícito para tsvector, columnas generadas, trigramas y `unnest`; migraciones SQL legibles; sin motor binario |
| Búsqueda | PostgreSQL FTS (`es_unaccent`) + `pg_trgm` + sinónimos | Suficiente hasta ~100 000 artículos; Meilisearch/OpenSearch solo si el volumen lo justifica |
| Autenticación | Propia: Argon2id + sesiones en BD (token aleatorio, solo su hash persiste) + cookies `httpOnly` | Control total, sin dependencias de terceros, fácil de auditar |
| IA | Interfaz de proveedores intercambiables; Fase 1 sin proveedor | Evita dependencia de un único proveedor; nada de claves en el cliente |
| Contenido | Markdown (GFM) saneado con rehype-sanitize | Editable por personas, seguro frente a XSS |
| Pruebas | Vitest (unidad + integración con PostgreSQL real) y Playwright (E2E escritorio y móvil) | Cubren lógica, base de datos y navegador |

## 4. Dependencias, servicios externos y costes

| Servicio | Necesario | Coste | Alternativa gratuita / limitación |
|---|---|---|---|
| PostgreSQL gestionado (con pgvector) | Sí | Desde 0 € (planes gratuitos de Supabase/Neon) a ~25–50 €/mes | Autoalojado en un VPS |
| Hosting Node.js | Sí | 0–20 €/mes (VPS, Render, Railway, Fly) | Vercel Hobby (no comercial) |
| SMTP transaccional | Para recuperar contraseña | 0 € hasta ~3 000 correos/mes en varios proveedores | — |
| Object storage S3 + CDN | Fase 2 (multimedia) | Céntimos por GB (Cloudflare R2 sin coste de salida) | MinIO autoalojado |
| Proveedor de LLM + embeddings | Fase 4 | Pago por uso (céntimos por consulta) | Modelos abiertos autoalojados (requieren GPU) |
| Mapas / globo 3D | Fase 3 | OSM gratis con política de uso justo; Cesium ion y Google Maps con cuotas | MapLibre + teselas propias o de proveedor con plan gratuito |
| Modelos 3D | Fase 3 | Variable; muchos CC en Sketchfab | Fotogrametría propia, Smithsonian 3D (CC0 en parte) |

## 5. Plan por fases

Ver [ROADMAP.md](ROADMAP.md). Resumen: **F1 Fundamentos** (completada) → F2 Enciclopedia → F3 Experiencias
interactivas → F4 Inteligencia artificial → F5 Educación → F6 Escalabilidad.

## 6. Riesgos

### Técnicos

| Riesgo | Mitigación |
|---|---|
| Next.js 16 / Cache Components es reciente y cambia APIs | Documentación local consultada; patrones oficiales (Suspense para sesión, `use cache` + etiquetas); pruebas E2E sobre el build de producción |
| `next build` necesita la base de datos (prerender) | Documentado; en CI se levanta PostgreSQL de servicio; en Docker se compila con red al host |
| Limitador de tasa en memoria no sirve con varias réplicas | Interfaz aislada; sustituir por Redis/Valkey en F6 |
| Rendimiento de FTS con millones de documentos | Índices GIN; plan de migración a motor dedicado + embeddings |
| Modelos 3D pesados bloqueando la navegación | Carga diferida, niveles de detalle, Draco/meshopt, nunca en la ruta crítica de lectura |
| Alucinaciones del asistente | RAG estricto: respuesta solo con pasajes recuperados, citas obligatorias, umbral de «información insuficiente» |

### Legales y de contenido

| Riesgo | Mitigación |
|---|---|
| Reutilizar contenido protegido (Britannica, National Geographic…) | Clasificación de uso por fuente (`reuse_policy`); por defecto solo enlace y cita |
| Licencias CC con obligaciones (BY, SA) | Registro de autor, licencia y URL por recurso; atribución visible; no publicar con derechos pendientes |
| Contenido generado por IA presentado como verificado | Bandera `ai_assisted`, estado `verification` independiente y aviso visible; la edición restablece la verificación |
| Información médica interpretada como consejo | Aviso obligatorio y fecha de revisión exigida para publicar |
| Temas religiosos, esotéricos y controvertidos | Avisos específicos, separación hechos/creencias/interpretaciones, perspectivas múltiples |
| Datos personales (RGPD y leyes equivalentes) | Minimización, sin terceros, historial desactivable, borrado de cuenta en cascada; **política de privacidad pendiente de revisión legal** |
| Imitación de marcas de referencia (Encarta, Wikipedia…) | Identidad visual y logotipo originales; las referencias son funcionales, no estéticas |

## 7. Supuestos documentados

- El idioma inicial es español; la estructura admite `en` y `pt` (campo `locale`, grupos de traducción).
- El contenido propio de ALEXANDRIA aún no tiene licencia definida: la descarga de texto está desactivada por defecto
  (`allow_download = false`) hasta que se decida (decisión del propietario del proyecto).
- No hay modelo de pago activo; el campo `plan` existe para un futuro plan premium sin limitar la exploración básica.
