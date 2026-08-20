import { expect, test } from "@playwright/test";

test("renders every portfolio section without horizontal overflow", async ({ page }) => {
  await page.goto("/");

  for (const heading of [
    "Dmitrii Pershin",
    "Focus",
    "Hard Skills",
    "Soft Skills",
    "AI Workflow",
    "Process & AI",
    "Theme Builders",
    "Interfaces",
    "Pet Project",
    "Nice to meet you",
  ]) {
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeAttached();
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("page has no runtime console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(150);
  expect(errors).toEqual([]);
});

test("language switch changes copy and persists the choice", async ({ page }) => {
  await page.goto("/");
  const languageButton = page.locator("[data-language-toggle]");
  await expect(languageButton).toHaveAccessibleName("Switch to English");
  await languageButton.click();
  await expect(page.getByText("Client context", { exact: true })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByText("Client context", { exact: true })).toBeVisible();
});

test("fixed controls follow the intended scroll behaviour", async ({ page }) => {
  await page.goto("/");
  const languageButton = page.locator("[data-language-toggle]");
  const menuButton = page.locator("[data-menu-toggle]");

  await expect(languageButton).toBeVisible();
  expect(await menuButton.evaluate((element) => getComputedStyle(element).position)).toBe("fixed");
  const menuTop = await menuButton.evaluate((element) => element.getBoundingClientRect().top);

  await page.evaluate(() => window.scrollTo(0, 80));
  await expect(languageButton).toBeHidden();
  const menuTopAfterScroll = await menuButton.evaluate((element) => element.getBoundingClientRect().top);
  expect(Math.abs(menuTopAfterScroll - menuTop)).toBeLessThanOrEqual(1);
});

test("menu is keyboard accessible and contains every section", async ({ page }) => {
  await page.goto("/");
  const menuButton = page.locator("[data-menu-toggle]");
  await expect(menuButton).toHaveAccessibleName("Открыть меню");
  await menuButton.focus();
  await page.keyboard.press("Enter");
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  const navigation = page.getByRole("navigation", { name: "Разделы портфолио" });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link")).toHaveCount(8);
  await page.keyboard.press("Escape");
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
});

test("avatar opens contact details", async ({ page }) => {
  await page.goto("/");
  const avatar = page.locator("[data-contact-toggle]");
  await avatar.click();
  await expect(page.getByRole("dialog", { name: "Nice to meet you" })).toBeVisible();
  await expect(page.getByRole("link", { name: /dmitrii_pershin/i })).toHaveAttribute("href", "https://t.me/dmitrii_pershin");
  await page.locator("[data-contact-close]").click();
  await expect(page.locator("[data-contact-overlay]")).toHaveAttribute("aria-hidden", "true");
});

test("reduced motion keeps content and original Figma connectors visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator("[data-workflow-node='frontend']")).toBeVisible();
  await expect(page.locator(".connector")).toHaveCount(8);
  await expect(page.locator(".connector--top-a")).toHaveCSS("opacity", "1");
});

test("desktop cards have smooth gradient hover feedback", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1200, "Desktop hover check");
  await page.goto("/");
  const card = page.locator(".process-card").first();
  await card.scrollIntoViewIfNeeded();
  const before = await card.evaluate((element) => getComputedStyle(element).boxShadow);
  await card.hover();
  await page.waitForTimeout(1050);
  const state = await card.evaluate((element) => {
    const style = getComputedStyle(element);
    return { background: style.backgroundImage, shadow: style.boxShadow, transform: style.transform };
  });
  expect(state.background).toContain("radial-gradient");
  expect(state.shadow).not.toBe(before);
  expect(state.transform).not.toBe("none");
});

test("mobile details reveal on demand", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1000) > 640, "Mobile-only disclosure");
  await page.goto("/");
  const firstCard = page.locator("[data-detail-card]").first();
  const button = firstCard.locator("[data-details-toggle]");
  await expect(firstCard.locator(".process-card__details")).toBeHidden();
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(firstCard.locator(".process-card__details")).toBeVisible();
});

test("health endpoint responds", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toEqual({ status: "ok" });
});
