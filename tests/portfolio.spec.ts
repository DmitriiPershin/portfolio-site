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
  await expect(page.getByText("Client context", { exact: true }).filter({ visible: true }).first()).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByText("Client context", { exact: true }).filter({ visible: true }).first()).toBeVisible();
});

test("navigation controls follow the intended responsive scroll behaviour", async ({ page }) => {
  await page.goto("/");
  const languageButton = page.locator("[data-language-toggle]");
  const menuButton = page.locator("[data-menu-toggle]");
  const mobile = (page.viewportSize()?.width ?? 1000) <= 640;

  await expect(languageButton).toBeVisible();
  expect(await menuButton.evaluate((element) => getComputedStyle(element).boxShadow)).toBe("none");
  const menuTop = await menuButton.evaluate((element) => element.getBoundingClientRect().top);

  await page.evaluate(() => window.scrollTo(0, 80));
  const menuTopAfterScroll = await menuButton.evaluate((element) => element.getBoundingClientRect().top);
  if (mobile) {
    expect(await menuButton.evaluate((element) => getComputedStyle(element).position)).toBe("relative");
    expect(Math.round(menuTop)).toBe(24);
    expect(Math.round(menuTopAfterScroll)).toBe(-56);
    const boxes = await Promise.all([languageButton, menuButton].map((locator) => locator.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return [Math.round(rect.left), Math.round(rect.width), Math.round(rect.height)];
    })));
    expect(boxes).toEqual([[24, 48, 48], [319, 48, 48]]);
  } else {
    expect(await menuButton.evaluate((element) => getComputedStyle(element).position)).toBe("fixed");
    await expect(languageButton).toBeHidden();
    expect(Math.abs(menuTopAfterScroll - menuTop)).toBeLessThanOrEqual(1);
  }
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
  const status = avatar.locator(".avatar-button__status");
  const photo = avatar.locator(".avatar-button__photo");
  const expectedSize = (page.viewportSize()?.width ?? 1000) <= 640 ? 60 : 120;
  const expectedStatus = expectedSize === 60 ? 9 : 18;
  const expectedPadding = expectedSize === 60 ? "2.5px" : "5px";
  expect(await avatar.evaluate((element) => [element.clientWidth, element.clientHeight])).toEqual([expectedSize, expectedSize]);
  expect(await status.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return [Math.round(rect.width), Math.round(rect.height)];
  })).toEqual([expectedStatus, expectedStatus]);
  await expect(photo).toHaveCSS("padding-top", expectedPadding);
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
  const frontend = (page.viewportSize()?.width ?? 1000) <= 640
    ? page.locator("[data-mobile-workflow-node='frontend']")
    : page.locator("[data-workflow-node='frontend']");
  await expect(frontend).toBeVisible();
  await expect(page.locator(".connector")).toHaveCount(8);
  await expect(page.locator(".connector--top-a")).toHaveCSS("opacity", "1");
});

test("desktop cards use the PremiumExchanger pointer-following border glow", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1200, "Desktop hover check");
  await page.goto("/");
  const card = page.locator(".interface-metric--3");
  await card.scrollIntoViewIfNeeded();
  await expect(card.locator(":scope > .card-border-glow")).toHaveCount(1);
  const before = await card.evaluate((element) => getComputedStyle(element).boxShadow);
  await card.hover();
  await page.waitForTimeout(100);
  const state = await card.evaluate((element) => {
    const style = getComputedStyle(element);
    const glow = element.querySelector<HTMLElement>(":scope > .card-border-glow");
    return {
      opacity: Number(style.getPropertyValue("--glow-opacity")),
      angle: style.getPropertyValue("--glow-angle"),
      glowBackground: glow ? getComputedStyle(glow, "::before").backgroundImage : "none",
      shadow: style.boxShadow,
    };
  });
  expect(state.opacity).toBeGreaterThan(0.9);
  expect(state.angle).toContain("deg");
  expect(state.glowBackground).toContain("conic-gradient");
  expect(state.shadow).toBe(before);
});

test("desktop Theme Builder and Interfaces cards match Figma geometry", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1200, "Desktop Figma geometry check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const speed = page.locator(".theme-metric--desktop");
  const primary = page.locator(".theme-metric--primary");
  const interfaceFirst = page.locator(".interface-metric--1");
  const comments = page.locator(".interface-metric--4");
  await speed.scrollIntoViewIfNeeded();

  await expect(speed).toHaveCSS("border-radius", "26px");
  expect(await speed.evaluate((element) => [element.clientWidth, element.clientHeight])).toEqual([282, 170]);
  await expect(primary).toHaveCSS("border-radius", "44px");
  expect(await primary.evaluate((element) => [element.clientWidth, element.clientHeight])).toEqual([1039, 451]);
  expect(await interfaceFirst.evaluate((element) => [element.clientWidth, element.clientHeight])).toEqual([358, 172]);
  expect(await comments.evaluate((element) => [element.clientWidth, element.clientHeight])).toEqual([378, 210]);
  await expect(interfaceFirst.locator("strong img")).toHaveAttribute("src", "/assets/metric-interface-561-desktop.png");
  expect(await interfaceFirst.locator("strong img").evaluate((image) => [(image as HTMLImageElement).naturalWidth, (image as HTMLImageElement).naturalHeight])).toEqual([143, 34]);
  await expect(page.getByText("Сделал редизайн панели управления обменником", { exact: true })).toBeVisible();
});

