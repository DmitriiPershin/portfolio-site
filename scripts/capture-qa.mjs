import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch();
const baseURL = process.env.PORTFOLIO_BASE_URL || "http://127.0.0.1:4321";
const outputDir = process.env.QA_OUTPUT_DIR || "artifacts/qa";
await mkdir(outputDir, { recursive: true });

for (const viewport of [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
]) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: "reduce",
    colorScheme: "dark",
  });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "astro-dev-toolbar { display: none !important; }" });
  await page.screenshot({ path: `${outputDir}/${viewport.name}-initial-viewport.png`, animations: "disabled" });
  await page.screenshot({
    path: `${outputDir}/${viewport.name}.png`,
    fullPage: true,
    animations: "disabled",
  });

  for (const [name, selector] of [
    ["hero", ".hero"],
    ["focus", "#focus"],
    ["skills", "#hard-skills"],
    ["ai-workflow", "#ai-workflow"],
    ["process", "#process-ai"],
    ["theme-builders", "#theme-builders"],
    ["interfaces", "#interfaces"],
    ["pet-project", "#pet-project"],
    ["contacts", "#contacts"],
  ]) {
    await page.locator(selector).screenshot({
      path: `${outputDir}/${viewport.name}-${name}.png`,
      animations: "disabled",
    });
  }

  for (const [name, toggle, overlay, close] of [
    ["menu", "[data-menu-toggle]", "[data-menu-overlay]", "[data-menu-close]"],
    ["language", "[data-language-toggle]", "[data-language-overlay]", "[data-language-close]"],
    ["contact", "[data-contact-toggle]", "[data-contact-overlay]", "[data-contact-close]"],
  ]) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator(toggle).click();
    await page.locator(overlay).screenshot({
      path: `${outputDir}/${viewport.name}-${name}.png`,
      animations: "disabled",
    });
    await page.locator(close).click();
  }

  if (viewport.width <= 640) {
    const firstDetails = page.locator("#process-ai [data-details-toggle]").first();
    await firstDetails.click();
    await page.waitForTimeout(900);
    await page.locator("#process-ai").screenshot({
      path: `${outputDir}/${viewport.name}-process-open.png`,
      animations: "disabled",
    });
  }
  if (viewport.width > 640) {
    await page.locator("[data-language-toggle]").click();
    await page.locator("[data-language-option='en']").click();
    await page.locator("#ai-workflow").screenshot({ path: `${outputDir}/${viewport.name}-ai-workflow-en.png` });
  }
  await context.close();
}

const motionContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "no-preference",
  colorScheme: "dark",
});
const motionPage = await motionContext.newPage();
await motionPage.goto(baseURL, { waitUntil: "networkidle" });
await motionPage.addStyleTag({ content: "astro-dev-toolbar { display: none !important; }" });
const motionCard = motionPage.locator("#process-ai .process-card").first();
await motionCard.scrollIntoViewIfNeeded();
await motionPage.evaluate(() => window.scrollBy(0, 180));
await motionPage.waitForTimeout(150);
await motionCard.screenshot({
  path: `${outputDir}/mobile-390-scroll-glow.png`,
  animations: "disabled",
});
await motionContext.close();

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.documentElement.dataset.motion === "full");
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${outputDir}/hero-${viewport.width}-revealing.png` });
  await page.waitForFunction(() => getComputedStyle(document.querySelector("[data-hero-logo]")).clipPath === "none");
  await page.screenshot({ path: `${outputDir}/hero-${viewport.width}-complete.png` });
  await context.close();
}

const hoverContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "no-preference",
});
const hoverPage = await hoverContext.newPage();
await hoverPage.goto(baseURL, { waitUntil: "networkidle" });
for (const [name, cardSelector, iconSelector] of [
  ["process", ".process-card", ".process-card__logo"],
  ["workflow", ".workflow-card:has(.app-icon-frame)", ".app-icon-frame"],
]) {
  const card = hoverPage.locator(cardSelector).first();
  await card.scrollIntoViewIfNeeded();
  await card.locator(iconSelector).hover();
  await hoverPage.waitForTimeout(1400);
  await card.screenshot({ path: `${outputDir}/desktop-1440-${name}-hover.png` });
}
await hoverContext.close();
await browser.close();
