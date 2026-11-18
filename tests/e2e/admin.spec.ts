import { expect, test } from "@playwright/test";
import { E2E_ADMIN, E2E_PREFIX } from "./fixtures";

test("flujo editorial completo: borrador → revisión → aprobado → publicado", async ({ page }) => {
  await page.goto("/cuenta/ingresar?next=%2Fadmin");
  await page.getByLabel("Correo electrónico").fill(E2E_ADMIN.email);
  await page.getByLabel("Contraseña").fill(E2E_ADMIN.password);
  await page.getByRole("button", { name: "Ingresar" }).click();
  await expect(page.getByRole("heading", { name: "Panel editorial" })).toBeVisible();

  const title = `${E2E_PREFIX} ${Date.now()}`;
  await page.goto("/admin/articulos/nuevo");
  await page.getByLabel("Título", { exact: true }).fill(title);
  await page.getByLabel("Resumen").fill("Artículo creado por la prueba automatizada para validar el flujo editorial completo.");
  await page.getByLabel("Categoría principal").selectOption({ label: "— — Egipto" });
  await page.getByLabel("Contenido (Markdown)").fill("## Sección\n\n" + "Texto de prueba del flujo editorial. ".repeat(12));
  await page.getByRole("button", { name: "Crear borrador" }).click();
  await expect(page).toHaveURL(/\/admin\/articulos\/[0-9a-f-]{36}/);

  const status = page.getByRole("status");
  await page.getByRole("button", { name: "Enviar a revisión" }).click();
  await expect(page.getByText("En revisión", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Aprobar" }).click();
  await expect(page.getByRole("button", { name: "Publicar" })).toBeVisible();
  await page.getByRole("button", { name: "Publicar" }).click();
  await expect(status.filter({ hasText: "Debe citar al menos una fuente." })).toBeVisible();

  await page.getByRole("checkbox", { name: /The Oxford History of Ancient Egypt/ }).check();
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(status.filter({ hasText: "Cambios guardados." }).first()).toBeVisible();
  await page.getByRole("button", { name: "Publicar" }).click();
  await expect(status.filter({ hasText: "Estado actualizado." })).toBeVisible();

  const slug = await page.getByLabel("Slug (URL)").inputValue();
  await page.goto(`/articulo/${slug}`);
  await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();

  await page.goto("/admin/auditoria");
  await expect(page.getByText("article.transition").first()).toBeVisible();
});
