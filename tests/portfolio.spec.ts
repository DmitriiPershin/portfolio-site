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
  const mobile = (page.viewportSize()?.width ?? 1000) <= 640;
  await expect(languageButton).toHaveAccessibleName("Открыть выбор языка");
  await languageButton.click();
  if (!mobile) {
    await expect(page.locator("[data-language-overlay]")).toHaveAttribute("aria-hidden", "false");
    await page.locator("[data-language-option='en']").click();
  }
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
  const languageTop = await languageButton.evaluate((element) => element.getBoundingClientRect().top);

  await page.evaluate(() => window.scrollTo(0, 240));
  const menuTopAfterScroll = await menuButton.evaluate((element) => element.getBoundingClientRect().top);
  const languageTopAfterScroll = await languageButton.evaluate((element) => element.getBoundingClientRect().top);
  if (mobile) {
    expect(await menuButton.evaluate((element) => getComputedStyle(element).position)).toBe("relative");
    expect(Math.round(menuTop)).toBe(24);
    expect(Math.round(menuTopAfterScroll)).toBe(-216);
    const boxes = await Promise.all([languageButton, menuButton].map((locator) => locator.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return [Math.round(rect.left), Math.round(rect.width), Math.round(rect.height)];
    })));
    expect(boxes).toEqual([[24, 48, 48], [319, 48, 48]]);
  } else {
    expect(await menuButton.evaluate((element) => getComputedStyle(element).position)).toBe("fixed");
    expect(Math.round(menuTop)).toBe(64);
    expect(Math.round(languageTop)).toBe(148);
    expect(Math.round(menuTopAfterScroll)).toBe(64);
    expect(Math.round(languageTopAfterScroll)).toBe(148);
    const expectedLeft = (page.viewportSize()?.width ?? 1440) - 112;
    expect(await Promise.all([languageButton, menuButton].map((locator) => locator.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return [Math.round(rect.left), Math.round(rect.width), Math.round(rect.height)];
    })))).toEqual([[expectedLeft, 64, 64], [expectedLeft, 64, 64]]);

    await page.locator("#hard-skills [data-reveal='icon']").scrollIntoViewIfNeeded();
    await expect(page.locator(".floating-header")).toHaveAttribute("data-scroll-hidden", "");
    await expect(menuButton).toHaveCSS("visibility", "hidden");
    await expect(languageButton).toHaveCSS("visibility", "hidden");
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
  if ((page.viewportSize()?.width ?? 1000) > 640) {
    const focus = navigation.getByRole("link", { name: "Focus", exact: true });
    await focus.hover();
    await expect(focus.locator(".menu-label__base")).toHaveCSS("opacity", "0");
    await expect(focus.locator(".menu-label__hover")).toHaveCSS("opacity", "0.4");
  }
  await page.keyboard.press("Escape");
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
});

test("avatar opens contact details", async ({ page }) => {
  await page.goto("/");
  const avatar = page.locator("[data-contact-toggle]");
  const status = avatar.locator(".avatar-button__status");
  const photoShell = avatar.locator(".avatar-button__photo-shell");
  const expectedSize = (page.viewportSize()?.width ?? 1000) <= 640 ? 60 : 120;
  const expectedStatus = expectedSize === 60 ? 9 : 18;
  const expectedInner = expectedSize === 60 ? 55 : 110;
  expect(await avatar.evaluate((element) => [element.clientWidth, element.clientHeight])).toEqual([expectedSize, expectedSize]);
  expect(await status.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return [Math.round(rect.width), Math.round(rect.height)];
  })).toEqual([expectedStatus, expectedStatus]);
  expect(await photoShell.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return [Math.round(rect.width), Math.round(rect.height)];
  })).toEqual([expectedInner, expectedInner]);
  await avatar.click();
  const dialog = page.getByRole("dialog", { name: "Nice to meet you" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /dmitrii_pershin/i })).toHaveAttribute("href", "https://t.me/dmitrii_pershin");
  const contactHeading = page.locator(".contact-heading");
  expect(await contactHeading.evaluate((element) => Math.ceil(element.getBoundingClientRect().bottom))).toBeLessThanOrEqual(page.viewportSize()?.height ?? 900);
  await page.locator("[data-contact-close]").click();
  await expect(page.locator("[data-contact-overlay]")).toHaveAttribute("aria-hidden", "true");
});

test("reduced motion keeps content and joined Figma routes visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  const frontend = (page.viewportSize()?.width ?? 1000) <= 640
    ? page.locator("[data-mobile-workflow-node='frontend']")
    : page.locator("[data-workflow-node='frontend']");
  await expect(frontend).toBeVisible();
  await expect(page.locator(".workflow-route")).toHaveCount(7);
  await expect(page.locator(".workflow-route--context")).toHaveCSS("opacity", "1");
});

