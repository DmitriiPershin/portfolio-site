import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initCardBorders } from "./borders";

gsap.registerPlugin(ScrollTrigger);

type Language = "ru" | "en";

const select = <T extends Element>(selector: string, scope: ParentNode = document) =>
  scope.querySelector<T>(selector);
const selectAll = <T extends Element>(selector: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(selector));

const readMotionNumber = (name: string, fallback: number) => {
  const value = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
};

function setBodyLocked() {
  const openOverlay = select<HTMLElement>('[data-menu-overlay][aria-hidden="false"], [data-language-overlay][aria-hidden="false"], [data-contact-overlay][aria-hidden="false"]');
  document.body.classList.toggle("overlay-open", Boolean(openOverlay));
}

function initOverlays() {
  const menuToggle = select<HTMLButtonElement>("[data-menu-toggle]");
  const menuOverlay = select<HTMLElement>("[data-menu-overlay]");
  const menuClose = select<HTMLButtonElement>("[data-menu-close]");
  const languageToggle = select<HTMLButtonElement>("[data-language-toggle]");
  const languageOverlay = select<HTMLElement>("[data-language-overlay]");
  const languageClose = select<HTMLButtonElement>("[data-language-close]");
  const contactToggle = select<HTMLButtonElement>("[data-contact-toggle]");
  const contactOverlay = select<HTMLElement>("[data-contact-overlay]");
  const contactClose = select<HTMLButtonElement>("[data-contact-close]");

  const setMenu = (open: boolean) => {
    if (!menuToggle || !menuOverlay) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuOverlay.setAttribute("aria-hidden", String(!open));
    if (open && contactOverlay?.getAttribute("aria-hidden") === "false") setContact(false);
    if (open && languageOverlay?.getAttribute("aria-hidden") === "false") setLanguage(false);
    setBodyLocked();
    if (open) menuOverlay.focus({ preventScroll: true });
  };

  const setLanguage = (open: boolean) => {
    if (!languageToggle || !languageOverlay) return;
    languageToggle.setAttribute("aria-expanded", String(open));
    languageOverlay.setAttribute("aria-hidden", String(!open));
    if (open && menuOverlay?.getAttribute("aria-hidden") === "false") setMenu(false);
    if (open && contactOverlay?.getAttribute("aria-hidden") === "false") setContact(false);
    setBodyLocked();
    if (open) languageOverlay.focus({ preventScroll: true });
  };

  const setContact = (open: boolean) => {
    if (!contactToggle || !contactOverlay) return;
    contactToggle.setAttribute("aria-expanded", String(open));
    contactOverlay.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("contact-open", open);
    if (open && menuOverlay?.getAttribute("aria-hidden") === "false") setMenu(false);
    if (open && languageOverlay?.getAttribute("aria-hidden") === "false") setLanguage(false);
    setBodyLocked();
    if (open) contactOverlay.focus({ preventScroll: true });
  };

  menuToggle?.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
  menuClose?.addEventListener("click", () => {
    setMenu(false);
    menuToggle?.focus();
  });
  selectAll<HTMLAnchorElement>("a", menuOverlay ?? document).forEach((link) => link.addEventListener("click", () => setMenu(false)));
  languageToggle?.addEventListener("click", () => setLanguage(languageToggle.getAttribute("aria-expanded") !== "true"));
  languageClose?.addEventListener("click", () => {
    setLanguage(false);
    languageToggle?.focus();
  });
  selectAll<HTMLButtonElement>("[data-language-option]", languageOverlay ?? document).forEach((button) => button.addEventListener("click", () => setLanguage(false)));
  contactToggle?.addEventListener("click", () => setContact(contactToggle.getAttribute("aria-expanded") !== "true"));
  contactClose?.addEventListener("click", () => {
    setContact(false);
    contactToggle?.focus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuToggle.focus();
    }
    if (languageToggle?.getAttribute("aria-expanded") === "true") {
      setLanguage(false);
      languageToggle.focus();
    }
    if (contactToggle?.getAttribute("aria-expanded") === "true") {
      setContact(false);
      contactToggle.focus();
    }
  });
}

