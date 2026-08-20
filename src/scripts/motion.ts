import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Language = "ru" | "en";

const select = <T extends Element>(selector: string, scope: ParentNode = document) =>
  scope.querySelector<T>(selector);
const selectAll = <T extends Element>(selector: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(selector));

function setBodyLocked() {
  const openOverlay = select<HTMLElement>('[data-menu-overlay][aria-hidden="false"], [data-contact-overlay][aria-hidden="false"]');
  document.body.classList.toggle("overlay-open", Boolean(openOverlay));
}

function initOverlays() {
  const menuToggle = select<HTMLButtonElement>("[data-menu-toggle]");
  const menuOverlay = select<HTMLElement>("[data-menu-overlay]");
  const contactToggle = select<HTMLButtonElement>("[data-contact-toggle]");
  const contactOverlay = select<HTMLElement>("[data-contact-overlay]");
  const contactClose = select<HTMLButtonElement>("[data-contact-close]");

  const setMenu = (open: boolean) => {
    if (!menuToggle || !menuOverlay) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuOverlay.setAttribute("aria-hidden", String(!open));
    if (open && contactOverlay?.getAttribute("aria-hidden") === "false") setContact(false);
    setBodyLocked();
    if (open) select<HTMLAnchorElement>("a", menuOverlay)?.focus();
  };

  const setContact = (open: boolean) => {
    if (!contactToggle || !contactOverlay) return;
    contactToggle.setAttribute("aria-expanded", String(open));
    contactOverlay.setAttribute("aria-hidden", String(!open));
    if (open && menuOverlay?.getAttribute("aria-hidden") === "false") setMenu(false);
    setBodyLocked();
    if (open) select<HTMLAnchorElement>("a", contactOverlay)?.focus();
  };

  menuToggle?.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
  selectAll<HTMLAnchorElement>("a", menuOverlay ?? document).forEach((link) => link.addEventListener("click", () => setMenu(false)));
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
    if (contactToggle?.getAttribute("aria-expanded") === "true") {
      setContact(false);
      contactToggle.focus();
    }
  });
}

function initLanguage() {
  const toggle = select<HTMLButtonElement>("[data-language-toggle]");
  const code = select<HTMLElement>(".language-code", toggle ?? document);
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
    if (code) code.textContent = next.toUpperCase();
    toggle.setAttribute("aria-label", next === "ru" ? "Switch to English" : "Переключить на русский");
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

  toggle.addEventListener("click", () => apply(language === "ru" ? "en" : "ru"));
  apply(language);

  let ticking = false;
  const updateVisibility = () => {
    toggle.classList.toggle("is-scrolled-away", window.scrollY > 40);
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateVisibility);
  }, { passive: true });
  updateVisibility();
}

function initDetails() {
  selectAll<HTMLButtonElement>("[data-details-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest<HTMLElement>("[data-detail-card]");
      if (!card) return;
      const open = !card.classList.contains("is-open");
      card.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      ScrollTrigger.refresh();
    });
  });
}

function initCardHover() {
  selectAll<HTMLElement>(".interactive-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--hover-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty("--hover-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--hover-x", "50%");
      card.style.setProperty("--hover-y", "50%");
    });
  });
}

function showEverything() {
  gsap.set(
    ["[data-hero-logo]", "[data-hero-role]", "[data-reveal]", "[data-card-reveal]", "[data-workflow-node]", "[data-workflow-input]", ".connector", ".connector-label", ".workflow-connectors-mobile"],
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
    const heading = select<HTMLElement>("[data-reveal='heading']", section);
    const headingImage = heading?.querySelector("img");
    const copy = selectAll<HTMLElement>("[data-reveal='copy']", section);
    const cards = selectAll<HTMLElement>("[data-card-reveal]", section);
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 78%", once: true },
      defaults: { ease: "power3.out" },
    });

    if (icon) timeline.fromTo(icon, { opacity: 0, scale: 0.975 }, { opacity: 1, scale: 1, duration: 0.9 });
    if (heading) timeline.set(heading, { opacity: 1 }, "-=0.4");
    if (headingImage) timeline.fromTo(headingImage, { yPercent: 112 }, { yPercent: 0, duration: 0.8 }, "<");
    if (copy.length) timeline.fromTo(copy, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, "-=0.42");
    if (cards.length) timeline.fromTo(cards, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, "-=0.38");
  });
}

function initWorkflowReveals() {
  const scene = select<HTMLElement>("[data-workflow-scene]");
  if (!scene) return;
  const cards = selectAll<HTMLElement>("[data-workflow-node]", scene);
  const inputs = selectAll<HTMLElement>("[data-workflow-input]", scene);
  const desktopConnectors = selectAll<HTMLElement>(".connector", scene);
  const labels = selectAll<HTMLElement>(".connector-label", scene);
  const mobileConnector = select<HTMLElement>(".workflow-connectors-mobile", scene);

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
  if (mobileConnector) {
    timeline.fromTo(mobileConnector, { opacity: 0, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 1.7 }, "-=1.4");
  }
}

export function initPortfolioMotion() {
  initOverlays();
  initLanguage();
  initDetails();
  initCardHover();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    showEverything();
    document.documentElement.dataset.motion = "reduced";
    return;
  }

  document.documentElement.dataset.motion = "full";
  initHero();
  initSectionReveals();
  initWorkflowReveals();

  window.addEventListener("pagehide", () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill()), { once: true });
}
