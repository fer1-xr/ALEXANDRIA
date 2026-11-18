/** Aplica las migraciones pendientes. Uso: `npm run db:migrate` (lee DATABASE_URL). */
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

export async function runMigrations(url: string) {
  const client = postgres(url, { max: 1, onnotice: () => {} });
  try {
    await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
  } finally {
    await client.end();
  }
}

if (process.argv[1]?.endsWith("migrate.ts")) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no definida");
  runMigrations(url)
    .then(() => console.log("✓ Migraciones aplicadas"))
    .catch((err) => {
      console.error("✗ Error al migrar:", err);
      process.exit(1);
    });
}