test("desktop cards use the PremiumExchanger pointer-following border glow", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1200, "Desktop hover check");
  await page.goto("/");
  const card = page.locator(".interface-metric--3");
  const cursorGlow = page.locator("[data-cursor-glow]");
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await expect(card.locator(":scope > .card-border-glow")).toHaveCount(1);
  const before = await card.evaluate((element) => getComputedStyle(element).boxShadow);
  const cardBox = await card.boundingBox();
  expect(cardBox).not.toBeNull();
  await page.mouse.move((cardBox?.x ?? 0) + (cardBox?.width ?? 0) / 2, (cardBox?.y ?? 0) + (cardBox?.height ?? 0) / 2, { steps: 8 });
  await page.waitForTimeout(500);
  const state = await card.evaluate((element) => {
    const style = getComputedStyle(element);
    const glow = element.querySelector<HTMLElement>(":scope > .card-border-glow");
    return {
      opacity: Number(style.getPropertyValue("--glow-opacity")),
      angle: style.getPropertyValue("--glow-angle"),
      glowOpacity: glow ? Number(getComputedStyle(glow).opacity) : 0,
      glowBackground: glow ? getComputedStyle(glow, "::before").backgroundImage : "none",
      shadow: style.boxShadow,
    };
  });
  expect(state.glowOpacity).toBeGreaterThan(0.15);
  expect(state.glowOpacity).toBeLessThanOrEqual(0.91);
  expect(state.angle).toContain("deg");
  expect(state.glowBackground).toContain("conic-gradient");
  expect(state.glowBackground).not.toContain("255, 255, 255");
  expect(state.shadow).toBe(before);
  await expect(cursorGlow).toHaveAttribute("data-active", "true");
  expect(Number.parseFloat(await cursorGlow.evaluate((element) => getComputedStyle(element).opacity))).toBeGreaterThan(0.1);
});

test("Skills hover stays purple and eases into the border highlight", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1200, "Desktop hover timing check");
  await page.goto("/");
  const chip = page.locator("#hard-skills .skill-chips--hard .skill-chip").first();
  await chip.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  const chipBox = await chip.boundingBox();
  expect(chipBox).not.toBeNull();
  await page.mouse.move((chipBox?.x ?? 0) + (chipBox?.width ?? 0) / 2, (chipBox?.y ?? 0) + (chipBox?.height ?? 0) / 2, { steps: 8 });
  await page.waitForTimeout(120);
  const early = Number.parseFloat(await chip.evaluate((element) => getComputedStyle(element).getPropertyValue("--glow-opacity")));
  await page.waitForTimeout(700);
  const late = Number.parseFloat(await chip.evaluate((element) => getComputedStyle(element).getPropertyValue("--glow-opacity")));
  const highlight = await chip.locator(":scope > .card-border-glow").evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
  expect(early).toBeGreaterThan(0.05);
  expect(early).toBeLessThan(0.65);
  expect(late).toBeGreaterThan(early);
  expect(late).toBeLessThanOrEqual(0.91);
  expect(highlight).toContain("118, 85, 146");
  expect(highlight).not.toContain("255, 255, 255");
});

test("desktop Theme Builder and Interfaces cards match Figma geometry", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1200, "Desktop Figma geometry check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const speed = page.locator(".theme-metric--desktop");
  const primary = page.locator(".theme-metric--primary");
  const interfaceFirst = page.locator(".interface-metric--1");
  const comments = page.locator(".interface-metric--4");
  const themeIcon = page.locator("#theme-builders .glow-icon--theme");
  const themeIconImage = themeIcon.locator("img");
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
  expect(await themeIconImage.evaluate((image) => {
    const icon = image.closest(".glow-icon")?.getBoundingClientRect();
    const rect = image.getBoundingClientRect();
    return [
      Math.round(rect.width),
      Math.round(rect.height),
      Math.round((rect.left - (icon?.left ?? 0)) * 10) / 10,
      Math.round(rect.top - (icon?.top ?? 0)),
    ];
  })).toEqual([633, 468, -166.5, 0]);
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
  expect(await themeIconImage.evaluate((element) => [Math.round(element.getBoundingClientRect().width), Math.round(element.getBoundingClientRect().height)])).toEqual([180, 180]);
  expect(await themeIconImage.evaluate((image) => (image as HTMLImageElement).currentSrc.endsWith("/assets/icon-theme-builders-mobile-exact.png"))).toBe(true);
  await expect(page.locator(".process-card").first()).toHaveCSS("border-left-width", "1px");
  await expect(page.locator(".pet-card")).toHaveCSS("border-left-width", "1px");

  const mobileComments = page.locator(".interface-metric--4");
  expect(await mobileComments.evaluate((element) => [Math.round(element.getBoundingClientRect().width), Math.round(element.getBoundingClientRect().height)])).toEqual([342, 96]);
  await expect(mobileComments).toHaveCSS("border-radius", "26px");
  await expect(page.locator(".ai-workflow__copy .section-headline [data-locale='ru']")).toContainText("стилей, иллюстраций");
  await expect(page.locator(".theme__headline [data-locale='ru']")).toContainText("дизайн-систему для");
});

