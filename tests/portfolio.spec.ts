import { expect, test } from "@playwright/test";

test("renders every portfolio section without horizontal overflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Dmitrii Pershin", exact: true })).toBeAttached();
  await expect(page.locator("#focus h2, #hard-skills h2, #soft-skills h2, #ai-workflow h2, #process-ai h2, #theme-builders h2, #interfaces h2, #pet-project h2, #contacts h2")).toHaveCount(9);
  await expect(page.locator("#contact-title")).toBeAttached();

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
  await expect(languageButton).toHaveAccessibleName("Открыть выбор языка");
  await languageButton.click();
  await expect(page.locator("[data-language-overlay]")).toHaveAttribute("aria-hidden", "false");
  await page.locator("[data-language-option='en']").click();
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
  await expect(languageButton).toBeVisible();
  expect(await menuButton.evaluate((element) => getComputedStyle(element).boxShadow)).toBe("none");
  const menuTop = await menuButton.evaluate((element) => element.getBoundingClientRect().top);
  const languageTop = await languageButton.evaluate((element) => element.getBoundingClientRect().top);

  await page.evaluate(() => window.scrollTo(0, 240));
  expect(await menuButton.evaluate((element) => getComputedStyle(element).position)).toBe((page.viewportSize()?.width ?? 1000) <= 640 ? "relative" : "fixed");
  expect(Math.round(menuTop)).toBe((page.viewportSize()?.width ?? 1000) <= 640 ? 20 : 64);
  expect(Math.round(languageTop)).toBe((page.viewportSize()?.width ?? 1000) <= 640 ? 20 : 148);
  if ((page.viewportSize()?.width ?? 1000) <= 640) {
    const roleFits = await page.locator(".floating-header__role").evaluate((element) => element.scrollWidth <= element.clientWidth && getComputedStyle(element).whiteSpace === "nowrap");
    expect(roleFits).toBe(true);
    expect(await menuButton.locator("span").evaluateAll((elements) => elements.map((element) => getComputedStyle(element).top))).toEqual(["16.5px", "23.25px", "30px"]);
  }
  await expect(page.locator(".floating-header")).toHaveAttribute("data-scroll-hidden", "");
  await expect(menuButton).toHaveCSS("visibility", "hidden");
  await expect(languageButton).toHaveCSS("visibility", "hidden");

  await page.evaluate(() => window.scrollBy(0, -80));
  await expect(page.locator(".floating-header")).not.toHaveAttribute("data-scroll-hidden", "");
  await expect(menuButton).toHaveCSS("visibility", "visible");
  await expect(languageButton).toHaveCSS("visibility", "visible");
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
    const focus = navigation.getByRole("link", { name: "FOCUS", exact: true });
    await focus.hover();
    await expect(focus).toHaveCSS("font-family", /Joyride Regular/);
    await expect(focus).toHaveCSS("opacity", "1");
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
  if ((page.viewportSize()?.width ?? 1000) > 640) {
    await expect(avatar).toHaveCSS("opacity", "1");
    const contactLinks = page.locator(".contact-links");
    const linksBottom = await contactLinks.evaluate((element) => element.getBoundingClientRect().bottom);
    const viewportHeight = page.viewportSize()?.height ?? 900;
    expect(linksBottom).toBeLessThanOrEqual(viewportHeight);
    expect(linksBottom).toBeGreaterThan(viewportHeight * 0.7);
  } else {
    await expect(avatar).toHaveCSS("opacity", "0");
  }
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