test("mobile Workflow, Skills and Interfaces match Figma geometry", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1000) > 640, "Mobile Figma geometry check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const scene = page.locator(".workflow-scene--mobile");
  const context = scene.locator(".workflow-context");
  const tool = scene.locator("[data-mobile-workflow-node='claude-context']");
  const flows = scene.locator("[data-mobile-flow]");
  const softHeading = page.locator("#soft-skills .display-heading--soft");
  const skillsSection = page.locator("#hard-skills");
  const thinking = skillsSection.locator(".skill-chip-rows--soft .skill-chip--thinking");
  const themeIcon = page.locator("#theme-builders .glow-icon--theme");
  const themeIconImage = themeIcon.locator("img");

  await softHeading.scrollIntoViewIfNeeded();
  await expect(softHeading).toBeVisible();
  expect(await skillsSection.evaluate((element) => Math.round(element.getBoundingClientRect().height))).toBe(2012);
  expect(await thinking.evaluate((element) => Math.round(element.getBoundingClientRect().height))).toBe(88);
  expect(await scene.evaluate((element) => Math.round(element.getBoundingClientRect().height))).toBe(1806);
  expect(await context.evaluate((element) => [Math.round(element.getBoundingClientRect().width), Math.round(element.getBoundingClientRect().height)])).toEqual([342, 296]);
  await expect(context).toHaveCSS("border-radius", "44px");
  expect(await tool.evaluate((element) => [Math.round(element.getBoundingClientRect().width), Math.round(element.getBoundingClientRect().height)])).toEqual([342, 136]);
  await expect(tool).toHaveCSS("border-radius", "104px");
  await expect(flows).toHaveCount(6);
  expect(await flows.evaluateAll((elements) => elements.map((element) => Math.round(element.getBoundingClientRect().height)))).toEqual([116, 116, 116, 116, 116, 116]);

  const sceneCenter = await scene.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return rect.left + rect.width / 2;
  });
  const groupCenters = await Promise.all([flows.nth(0), flows.nth(3), flows.nth(5)].map((flow) => flow.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return rect.left + rect.width / 2;
  })));
  groupCenters.forEach((center) => expect(Math.abs(center - sceneCenter)).toBeLessThanOrEqual(1));

  expect(await themeIcon.evaluate((element) => [Math.round(element.getBoundingClientRect().width), Math.round(element.getBoundingClientRect().height)])).toEqual([180, 180]);
  expect(await themeIconImage.evaluate((element) => [Math.round(element.getBoundingClientRect().width), Math.round(element.getBoundingClientRect().height)])).toEqual([300, 222]);
  await expect(page.locator(".process-card").first()).toHaveCSS("border-left-width", "1px");
  await expect(page.locator(".pet-card")).toHaveCSS("border-left-width", "1px");

  const mobileComments = page.locator(".interface-metric--4");
  expect(await mobileComments.evaluate((element) => [Math.round(element.getBoundingClientRect().width), Math.round(element.getBoundingClientRect().height)])).toEqual([342, 96]);
  await expect(mobileComments).toHaveCSS("border-radius", "26px");
  await expect(page.locator(".ai-workflow__copy .section-headline [data-locale='ru']")).toContainText("стилей, иллюстраций");
  await expect(page.locator(".theme__headline [data-locale='ru']")).toContainText("дизайн-систему для");
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
  await expect(button).toBeHidden();

  const themeCopy = page.locator(".theme-copy");
  const themeButton = themeCopy.locator("[data-details-toggle]");
  await themeButton.scrollIntoViewIfNeeded();
  await expect(themeCopy.locator(".theme-copy__primary")).toBeVisible();
  await expect(themeCopy.locator(".theme-copy__secondary")).toBeHidden();
  await themeButton.click();
  await expect(themeCopy.locator(".theme-copy__primary")).toBeVisible();
  await expect(themeCopy.locator(".theme-copy__secondary")).toBeVisible();
  await expect(themeCopy.locator(".theme-copy__details")).toBeVisible();
  await expect(themeButton).toBeHidden();
});

test("mobile card borders rotate their gradient with scroll", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1000) > 640, "Mobile-only scroll-linked border motion");
  await page.goto("/");
  const card = page.locator(".process-card").first();
  await expect(page.locator("html")).toHaveAttribute("data-scroll-glow", "mobile");
  await expect(card.locator(":scope > .card-border-glow")).toHaveCount(1);
  const before = await card.evaluate((element) => getComputedStyle(element).getPropertyValue("--glow-angle"));
  await page.evaluate(() => window.scrollBy(0, 320));
  await page.waitForTimeout(100);
  const after = await card.evaluate((element) => getComputedStyle(element).getPropertyValue("--glow-angle"));
  expect(after).not.toBe(before);
  expect(Number.parseFloat(await card.evaluate((element) => getComputedStyle(element).getPropertyValue("--glow-opacity")))).toBeGreaterThan(0.8);
});

test("pet project uses the supplied destinations and exact portfolio font", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".pet-card__visual-link")).toHaveAttribute("href", /30mintimer\.com/);
  await expect(page.getByRole("link", { name: /Google Chrome/i })).toHaveAttribute("href", /chromewebstore\.google\.com\/detail\/30-minute-timer/);
  await expect(page.getByRole("link", { name: /30mintimer\.com/i })).toHaveAttribute("href", /30mintimer\.com/);
  await expect(page.getByRole("link", { name: /Open AI/i })).toHaveAttribute("href", /plugin_asdk_app_6a2420b57e388191a16f2f65fe21191c/);
  expect(await page.locator("body").evaluate((element) => getComputedStyle(element).fontFamily)).toContain("LINE Seed JP");
});

test("health endpoint responds", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toEqual({ status: "ok" });
});
