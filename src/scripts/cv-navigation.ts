import { gsap } from "gsap";

const token = (name: string) => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
const milliseconds = (name: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return Number.parseFloat(value) * (value.endsWith("ms") ? 1 : 1000);
};

/** Real anchors still handle new tabs, reduced motion, and no-JavaScript visits. */
export function initCvNavigation() {
  let navigating = false;
  window.addEventListener("pageshow", () => {
    document.querySelectorAll(".cv-route-transition").forEach(layer => layer.remove());
    delete document.documentElement.dataset.cvNavigating;
    navigating = false;
  });
  document.querySelectorAll<HTMLAnchorElement>("[data-cv-link]").forEach(link => {
    link.addEventListener("click", async event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      if (navigating) return;
      navigating = true;
      const destination = link.href;
      const go = () => window.location.assign(destination);
      const hero = document.querySelector<HTMLElement>(".hero__logo");
      if (!hero) { go(); return; }

      // Wait briefly for the same local logo asset used by /cv; a failed asset never blocks navigation.
      const target = new Image();
      target.src = "/assets/cv-wordmark.svg";
      try {
        await Promise.race([target.decode(), new Promise((_, reject) => window.setTimeout(reject, milliseconds("--cv-transition-font-ready")))]);
      } catch { go(); return; }

      const gutter = token("--cv-gutter");
      const contentWidth = Math.min(token("--cv-width"), window.innerWidth - gutter * 2);
      const width = Math.min(token("--cv-logo-width"), contentWidth);
      const height = width * token("--cv-logo-height") / token("--cv-logo-width");
      const x = (window.innerWidth - contentWidth) / 2;
      const y = token("--cv-top");
      const rect = hero.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      const sourceWidth = inView ? rect.width : Math.min(token("--cv-transition-source-max"), contentWidth);
      const sourceHeight = inView ? rect.height : sourceWidth * height / width;
      const sourceX = inView ? rect.left : (window.innerWidth - sourceWidth) / 2;
      const sourceY = inView ? rect.top : Math.max(y, (window.innerHeight - sourceHeight) / 2);

      const layer = document.createElement("div");
      layer.className = "cv-route-transition";
      layer.setAttribute("aria-hidden", "true");
      const backdrop = document.createElement("div");
      backdrop.className = "cv-route-transition__backdrop";
      const logo = document.createElement("div");
      logo.className = "cv-route-transition__logo";
      // Keep the actual live hero glyphs at the start, then crossfade to the authored CV logo.
      const source = inView ? hero.cloneNode(true) as HTMLElement : document.createElement("img");
      if (source instanceof HTMLImageElement) { source.src = target.src; source.width = sourceWidth; source.height = sourceHeight; }
      source.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
      source.removeAttribute("id");
      source.style.width = `${sourceWidth}px`;
      source.style.height = `${sourceHeight}px`;
      source.style.textAlign = "center";
      logo.append(source);
      target.className = "cv-route-transition__target";
      target.width = width;
      target.height = height;
      target.style.width = `${width}px`;
      target.style.height = `${height}px`;
      layer.append(backdrop, logo, target);
      document.body.append(layer);
      document.documentElement.dataset.cvNavigating = "true";
      gsap.set(logo, { x: sourceX, y: sourceY, width: sourceWidth, height: sourceHeight });
      gsap.set(target, { x, y, opacity: 0 });
      gsap.set(backdrop, { opacity: 0 });
      const duration = milliseconds("--cv-duration-logo") / 1000;
      const fade = milliseconds("--cv-duration-crossfade") / 1000;
      gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: go })
        .to(backdrop, { opacity: 1, duration: fade }, 0)
        .to(logo, { x, y, scaleX: width / sourceWidth, scaleY: height / sourceHeight, duration }, 0)
        .to(logo, { opacity: 0, duration: fade }, duration - fade)
        .to(target, { opacity: 1, duration: fade }, duration - fade);
    });
  });
}
