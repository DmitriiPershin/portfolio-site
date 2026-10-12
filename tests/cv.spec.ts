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
  for (const download of await page.locator("[data-pdf-download]").all()) await expect(download).toBeEnabled();
  await page.locator("[data-pdf-download]").first().click();
  await expect(page.locator("#cv-pdf-dialog")).toBeVisible();
  await expect(page.getByRole("button", {name:"Desktop PDF",exact:true})).toBeDisabled();
  await expect(page.getByRole("button", {name:"Mobile PDF",exact:true})).toBeDisabled();
  await page.keyboard.press("Escape");
  const width = page.viewportSize()!.width;
  const geometry = await page.evaluate(() => {
    const rect = (selector: string) => { const r = document.querySelector(selector)!.getBoundingClientRect(); return { x:r.x,y:r.y,width:r.width,height:r.height }; };
    return { overflow:document.documentElement.scrollWidth > innerWidth, logo:rect(".cv-wordmark"), experience:rect(".cv-experience"), practice:rect(".cv-practice"), img:(document.querySelector(".cv-wordmark img") as HTMLImageElement).naturalWidth };
  });
  expect(geometry.overflow).toBe(false);
  expect(geometry.img).toBeGreaterThan(0);
  expect(geometry.logo.y).toBe(width <= 640 ? 104 : 170);
  if (width === 1440) { expect(geometry.logo.x).toBe(136);expect(geometry.logo.width).toBeCloseTo(625.334,1);expect(geometry.experience.width).toBe(800);expect(geometry.practice.width).toBe(320); }
  if (width <= 640) { expect(geometry.logo.x).toBe(24);expect(geometry.logo.width).toBe(342);expect(geometry.practice.y).toBeGreaterThan(geometry.experience.y+geometry.experience.height); }
  expect(errors).toEqual([]);
});

test("header opens CV through a shrinking logo and browser back remains usable", async ({ page }) => {
  await page.addInitScript(() => window.addEventListener("beforeunload",()=>{
    const logo=document.querySelector(".cv-route-transition__logo");
    if(!logo)return;
    const r=logo.getBoundingClientRect();
    sessionStorage.setItem("cv-flight-test",JSON.stringify({x:r.x,y:r.y,width:r.width,height:r.height,opacity:getComputedStyle(logo).opacity}));
  }));
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.motion === "full");
  await page.waitForFunction(() => getComputedStyle(document.querySelector("[data-hero-logo]")!).clipPath === "none");
  await page.locator("[data-cv-link]").click({ noWaitAfter: true });
  await expect(page.locator(".cv-route-transition")).toBeAttached();
  await expect(page.locator(".cv-route-transition img")).toHaveCount(1);
  await expect(page.locator(".cv-route-transition img")).toHaveAttribute("src", "/assets/cv-wordmark.svg");
  await expect(page.locator(".cv-route-transition__target")).toHaveCount(0);
  await expect(page.locator(".hero__logo img")).toHaveCSS("visibility", "hidden");
  const before = await page.locator(".cv-route-transition__logo").evaluate(el => el.getBoundingClientRect().width);
  await page.waitForTimeout(350);
  const after = await page.locator(".cv-route-transition__logo").evaluate(el => el.getBoundingClientRect().width);
  expect(after).toBeLessThan(before);
  await page.waitForURL("**/cv");
  const arriving=await page.evaluate(()=>JSON.parse(sessionStorage.getItem("cv-flight-test") || "null"));
  expect(arriving.opacity).toBe("1");
  const landed=await page.locator(".cv-wordmark img").boundingBox();
  expect(Math.abs(arriving.x-landed!.x)).toBeLessThan(1);
  expect(Math.abs(arriving.y-landed!.y)).toBeLessThan(1);
  expect(Math.abs(arriving.width-landed!.width)).toBeLessThan(1);
  expect(Math.abs(arriving.height-landed!.height)).toBeLessThan(1);
  await expect(page.getByRole("heading", { name: cv.role, exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.locator(".cv-route-transition")).toHaveCount(0);
  await expect(page.locator("[data-menu-toggle]")).toBeVisible();
  await expect(page.locator(".hero__logo img")).toHaveCSS("visibility", "visible");
});

test("reduced motion keeps immediate CV navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion:"reduce" });
  await page.goto("/");
  await page.locator("[data-cv-link]").click();
  await page.waitForURL("**/cv");
  await expect(page.locator(".cv-route-transition")).toHaveCount(0);
});

