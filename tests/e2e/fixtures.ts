import "dotenv/config";
import postgres from "postgres";

export const E2E_ADMIN = { email: "e2e.admin@example.com", password: "clave-e2e-administracion", name: "Admin E2E" };
export const E2E_PREFIX = "E2E Prueba";

export function sqlClient() {
  return postgres(process.env.DATABASE_URL!, { max: 1, onnotice: () => {} });
}
