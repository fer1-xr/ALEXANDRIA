/**
 * Capa de proveedores de modelos de lenguaje (Fase 4).
 *
 * Diseño: la aplicación depende solo de esta interfaz, no de un proveedor concreto.
 * Cada implementación leerá su clave del entorno en el servidor (nunca en el cliente).
 * En la Fase 1 NO hay ningún proveedor implementado: getLanguageModel() devuelve null y
 * ALEXANDRIA AI funciona en «modo recuperación» (pasajes citados, sin texto generado).
 */
export type GroundedAnswerRequest = {
  question: string;
  level: "children" | "beginner" | "intermediate" | "advanced" | "university" | "specialist";
  passages: { id: string; title: string; text: string }[];
};

export type GroundedAnswer = {
  text: string;
  /** Ids de los pasajes citados; toda afirmación debe apoyarse en alguno. */
  citations: string[];
  insufficientInformation: boolean;
};

export interface LanguageModelProvider {
  readonly name: string;
  answer(req: GroundedAnswerRequest, signal?: AbortSignal): Promise<GroundedAnswer>;
}

export function getLanguageModel(): LanguageModelProvider | null {
  return null;
}
