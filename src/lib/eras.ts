/** Grandes eras de «Viaja por la historia» (clave usada en timeline_events.era). */
export const ERAS = [
  { key: "cosmos", label: "El cosmos", description: "Del origen del universo a la formación de la Tierra" },
  { key: "vida", label: "La vida en la Tierra", description: "Primeros organismos, grandes extinciones y diversificación" },
  { key: "humanidad", label: "Evolución humana", description: "Homininos, Homo sapiens y las primeras migraciones" },
  { key: "prehistoria", label: "Prehistoria y Neolítico", description: "Agricultura, aldeas y primeras ciudades" },
  { key: "antiguedad", label: "Antigüedad", description: "Escritura, imperios y civilizaciones clásicas" },
  { key: "edad-media", label: "Edad Media", description: "c. 476 – 1492" },
  { key: "edad-moderna", label: "Edad Moderna", description: "c. 1492 – 1789" },
  { key: "contemporanea", label: "Edad Contemporánea", description: "Revoluciones, guerras mundiales y era digital" },
] as const;

export type EraKey = (typeof ERAS)[number]["key"];
