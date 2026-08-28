import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  languageToggle?.addEventListener("click", () => {
    if (window.matchMedia("(min-width: 641px)").matches) setLanguage(languageToggle.getAttribute("aria-expanded") !== "true");
  });
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
    selectAll<HTMLElement>("[data-locale]").forEach((element) => {
      element.hidden = element.dataset.locale !== next;
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

  toggle.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 640px)").matches) apply(language === "ru" ? "en" : "ru");
  });
  options.forEach((option) => option.addEventListener("click", () => {
    const next = option.dataset.languageOption;
    if (next === "ru" || next === "en") apply(next);
  }));
  apply(language);

}

function initScrollVisibility() {
  const controls = select<HTMLElement>(".floating-header");
  const hardSkillsImage = select<HTMLElement>(".skills [data-reveal='icon']");
  const avatar = select<HTMLButtonElement>("[data-contact-toggle]");
  const closing = select<HTMLElement>("[data-section='closing']");
  if (!controls && !avatar) return;

  let frame = 0;
  const update = () => {
    frame = 0;
    const desktop = window.matchMedia("(min-width: 641px)").matches;
    const hardRect = hardSkillsImage?.getBoundingClientRect();
    const hideControls = Boolean(desktop && hardRect && hardRect.top <= window.innerHeight * 0.9);
    controls?.toggleAttribute("data-scroll-hidden", hideControls);

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

function ensureBorderGlows(cards: HTMLElement[]) {
  cards.forEach((card) => {
    if (card.querySelector(":scope > .card-border-glow")) return;
    const glow = document.createElement("span");
    glow.className = "card-border-glow";
    glow.setAttribute("aria-hidden", "true");
    card.prepend(glow);
  });
}

function initCursorGlow() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const glow = select<HTMLElement>("[data-cursor-glow]");
  if (!glow) return;

  const smoothing = readMotionNumber("--cursor-glow-smoothing", 0.12);
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let hasPosition = false;
  let frame = 0;

  const render = () => {
    frame = 0;
    currentX += (targetX - currentX) * smoothing;
    currentY += (targetY - currentY) * smoothing;
    glow.style.transform = `translate3d(${Math.round(currentX * 100) / 100}px, ${Math.round(currentY * 100) / 100}px, 0) translate(-50%, -50%)`;
    if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      frame = window.requestAnimationFrame(render);
    }
  };

  const schedule = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    targetX = event.clientX;
    targetY = event.clientY;
    if (!hasPosition) {
      currentX = targetX;
      currentY = targetY;
      hasPosition = true;
    }
    glow.dataset.active = "true";
    if (!frame) frame = window.requestAnimationFrame(render);
  };

  window.addEventListener("pointermove", schedule, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => { glow.dataset.active = "false"; });
  window.addEventListener("blur", () => { glow.dataset.active = "false"; });
}

function initBorderGlow() {
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!supportsHover || reducedMotion) return;

  const cards = selectAll<HTMLElement>(".interactive-card");
  ensureBorderGlows(cards);

  const BORDER_GLOW = {
    proximityRadius: readMotionNumber("--border-glow-proximity", 300),
    maxOpacity: readMotionNumber("--border-glow-max-opacity", 0.82),
    angleSmoothing: readMotionNumber("--border-glow-angle-smoothing", 0.075),
    opacitySmoothing: readMotionNumber("--border-glow-opacity-smoothing", 0.055),
  } as const;
  type GlowState = { angle: number; targetAngle: number; opacity: number; targetOpacity: number };
  const states = new Map<HTMLElement, GlowState>();
  cards.forEach((card) => states.set(card, { angle: 0, targetAngle: 0, opacity: 0, targetOpacity: 0 }));

  let pointerX = 0;
  let pointerY = 0;
  let hasPointer = false;
  let frame = 0;

  const render = () => {
    frame = 0;
    let unsettled = false;
    cards.forEach((card) => {
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
      const proximity = hovered ? 1 : hasPointer ? Math.max(0, 1 - distance / BORDER_GLOW.proximityRadius) : 0;
      const easedProximity = proximity * proximity * (3 - 2 * proximity);
      state.targetOpacity = easedProximity * BORDER_GLOW.maxOpacity;

      const angleDelta = ((state.targetAngle - state.angle + 540) % 360) - 180;
      state.angle += angleDelta * BORDER_GLOW.angleSmoothing;
      state.opacity += (state.targetOpacity - state.opacity) * BORDER_GLOW.opacitySmoothing;
      if (Math.abs(angleDelta) > 0.08 || Math.abs(state.targetOpacity - state.opacity) > 0.004) unsettled = true;

      card.style.setProperty("--glow-angle", `${Math.round(state.angle * 100) / 100}deg`);
      card.style.setProperty("--glow-opacity", `${Math.round(state.opacity * 1000) / 1000}`);
      card.style.setProperty("--glow-cover", `${Math.ceil(Math.hypot(rect.width, rect.height))}px`);
    });
    if (unsettled) frame = window.requestAnimationFrame(render);
  };

  const scheduleFrame = () => {
    if (!frame) frame = window.requestAnimationFrame(render);
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
  const maxOpacity = readMotionNumber("--border-glow-max-opacity", 0.82);
  const degreesPerPixel = readMotionNumber("--mobile-border-glow-degrees-per-pixel", 0.22);
  const cardAngleOffset = readMotionNumber("--mobile-border-glow-card-offset", 23);
  ensureBorderGlows(cards);
  document.documentElement.dataset.scrollGlow = "mobile";

  const refreshGeometry = () => {
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--glow-cover", `${Math.ceil(Math.hypot(rect.width, rect.height))}px`);
      card.style.setProperty("--glow-opacity", `${maxOpacity}`);
    });
  };

  const updateAngles = () => {
    const scrollAngle = window.scrollY * degreesPerPixel;
    cards.forEach((card, index) => {
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
    ["[data-hero-logo]", "[data-hero-role]", "[data-reveal]", "[data-card-reveal]", "[data-workflow-node]", "[data-workflow-input]", "[data-mobile-workflow-node]", "[data-mobile-workflow-input]", ".workflow-route", ".workflow-route-translation", "[data-mobile-flow]"],
    { opacity: 1, y: 0, scale: 1, clipPath: "inset(0 0% 0 0)", clearProps: "transform" },
  );
}

function initHero() {
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to("[data-hero-logo]", { clipPath: "inset(0 0% 0 0)", duration: 1.1 })
    .fromTo("[data-hero-role]", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.55");
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
      const headingImage = heading.querySelector("img");
      gsap.set(heading, { opacity: 1 });
      if (!headingImage) return;
      gsap.fromTo(headingImage, { yPercent: 112 }, {
        yPercent: 0,
        duration: 0.8,
        ease: "power3.out",
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
  const labels = selectAll<HTMLElement>(".workflow-route-translation", scene);
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
    timeline.fromTo(labels, { opacity: 0 }, { opacity: 1, duration: 0.45, stagger: 0.04 }, "-=0.5");
  }
  if (mobileFlows.length) {
    timeline.fromTo(mobileFlows, { opacity: 0, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.62, stagger: 0.08 }, "-=1.4");
  }
}

export function initPortfolioMotion() {
  initOverlays();
  initLanguage();
  initDetails();
  initScrollVisibility();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    showEverything();
    document.documentElement.dataset.motion = "reduced";
    return;
  }

  document.documentElement.dataset.motion = "full";
  initCursorGlow();
  initBorderGlow();
  initMobileScrollGlow();
  initHero();
  initSectionReveals();
  initWorkflowReveals();

  window.addEventListener("pagehide", () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill()), { once: true });
}
