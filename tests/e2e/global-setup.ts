import { hash } from "@node-rs/argon2";
import { E2E_ADMIN, sqlClient } from "./fixtures";

/** Crea (o restablece) la cuenta de administración usada por las pruebas E2E. */
export default async function globalSetup() {
  const sql = sqlClient();
  const passwordHash = await hash(E2E_ADMIN.password, { memoryCost: 19456, timeCost: 2, parallelism: 1, outputLen: 32 });
  await sql`DELETE FROM users WHERE lower(email) = ${E2E_ADMIN.email}`;
  await sql`INSERT INTO users (email, display_name, password_hash, role) VALUES (${E2E_ADMIN.email}, ${E2E_ADMIN.name}, ${passwordHash}, 'admin')`;
  await sql.end();
}
