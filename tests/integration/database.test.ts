/**
 * Integración con PostgreSQL real (TEST_DATABASE_URL). Recrea el esquema, migra,
 * ejecuta el seed dos veces y comprueba restricciones y búsqueda.
 */
import "dotenv/config";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, sql } from "drizzle-orm";
import * as schema from "@/server/db/schema";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { runMigrations } from "../../scripts/migrate";
import { seed, SEED_ARTICLES } from "../../scripts/seed/index";

const url = process.env.TEST_DATABASE_URL;
const client = url ? postgres(url, { max: 1, onnotice: () => {} }) : null;
const db = client ? drizzle(client, { schema, casing: "snake_case" }) : null;

describe.skipIf(!url)("base de datos", () => {
  beforeAll(async () => {
    // Elimina solo los objetos de la aplicación; las extensiones (del superusuario) se conservan.
    await client!.unsafe("DROP OWNED BY CURRENT_USER CASCADE;");
    await runMigrations(url!);
  });
  afterAll(async () => {
    await client?.end();
  });

  it("el seed es idempotente", async () => {
    const first = await seed(db! as never);
    const second = await seed(db! as never);
    expect(second).toEqual(first);
    const [{ n }] = await db!.select({ n: sql<number>`count(*)::int` }).from(schema.articles);
    expect(n).toBe(SEED_ARTICLES.length);
    const [{ r }] = await db!.select({ r: sql<number>`count(*)::int` }).from(schema.articleRevisions);
    expect(r).toBe(SEED_ARTICLES.length);
  });

  it("la búsqueda de texto completo ignora tildes y mayúsculas", async () => {
    const rows = await db!.execute<{ slug: string }>(sql`
      SELECT slug FROM articles WHERE search_vector @@ websearch_to_tsquery('es_unaccent', 'PIRAMIDES egipcias')
      ORDER BY ts_rank_cd(search_vector, websearch_to_tsquery('es_unaccent', 'PIRAMIDES egipcias')) DESC`);
    expect(rows.map((r) => r.slug)).toContain("piramides-de-giza");
  });

  it("los trigramas toleran errores ortográficos", async () => {
    const rows = await db!.execute<{ title: string }>(sql`
      SELECT title FROM articles WHERE f_unaccent(lower(title)) % f_unaccent(lower('Leonardo da Vinchi'))`);
    expect(rows.map((r) => r.title)).toContain("Leonardo da Vinci");
  });

  it("el correo es único sin distinguir mayúsculas", async () => {
    const passwordHash = await hashPassword("una frase larga");
    await db!.insert(schema.users).values({ email: "Lectora@Example.com", displayName: "Lectora", passwordHash });
    await expect(
      db!.insert(schema.users).values({ email: "lectora@example.com", displayName: "Copia", passwordHash }),
    ).rejects.toThrow();
  });

  it("Argon2id verifica la contraseña correcta y rechaza la incorrecta", async () => {
    const [u] = await db!.select().from(schema.users).where(sql`lower(${schema.users.email}) = 'lectora@example.com'`);
    expect(await verifyPassword(u.passwordHash, "una frase larga")).toBe(true);
    expect(await verifyPassword(u.passwordHash, "otra")).toBe(false);
    expect(u.passwordHash).toMatch(/^\$argon2id\$/);
  });

  it("borrar una cuenta elimina en cascada sus datos personales", async () => {
    const [u] = await db!.select().from(schema.users).where(sql`lower(${schema.users.email}) = 'lectora@example.com'`);
    const [a] = await db!.select().from(schema.articles).limit(1);
    await db!.insert(schema.favorites).values({ userId: u.id, articleId: a.id });
    await db!.insert(schema.notes).values({ userId: u.id, articleId: a.id, body: "nota" });
    await db!.insert(schema.sessions).values({ id: "x".repeat(64), userId: u.id, expiresAt: new Date(Date.now() + 1e6) });
    await db!.delete(schema.users).where(eq(schema.users.id, u.id));
    for (const t of [schema.favorites, schema.notes, schema.sessions]) {
      const [{ n }] = await db!.select({ n: sql<number>`count(*)::int` }).from(t);
      expect(n).toBe(0);
    }
  });

  it("no se puede borrar una fuente citada ni una categoría con artículos", async () => {
    const [cited] = await db!.select({ id: schema.articleSources.sourceId }).from(schema.articleSources).limit(1);
    await expect(db!.delete(schema.sources).where(eq(schema.sources.id, cited.id))).rejects.toThrow();
    const [art] = await db!.select({ c: schema.articles.categoryId }).from(schema.articles).limit(1);
    await expect(db!.delete(schema.categories).where(eq(schema.categories.id, art.c))).rejects.toThrow();
  });
});
