import { expect, test } from "@playwright/test";

test("registro, favoritos, notas y control de acceso", async ({ page }) => {
  const email = `e2e-lector-${Date.now()}@example.com`;
  await page.goto("/cuenta/registro");
  await page.getByLabel("Nombre").fill("Lector E2E");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill("una frase larga segura");
  await page.getByLabel("Repite la contraseña").fill("una frase larga segura");
  await page.getByRole("checkbox", { name: /política de privacidad/ }).check();
  await page.getByRole("button", { name: "Crear cuenta gratuita" }).click();
  await expect(page).toHaveURL(/\/mi-biblioteca/);

  await page.goto("/articulo/adn");
  await page.getByRole("button", { name: "Guardar en favoritos" }).click();
  await expect(page.getByRole("button", { name: "En favoritos" })).toBeVisible();
  await page.getByText("Notas privadas").click();
  await page.getByLabel("Nueva nota").fill("Nota E2E sobre la doble hélice");
  await page.getByRole("button", { name: "Guardar nota" }).click();
  await expect(page.getByText("Nota E2E sobre la doble hélice")).toBeVisible();

  await page.goto("/mi-biblioteca");
  await expect(page.getByRole("heading", { name: "Favoritos" })).toBeVisible();
  await expect(page.locator("#favoritos").getByText("ADN", { exact: true })).toBeVisible();
  await expect(page.getByText("Nota E2E sobre la doble hélice")).toBeVisible();

  // Un usuario registrado no accede al panel de administración.
  await page.goto("/admin");
  await expect(page.getByText("Acceso restringido")).toBeVisible();
});

test("sin sesión, Mi biblioteca redirige al inicio de sesión", async ({ page }) => {
  await page.goto("/mi-biblioteca");
  await expect(page).toHaveURL(/\/cuenta\/ingresar\?next=%2Fmi-biblioteca/);
});

test("el inicio de sesión rechaza credenciales incorrectas", async ({ page }) => {
  await page.goto("/cuenta/ingresar");
  await page.getByLabel("Correo electrónico").fill("nadie@example.com");
  await page.getByLabel("Contraseña").fill("incorrecta");
  await page.getByRole("button", { name: "Ingresar" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Correo o contraseña incorrectos" })).toBeVisible();
});
