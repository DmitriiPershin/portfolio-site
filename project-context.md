# Project context

## Purpose

A production portfolio for Dmitrii Pershin, a senior product designer focused on white-label systems, AI-assisted design production, and complex fintech interfaces.

## Audience

Hiring managers, design leaders, founders, and product teams evaluating senior product/system design work.

## Current scope

The full Russian desktop and mobile portfolio is implemented, with an English content layer:

1. Hero.
2. Focus.
3. Hard Skills and Soft Skills.
4. AI Workflow.
5. Process & AI.
6. Theme Builders.
7. Interfaces.
8. Pet Project.
9. Closing with live Joyride `THANK / YOU`, live email/Telegram rows, and the avatar-triggered contact overlay.

## Design source

- Figma file: `RohXp9xh64xj3NpvNcCe4j`.
- Desktop frame: `358:434`.
- Mobile frame: `372:928`.
- Section node IDs are recorded in `README.md` and on the matching DOM sections.

## Constraints

- Astro + TypeScript.
- CSS for layout, hover/focus, and ambient motion.
- GSAP + ScrollTrigger as the only animation runtime.
- No React, smooth-scroll library, WebGL, or second motion library.
- Essential content is visible without JavaScript.
- `prefers-reduced-motion` disables reveals and ambient drift while preserving layout and connector geometry.
- User-supplied Joyride OTF files are self-hosted and preloaded. Signature typography and metrics remain live selectable text; do not regress them to SVG/PNG.
- Desktop and mobile menu/language controls are fixed. They hide on downward scroll after `40 px` and return on upward scroll. The avatar hides over final contacts and menu/language overlays; the authored desktop contact overlay keeps its bottom-right avatar while mobile uses the central overlay avatar.
- AI Workflow desktop connector geometry and `150/54 px` application frames are exact local Figma exports. The three localized route labels may be replaced with live SVG text inside the same original chip. Never overlay another translated chip.
- One painted contour per card/icon, including dashed Context. Keep Figma radius NUMBERS but use ordinary circular corners, explicitly overriding corner smoothing at Dmitrii's request (2026-09-05 motion revision). A stationary authored gradient and moving conic light share ONE mask. App/Process artwork is preserved at original scale while its baked outer frame is clipped away before rendering the replacement contour. Raw paint/effect evidence remains in `reports/figma-border-audit-2026-09-05.md`.
- Menu and language hover use one live-text crossfade implementation at full control opacity and share the border response timing. Cursor colour must update while scrolling under a stationary pointer, not only on pointermove. Scrollbar colour follows the reading section; native OS scrollbar visibility is respected. Avatar backing is opaque.
- Theme Builders and Interfaces metrics use live, accessible Joyride WIDE text. Fine-motion mode animates each digit through one complete ribbon on scroll; reduced-motion and no-JavaScript modes expose the final value immediately.
- Layout spacing and radii follow semantic tokens documented in `reports/figma-spacing-radius-audit-2026-08-30.md`; decorative artwork radii are not layout tokens.
- LINE Seed JP is self-hosted under SIL OFL 1.1.
- No database is required.
- GitHub `main` is the deployment source for Railway.