test("desktop hover animates one contour without moving its geometry", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1200, "Desktop hover check");
  await page.goto("/");
  const card = page.locator(".interface-metric--3");
  const cursorGlow = page.locator("[data-cursor-glow]");
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await expect(card.locator(":scope > .card-border")).toHaveCount(1);
  const pathBefore = await card.locator(":scope > .card-border > path").getAttribute("d");
  const before = await card.evaluate((element) => getComputedStyle(element).boxShadow);
  const cardBox = await card.boundingBox();
  expect(cardBox).not.toBeNull();
  await page.mouse.move((cardBox?.x ?? 0) + (cardBox?.width ?? 0) / 2, (cardBox?.y ?? 0) + (cardBox?.height ?? 0) / 2, { steps: 8 });
  await page.waitForTimeout(500);
  const state = await card.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      opacity: Number(style.getPropertyValue("--glow-opacity")),
      angle: style.getPropertyValue("--glow-angle"),
      gradientTransform: element.querySelector("linearGradient")?.getAttribute("gradientTransform"),
      strokeColor: getComputedStyle(element.querySelector("stop")!).stopColor,
      shadow: style.boxShadow,
    };
  });
  expect(state.opacity).toBeGreaterThan(0.15);
  expect(state.opacity).toBeLessThanOrEqual(0.91);
  expect(state.angle).toContain("deg");
  expect(state.gradientTransform).toContain("rotate(");
  expect(state.strokeColor).not.toContain("255, 255, 255");
  await expect(card.locator(":scope > .card-border > path")).toHaveAttribute("d", pathBefore!);
  await expect(card).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
  expect(state.shadow).toBe(before);
  await expect(cursorGlow).toHaveAttribute("data-active", "true");
  expect(Number.parseFloat(await cursorGlow.evaluate((element) => getComputedStyle(element).opacity))).toBeGreaterThan(0.1);
  expect((await cursorGlow.evaluate((element) => getComputedStyle(element).getPropertyValue("--cursor-glow-rgb"))).replace(/\s/g, "")).toBe("253,80,160");
  await expect(cursorGlow).toHaveCSS("width", "266px");
  await expect(cursorGlow).toHaveCSS("opacity", "0.45");
});

