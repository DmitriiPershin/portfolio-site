import { test, expect } from "@playwright/test";
import cv from "../src/data/cv.json" with { type: "json" };

test("CV follows the edited content, links and responsive composition", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const response = await page.goto("/cv");
  expect(response?.status()).toBe(200);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: cv.role, exact: true })).toBeVisible();
  for (const entry of cv.experience) {
    const job = page.locator(".cv-job").filter({ has: page.getByRole("heading", { name: entry.title, exact: true }) });
    await expect(job).toContainText(entry.dates);
    for (const bullet of entry.bullets) await expect(job).toContainText(bullet);
  }
  await expect(page.locator("main")).not.toContainText("Two products with the same founding team");
  await expect(page.locator("main")).not.toContainText("Mar 2022");
  await expect(page.locator("main")).not.toContainText("Telegram");
  await expect(page.getByRole("link", { name: "View project →" })).toHaveAttribute("href", cv.timer);
  for (const contact of await page.getByRole("link", { name: "Contact", exact: true }).all()) await expect(contact).toHaveAttribute("href", cv.contact);
  for (const portfolio of await page.getByRole("link", { name: "View portfolio →" }).all()) await expect(portfolio).toHaveAttribute("href", "/");
  await expect(page.locator("[data-pdf-download]")).toHaveCount(2);
  for (const download of await page.locator("[data-pdf-download]").all()) await expect(download).toBeDisabled();
  const width = page.viewportSize()!.width;
  const geometry = await page.evaluate(() => {
    const rect = (selector: string) => { const r = document.querySelector(selector)!.getBoundingClientRect(); return { x:r.x,y:r.y,width:r.width,height:r.height }; };
    return { overflow:document.documentElement.scrollWidth > innerWidth, logo:rect(".cv-wordmark"), experience:rect(".cv-experience"), practice:rect(".cv-practice"), img:(document.querySelector(".cv-wordmark img") as HTMLImageElement).naturalWidth };
  });
  expect(geometry.overflow).toBe(false);
  expect(geometry.img).toBeGreaterThan(0);
  expect(geometry.logo.y).toBe(width <= 640 ? 48 : 170);
  if (width === 1440) { expect(geometry.logo.x).toBe(136);expect(geometry.logo.width).toBeCloseTo(625.334,1);expect(geometry.experience.width).toBe(800);expect(geometry.practice.width).toBe(320); }
  if (width <= 640) { expect(geometry.logo.x).toBe(24);expect(geometry.logo.width).toBe(342);expect(geometry.practice.y).toBeGreaterThan(geometry.experience.y+geometry.experience.height); }
  expect(errors).toEqual([]);
});

test("main menu opens CV through a shrinking logo and browser back remains usable", async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.motion === "full");
  await page.waitForFunction(() => getComputedStyle(document.querySelector("[data-hero-logo]")!).clipPath === "none");
  await page.locator("[data-menu-toggle]").click();
  await page.locator("[data-cv-link]").click({ noWaitAfter: true });
  await expect(page.locator(".cv-route-transition")).toBeAttached();
  const before = await page.locator(".cv-route-transition__logo").evaluate(el => el.getBoundingClientRect().width);
  await page.waitForTimeout(350);
  const after = await page.locator(".cv-route-transition__logo").evaluate(el => el.getBoundingClientRect().width);
  expect(after).toBeLessThan(before);
  await page.waitForURL("**/cv");
  await expect(page.getByRole("heading", { name: cv.role, exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.locator(".cv-route-transition")).toHaveCount(0);
  await expect(page.locator("[data-menu-toggle]")).toBeVisible();
});

test("reduced motion keeps immediate CV navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion:"reduce" });
  await page.goto("/");
  await page.locator("[data-menu-toggle]").click();
  await page.locator("[data-cv-link]").click();
  await page.waitForURL("**/cv");
  await expect(page.locator(".cv-route-transition")).toHaveCount(0);
});

test("CV is accessible without JavaScript and at narrow widths", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled:false, viewport:{width:320,height:640} });
  const page = await context.newPage();
  await page.goto("/");
  await page.locator(".cv-fallback-link").click();
  await expect(page).toHaveURL(/\/cv$/);
  await expect(page.getByRole("heading", { name:"Premium Exchanger" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
