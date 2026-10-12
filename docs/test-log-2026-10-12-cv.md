# CV preferences and shared PDF export validation - 2026-10-12

Code revision: `51d69cb686c6dfebb70146f0d8848cffee944c9b`. Subsequent documentation-only commit records this validation; deployment receipt identifies the final pushed main revision.

## Technical checks

- `npm run build`: PASS, Astro diagnostics 0 errors / 0 warnings.
- `npm test -- --workers=2`: PASS, **89 passed, 19 intentional breakpoint skips, 0 failures**, 1.1 minutes. Desktop 1440x900, tablet 1024x768, mobile 390x844.
- Navigation: eight section links, direct CV header entry, GSAP logo interpolation, browser Back, reduced motion and native no-JavaScript entry.
- CV: dark/English default, matching sun/moon icons, light/Russian switch preserving both preferences through reload, current theme/language in PDF chooser, Desktop PDF / Mobile PDF held disabled until approval, dialog keyboard focus / Escape, correct content and external actions.
- Visual smoke: EN/RU x dark/light at 1440 / 390 / 320 px, no horizontal overflow or mobile toolbar/logo overlap. Screenshots: `artifacts/qa/cv-preferences/`. Main header/menu proof: `artifacts/qa/navigation/`.
- All eight PDF candidates generated from the same CV page outside the repository. Each has one continuous page, selectable text, around-20-years sentence, all four employers, six working external/mail URI annotations, no localhost destinations or PDF-download controls. Desktop width 1080 pt; mobile Chromium rounds width to 293.04 pt (requested 390 px).
- Poppler rendered all eight at 96 dpi; all final PDF renders visually inspected. No clipping, overlapping sections or missing content.
- Figma: eight editable layout projections verified: 36 text nodes, 9 existing-component instances, 14 logo vectors each, correct LINE Seed JP font, 0 image-filled nodes. Full-view screenshots inspected for each. See `docs/cv-pdf-review.md` for review node IDs and approval steps.
- PDF publication gate: `approved:false`, no public URLs, no PDF files under public assets. Generated candidates remain in the Codex workspace for validation, outside GitHub and Railway upload.

## Product review for Dmitrii

1. In the deployed CV, switch theme/language, reload, and open Download PDF. Confirm both format choices and the current theme/language.
2. Compare desktop and mobile navigation with Figma; click CV from the portfolio and test browser Back.
3. Review/edit the eight PDF frames on the Figma CV page: long-page format, margins, summary, translations and footer contacts. Explicit PDF publication approval remains open.

Local execution logs: `/tmp/portfolio-cv-preferences-build.log`, `/tmp/portfolio-cv-preferences-local-tests.log`, `/tmp/portfolio-cv-pdf-generation.log`. Deployment and production checks are recorded in the Codex workspace release receipt after Railway succeeds.