test("Skills hover stays purple and eases into the border highlight", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1200, "Desktop hover timing check");
  await page.goto("/");
  const chip = page.locator("#hard-skills .skill-chips--hard .skill-chip").first();
  await chip.scrollIntoViewIfNeeded();
  await page.mouse.move(-1000, -1000);
  await expect.poll(async () => Number.parseFloat(await chip.evaluate((element) => getComputedStyle(element).getPropertyValue("--glow-opacity")))).toBeLessThan(0.01);
  // Sample in the browser, not across delayed automation calls under CPU load.
  const [early, late] = await chip.evaluate(async (element) => {
    const rect = element.getBoundingClientRect();
    window.dispatchEvent(new PointerEvent("pointermove", { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 }));
    const values: number[] = [];
    for (let frame = 0; frame < 50; frame++) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      if (frame === 4 || frame === 49) values.push(Number.parseFloat(getComputedStyle(element).getPropertyValue("--glow-opacity")));
    }
    return values;
  });
  const highlight = await chip.locator(":scope > .card-border stop").first().evaluate((element) => getComputedStyle(element).stopColor);
  expect(early).toBeGreaterThan(0.05);
  expect(early).toBeLessThan(0.4);
  expect(late).toBeGreaterThan(early);
  expect(late).toBeLessThanOrEqual(0.91);
  await expect(chip).toHaveCSS("border-top", "1px solid rgba(0, 0, 0, 0)");
  await expect(chip).toHaveCSS("background-color", "rgba(118, 85, 146, 0.3)");
  await expect(chip).toHaveCSS("box-shadow", "rgba(118, 85, 146, 0.6) 0px 0px 60px -17.68px inset");
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
  const themeIconImage = themeIcon.locator(".glow-icon__base img");
  await speed.scrollIntoViewIfNeeded();

  await expect(speed).toHaveCSS("border-radius", "26px");
  expect(await speed.evaluate((element) => [element.clientWidth, element.clientHeight])).toEqual([282, 170]);
  await expect(primary).toHaveCSS("border-radius", "44px");
  expect(await primary.evaluate((element) => [element.clientWidth, element.clientHeight])).toEqual([1039, 451]);
  expect(await interfaceFirst.evaluate((element) => [element.clientWidth, element.clientHeight])).toEqual([358, 172]);
  expect(await comments.evaluate((element) => [element.clientWidth, element.clientHeight])).toEqual([378, 210]);
  await expect(interfaceFirst.locator("strong .visually-hidden")).toHaveText("561");
  await expect(interfaceFirst.locator("strong")).toHaveCSS("font-family", /Joyride WIDE/);
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
  const softHeading = page.locator("#soft-skills .display-heading--outline");
  const skillsSection = page.locator("#hard-skills");
  const thinking = skillsSection.locator(".skill-chip-rows--soft .skill-chip--thinking");
  const themeIcon = page.locator("#theme-builders .glow-icon--theme");
  const themeIconImage = themeIcon.locator(".glow-icon__base img");

  await softHeading.scrollIntoViewIfNeeded();
  await expect(softHeading).toBeVisible();
  expect(await skillsSection.evaluate((element) => Math.round(element.getBoundingClientRect().height))).toBe(2012);
  expect(await thinking.evaluate((element) => Math.round(element.getBoundingClientRect().height))).toBe(88);
  expect(await scene.evaluate((element) => Math.round(element.getBoundingClientRect().height))).toBe(1844);
  expect(await context.evaluate((element) => [Math.round(element.getBoundingClientRect().width), Math.round(element.getBoundingClientRect().height)])).toEqual([342, 296]);
  await expect(context).toHaveCSS("border-radius", "44px");
  expect(await tool.evaluate((element) => [Math.round(element.getBoundingClientRect().width), Math.round(element.getBoundingClientRect().height)])).toEqual([342, 142]);
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
  await expect(page.locator(".pet-card")).toHaveCSS("border-left-width", "0px");

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
  await expect(processCards.first().locator(".card-border__stop--2")).toHaveCSS("stop-opacity", "0");
  expect(await processCards.first().evaluate((element) => getComputedStyle(element).backgroundImage)).toBe("none");
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
  expect(contactGeometry.map(([icon, font]) => [icon, font])).toEqual(mobile ? [[26, 20], [26, 20]] : [[62, 40], [62, 40]]);
  contactGeometry.forEach(([, , width]) => expect(width).toBeLessThanOrEqual(mobile ? 342 : 608));
  if (mobile) {
    expect(await contacts.nth(0).locator("span").evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  }
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
  await expect(card.locator(":scope > .card-border")).toHaveCount(1);
  const stroke = card.locator(":scope > .card-border linearGradient");
  const initialPaint = await stroke.getAttribute("gradientTransform");
  const before = await card.evaluate((element) => getComputedStyle(element).getPropertyValue("--glow-angle"));
  await page.evaluate(() => window.scrollBy(0, 320));
  await page.waitForTimeout(100);
  const after = await card.evaluate((element) => getComputedStyle(element).getPropertyValue("--glow-angle"));
  expect(after).not.toBe(before);
  expect(await stroke.getAttribute("gradientTransform")).not.toBe(initialPaint);
  expect(Number.parseFloat(await card.evaluate((element) => getComputedStyle(element).getPropertyValue("--glow-opacity")))).toBeGreaterThan(0.8);
  const skillAngles = await page.locator(".skill-chip-rows--hard .skill-chip").evaluateAll((elements) => elements.slice(0, 6).map((element) => getComputedStyle(element).getPropertyValue("--glow-angle")));
  expect(new Set(skillAngles).size).toBeGreaterThan(4);
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
  await expect(page.locator("img.workflow-route")).toHaveCount(4);
  await expect(page.locator(".workflow-route > svg")).toHaveCount(3);
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
  await expect(closing.locator(".closing__heading")).toHaveText(/THANK\s*YOU/);
  await expect(closing.locator(".closing__heading-outline")).toHaveCSS("font-family", /Joyride WIDE/);
  expect(await closing.locator(".closing__heading-outline").evaluate((element) => getComputedStyle(element).webkitTextStrokeWidth)).toBe("2px");
  await expect(closing.locator(".closing__contacts span")).toHaveCount(2);
});

