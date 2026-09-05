const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/** One mask owns the contour. Resting paint and moving light share it. */
export function initCardBorders() {
  const cards = document.querySelectorAll<HTMLElement>(".interactive-card");
  const resize = new ResizeObserver((entries) => {
    entries.forEach(({ target }) => updateGeometry(target as HTMLElement));
  });

  function updateGeometry(card: HTMLElement) {
    const style = getComputedStyle(card);
    const width = Number.parseFloat(style.width);
    const height = Number.parseFloat(style.height);
    if (!width || !height) return;
    const weight = Number.parseFloat(style.getPropertyValue("--stroke-width")) || 1;
    const borderWidth = Number.parseFloat(style.borderTopWidth) || 0;
    const radius = Number.parseFloat(style.borderTopLeftRadius) || 0;
    const innerRadius = Math.max(0, Math.min(radius, width / 2, height / 2) - weight / 2);
    const border = card.querySelector<HTMLElement>(":scope > .card-border");
    if (!border) return;
    card.style.clipPath = `inset(0 round ${radius}px)`;
    const dash = card.matches(".workflow-context") ? ' stroke-dasharray="4 4"' : "";
    // Standard circular arcs, not Figma corner smoothing. Radius values are unchanged.
    const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect x="${weight / 2}" y="${weight / 2}" width="${width - weight}" height="${height - weight}" rx="${innerRadius}" fill="none" stroke="white" stroke-width="${weight}"${dash}/></svg>`;
    border.style.maskImage = svgUrl(mask);
    border.style.setProperty("-webkit-mask-image", svgUrl(mask));
    border.style.inset = `${-borderWidth}px`;
    border.style.width = `calc(100% + ${borderWidth * 2}px)`;
    border.style.height = `calc(100% + ${borderWidth * 2}px)`;
    border.style.setProperty("--glow-cover", `${Math.ceil(Math.hypot(width, height))}px`);
    border.dataset.radius = String(radius);
    border.dataset.strokeWidth = String(weight);
    border.dataset.dash = dash ? "4 4" : "none";

    const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
    const color = read("--card-rgb", "118, 85, 146");
    const mid = read("--stroke-mid-rgb", color);
    const faded = read("--stroke-fade-rgb", mid);
    const fadeAlpha = read("--stroke-fade-alpha", "0.627451");
    const returnAlpha = read("--stroke-return-alpha", "0.367586");
    const fourStops = card.matches(".workflow-card, .process-card, .app-icon-frame, .process-card__logo");
    // The authored static gradient stays still; only the conic light moves.
    const paint = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="paint" x1=".162639" y1=".0517356" x2=".8375" y2="1.01255"><stop stop-color="rgb(${color})"/><stop offset=".228167787" stop-color="rgb(${mid})" stop-opacity=".1"/><stop offset=".4742558" stop-color="rgb(${faded})" stop-opacity="${fadeAlpha}"/>${fourStops ? "" : `<stop offset=".66751188" stop-color="rgb(${color})" stop-opacity="${returnAlpha}"/>`}<stop offset="1" stop-color="rgb(${color})"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#paint)"/></svg>`;
    border.style.backgroundImage = svgUrl(paint);
  }

  cards.forEach((card) => {
    if (card.dataset.borderReady) return;
    const border = document.createElement("span");
    border.className = "card-border";
    border.setAttribute("aria-hidden", "true");
    card.prepend(border);
    updateGeometry(card);
    card.dataset.borderReady = "true";
    resize.observe(card);
  });

  window.addEventListener("pagehide", () => resize.disconnect(), { once: true });
}
