import { getSvgPath } from "figma-squircle";

const SVG_NS = "http://www.w3.org/2000/svg";
const gradients = new WeakMap<HTMLElement, SVGLinearGradientElement>();

/** One painted contour per card. Pointer/scroll updates the paint, never the path. */
export function initCardBorders() {
  const cards = document.querySelectorAll<HTMLElement>(".interactive-card:not(.app-icon-frame, .process-card__logo)");
  const resize = new ResizeObserver((entries) => {
    entries.forEach(({ target }) => updateGeometry(target as HTMLElement));
  });

  function updateGeometry(card: HTMLElement) {
    const style = getComputedStyle(card);
    const width = Number.parseFloat(style.width);
    const height = Number.parseFloat(style.height);
    if (!width || !height) return;
    const weight = Number.parseFloat(style.getPropertyValue("--stroke-width")) || 1;
    const radius = Number.parseFloat(style.borderTopLeftRadius) || 0;
    const svg = card.querySelector<SVGSVGElement>(":scope > .card-border");
    if (!svg) return;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.querySelector("path")?.setAttribute("d", getSvgPath({
      width: width - weight,
      height: height - weight,
      cornerRadius: Math.max(0, radius - weight / 2),
      cornerSmoothing: 1,
    }));
    svg.querySelector("path")?.setAttribute("transform", `translate(${weight / 2} ${weight / 2})`);
    svg.querySelector("path")?.setAttribute("stroke-width", String(weight));
    // The same smooth silhouette clips the backing and its inset effect.
    if (!card.matches(".pet-card__visual-link")) {
      card.style.clipPath = `path('${getSvgPath({ width, height, cornerRadius: radius, cornerSmoothing: 1 })}')`;
    }
  }

  cards.forEach((card, index) => {
    if (card.dataset.borderReady) return;
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.classList.add("card-border");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const defs = document.createElementNS(SVG_NS, "defs");
    const gradient = document.createElementNS(SVG_NS, "linearGradient");
    gradient.id = `card-stroke-${index}`;
    // Inverse of the authored Figma gradient transform, in normalized bounds.
    gradient.setAttribute("x1", "0.162639");
    gradient.setAttribute("y1", "0.0517356");
    gradient.setAttribute("x2", "0.8375");
    gradient.setAttribute("y2", "1.01255");
    const positions = card.matches(".workflow-card, .process-card")
      ? [0, 0.228167787, 0.4742558, 1]
      : [0, 0.228167787, 0.4742558, 0.66751188, 1];
    positions.forEach((position, stopIndex) => {
      const stop = document.createElementNS(SVG_NS, "stop");
      stop.setAttribute("offset", String(position));
      stop.classList.add(`card-border__stop--${position === 1 ? 4 : stopIndex}`);
      gradient.append(stop);
    });
    defs.append(gradient);
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", `url(#${gradient.id})`);
    if (card.matches(".workflow-context")) path.setAttribute("stroke-dasharray", "4 4");
    svg.append(defs, path);
    card.prepend(svg);
    gradients.set(card, gradient);
    card.dataset.borderReady = "true";
    updateGeometry(card);
    resize.observe(card);
  });

  window.addEventListener("pagehide", () => resize.disconnect(), { once: true });
}

export function paintCardBorder(card: HTMLElement, angle: number, opacity: number) {
  const gradient = gradients.get(card);
  if (gradient) gradient.setAttribute("gradientTransform", `rotate(${angle * Math.min(1, opacity / 0.9)} .5 .5)`);
}