test("Focus, Process and closing contacts follow the Figma formatting", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const mobile = (page.viewportSize()?.width ?? 1000) <= 640;
  const focusParagraphs = page.locator(".focus__body [data-locale='ru'] p");
  await expect(focusParagraphs).toHaveCount(2);
  expect(await focusParagraphs.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).display))).toEqual(["block", "block"]);

  const processCards = page.locator(".process-card");
  await processCards.first().scrollIntoViewIfNeeded();
  await expect(processCards.first()).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
  expect(await processCards.first().evaluate((element) => getComputedStyle(element).backgroundImage)).toContain("linear-gradient");
  await expect(processCards.first()).toHaveCSS("border-radius", mobile ? "26px" : "80px");
  if (mobile) {
    expect(await processCards.evaluateAll((elements) => elements.map((element) => Math.round(element.getBoundingClientRect().height)))).toEqual([420, 448, 448]);
    expect(await processCards.first().locator(".more-button").evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return [Math.round(rect.width), Math.round(rect.height)];
    })).toEqual([140, 50]);
    expect(await page.locator(".focus__mobile-break").evaluate((element) => getComputedStyle(element).display)).toBe("inline");
  } else {
    expect(await processCards.evaluateAll((elements) => elements.map((element) => Math.round(element.getBoundingClientRect().height)))).toEqual([438, 438, 374]);
  }

  const contacts = page.locator("#contacts .closing__contacts a");
  await expect(contacts).toHaveCount(2);
  await expect(contacts.nth(0)).toHaveAttribute("href", "mailto:pershindmitrii@gmail.com");
  await expect(contacts.nth(1)).toHaveAttribute("href", "https://t.me/dmitrii_pershin");
  const contactGeometry = await contacts.evaluateAll((elements) => elements.map((element) => {
    const icon = element.querySelector("img")?.getBoundingClientRect();
    const style = getComputedStyle(element);
    return [Math.round(icon?.width ?? 0), Math.round(Number.parseFloat(style.fontSize)), Math.ceil(element.getBoundingClientRect().width)];
  }));
  expect(contactGeometry.map(([icon, font]) => [icon, font])).toEqual(mobile ? [[48, 20], [48, 20]] : [[62, 40], [62, 40]]);
  contactGeometry.forEach(([, , width]) => expect(width).toBeLessThanOrEqual(mobile ? 342 : 608));
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

test("pet project uses the verified destinations and exact portfolio font", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".pet-card__visual-link")).toHaveAttribute("href", /30mintimer\.com/);
  await expect(page.getByRole("link", { name: /Google Chrome/i })).toHaveAttribute("href", /chromewebstore\.google\.com\/detail\/30-minute-timer/);
  await expect(page.getByRole("link", { name: /30mintimer\.com/i })).toHaveAttribute("href", /30mintimer\.com/);
  await expect(page.getByRole("link", { name: /Open AI/i })).toHaveAttribute("href", /^https:\/\/chatgpt\.com\//);
  expect(await page.locator("body").evaluate((element) => getComputedStyle(element).fontFamily)).toContain("LINE Seed JP");
});

test("desktop AI routes, Pet Project and closing section use the latest Figma structure", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1200, "Desktop Figma structure check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const routes = page.locator(".workflow-route");
  await expect(routes).toHaveCount(7);
  expect(await routes.evaluateAll((elements) => elements.every((element) => (element as HTMLImageElement).currentSrc.endsWith(".svg")))).toBe(true);
  await expect(page.locator(".workflow-route-filter")).toHaveCount(0);

  const pet = page.locator(".pet-card");
  const visual = page.locator(".pet-card__visual-link");
  const platforms = page.locator(".pet-platforms");
  expect(await pet.evaluate((element) => [Math.round(element.getBoundingClientRect().width), getComputedStyle(element).borderLeftWidth, getComputedStyle(element).paddingLeft])).toEqual([1066, "0px", "0px"]);
  expect(await visual.evaluate((element) => [Math.round(element.getBoundingClientRect().width), Math.round(element.getBoundingClientRect().height)])).toEqual([1066, 600]);
  expect(await platforms.evaluate((element) => [Math.round(element.getBoundingClientRect().width), getComputedStyle(element).columnGap])).toEqual([809, "40px"]);

  const closing = page.locator("#contacts");
  await closing.scrollIntoViewIfNeeded();
  await expect(page.locator("[data-contact-toggle]")).toHaveAttribute("data-closing-visible", "");
  await expect(page.locator("[data-contact-toggle]")).toHaveCSS("visibility", "hidden");
  await expect(closing.locator(".closing__heading")).toHaveAttribute("src", "/assets/closing-heading.svg");
  await expect(closing.locator(".closing__contacts span")).toHaveCount(2);
});

test("health endpoint responds", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toEqual({ status: "ok" });
});
