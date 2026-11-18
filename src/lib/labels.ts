/**
 * Etiquetas visibles (español) para las enumeraciones del dominio.
 * Centralizadas aquí para que la futura internacionalización tenga un único punto de entrada.
 */
import type {
  ContentNotice,
  DifficultyLevel,
  EditorialStatus,
  EntityType,
  UserRole,
} from "@/server/db/schema";

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  children: "Infantil",
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  university: "Universitario",
  specialist: "Especializado",
};

export const DIFFICULTY_ORDER: DifficultyLevel[] = [
  "children",
  "beginner",
  "intermediate",
  "advanced",
  "university",
  "specialist",
];

export const ENTITY_LABELS: Record<EntityType, string> = {
  article: "Artículo",
  concept: "Concepto",
  person: "Personaje",
  place: "Lugar",
  monument: "Monumento",
  event: "Acontecimiento",
  period: "Período",
  civilization: "Civilización",
  country: "País",
  species: "Especie",
  celestial_body: "Cuerpo celeste",
  invention: "Invento",
  work: "Obra",
  theory: "Teoría",
  discipline: "Disciplina",
  religion: "Religión",
  organization: "Organización",
};

export const STATUS_LABELS: Record<EditorialStatus, string> = {
  draft: "Borrador",
  in_review: "En revisión",
  approved: "Aprobado",
  published: "Publicado",
  archived: "Archivado",
};

export const ROLE_LABELS: Record<UserRole | "visitor", string> = {
  visitor: "Visitante",
  registered: "Usuario registrado",
  student: "Estudiante",
  editor: "Editor",
  admin: "Administrador",
};

export const VERIFICATION_LABELS = {
  unverified: "Sin verificación humana",
  editor_reviewed: "Revisado por el equipo editorial",
  expert_verified: "Verificado por especialista",
} as const;

export const NOTICE_TEXT: Record<ContentNotice, { title: string; body: string }> = {
  medical: {
    title: "Contenido educativo, no consejo médico",
    body: "Esta información tiene fines divulgativos y no sustituye el diagnóstico, el tratamiento ni el consejo de profesionales de la salud. Ante cualquier síntoma o duda, consulta a un profesional.",
  },
  esoteric: {
    title: "Estudio histórico y cultural",
    body: "Este artículo describe creencias y prácticas desde una perspectiva histórica y antropológica. Distingue entre hechos documentados, creencias e interpretaciones; las afirmaciones sobrenaturales que aquí se describen no están demostradas científicamente.",
  },
  religious: {
    title: "Perspectiva académica y respetuosa",
    body: "Las religiones se presentan desde un enfoque histórico, cultural y comparativo. Se describen las creencias tal como las entienden sus tradiciones, sin favorecer ni desacreditar ninguna cosmovisión.",
  },
  contested: {
    title: "Tema con debate académico",
    body: "Existen interpretaciones distintas entre especialistas. Se indican las principales posturas y los límites de la evidencia disponible.",
  },
  evolving: {
    title: "Información que cambia con el tiempo",
    body: "Algunos datos (población, cifras económicas, récords, investigaciones en curso) se actualizan periódicamente. Comprueba la fecha de revisión.",
  },
};

export const EXPERIENCE_TYPE_LABELS = {
  model_3d: "Modelo 3D navegable",
  panorama_360: "Recorrido panorámico 360°",
  photo_tour: "Visita virtual mediante fotografías",
  simplified_model: "Modelo interactivo simplificado",
  artistic_reconstruction: "Representación artística o reconstrucción histórica",
} as const;

export const AVAILABILITY_LABELS = {
  available: "Disponible",
  in_production: "En producción",
  planned: "Planificada",
} as const;

export const SOURCE_KIND_LABELS = {
  book: "Libro",
  journal_article: "Artículo científico",
  website: "Sitio web",
  dataset: "Conjunto de datos",
  api: "API",
  archive: "Archivo",
  official_document: "Documento oficial",
  other: "Otro",
} as const;

export const REUSE_POLICY_LABELS = {
  external_link: "Solo enlace externo",
  api_query: "Consulta mediante API",
  open_data: "Datos abiertos",
  reusable: "Contenido reutilizable (licencia libre)",
  commercial_license: "Requiere licencia comercial",
  copyrighted: "Protegido por derechos de autor (solo cita)",
} as const;

export const SOURCE_VERIFICATION_LABELS = {
  pending: "Pendiente de verificación",
  verified: "Verificada",
  broken: "Enlace roto",
  rejected: "Rechazada",
} as const;

export const RELATION_LABELS = {
  related: "Relacionado con",
  part_of: "Forma parte de",
  located_in: "Se encuentra en",
  influenced: "Influyó en",
  preceded: "Precedió a",
  contemporary_of: "Contemporáneo de",
  created_by: "Creado por",
  participated_in: "Participó en",
  studied_by: "Estudiado por",
  example_of: "Es un ejemplo de",
  contrasts_with: "Contrasta con",
} as const;

/** Lectura de una relación desde el artículo de destino (A part_of B ⇒ en B: «Incluye» A). */
export const INVERSE_RELATION_LABELS = {
  related: "Relacionado con",
  part_of: "Incluye",
  located_in: "Alberga",
  influenced: "Recibió influencia de",
  preceded: "Sucedió a",
  contemporary_of: "Contemporáneo de",
  created_by: "Creó",
  participated_in: "Contó con la participación de",
  studied_by: "Estudió",
  example_of: "Tiene como ejemplo",
  contrasts_with: "Contrasta con",
} as const;

export const MEDIA_KIND_LABELS = {
  image: "Fotografía",
  illustration: "Ilustración",
  infographic: "Infografía",
  video: "Vídeo",
  audio: "Audio",
  model_3d: "Modelo 3D",
  panorama_360: "Panorámica 360°",
  map: "Mapa",
  diagram: "Diagrama",
  document: "Documento histórico",
} as const;
