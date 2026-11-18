/**
 * Paso previo a `next build` en despliegues (Vercel: script `vercel-build`).
 *
 * 1. Aplica las migraciones pendientes (idempotente: Drizzle registra las aplicadas).
 *    En vistas previas de Vercel no se migra (salvo MIGRATE_ON_PREVIEW=1).
 * 2. Solo si SEED_ON_BUILD=1, carga el contenido semilla. El seed SOBRESCRIBE los artículos
 *    de demostración con su versión original, así que debe usarse únicamente en el primer
 *    despliegue y desactivarse después para no pisar el trabajo editorial.
 */
import "dotenv/config";
import { runMigrations } from "./migrate";
import { runSeed } from "./seed/index";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no definida: el build necesita la base de datos.");
  // Las vistas previas de Vercel comparten la base de producción: no deben alterar su esquema.
  if (process.env.VERCEL_ENV === "preview" && process.env.MIGRATE_ON_PREVIEW !== "1") {
    console.log("· Vista previa: migraciones omitidas (la base es compartida con producción)");
    return;
  }
  await runMigrations(url);
  console.log("✓ Migraciones aplicadas");
  if (process.env.SEED_ON_BUILD === "1") {
    const r = await runSeed(url);
    console.log(`✓ Seed: ${r.categories} categorías, ${r.sources} fuentes, ${r.articles} artículos, ${r.events} acontecimientos`);
  } else {
    console.log("· Seed omitido (SEED_ON_BUILD distinto de 1)");
  }
}

main().catch((err) => {
  console.error("✗ Error preparando la base de datos:", err);
  process.exit(1);
});
