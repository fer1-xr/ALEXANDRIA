/** Estructura del menú principal (sección 22 del documento de producto). */
export const EXPERIENCE_LINKS = [
  { href: "/experiencias", label: "Viajes 3D y lugares", icon: "cube", note: "Catálogo de experiencias" },
  { href: "/atlas", label: "Atlas interactivo", icon: "map", note: "Lugares en el mapa" },
  { href: "/linea-de-tiempo", label: "Línea de tiempo", icon: "timeline", note: "Viaja por la historia" },
  { href: "/explorar/universo/sistemas-planetarios/sistema-solar", label: "Sistema solar", icon: "orbit", note: "Planetas y escalas" },
  { href: "/explorar/medicina/anatomia", label: "Anatomía", icon: "pulse", note: "El cuerpo humano" },
  { href: "/explorar/cultura/museos", label: "Museos virtuales", icon: "palette", note: "Exposiciones" },
] as const;

export const LEARN_LINKS = [
  { href: "/aprender", label: "Rutas de aprendizaje", icon: "route", note: "Itinerarios por niveles" },
  { href: "/descubrir", label: "Descubrir", icon: "compass", note: "Exploración libre" },
  { href: "/descubrir/sorprendeme", label: "Sorpréndeme", icon: "shuffle", note: "Un conocimiento al azar" },
] as const;