test("Joyride loads before paint and signature typography remains selectable live text", async ({ page }) => {
  await page.goto("/");
  const loaded = await page.evaluate(async () => {
    const faces = [
      '16px "Joyride Extended"',
      '16px "Joyride Extended Outline"',
      '16px "Joyride WIDE"',
      '16px "Joyride Regular"',
      '16px "Joyride Outline"',
    ];
    await Promise.all(faces.map((face) => document.fonts.load(face)));
    return faces.map((face) => document.fonts.check(face));
  });
  expect(loaded).toEqual([true, true, true, true, true]);

  await expect(page.locator('link[rel="preload"][href="/fonts/Joyride-Extended-Regular.otf"]')).toHaveCount(1);
  await expect(page.locator('link[rel="preload"][href="/fonts/Joyride-Extended-Outline.otf"]')).toHaveCount(1);
  await expect(page.locator(".hero__logo img, .display-heading img, .closing__heading img")).toHaveCount(0);
  await expect(page.locator(".display-heading")).toHaveCount(8);
  expect(await page.locator(".display-heading").first().evaluate((element) => getComputedStyle(element).fontFamily)).toContain("Joyride WIDE");
  const logoMask = page.locator("[data-hero-logo]");
  await expect(logoMask).toHaveCSS("overflow", "visible");
  await expect(logoMask).toHaveCSS("clip-path", "none");
});

test("AI context, tool cards and app icons use the exact Figma geometry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const context = (page.viewportSize()?.width ?? 1000) <= 640
    ? page.locator(".workflow-scene--mobile .workflow-context")
    : page.locator(".workflow-scene--desktop .workflow-context");
  await context.scrollIntoViewIfNeeded();
  await expect(context).toHaveCSS("border-top-style", "dashed");
  await expect(context).toHaveCSS("border-top-width", "2px");
  await expect(context.locator(":scope > .dash-border-glow")).toHaveCount(0);
  await expect(context.locator(":scope > .card-border-glow")).toHaveCount(0);
  await expect(context.locator(":scope > .card-border > path")).toHaveAttribute("stroke-dasharray", "4 4");
  await expect(context).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");

  const iconFrame = (page.viewportSize()?.width ?? 1000) <= 640
    ? page.locator(".workflow-scene--mobile .app-icon-frame").first()
    : page.locator(".workflow-scene--desktop .app-icon-frame").first();
  const expected = (page.viewportSize()?.width ?? 1000) <= 640 ? [54, 54, "12px"] : [150, 150, "39px"];
  expect(await iconFrame.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return [Math.round(rect.width), Math.round(rect.height), getComputedStyle(element).borderRadius];
  })).toEqual(expected);
  expect(await iconFrame.evaluate((element) => getComputedStyle(element).backgroundImage)).toBe("none");
  expect(await iconFrame.locator("img").getAttribute("src")).toMatch(/^\/assets\/workflow-(frame|mobile)-/);

  const tool = (page.viewportSize()?.width ?? 1000) <= 640
    ? page.locator(".workflow-scene--mobile .workflow-tool").first()
    : page.locator(".workflow-scene--desktop .workflow-tool").first();
  await expect(tool).toHaveCSS("border-top", "2px solid rgba(0, 0, 0, 0)");
  await expect(tool).toHaveCSS("background-color", "rgba(21, 48, 72, 0.1)");
  expect(await tool.evaluate((element) => getComputedStyle(element).boxShadow)).toContain("rgba(64, 88, 244, 0.3)");
});

test("Theme and Interfaces metrics use live staggered odometer digits", async ({ page }) => {
  await page.goto("/");
  const themeNumber = page.locator("#theme-builders [data-rolling-number]");
  await expect(themeNumber.locator(".visually-hidden")).toHaveText("250");
  await expect(themeNumber.locator(".rolling-number__digit")).toHaveCount(3);
  await expect(themeNumber.locator(".rolling-number__digit").first().locator(".rolling-number__number")).toHaveCount(20);
  await themeNumber.scrollIntoViewIfNeeded();
  await expect(themeNumber).toHaveClass(/is-(rolling|complete)/);
  await expect(themeNumber).toHaveCSS("--rolling-duration", "1.8s");
  await expect(page.locator(".interface-metric--1 [data-rolling-number]")).toHaveCSS("--rolling-duration", /^0?\.9s$/);
  await expect(themeNumber).toHaveClass(/is-complete/, { timeout: 3500 });
  await expect(page.locator(".interface-metric--1 .visually-hidden")).toHaveText("561");
});

test("health endpoint responds", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toEqual({ status: "ok" });
});

