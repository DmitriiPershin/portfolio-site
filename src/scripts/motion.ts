import {clientLanguage,saveLanguage} from "../lib/language";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionEase, motionNumber, motionSeconds } from "./motion-tokens";
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

export function initOverlays() {
  const kinds = ['menu', 'language', 'contact', 'pdf'] as const;
  let opener: HTMLElement | null = null;
  const closeAll = (restoreFocus = false) => {
    for (const kind of kinds) {
      select<HTMLElement>(`[data-${kind}-overlay]`)?.setAttribute('aria-hidden', 'true');
      selectAll<HTMLElement>(`[data-${kind}-toggle]`).forEach(button => button.setAttribute('aria-expanded', 'false'));
    }
    document.body.classList.remove('overlay-open', 'contact-open');
    document.documentElement.classList.remove('overlay-open');
    if (restoreFocus) opener?.focus({preventScroll:true});
  };
  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    for (const kind of kinds) {
      const toggle = target?.closest<HTMLElement>(`[data-${kind}-toggle]`);
      const overlay = select<HTMLElement>(`[data-${kind}-overlay]`);
      if (toggle && overlay) {
        event.preventDefault();
        const opening = overlay.getAttribute('aria-hidden') !== 'false';
        closeAll();
        if (!opening) return;
        opener = toggle;
        overlay.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('overlay-open');
        document.documentElement.classList.add('overlay-open');
        document.body.classList.toggle('contact-open', kind === 'contact');
        overlay.focus({preventScroll:true});
        return;
      }
      if (target?.closest(`[data-${kind}-close]`)) { closeAll(true); return; }
    }
    if (target?.closest('[data-menu-current]')) {event.preventDefault();closeAll(true);return;}
    if (target?.closest('[data-menu-overlay] a, [data-language-option]')) closeAll();
  });
  document.addEventListener('keydown', event => {
    const overlay = select<HTMLElement>(kinds.map(kind=>`[data-${kind}-overlay][aria-hidden="false"]`).join(','));
    if (!overlay) return;
    if (event.key === 'Escape') { event.preventDefault(); closeAll(true); }
    if (event.key === 'Tab') {
      const items = selectAll<HTMLElement>('button:not(:disabled),a[href]', overlay);
      const first=items[0],last=items.at(-1);
      if (event.shiftKey && (document.activeElement===first || document.activeElement===overlay)) {event.preventDefault();last?.focus();}
      else if (!event.shiftKey && (document.activeElement===last || document.activeElement===overlay)) {event.preventDefault();first?.focus();}
    }
  });
  window.addEventListener('pageshow', () => closeAll());
}

function initLanguage() {
  const toggle = select<HTMLButtonElement>("[data-language-toggle]");
  const options = selectAll<HTMLButtonElement>("[data-language-option]");
  if (!toggle) return;

  let language: Language = clientLanguage();

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
    ScrollTrigger.refresh();
  };

  options.forEach((option) => option.addEventListener("click", () => {
    const next = option.dataset.languageOption;
    if (next === "ru" || next === "en") {saveLanguage(next);apply(next);}
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
    controls?.toggleAttribute("data-scroll-hidden", innerWidth > 640 && controlsHidden);
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

// Keep the initial cross-page anchor through font/load-triggered measurements.
// Stop as soon as the reader interacts, so later refreshes preserve their position.
function initSectionArrival() {
  const section = document.getElementById(location.hash.slice(1));
  if (!section?.closest('[data-section]')) {delete document.documentElement.dataset.sectionArrival;return;}
  const lifecycle = new AbortController();
  let frame = 0;
  const align = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => section.scrollIntoView({behavior:'instant'}));
  };
  const stop = () => {
    lifecycle.abort();cancelAnimationFrame(frame);
    ScrollTrigger.removeEventListener('refresh',align);
    delete document.documentElement.dataset.sectionArrival;
  };
  ScrollTrigger.addEventListener('refresh',align);
  window.addEventListener('load',align,{once:true,signal:lifecycle.signal});
  window.addEventListener('pagehide',stop,{once:true,signal:lifecycle.signal});
  for (const type of ['wheel','touchstart','pointerdown','keydown']) {
    window.addEventListener(type,stop,{once:true,passive:true,signal:lifecycle.signal});
  }
  align();
}

export function initMenuFit() {
  const nav = select<HTMLElement>(".menu-overlay nav");
  if (!nav) return;
  const fit = () => {
    if (window.innerWidth <= 640) {
      nav.style.removeProperty("--menu-scale");
      nav.style.removeProperty("--menu-top");
      return;
    }
    const style = getComputedStyle(nav);
    const left = Number.parseFloat(style.left);
    const margin = readMotionNumber("--menu-viewport-margin", 40);
    const scale = Math.min(1,(window.innerWidth-left-margin)/nav.scrollWidth,(window.innerHeight-2*margin)/nav.scrollHeight);
    nav.style.setProperty("--menu-scale",String(Math.max(.1,scale)));
    nav.style.setProperty("--menu-top",`${(window.innerHeight-nav.scrollHeight*scale)/2+readMotionNumber('--menu-center-offset',0)}px`);
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
        defaults: { ease: motionEase("reveal") },
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
          duration: motionSeconds("--motion-workflow-duration"),
          stagger: motionSeconds("--motion-flow-stagger"),
        })
        .to(button, { opacity: 0, y: 8, height: 0, paddingTop: 0, paddingBottom: 0, duration: 0.32 }, "-=0.18");
    }, { once: true });
  });
}

