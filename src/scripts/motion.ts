import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const workflowLinks = [
  ["context", "claude-context"],
  ["claude-context", "magnific"],
  ["magnific", "claude-style"],
  ["claude-style", "figma"],
  ["figma", "designer"],
  ["designer", "frontend"],
] as const;

const select = <T extends Element>(selector: string, scope: ParentNode = document) =>
  scope.querySelector<T>(selector);

const selectAll = <T extends Element>(selector: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(selector));

function initMenu() {
  const toggle = select<HTMLButtonElement>("[data-menu-toggle]");
  const overlay = select<HTMLElement>("[data-menu-overlay]");

  if (!toggle || !overlay) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    overlay.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-open", open);

    if (open) {
      select<HTMLAnchorElement>("a", overlay)?.focus();
    } else {
      toggle.focus();
    }
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  selectAll<HTMLAnchorElement>("a", overlay).forEach((link) => link.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setOpen(false);
  });
}

function makeConnectorPath(source: HTMLElement, target: HTMLElement, scene: HTMLElement) {
  const sceneRect = scene.getBoundingClientRect();
  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const isMobile = window.matchMedia("(max-width: 640px)").matches;

  if (!isMobile && Math.abs(targetRect.top - sourceRect.top) < 60) {
    const travelsLeft = targetRect.left < sourceRect.left;
    const x1 = (travelsLeft ? sourceRect.left : sourceRect.right) - sceneRect.left;
    const y1 = sourceRect.top + sourceRect.height / 2 - sceneRect.top;
    const x2 = (travelsLeft ? targetRect.right : targetRect.left) - sceneRect.left;
    const y2 = targetRect.top + targetRect.height / 2 - sceneRect.top;
    const bend = Math.max(48, Math.abs(x2 - x1) * 0.42);
    const c1 = x1 + (travelsLeft ? -bend : bend);
    const c2 = x2 + (travelsLeft ? bend : -bend);
    return `M ${x1} ${y1} C ${c1} ${y1}, ${c2} ${y2}, ${x2} ${y2}`;
  }

  const x1 = sourceRect.left + sourceRect.width / 2 - sceneRect.left;
  const y1 = sourceRect.bottom - sceneRect.top;
  const x2 = targetRect.left + targetRect.width / 2 - sceneRect.left;
  const y2 = targetRect.top - sceneRect.top;
  const midpoint = y1 + (y2 - y1) * 0.5;
  return `M ${x1} ${y1} C ${x1} ${midpoint}, ${x2} ${midpoint}, ${x2} ${y2}`;
}

function initWorkflowConnectors(reducedMotion: boolean) {
  const scene = select<HTMLElement>("[data-workflow-scene]");
  const svg = select<SVGSVGElement>("[data-workflow-connectors]");
  const pathGroup = select<SVGGElement>("[data-flow-paths]");
  if (!scene || !svg || !pathGroup) return () => undefined;

  let pathTweens: gsap.core.Tween[] = [];

  const build = () => {
    pathTweens.forEach((tween) => tween.kill());
    pathTweens = [];
    pathGroup.replaceChildren();

    const width = scene.clientWidth;
    const height = scene.clientHeight;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    workflowLinks.forEach(([sourceId, targetId], index) => {
      const source = select<HTMLElement>(`[data-workflow-node="${sourceId}"]`, scene);
      const target = select<HTMLElement>(`[data-workflow-node="${targetId}"]`, scene);
      if (!source || !target) return;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.classList.add("flow-path");
      path.setAttribute("d", makeConnectorPath(source, target, scene));
      path.setAttribute("marker-end", "url(#flow-arrow)");
      path.dataset.pathIndex = String(index);
      pathGroup.append(path);

      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = reducedMotion ? "0" : `${length}`;

      if (!reducedMotion) {
        const tween = gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: target,
            start: "top 78%",
            once: true,
          },
        });
        pathTweens.push(tween);
      }
    });
  };

  const onResize = () => window.requestAnimationFrame(build);
  build();
  window.addEventListener("resize", onResize, { passive: true });
  return () => {
    window.removeEventListener("resize", onResize);
    pathTweens.forEach((tween) => tween.kill());
  };
}

function showEverything() {
  gsap.set(
    [
      "[data-hero-logo]",
      "[data-hero-role]",
      "[data-reveal]",
      "[data-workflow-node]",
      "[data-workflow-input]",
      ".flow-label",
    ],
    { opacity: 1, y: 0, scale: 1, clipPath: "inset(0 0% 0 0)", clearProps: "transform" },
  );
}

function initHero() {
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  timeline
    .to("[data-hero-logo]", { clipPath: "inset(0 0% 0 0)", duration: 0.9 })
    .fromTo("[data-hero-role]", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.45");
}

function initSectionReveals() {
  selectAll<HTMLElement>("[data-section]:not([data-section='hero'])").forEach((section) => {
    const icon = select<HTMLElement>("[data-reveal='icon']", section);
    const heading = select<HTMLElement>("[data-reveal='heading']", section);
    const headingImage = heading?.querySelector("img");
    const copy = selectAll<HTMLElement>("[data-reveal='copy']", section);

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 76%", once: true },
      defaults: { ease: "power3.out" },
    });

    if (icon) timeline.fromTo(icon, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.6 });
    if (heading) timeline.set(heading, { opacity: 1 }, "-=0.24");
    if (headingImage) timeline.fromTo(headingImage, { yPercent: 110 }, { yPercent: 0, duration: 0.6 }, "<");
    if (copy.length) timeline.fromTo(copy, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 }, "-=0.3");
  });
}

function initWorkflowReveals() {
  const context = select<HTMLElement>("[data-workflow-node='context']");
  if (context) {
    const contextTimeline = gsap.timeline({
      scrollTrigger: { trigger: context, start: "top 78%", once: true },
      defaults: { ease: "power3.out" },
      onComplete: () => context.classList.add("is-revealed"),
    });
    contextTimeline
      .fromTo(context, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(
        selectAll<HTMLElement>("[data-workflow-input]", context),
        { opacity: 0, y: 12, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.06 },
        "-=0.28",
      );
  }

  selectAll<HTMLElement>("[data-workflow-node]:not([data-workflow-node='context'])").forEach((card) => {
    const label = card.parentElement?.querySelector<HTMLElement>(".flow-label");
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: card, start: "top 80%", once: true },
      defaults: { ease: "power3.out" },
      onComplete: () => card.classList.add("is-revealed"),
    });
    if (label) timeline.to(label, { opacity: 1, duration: 0.24 });
    timeline.fromTo(card, { opacity: 0, y: 32, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, label ? "-=0.08" : 0);
  });
}

export function initPortfolioMotion() {
  initMenu();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    showEverything();
    initWorkflowConnectors(true);
    document.documentElement.dataset.motion = "reduced";
    return;
  }

  document.documentElement.dataset.motion = "full";
  const cleanupConnectors = initWorkflowConnectors(false);
  initHero();
  initSectionReveals();
  initWorkflowReveals();

  window.addEventListener(
    "pagehide",
    () => {
      cleanupConnectors();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    },
    { once: true },
  );
}
