import type { ContentNotice, DifficultyLevel, EntityType } from "../../src/server/db/schema";

export type SeedArticle = {
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  /** Ruta de la categoría principal, p. ej. "historia/civilizaciones/egipto". */
  category: string;
  /** Categorías secundarias. */
  alsoIn?: string[];
  entityType: EntityType;
  difficulty: DifficultyLevel;
  keywords: string[];
  facts: { label: string; value: string }[];
  notices?: ContentNotice[];
  /** Claves de scripts/seed/sources.ts, en orden de cita. */
  sources: string[];
  relations?: {
    to: string;
    type?:
      | "related"
      | "part_of"
      | "located_in"
      | "influenced"
      | "preceded"
      | "contemporary_of"
      | "created_by"
      | "participated_in"
      | "studied_by"
      | "example_of"
      | "contrasts_with";
    description?: string;
  }[];
  content: string;
};
