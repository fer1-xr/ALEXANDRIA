import { expect, test } from "@playwright/test";

test.describe("experiencia pública", () => {
  test("la portada muestra las 14 secciones clave", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Todo el conocimiento de la humanidad");
    for (const h of [
      "Elige por dónde empezar",
      "Explora el universo",
      "Viaja por la historia",
      "Monumentos y lugares extraordinarios",
      "Ciencia y descubrimientos",
      "Personajes que cambiaron la humanidad",
      "Explora el mundo en 3D",
      "Continúa aprendiendo",
      "Descubrimientos recomendados",
      "Rutas de aprendizaje",
    ]) {
      await expect(page.getByRole("heading", { name: h })).toBeVisible();
    }
    await expect(page.getByText("Conocimiento del día")).toBeVisible();
    await expect(page.getByRole("link", { name: /Preguntar a ALEXANDRIA AI/ })).toBeVisible();
  });

  test("el buscador sugiere mientras se escribe y lleva al artículo", async ({ page }) => {
    await page.goto("/");
    const box = page.getByRole("combobox", { name: "Buscar en ALEXANDRIA" }).first();
    await box.fill("mesopo");
    const option = page.getByRole("option", { name: /Mesopotamia/ }).first();
    await expect(option).toBeVisible();
    await option.click();
    await expect(page).toHaveURL(/\/articulo\/mesopotamia/);
  });

  test("la búsqueda tolera errores y propone una corrección", async ({ page }) => {
    await page.goto("/buscar?q=marie%20cury");
    await expect(page.getByRole("link", { name: "Marie Curie" }).first()).toBeVisible();
  });

  test("el artículo muestra índice, fuentes, avisos y relaciones", async ({ page }) => {
    await page.goto("/articulo/cerebro-humano");
    await expect(page.getByRole("heading", { level: 1, name: "Cerebro humano" })).toBeVisible();
    await expect(page.getByText("Contenido educativo, no consejo médico")).toBeVisible();
    await expect(page.getByText(/Redactado con asistencia de IA/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Fuentes y referencias" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Índice del artículo" }).last()).toBeVisible();
    await page.goto("/articulo/piramides-de-giza");
    await expect(page.getByRole("heading", { name: "Conocimiento conectado" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Antiguo Egipto/ }).first()).toBeVisible();
  });

  test("Sorpréndeme lleva a un artículo publicado", async ({ page }) => {
    await page.goto("/descubrir/sorprendeme");
    await expect(page).toHaveURL(/\/articulo\/[a-z0-9-]+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("la línea de tiempo filtra por era y marca las fechas aproximadas", async ({ page }) => {
    await page.goto("/linea-de-tiempo");
    await expect(page.getByText("Fecha aproximada").first()).toBeVisible();
    await page.getByLabel("Era", { exact: true }).selectOption("antiguedad");
    await expect(page.getByRole("heading", { name: "Antigüedad", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "El cosmos", level: 2 })).toHaveCount(0);
  });

  test("ALEXANDRIA AI muestra pasajes citados o reconoce que no sabe", async ({ page }) => {
    await page.goto(`/ai?q=${encodeURIComponent("¿Por qué Plutón no es un planeta?")}`);
    await expect(page.getByRole("link", { name: /Sistema solar › ¿Por qué Plutón/ })).toBeVisible();
    await page.goto(`/ai?q=${encodeURIComponent("receta de lasaña boloñesa")}`);
    await expect(page.getByText("La biblioteca aún no tiene información suficiente")).toBeVisible();
  });

  test("las experiencias no se presentan como disponibles si no lo están", async ({ page }) => {
    await page.goto("/experiencias");
    await expect(page.getByText("Planificada").first()).toBeVisible();
    await expect(page.getByText("Disponible", { exact: true })).toHaveCount(0);
  });

  test("una ruta inexistente devuelve la página 404", async ({ page }) => {
    const res = await page.goto("/esta-pagina-no-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("Esta página no está en la biblioteca")).toBeVisible();
  });
});