function initLanguage() {
  const toggle = select<HTMLButtonElement>("[data-language-toggle]");
  const options = selectAll<HTMLButtonElement>("[data-language-option]");
  if (!toggle) return;

  let language: Language = "ru";
  try {
    const saved = window.localStorage.getItem("portfolio-language");
    if (saved === "ru" || saved === "en") language = saved;
  } catch {
    // The default Russian content remains usable when storage is unavailable.
  }

  const apply = (next: Language) => {
    language = next;
    document.documentElement.lang = next;
    selectAll<HTMLElement | SVGElement>("[data-locale]").forEach((element) => {
      element.toggleAttribute("hidden", element.dataset.locale !== next);
    });
    toggle.setAttribute("aria-label", next === "ru" ? "Открыть выбор языка" : "Open language selector");
    options.forEach((option) => option.setAttribute("aria-pressed", String(option.dataset.languageOption === next)));
    const menuButton = select<HTMLButtonElement>("[data-menu-toggle]");
    const contactButton = select<HTMLButtonElement>("[data-contact-toggle]");
    if (menuButton) menuButton.setAttribute("aria-label", next === "ru" ? "Открыть меню" : "Open menu");
    if (contactButton) contactButton.setAttribute("aria-label", next === "ru" ? "Открыть контакты" : "Open contacts");
    document.title = next === "ru"
      ? "Dmitrii Pershin — Senior Product Designer"
      : "Dmitrii Pershin — Senior Product Designer Portfolio";
    try {
      window.localStorage.setItem("portfolio-language", next);
    } catch {
      // Language switching itself does not depend on storage.
    }
    ScrollTrigger.refresh();
  };

  options.forEach((option) => option.addEventListener("click", () => {
    const next = option.dataset.languageOption;
    if (next === "ru" || next === "en") apply(next);
  }));
  apply(language);

}

function initScrollVisibility() {
  const controls = select<HTMLElement>(".floating-header");
  const avatar = select<HTMLButtonElement>("[data-contact-toggle]");
  const closing = select<HTMLElement>("[data-section='closing']");
  if (!controls && !avatar) return;

  let frame = 0;
  let lastScrollY = window.scrollY;
  let controlsHidden = false;
  const update = () => {
    frame = 0;
    const nextScrollY = Math.max(0, window.scrollY);
    const delta = nextScrollY - lastScrollY;
    if (nextScrollY <= 40) controlsHidden = false;
    else if (delta > 5) controlsHidden = true;
    else if (delta < -5) controlsHidden = false;
    controls?.toggleAttribute("data-scroll-hidden", controlsHidden);
    lastScrollY = nextScrollY;

    const closingRect = closing?.getBoundingClientRect();
    const closingVisible = Boolean(closingRect && closingRect.top < window.innerHeight * 0.92 && closingRect.bottom > window.innerHeight * 0.08);
    avatar?.toggleAttribute("data-closing-visible", closingVisible);
  };
  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  update();
}

function initMenuFit() {
  const nav = select<HTMLElement>(".menu-overlay nav");
  if (!nav) return;
  const fit = () => {
    if (window.innerWidth <= 640) {
      nav.style.removeProperty("--menu-scale");
      return;
    }
    const style = getComputedStyle(nav);
    const left = Number.parseFloat(style.left);
    const top = Number.parseFloat(style.top);
    const margin = readMotionNumber("--menu-viewport-margin", 40);
    const scale = Math.min(1, (window.innerWidth - left - margin) / nav.scrollWidth,
      (window.innerHeight - top - margin) / nav.scrollHeight);
    nav.style.setProperty("--menu-scale", String(Math.max(0.1, scale)));
  };
  fit();
  window.addEventListener("resize", fit, { passive: true });
}