// The same 60 Hz exponential response is shared by borders and type crossfades.
const responseFactor = (amount: number, elapsed: number) => 1 - Math.pow(1 - amount, Math.min(elapsed, 64) / (1000 / 60));

export function initTypeCrossfades() {
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
      target = control.matches(':hover, :focus-visible, [aria-pressed="true"], [aria-current="page"]') ? 1 : 0;
      if (reduced) {
        current = target;
        label.style.setProperty("--label-progress", String(target));
      } else if (!frame) {
        previous = performance.now();
        frame = requestAnimationFrame(render);
      }
    };
    ["pointerenter", "pointerleave", "focus", "blur"].forEach((event) => control.addEventListener(event, update));
    if(control.hasAttribute('data-language-option'))new MutationObserver(update).observe(control,{attributes:true,attributeFilter:['aria-pressed']});
    update();
    window.addEventListener("pagehide", () => cancelAnimationFrame(frame), { once: true });
  });
}

export function initSectionFeedback() {
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

export function initBorderGlow() {
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
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", schedule);
    window.removeEventListener("scroll", scheduleFrame);
    document.documentElement.removeEventListener("pointerleave", clear);
    window.removeEventListener("blur", clear);
  };
}

export function initMobileScrollGlow() {
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

  const trigger = ScrollTrigger.create({
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
  return () => trigger.kill();
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

export function revealHeroRole() {
  const role = select<HTMLElement>('[data-hero-role]');
  if (!role) return;
  gsap.killTweensOf(role);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { gsap.set(role,{opacity:1,y:0}); return; }
  gsap.fromTo(role,{opacity:0,y:motionNumber('--motion-role-distance')},{opacity:1,y:0,duration:motionSeconds('--motion-reveal-duration'),ease:motionEase('reveal')});
}

function initHero() {
  gsap.timeline({ defaults: { ease: motionEase("reveal") } })
    .to("[data-hero-logo]", { clipPath: "inset(-40px -40px -40px -40px)", duration: motionSeconds("--motion-hero-duration") })
    .set("[data-hero-logo]", { clipPath: "none", willChange: "auto" })
    .fromTo("[data-hero-role]", { opacity: 0, y: motionNumber("--motion-role-distance") }, { opacity: 1, y: 0, duration: motionSeconds("--motion-reveal-duration") }, `-=${motionSeconds("--motion-role-overlap")}`);
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
        duration: motionSeconds("--motion-reveal-duration"),
        ease: motionEase("reveal"),
        scrollTrigger: { trigger: icon, start: "top 84%", once: true },
      });
    }

    headings.forEach((heading) => {
      const headingImage = heading.querySelector<HTMLElement>(".display-heading, .closing__heading");
      gsap.set(heading, { opacity: 1 });
      if (!headingImage) return;
      gsap.fromTo(headingImage, { yPercent: 112 }, {
        yPercent: 0,
        duration: motionSeconds("--motion-reveal-duration"),
        ease: motionEase("reveal"),
        onComplete: () => { heading.style.overflow = "visible"; },
        scrollTrigger: { trigger: heading, start: "top 88%", once: true },
      });
    });

    copy.forEach((item) => {
      gsap.fromTo(item, { opacity: 0, y: 18 }, {
        opacity: 1,
        y: 0,
        duration: motionSeconds("--motion-reveal-duration"),
        ease: motionEase("reveal"),
        scrollTrigger: { trigger: item, start: "top 90%", once: true },
      });
    });

    if (cards.length) {
      gsap.fromTo(cards, { opacity: 0, y: 22 }, {
        opacity: 1,
        y: 0,
        duration: motionSeconds("--motion-reveal-duration"),
        stagger: motionSeconds("--motion-reveal-stagger"),
        ease: motionEase("reveal"),
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
    defaults: { ease: motionEase("reveal") },
  });
  timeline
    .fromTo(cards, { opacity: 0, y: 20, scale: 0.992 }, { opacity: 1, y: 0, scale: 1, duration: motionSeconds("--motion-workflow-duration"), stagger: motionSeconds("--motion-reveal-stagger") })
    .fromTo(inputs, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: motionSeconds("--motion-workflow-input-duration"), stagger: motionSeconds("--motion-chip-stagger") }, "-=0.7");

  if (desktopConnectors.length) {
    timeline.fromTo(desktopConnectors, { opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: motionSeconds("--motion-reveal-duration"), stagger: motionSeconds("--motion-flow-stagger") }, "-=0.4");
  }
  if (mobileFlows.length) {
    timeline.fromTo(mobileFlows, { opacity: 0, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.62, stagger: motionSeconds("--motion-flow-stagger") }, "-=1.4");
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
  initSectionArrival();

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
  if (!document.documentElement.hasAttribute("data-route-arrival")) initHero();
  else { gsap.set("[data-hero-logo]", {clipPath:"none", opacity:1}); gsap.set("[data-hero-role]", {opacity:0,y:motionNumber("--motion-role-distance")}); }
  initSectionReveals();
  initWorkflowReveals();
  initRollingNumbers();

  window.addEventListener("pagehide", event => { if (!event.persisted) ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); });
}
