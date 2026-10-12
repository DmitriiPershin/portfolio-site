import { gsap } from 'gsap';
import { motionNumber as token, motionSeconds } from './motion-tokens';

/** One SVG and uniform scaling; real anchors retain native navigation fallbacks. */
export function initCvNavigation() {
  let navigating = false;
  window.addEventListener('pageshow', () => {
    document.querySelectorAll('.cv-route-transition').forEach(layer => layer.remove());
    document.querySelectorAll<HTMLElement>('[data-cv-source-hidden]').forEach(source => {
      source.style.removeProperty('visibility');delete source.dataset.cvSourceHidden;
    });
    delete document.documentElement.dataset.cvNavigating;
    navigating = false;
  });
  document.querySelectorAll<HTMLAnchorElement>('[data-cv-link]').forEach(link => {
    link.addEventListener('click', async event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const hero = document.querySelector<HTMLImageElement>('.hero__logo [data-shared-wordmark]');
      if (!hero) return;
      event.preventDefault();
      if (navigating) return;
      navigating = true;
      const go = () => window.location.assign(link.href);
      try {
        await Promise.race([hero.decode(), new Promise((_, reject) => window.setTimeout(reject, motionSeconds('--cv-transition-font-ready') * 1000))]);
      } catch { go(); return; }
      const gutter = token('--cv-gutter');
      const contentWidth = Math.min(token('--cv-width'), innerWidth - gutter * 2);
      const width = Math.min(token('--cv-logo-width'), contentWidth);
      const x = (innerWidth - contentWidth) / 2;
      const y = token(innerWidth <= 640 ? '--cv-mobile-screen-top' : '--cv-top');
      const rect = hero.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < innerHeight;
      const sourceWidth = inView ? rect.width : Math.min(token('--cv-transition-source-max'), contentWidth);
      const sourceHeight = sourceWidth * hero.naturalHeight / hero.naturalWidth;
      const sourceX = inView ? rect.left : (innerWidth - sourceWidth) / 2;
      const sourceY = inView ? rect.top : Math.max(y, (innerHeight - sourceHeight) / 2);
      const layer = document.createElement('div');
      layer.className = 'cv-route-transition';
      layer.setAttribute('aria-hidden', 'true');
      const backdrop = document.createElement('div');
      backdrop.className = 'cv-route-transition__backdrop';
      const logo = hero.cloneNode(false) as HTMLImageElement;
      logo.className = 'cv-route-transition__logo';
      logo.removeAttribute('id');
      logo.style.width = `${sourceWidth}px`;
      logo.style.height = `${sourceHeight}px`;
      layer.append(backdrop, logo);
      document.body.append(layer);
      hero.style.visibility='hidden';hero.dataset.cvSourceHidden='';
      document.documentElement.dataset.cvNavigating = 'true';
      gsap.set(logo, { x: sourceX, y: sourceY, opacity: inView ? 1 : 0 });
      gsap.set(backdrop, { opacity: 0 });
      const duration = motionSeconds('--cv-duration-logo');
      const background = motionSeconds('--cv-duration-backdrop');
      const timeline = gsap.timeline({ onComplete: go });
      timeline.to(backdrop, {opacity: 1, duration: background, ease: 'sine.out'}, 0);
      if (!inView) timeline.to(logo, {opacity: 1, duration: background, ease:'sine.out'}, 0);
      timeline.to(logo, {x, y, scale: width / sourceWidth, duration, ease:'power3.inOut'}, 0);
    });
  });
}