function initDetails() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  selectAll<HTMLButtonElement>("[data-details-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest<HTMLElement>("[data-detail-card]");
      if (!card) return;
      const details = selectAll<HTMLElement>(".process-card__details, .theme-copy__secondary, .theme-copy__details", card);
      if (!details.length) return;

      card.classList.add("is-open");
      button.disabled = true;
      button.setAttribute("aria-expanded", "true");

      if (reducedMotion) {
        card.classList.add("is-revealed");
        button.hidden = true;
        ScrollTrigger.refresh();
        return;
      }

      gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          card.classList.add("is-revealed");
          button.hidden = true;
          gsap.set(details, { clearProps: "height,overflow,transform,opacity" });
          ScrollTrigger.refresh();
        },
      })
        .fromTo(details, {
          display: "block",
          height: 0,
          overflow: "hidden",
          opacity: 0,
          y: -10,
        }, {
          height: "auto",
          opacity: 1,
          y: 0,
          duration: 0.72,
          stagger: 0.08,
        })
        .to(button, { opacity: 0, y: 8, height: 0, paddingTop: 0, paddingBottom: 0, duration: 0.32 }, "-=0.18");
    }, { once: true });
  });
}

// The same 60 Hz exponential response is shared by borders and type crossfades.
const responseFactor = (amount: number, elapsed: number) => 1 - Math.pow(1 - amount, Math.min(elapsed, 64) / (1000 / 60));

function initTypeCrossfades() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const smoothing = readMotionNumber("--border-glow-opacity-smoothing", 0.04);
  selectAll<HTMLElement>("[data-morph-label]").forEach((label) => {
    const control = label.closest<HTMLElement>("a, button");
    if (!control) return;
    let current = 0;
    let target = 0;
    let frame = 0;
    let previous = 0;
    const render = (now: number) => {
      frame = 0;
      current += (target - current) * responseFactor(smoothing, now - previous);
      previous = now;
      if (Math.abs(target - current) < 0.002) current = target;
      label.style.setProperty("--label-progress", String(current));
      if (current !== target) frame = requestAnimationFrame(render);
    };
    const update = () => {
      target = control.matches(":hover, :focus-visible") ? 1 : 0;
      if (reduced) {
        current = target;
        label.style.setProperty("--label-progress", String(target));
      } else if (!frame) {
        previous = performance.now();
        frame = requestAnimationFrame(render);
      }
    };
    ["pointerenter", "pointerleave", "focus", "blur"].forEach((event) => control.addEventListener(event, update));
    window.addEventListener("pagehide", () => cancelAnimationFrame(frame), { once: true });
  });
}