test("all cards have one painted border and icon exports have no extra ring", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  const contours = await page.locator(".interactive-card:not(.app-icon-frame, .process-card__logo)").evaluateAll((cards) => cards.map((card) => ({
    paths: card.querySelectorAll(":scope > .card-border > path").length,
    nativeBorder: getComputedStyle(card).borderTopColor,
    nativeGradient: getComputedStyle(card).backgroundImage,
  })));
  expect(contours.length).toBeGreaterThan(20);
  for (const contour of contours) {
    expect(contour).toEqual({ paths: 1, nativeBorder: "rgba(0, 0, 0, 0)", nativeGradient: "none" });
  }
  await expect(page.locator(".card-border-glow, .dash-border-glow, .app-icon-frame .card-border, .process-card__logo .card-border")).toHaveCount(0);
});

test("AI route translations replace their labels without adding another chip", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 640, "Desktop route labels");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const labels = page.locator(".workflow-route__label");
  await expect(labels).toHaveCount(3);
  await expect(labels.locator("tspan:not([hidden])")).toHaveText(["Контекст", "Интерпретация контекста", "Стили"]);
  await page.locator("[data-language-toggle]").click();
  await page.locator("[data-language-option='en']").click();
  await expect(labels.locator("tspan:not([hidden])")).toHaveText(["Context", "Context interpretation", "Styles"]);
  await expect(page.locator(".workflow-route-translation, .workflow-route path[id$='-Label']")).toHaveCount(0);
});

test("mobile header aligns with the logo and skill rows fill their width", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1000) > 640, "Mobile alignment");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  const edges = await page.evaluate(() => {
    const bounds = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
    const logo = bounds(".hero__logo-mask");
    const role = bounds(".floating-header__role");
    return [bounds("[data-language-toggle]").left - logo.left,
      bounds("[data-menu-toggle]").right - logo.right,
      (role.left + role.right) / 2 - window.innerWidth / 2];
  });
  edges.forEach((delta) => expect(Math.abs(delta)).toBeLessThan(1));
  const gaps = await page.locator(".skill-chip-row").evaluateAll((rows) => rows.map((row) => {
    const chips = row.querySelectorAll(".skill-chip");
    const bounds = row.getBoundingClientRect();
    return [chips[0].getBoundingClientRect().left - bounds.left,
      chips[chips.length - 1].getBoundingClientRect().right - bounds.right];
  }));
  gaps.flat().forEach((gap) => expect(Math.abs(gap)).toBeLessThan(1));
});

test("every desktop menu item fits on a short viewport", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 640, "Desktop menu fitting");
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await page.locator("[data-menu-toggle]").click();
  const bounds = await page.locator(".menu-overlay nav a").evaluateAll((links) => links.map((link) => {
    const rect = link.getBoundingClientRect();
    return [rect.top, rect.left, rect.right, rect.bottom];
  }));
  expect(bounds).toHaveLength(8);
  for (const [top, left, right, bottom] of bounds) {
    expect(top).toBeGreaterThanOrEqual(0);
    expect(left).toBeGreaterThanOrEqual(0);
    expect(right).toBeLessThanOrEqual(1280);
    expect(bottom).toBeLessThanOrEqual(600);
  }
});

test("cold font loading waits before the padded hero reveal without layout shift", async ({ page }) => {
  let releaseFonts!: () => void;
  const fontGate = new Promise<void>((resolve) => { releaseFonts = resolve; });
  await page.route("**/fonts/*", async (route) => { await fontGate; await route.continue(); });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const logo = page.locator("[data-hero-logo]");
  await expect(logo).toHaveCSS("clip-path", "inset(-40px 100% -40px -40px)");
  const before = await logo.boundingBox();
  releaseFonts();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  const during = await logo.evaluate((element) => getComputedStyle(element).clipPath);
  expect(during).toMatch(/^inset\(-40px/);
  await expect(logo).toHaveCSS("clip-path", "none");
  expect(await logo.boundingBox()).toEqual(before);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("essential portfolio content and final numbers remain readable", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-hero-logo]")).toHaveCSS("clip-path", "none");
    await expect(page.locator(".display-heading")).toHaveCount(8);
    await expect(page.locator(".theme-metric--primary .visually-hidden")).toHaveText("250");
    await expect(page.locator("#contacts .closing__contacts a")).toHaveCount(2);
    await expect(page.locator(".card-border-glow, .dash-border-glow")).toHaveCount(0);
    await expect(page.locator("#focus")).toHaveCSS("opacity", "1");
  });
});
