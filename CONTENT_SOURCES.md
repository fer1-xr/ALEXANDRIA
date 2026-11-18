# CONTENT_SOURCES — Política de fuentes y licencias

## Principios

1. **Cada artículo cita sus fuentes.** No se puede publicar sin al menos una.
2. **No se asume que una fuente permita reutilizar su contenido.** Cada fuente declara su uso permitido.
3. **No se inventan fuentes ni fechas de consulta.** `accessed_at` solo se rellena cuando una persona o un proceso
   consultó realmente la fuente, y es obligatorio para marcarla como verificada.
4. **Multimedia solo con derechos verificados**: autor, procedencia, licencia, URL original, créditos y condiciones.

## Uso permitido (`reuse_policy`)

| Valor | Significado | Qué puede hacer ALEXANDRIA |
|---|---|---|
| `external_link` | Solo enlace | Citar y enlazar. No copiar contenido |
| `api_query` | Consulta mediante API | Consultar según los términos de la API; mostrar datos con atribución |
| `open_data` | Datos abiertos | Importar datos (no textos) con la atribución exigida |
| `reusable` | Licencia libre (dominio público, CC BY, CC BY-SA, CC0) | Reutilizar respetando atribución y, si es SA, compartir igual |
| `commercial_license` | Requiere contrato | Nada hasta firmar la licencia |
| `copyrighted` | Protegido | Citar brevemente con referencia; nunca reproducir |

## Fuentes a integrar o evaluar

| Fuente | Tipo de acceso | Licencia / condiciones (a confirmar en cada caso) | Plan |
|---|---|---|---|
| Wikidata | API SPARQL/REST | CC0 | F2: metadatos (fechas, coordenadas, identificadores) para artículos y cronología |
| Wikipedia | API | CC BY-SA 4.0 (texto) | Solo como referencia o con atribución y licencia SA explícita en el texto derivado |
| Wikimedia Commons | API | Variable por archivo (DP, CC0, CC BY, CC BY-SA) | F2: importar imágenes con su licencia individual registrada en `media_assets` |
| NASA (images-api, science.nasa.gov) | API / web | Mayoritariamente dominio público; excepciones con terceros y logotipos | F2–F3: imágenes astronómicas y datos planetarios |
| ESA | Web / API | Varía (muchas imágenes CC BY-SA 3.0 IGO) | Verificar por recurso |
| UNESCO World Heritage | Web / datos | Términos propios; datos de la lista disponibles | Enlaces y metadatos de sitios |
| Smithsonian Open Access | API | CC0 en la colección Open Access | Imágenes y modelos 3D |
| Europeana | API (clave gratuita) | Variable por objeto (`rights` en cada registro) | Patrimonio cultural europeo |
| Library of Congress | API | Mucho en dominio público; verificar | Documentos e imágenes históricas |
| Internet Archive | API | Variable | Libros y documentos en dominio público |
| Project Gutenberg | Web / catálogo | Dominio público en EE. UU. (verificar en otros países) | Textos clásicos |
| PubMed / PMC | API E-utilities | Resúmenes con derechos; PMC OA con licencias variables | Referencias médicas |
| OpenStax | Web | CC BY 4.0 | Rutas de aprendizaje (F5) |
| Encyclopaedia Britannica | Licencia comercial | Protegido | Solo cita/enlace salvo acuerdo |
| National Geographic | Licencia comercial | Protegido | Solo cita/enlace salvo acuerdo |
| Museos y universidades | Variable | Variable | Acuerdos individuales |

Ninguna de estas integraciones está implementada en la Fase 1: el entorno de desarrollo no tenía acceso a Internet.
Las claves de API (p. ej., Europeana) se configurarán como variables de entorno del servidor.

## Trazabilidad por fuente

Cada registro de `sources` guarda: identificador estable (`external_id`: DOI o URL canónica), procedencia
(`provider`), fecha de consulta (`accessed_at`), licencia, uso permitido, estado de verificación y método de
incorporación (`manual`, `api`, `file_import`, `seed`). El índice único sobre `external_id` evita duplicados.

## Estado del contenido inicial (Fase 1)

- **24 artículos** de demostración redactados con asistencia de IA a partir de conocimiento enciclopédico general:
  `ai_assisted = true`, `verification = unverified`, aviso visible al lector.
- **52 fuentes** citadas: obras, artículos científicos (con DOI) e instituciones reales. Todas en
  `verification = pending`, sin `accessed_at`, con la nota «Referencia aportada durante la redacción asistida por IA.
  Pendiente de verificación editorial».
- **0 recursos multimedia**: no se incorporó ninguna imagen, vídeo ni modelo porque no fue posible verificar sus
  licencias. Las portadas son composiciones tipográficas generadas, claramente decorativas.
- **12 experiencias** catalogadas como «planificadas», con su tipo previsto y enlace a la ficha de UNESCO.

### Proceso de verificación recomendado

1. Abrir cada fuente desde Administración › Fuentes; comprobar título, autoría, año, DOI/URL.
2. Comprobar que el artículo dice lo que la fuente respalda; corregir el texto si no.
3. Registrar la fecha de consulta y marcar la fuente como «Verificada» (o «Enlace roto»/«Rechazada»).
4. En el artículo, marcar «Revisado por el equipo editorial» o «Verificado por especialista».
   Cualquier edición posterior del contenido restablece la verificación a «sin verificación humana».

## Temas sensibles

- **Medicina**: aviso obligatorio y fecha de revisión profesional exigida para publicar.
- **Religiones**: enfoque histórico y comparativo; se describen las creencias como las entienden sus tradiciones.
- **Esoterismo**: separar hechos documentados, creencias, interpretaciones y afirmaciones sin evidencia.
- **Temas controvertidos**: aviso «Tema con debate académico» y exposición de las posturas y límites de la evidencia.
- **Datos que cambian** (población, récords, cifras): aviso «Información que cambia con el tiempo» y fecha de revisión.
