import { describe, expect, it } from "vitest";
import { renderMarkdown } from "@/server/content/markdown";
import { articleInputSchema, registerSchema, sourceInputSchema } from "@/lib/validation";

describe("renderizado de Markdown", () => {
  it("elimina scripts, manejadores de eventos y URLs javascript:", async () => {
    const { html } = await renderMarkdown(
      '## Título\n\n<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\n[enlace](javascript:alert(1))',
    );
    expect(html).not.toMatch(/<script/i);
    expect(html).not.toMatch(/onerror/i);
    expect(html).not.toMatch(/javascript:/i);
  });
  it("genera índice y abre enlaces externos de forma segura", async () => {
    const { html, toc } = await renderMarkdown("## Uno\n\n### Uno punto uno\n\n[NASA](https://science.nasa.gov)");
    expect(toc).toEqual([
      { id: "uno", text: "Uno", level: 2 },
      { id: "uno-punto-uno", text: "Uno punto uno", level: 3 },
    ]);
    expect(html).toContain('rel="noopener noreferrer nofollow"');
    expect(html).toContain('target="_blank"');
  });
});

describe("validación", () => {
  const base = {
    displayName: "Ana",
    email: "ANA@Example.com ",
    password: "una frase larga",
    passwordConfirm: "una frase larga",
    acceptPrivacy: "on",
  };
  it("normaliza el correo y exige aceptar la privacidad", () => {
    expect(registerSchema.parse(base).email).toBe("ana@example.com");
    expect(registerSchema.safeParse({ ...base, acceptPrivacy: undefined }).success).toBe(false);
  });
  it("rechaza contraseñas cortas o que no coinciden", () => {
    expect(registerSchema.safeParse({ ...base, password: "corta", passwordConfirm: "corta" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...base, passwordConfirm: "otra frase larga" }).success).toBe(false);
  });
  it("parsea la ficha rápida y las palabras clave del artículo", () => {
    const r = articleInputSchema.parse({
      title: "Egipto",
      slug: "egipto",
      summary: "Resumen suficientemente largo",
      content: "Texto",
      categoryId: "4a5c3f5e-1c4b-4c55-9b1a-4f5b6c7d8e9f",
      entityType: "civilization",
      difficulty: "beginner",
      keywords: "Nilo, faraones, Nilo",
      facts: "Capital: Menfis\nPeríodo: c. 3100 – 30 a. C.",
    });
    expect(r.keywords).toEqual(["Nilo", "faraones"]);
    expect(r.facts).toEqual([
      { label: "Capital", value: "Menfis" },
      { label: "Período", value: "c. 3100 – 30 a. C." },
    ]);
  });
  it("rechaza slugs inválidos y URLs no http(s)", () => {
    expect(articleInputSchema.shape.slug.safeParse("Con Mayúsculas").success).toBe(false);
    expect(sourceInputSchema.shape.url.safeParse("javascript:alert(1)").success).toBe(false);
  });
});
