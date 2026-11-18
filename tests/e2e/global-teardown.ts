import { E2E_ADMIN, E2E_PREFIX, sqlClient } from "./fixtures";

/** Limpia los datos creados por las pruebas para no contaminar la base. */
export default async function globalTeardown() {
  const sql = sqlClient();
  await sql`DELETE FROM articles WHERE title LIKE ${E2E_PREFIX + "%"}`;
  await sql`DELETE FROM users WHERE lower(email) = ${E2E_ADMIN.email} OR email LIKE 'e2e-lector-%@example.com'`;
  await sql.end();
}