test("CV is accessible without JavaScript and at narrow widths", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled:false, viewport:{width:320,height:640} });
  const page = await context.newPage();
  await page.goto("/");
  await page.locator("[data-cv-link]").click();
  await expect(page).toHaveURL(/\/cv$/);
  await expect(page.getByRole("heading", { name:"Premium Exchanger" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});


test("CV language and theme preserve each other and the PDF format choice", async ({ page }) => {
  await page.goto("/cv");
  await expect(page.locator("html")).toHaveAttribute("data-cv-theme", "dark");
  await expect(page.locator(".cv-summary")).toContainText("around 20 years");
  await expect(page.locator(".cv-control--theme img")).toHaveAttribute("src", "/assets/cv-theme-light.svg");
  await page.getByRole("link", {name:"Switch to light theme"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-cv-theme", "light");
  await expect(page.locator(".cv-control--theme img")).toHaveAttribute("src", "/assets/cv-theme-dark.svg");
  await page.getByRole("button", {name:"Choose language"}).click();
  await page.getByRole("button", {name:"RUS",exact:true}).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.locator("html")).toHaveAttribute("data-cv-theme", "light");
  await expect(page.locator(".cv-summary")).toContainText("около 20 лет опыта в дизайне");
  await page.reload();
  await expect(page.getByRole("heading", {name:"Опыт",exact:true})).toBeVisible();
  await page.locator("[data-pdf-download]").first().click();
  await expect(page.locator("[data-pdf-selection]")).toHaveText("Светлая тема · Русский");
  await expect(page.locator("[data-pdf-format=desktop]")).toBeDisabled();
  await expect(page.locator("[data-pdf-format=mobile]")).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-pdf-download]").first()).toBeFocused();
  await page.locator(".cv-control--theme").click();
  await expect(page.locator("html")).toHaveAttribute("data-cv-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});


test("CV theme interpolates without reload and both overlays match portfolio behaviour", async ({ page }) => {
  await page.goto("/cv");
  await page.locator("html[data-cv-controls-ready]").waitFor();
  await page.evaluate(() => (window as Window & { cvIdentity?: object }).cvIdentity = {});
  await page.locator(".cv-control--theme").click();
  const colors = await page.evaluate(async () => {
    const values: string[]=[];
    const start=performance.now();
    await new Promise<void>(resolve => { const sample=()=>{values.push(getComputedStyle(document.body).backgroundColor);if(performance.now()-start<900)requestAnimationFrame(sample);else resolve();};sample(); });
    return [...new Set(values)];
  });
  expect(colors.length).toBeGreaterThan(5);
  expect(colors.some(color=>color!=="rgb(0, 0, 0)"&&color!=="rgb(246, 244, 255)")).toBe(true);
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(246, 244, 255)");
  expect(await page.evaluate(() => Boolean((window as Window & { cvIdentity?: object }).cvIdentity))).toBe(true);
  await page.locator("[data-menu-toggle]").click();
  await expect(page.locator("[data-menu-overlay]")).toHaveAttribute("aria-hidden", "false");
  const choice=page.locator("[data-menu-overlay] a[href='#experience-heading']");
  await expect(choice.locator("[data-morph-label]")).toBeVisible();
  if(page.viewportSize()!.width>640) await expect(choice.locator(".morph-label__base")).toHaveCSS("font-family", /Joyride Outline/);
  const targetY=await page.locator("#experience-heading").evaluate(el=>el.getBoundingClientRect().top+scrollY);
  await choice.click();
  await expect(page.locator("[data-menu-overlay]")).toHaveAttribute("aria-hidden", "true");
  const positions=await page.evaluate(async()=>{const points:number[]=[];const start=performance.now();await new Promise<void>(resolve=>{const sample=()=>{points.push(scrollY);if(performance.now()-start<900)requestAnimationFrame(sample);else resolve();};sample();});return points;});
  expect(positions.some(y=>y>0&&y<targetY-1)).toBe(true);
  expect(Math.abs(positions.at(-1)!-targetY)).toBeLessThan(2);
  await page.locator("[data-language-toggle]").click();
  await expect(page.locator("[data-language-overlay]")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", {name:"RUS",exact:true}).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.locator("[data-language-overlay]")).toHaveAttribute("aria-hidden", "true");
  expect(await page.evaluate(() => Boolean((window as Window & { cvIdentity?: object }).cvIdentity))).toBe(true);
  await expect(page.locator("html")).toHaveAttribute("data-cv-theme", "light");
  const scrollBefore=await page.evaluate(()=>scrollY);
  await page.locator(".cv-control--theme").click();
  const darkSamples=await page.evaluate(async()=>{const values:string[]=[];const start=performance.now();await new Promise<void>(resolve=>{const sample=()=>{values.push(getComputedStyle(document.body).backgroundColor);if(performance.now()-start<900)requestAnimationFrame(sample);else resolve();};sample();});return [...new Set(values)];});
  expect(darkSamples.length).toBeGreaterThan(5);
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(0, 0, 0)");
  expect(await page.evaluate(()=>scrollY)).toBe(scrollBefore);
  await page.locator(".cv-control--theme").click();
  await page.waitForTimeout(120);
  await page.locator(".cv-control--theme").click();
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await expect(page.locator(".cv-control--theme img")).toHaveAttribute("src", "/assets/cv-theme-light.svg");
  await expect(page).toHaveURL(/theme=dark/);
});
