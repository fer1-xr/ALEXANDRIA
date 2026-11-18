/**
 * Formato de fechas históricas con numeración astronómica (1 a. C. = 0).
 * Nunca convierte una fecha aproximada en exacta: la etiqueta visible de cada
 * acontecimiento se guarda en `display_date`; estas utilidades sirven para
 * formularios, ejes y validaciones.
 */
export type DatePrecision =
  | "day"
  | "year"
  | "decade"
  | "century"
  | "millennium"
  | "approximate"
  | "geological";

const nf = new Intl.NumberFormat("es-ES");

/** Año astronómico → etiqueta «753 a. C.» / «1492». */
export function formatAstronomicalYear(year: number): string {
  if (year <= 0) return `${nf.format(1 - year)} a. C.`;
  return String(year);
}

/** Años antes del presente para el tiempo profundo: «hace 13 800 millones de años». */
export function formatYearsAgo(yearsAgo: number): string {
  const abs = Math.abs(yearsAgo);
  if (abs >= 1e9) return `hace ${nf.format(round(abs / 1e9, 2))} mil millones de años`;
  if (abs >= 1e6) return `hace ${nf.format(round(abs / 1e6, 1))} millones de años`;
  if (abs >= 1e4) return `hace ${nf.format(Math.round(abs / 1e3))} 000 años`;
  return `hace ${nf.format(abs)} años`;
}

function round(n: number, decimals: number) {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

/** Construye una etiqueta por defecto coherente con la precisión declarada. */
export function defaultDisplayDate(startYear: number, endYear: number | null, precision: DatePrecision): string {
  if (precision === "geological") return formatYearsAgo(2000 - startYear);
  const approx = precision === "approximate" || precision === "millennium" || precision === "century";
  const prefix = approx ? "c. " : "";
  const start = formatAstronomicalYear(startYear);
  if (endYear != null && endYear !== startYear) {
    return `${prefix}${start} – ${formatAstronomicalYear(endYear)}`;
  }
  if (precision === "decade") return `década de ${start}`;
  return `${prefix}${start}`;
}

/** Comprueba que una etiqueta no presente como exacta una fecha aproximada. */
export function displayDateRespectsPrecision(label: string, precision: DatePrecision): boolean {
  if (precision === "day" || precision === "year" || precision === "decade") return true;
  // «c.»/«ca.» solo como prefijo: la «C.» de «a. C.» no indica aproximación.
  return /^(c\.|ca\.)\s|^(hacia|hace)\b|~|aprox|siglo|milenio|entre|década|tradicional/i.test(label.trim());
}
