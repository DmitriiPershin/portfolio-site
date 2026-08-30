import { chromium } from "@playwright/test";

const browser = await chromium.launch();

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
  await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "astro-dev-toolbar { display: none !important; }" });
  await page.screenshot({
    path: `artifacts/qa/${viewport.name}.png`,
    fullPage: true,
    animations: "disabled",
  });

  for (const [name, selector] of [
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
      path: `artifacts/qa/${viewport.name}-${name}.png`,
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
      path: `artifacts/qa/${viewport.name}-${name}.png`,
      animations: "disabled",
    });
    await page.locator(close).click();
  }

  if (viewport.width <= 640) {
    const firstDetails = page.locator("#process-ai [data-details-toggle]").first();
    await firstDetails.click();
    await page.waitForTimeout(900);
    await page.locator("#process-ai").screenshot({
      path: `artifacts/qa/${viewport.name}-process-open.png`,
      animations: "disabled",
    });
  }
  await context.close();
}

const motionContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "no-preference",
  colorScheme: "dark",
});
const motionPage = await motionContext.newPage();
await motionPage.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await motionPage.addStyleTag({ content: "astro-dev-toolbar { display: none !important; }" });
const motionCard = motionPage.locator("#process-ai .process-card").first();
await motionCard.scrollIntoViewIfNeeded();
await motionPage.evaluate(() => window.scrollBy(0, 180));
await motionPage.waitForTimeout(150);
await motionCard.screenshot({
  path: "artifacts/qa/mobile-390-scroll-glow.png",
  animations: "disabled",
});
await motionContext.close();

await browser.close();
