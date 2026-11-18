import { createHash, randomBytes } from "node:crypto";

/** Token opaco de 256 bits, apto para cookies y enlaces. */
export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Solo se persiste el hash: una filtración de la base no expone sesiones válidas. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
