import { expect, test } from "@playwright/test";

test.describe("móvil", () => {
  test("la portada no desborda horizontalmente y el menú lateral funciona", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.getByRole("button", { name: "Abrir menú" }).click();
    const dialog = page.getByRole("dialog", { name: "Menú principal" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("link", { name: "Universo y astronomía" }).click();
    await expect(page).toHaveURL(/\/explorar\/universo/);
    await expect(dialog).toHaveCount(0);
  });

  test("el artículo es legible y sin desbordes en móvil", async ({ page }) => {
    await page.goto("/articulo/antiguo-egipto");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.getByText("Índice del artículo")).toBeVisible();
  });
});