function initSectionFeedback() {
  const root = document.documentElement;
  const sections = selectAll<HTMLElement>("[data-section]");
  const glow = select<HTMLElement>("[data-cursor-glow]");
  const canGlow = Boolean(glow) && window.matchMedia("(hover: hover) and (pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const smoothing = readMotionNumber("--cursor-glow-smoothing", 0.32);
  let geometry: { top: number; bottom: number; rgb: string; id: string }[] = [];
  let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
  let hasPosition = false;
  let frame = 0;
  let previous = 0;
  let needsGeometry = true;

  const measure = () => {
    geometry = sections.map((section) => {
      const rect = section.getBoundingClientRect();
      return { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY,
        rgb: getComputedStyle(section).getPropertyValue("--section-rgb").trim() || "118, 85, 146",
        id: section.dataset.section || "" };
    });
    needsGeometry = false;
  };
  const atY = (viewportY: number) => {
    const y = window.scrollY + viewportY;
    return geometry.reduce((best, section) => {
      const distance = y < section.top ? section.top - y : y > section.bottom ? y - section.bottom : 0;
      return distance < best.distance ? { section, distance } : best;
    }, { section: geometry[0], distance: Infinity }).section;
  };
  const updateColors = () => {
    if (needsGeometry) measure();
    const readingSection = atY(window.innerHeight * 0.4);
    if (readingSection) {
      root.style.setProperty("--scrollbar-rgb", readingSection.rgb);
      root.dataset.scrollSection = readingSection.id;
    }
    if (canGlow && hasPosition && glow) {
      const pointerSection = atY(targetY);
      if (pointerSection) {
        glow.style.setProperty("--cursor-glow-rgb", pointerSection.rgb);
        glow.dataset.section = pointerSection.id;
      }
    }
  };
  const render = (now: number) => {
    frame = 0;
    updateColors();
    if (!canGlow || !hasPosition || !glow) return;
    const factor = responseFactor(smoothing, now - previous);
    previous = now;
    currentX += (targetX - currentX) * factor;
    currentY += (targetY - currentY) * factor;
    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      frame = requestAnimationFrame(render);
    }
  };
  const schedule = () => {
    if (!frame) {
      previous = performance.now();
      frame = requestAnimationFrame(render);
    }
  };
  const onPointer = (event: PointerEvent) => {
    if (!canGlow || !glow || event.pointerType === "touch") return;
    targetX = event.clientX;
    targetY = event.clientY;
    if (!hasPosition) {
      currentX = targetX;
      currentY = targetY;
      hasPosition = true;
    }
    glow.dataset.active = "true";
    schedule();
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("scroll", () => {
    // Fixed light follows screen coordinates, not the previously hovered DOM node.
    currentX = targetX;
    currentY = targetY;
    schedule();
  }, { passive: true });
  window.addEventListener("resize", () => { needsGeometry = true; schedule(); }, { passive: true });
  const resize = new ResizeObserver(() => { needsGeometry = true; schedule(); });
  sections.forEach((section) => resize.observe(section));
  document.documentElement.addEventListener("pointerleave", () => { if (glow) glow.dataset.active = "false"; });
  window.addEventListener("blur", () => { if (glow) glow.dataset.active = "false"; });
  window.addEventListener("pagehide", () => { resize.disconnect(); cancelAnimationFrame(frame); }, { once: true });
  updateColors();
}

function initBorderGlow() {
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const mobileLayout = window.matchMedia("(max-width: 640px)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!supportsHover || mobileLayout || reducedMotion) return;

  const cards = selectAll<HTMLElement>(".interactive-card");
  const targets = Array.from(new Set([...cards, ...selectAll<HTMLElement>("[data-glow-target]")]));

  const BORDER_GLOW = {
    proximityRadius: readMotionNumber("--border-glow-proximity", 300),
    maxOpacity: readMotionNumber("--border-glow-max-opacity", 0.82),
    angleSmoothing: readMotionNumber("--border-glow-angle-smoothing", 0.075),
    opacitySmoothing: readMotionNumber("--border-glow-opacity-smoothing", 0.055),
  } as const;
  type GlowState = { angle: number; targetAngle: number; opacity: number; targetOpacity: number };
  const states = new Map<HTMLElement, GlowState>();
  targets.forEach((card, index) => {
    const startAngle = (index * 137.5) % 360;
    card.style.setProperty("--glow-angle", `${startAngle}deg`);
    states.set(card, { angle: startAngle, targetAngle: startAngle, opacity: 0, targetOpacity: 0 });
  });

  let pointerX = 0;
  let pointerY = 0;
  let hasPointer = false;
  let frame = 0;
  let previous = 0;

  const render = (now: number) => {
    frame = 0;
    const elapsed = now - previous;
    previous = now;
    let unsettled = false;
    targets.forEach((card) => {
      const state = states.get(card);
      if (!state) return;
      const rect = card.getBoundingClientRect();
      const dx = Math.max(rect.left - pointerX, 0, pointerX - rect.right);
      const dy = Math.max(rect.top - pointerY, 0, pointerY - rect.bottom);
      const distance = Math.hypot(dx, dy);
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      state.targetAngle = (Math.atan2(pointerY - centerY, pointerX - centerX) * 180) / Math.PI;
      const hovered = card.matches(":hover");
      const proximity = hasPointer ? (hovered ? 1 : Math.max(0, 1 - distance / BORDER_GLOW.proximityRadius)) : 0;
      const easedProximity = proximity * proximity * (3 - 2 * proximity);
      state.targetOpacity = easedProximity * BORDER_GLOW.maxOpacity;

      const angleDelta = ((state.targetAngle - state.angle + 540) % 360) - 180;
      state.angle += angleDelta * responseFactor(BORDER_GLOW.angleSmoothing, elapsed);
      state.opacity += (state.targetOpacity - state.opacity) * responseFactor(BORDER_GLOW.opacitySmoothing, elapsed);
      if (Math.abs(angleDelta) > 0.08 || Math.abs(state.targetOpacity - state.opacity) > 0.004) unsettled = true;

      card.style.setProperty("--glow-angle", `${Math.round(state.angle * 100) / 100}deg`);
      card.style.setProperty("--glow-opacity", `${Math.round(state.opacity * 1000) / 1000}`);
    });
    if (unsettled) frame = window.requestAnimationFrame(render);
  };

  const scheduleFrame = () => {
    if (!frame) {
      previous = performance.now();
      frame = window.requestAnimationFrame(render);
    }
  };

  const schedule = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    hasPointer = true;
    pointerX = event.clientX;
    pointerY = event.clientY;
    scheduleFrame();
  };

  const clear = () => {
    hasPointer = false;
    states.forEach((state) => { state.targetOpacity = 0; });
    scheduleFrame();
  };
  window.addEventListener("pointermove", schedule, { passive: true });
  window.addEventListener("scroll", scheduleFrame, { passive: true });
  document.documentElement.addEventListener("pointerleave", clear);
  window.addEventListener("blur", clear);
}

function initMobileScrollGlow() {
  if (!window.matchMedia("(max-width: 640px)").matches) return;

  const cards = selectAll<HTMLElement>(".interactive-card");
  const targets = Array.from(new Set([...cards, ...selectAll<HTMLElement>("[data-glow-target]")]));
  const maxOpacity = readMotionNumber("--border-glow-max-opacity", 0.82);
  const degreesPerPixel = readMotionNumber("--mobile-border-glow-degrees-per-pixel", 0.22);
  const cardAngleOffset = readMotionNumber("--mobile-border-glow-card-offset", 23);
  document.documentElement.dataset.scrollGlow = "mobile";

  const refreshGeometry = () => {
    targets.forEach((card) => {
      card.style.setProperty("--glow-opacity", `${maxOpacity}`);
    });
  };

  const updateAngles = () => {
    const scrollAngle = window.scrollY * degreesPerPixel;
    targets.forEach((card, index) => {
      const angle = (scrollAngle + index * cardAngleOffset) % 360;
      card.style.setProperty("--glow-angle", `${Math.round(angle * 100) / 100}deg`);
    });
  };

  ScrollTrigger.create({
    start: 0,
    end: () => ScrollTrigger.maxScroll(window),
    onRefresh: () => {
      refreshGeometry();
      updateAngles();
    },
    onUpdate: updateAngles,
  });
  refreshGeometry();
  updateAngles();
}

function showEverything() {
  gsap.set(
    ["[data-hero-logo]", "[data-hero-role]", "[data-reveal]", "[data-card-reveal]", "[data-workflow-node]", "[data-workflow-input]", "[data-mobile-workflow-node]", "[data-mobile-workflow-input]", ".workflow-route", "[data-mobile-flow]"],
    { opacity: 1, y: 0, scale: 1, clearProps: "transform" },
  );
  gsap.set(["[data-hero-logo]", ".workflow-route", "[data-mobile-flow]"], { clipPath: "none" });
  selectAll<HTMLElement>(".display-heading-mask").forEach((mask) => { mask.style.overflow = "visible"; });
  selectAll<HTMLElement>("[data-rolling-number]").forEach((number) => number.classList.add("is-complete"));
}

function initHero() {
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to("[data-hero-logo]", { clipPath: "inset(-40px -40px -40px -40px)", duration: 1.1 })
    .set("[data-hero-logo]", { clipPath: "none", willChange: "auto" })
    .fromTo("[data-hero-role]", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.55");
}

function initRollingNumbers() {
  selectAll<HTMLElement>("[data-rolling-number]").forEach((number) => {
    const digitCount = Number.parseInt(number.dataset.digitCount ?? "1", 10);
    const duration = Number.parseFloat(getComputedStyle(number).getPropertyValue("--rolling-duration")) * 1000;
    ScrollTrigger.create({
      trigger: number,
      start: "top 88%",
      once: true,
      onEnter: () => {
        window.requestAnimationFrame(() => {
          number.classList.add("is-rolling");
          window.setTimeout(() => {
            number.classList.add("is-complete");
            number.classList.remove("is-rolling");
          }, duration + Math.max(0, digitCount - 1) * 45 + 80);
        });
      },
    });
  });
}

function initSectionReveals() {
  selectAll<HTMLElement>("[data-section]:not([data-section='hero'])").forEach((section) => {
    const icon = select<HTMLElement>("[data-reveal='icon']", section);
    const headings = selectAll<HTMLElement>("[data-reveal='heading']", section);
    const copy = selectAll<HTMLElement>("[data-reveal='copy']", section);
    const cards = selectAll<HTMLElement>("[data-card-reveal]", section);

    if (icon) {
      gsap.fromTo(icon, { opacity: 0, scale: 0.975 }, {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: icon, start: "top 84%", once: true },
      });
    }

    headings.forEach((heading) => {
      const headingImage = heading.querySelector<HTMLElement>(".display-heading, .closing__heading");
      gsap.set(heading, { opacity: 1 });
      if (!headingImage) return;
      gsap.fromTo(headingImage, { yPercent: 112 }, {
        yPercent: 0,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => { heading.style.overflow = "visible"; },
        scrollTrigger: { trigger: heading, start: "top 88%", once: true },
      });
    });

    copy.forEach((item) => {
      gsap.fromTo(item, { opacity: 0, y: 18 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 90%", once: true },
      });
    });

    if (cards.length) {
      gsap.fromTo(cards, { opacity: 0, y: 22 }, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: cards[0], start: "top 88%", once: true },
      });
    }
  });
}

