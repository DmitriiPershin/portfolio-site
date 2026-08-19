import { expect, test } from "@playwright/test";

test("renders the production slice without horizontal overflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Dmitrii Pershin" })).toBeAttached();
  await expect(page.getByRole("heading", { level: 2, name: "Focus" })).toBeAttached();
  await expect(page.getByRole("heading", { level: 2, name: "AI Workflow" })).toBeAttached();
  await expect(page.getByText("Контекст клиента")).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("menu is keyboard accessible", async ({ page }) => {
  await page.goto("/");
  const menuButton = page.locator("[data-menu-toggle]");
  await expect(menuButton).toHaveAccessibleName("Открыть меню");
  await menuButton.focus();
  await page.keyboard.press("Enter");
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(menuButton).toHaveAccessibleName("Закрыть меню");
  await expect(page.getByRole("navigation", { name: "Разделы портфолио" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
});

test("reduced motion keeps content and connectors visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator("[data-workflow-node='frontend']")).toBeVisible();
  await expect(page.locator(".flow-path")).toHaveCount(6);
  const dashOffset = await page.locator(".flow-path").first().evaluate((path) => getComputedStyle(path).strokeDashoffset);
  expect(dashOffset).toBe("0px");
});

test("health endpoint responds", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toEqual({ status: "ok" });
});
