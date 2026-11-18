/**
 * Crea (o promueve) una cuenta de administración.
 * Uso: ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:create-admin
 * La contraseña se lee del entorno para no dejarla en el historial del shell como argumento.
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { hashPassword } from "../src/server/auth/password";
import { users } from "../src/server/db/schema";
import { emailSchema, passwordSchema } from "../src/lib/validation";

async function main() {
  const email = emailSchema.parse(process.env.ADMIN_EMAIL);
  const password = passwordSchema.parse(process.env.ADMIN_PASSWORD);
  const name = process.env.ADMIN_NAME?.trim() || "Administración";
  const client = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(client);
  const passwordHash = await hashPassword(password);
  const [existing] = await db.select({ id: users.id }).from(users).where(sql`lower(${users.email}) = ${email}`).limit(1);
  if (existing) await db.update(users).set({ role: "admin", passwordHash }).where(sql`${users.id} = ${existing.id}`);
  else await db.insert(users).values({ email, displayName: name, passwordHash, role: "admin" });
  await client.end();
  console.log(`✓ Cuenta de administración lista: ${email}`);
}

main().catch((err) => {
  console.error("✗", err instanceof Error ? err.message : err);
  process.exit(1);
});