function initWorkflowReveals() {
  const scene = select<HTMLElement>("[data-workflow-scene]");
  if (!scene) return;
  const cards = selectAll<HTMLElement>("[data-workflow-node], [data-mobile-workflow-node]", scene);
  const inputs = selectAll<HTMLElement>("[data-workflow-input], [data-mobile-workflow-input]", scene);
  const desktopConnectors = selectAll<HTMLElement>(".workflow-route", scene);
  const mobileFlows = selectAll<HTMLElement>("[data-mobile-flow]", scene);

  const timeline = gsap.timeline({
    scrollTrigger: { trigger: scene, start: "top 76%", once: true },
    defaults: { ease: "power3.out" },
  });
  timeline
    .fromTo(cards, { opacity: 0, y: 20, scale: 0.992 }, { opacity: 1, y: 0, scale: 1, duration: 0.72, stagger: 0.11 })
    .fromTo(inputs, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.04 }, "-=0.7");

  if (desktopConnectors.length) {
    timeline.fromTo(desktopConnectors, { opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.8, stagger: 0.08 }, "-=0.4");
  }
  if (mobileFlows.length) {
    timeline.fromTo(mobileFlows, { opacity: 0, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.62, stagger: 0.08 }, "-=1.4");
  }
}

export async function initPortfolioMotion() {
  initOverlays();
  initLanguage();
  initDetails();
  initScrollVisibility();
  await Promise.allSettled([
    document.fonts.load('16px "Joyride Extended"'),
    document.fonts.load('16px "Joyride Extended Outline"'),
    document.fonts.load('16px "Joyride Outline"'),
    document.fonts.load('16px "Joyride WIDE"'),
    document.fonts.load('16px "Joyride Regular"'),
    document.fonts.load('16px "LINE Seed JP"'),
  ]);
  initMenuFit();
  initTypeCrossfades();
  initSectionFeedback();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    showEverything();
    initCardBorders();
    document.documentElement.dataset.motion = "reduced";
    return;
  }

  document.documentElement.dataset.motion = "full";
  initCardBorders();
  initBorderGlow();
  initMobileScrollGlow();
  initHero();
  initSectionReveals();
  initWorkflowReveals();
  initRollingNumbers();

  window.addEventListener("pagehide", () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill()), { once: true });
}
