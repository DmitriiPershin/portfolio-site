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
  await page.screenshot({
    path: `artifacts/qa/${viewport.name}.png`,
    fullPage: true,
    animations: "disabled",
  });
  await context.close();
}

await browser.close();
