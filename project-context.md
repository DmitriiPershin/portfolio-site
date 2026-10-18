# Project context

## Purpose

A production portfolio for Dmitrii Pershin, a senior product designer focused on white-label systems, AI-assisted design production, and complex fintech interfaces.

## Audience

Hiring managers, design leaders, founders, and product teams evaluating senior product/system design work.

## Current scope

The EN/RU `/cv` page uses the edited Figma layout (`584:3` / `584:4`) with the exact supplied SVG. Its current interactions, shared header/mobile logo geometry and PDF export rules are canonical in [motion-system.md](docs/motion-system.md) and README. Explicit PDF publication authorization remains valid. Career copy and NDA constraints are unchanged.

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
- User-supplied Joyride OTF files are self-hosted and preloaded. Section/overlay typography and metrics remain live selectable text. Exception, explicitly requested by Dmitrii on 2026-10-12: hero/CV wordmarks use one shared exact SVG to avoid shape substitution during the route animation; retain an accessible name.
- Shared navigation/avatar/route behaviour follows the current decisions in `docs/motion-system.md` (updated2026-10-15). In particular, mobile headers scroll with the document; desktop controls preserve their slots. Avatar hides over final contacts and non-contact overlays; the contact overlay retains its separate mobile portrait.
- AI Workflow desktop connector geometry and `150/54 px` application frames are exact local Figma exports. The three localized route labels may be replaced with live SVG text inside the same original chip. Never overlay another translated chip.
- One painted contour per card/icon, including dashed Context. Keep Figma radius NUMBERS but use ordinary circular corners, explicitly overriding corner smoothing at Dmitrii's request (2026-09-05 motion revision). A stationary authored gradient and moving conic light share ONE mask. App/Process artwork is preserved at original scale while its baked outer frame is clipped away before rendering the replacement contour. Raw paint/effect evidence remains in `reports/figma-border-audit-2026-09-05.md`.
- Menu and language hover use one live-text crossfade implementation at full control opacity and share the border response timing. Cursor colour must update while scrolling under a stationary pointer, not only on pointermove. Scrollbar colour follows the reading section; native OS scrollbar visibility is respected. Avatar backing is opaque.
- Theme Builders and Interfaces metrics use live, accessible Joyride WIDE text. Fine-motion mode animates each digit through one complete ribbon on scroll; reduced-motion and no-JavaScript modes expose the final value immediately.
- Layout spacing and radii follow semantic tokens documented in `reports/figma-spacing-radius-audit-2026-08-30.md`; decorative artwork radii are not layout tokens.
- LINE Seed JP is self-hosted under SIL OFL 1.1.
- No database is required.
- GitHub `main` is the deployment source for Railway.

## Deployment follow-up — checked2026-10-18

Open: Railway's current service-settings banner says legacy Config as Code remains supported only until2026-12-01. The existing railway.json deployment works today; plan a separate migration to supported service settings/Infrastructure as Code before that deadline. Source: authenticated service Settings,project d2069e58-6cb0-4c01-a7af-192ec1c9596f,service portfolio. This task does not change the deployment configuration.
