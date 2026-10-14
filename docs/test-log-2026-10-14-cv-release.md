# CV release verification — 2026-10-14

Implementation: exact supplied Group 3.svg, aligned toolbar slots, reverse/logo Back motion, viewport-centred language/PDF overlays, sharp vector close, root/body scroll locking, shared Contact panel and Contact → Download PDF → View portfolio ordering. Eight public PDFs share website source and inherit language/theme.

## Technical checks

- `npm run build`: Astro diagnostics zero errors/warnings/hints; production build PASS.
- `npm test -- tests/cv.spec.ts --workers=2` before publication: 24 passed, zero failures.
- Full pre-publication suite: 98 passed,19 intentional skips,zero failures.
- Final local suite:99 passed,21 intentional skips,zero failures in1.3min. Includes native browser Back flight and all eight public PDF byte/hash checks. Production verification recorded below after deployment.
- All eight PDFs reopened through pypdf: one page; all four employers and 20-years sentence; no raster XObjects; eight URI annotations, including two mailto and two same-variant public PDF links; no local/undefined URLs. Poppler renders inspected for all eight. Screenshots and correct-size public downloads retain the supplied vector wordmark.
- SVG: 951×214,8498 bytes,SHA256 `3fe4a3d13ca25eef926b764c5f8642e9cd616ecb8fbdcb19fa0e9571306c823c`; byte-identical to supplied Downloads/Group 3.svg.
- UI captures: `artifacts/qa/cv-release-2026-10-14/`, desktop1440×900/mobile390×844/small320×640, including Contact/language/PDF overlays and hero. Small-phone contact wrap/email clipping found during inspection and fixed before final tests.
- Export metadata and hashes: `src/data/cv-pdf-manifest.json`. Eight actual `public/cv/` files are verified against that manifest in Playwright.

## Product checks for Dmitrii

1. CV → View portfolio, then CV → browser Back, on desktop and phone. Evaluate wordmark motion and toolbar stability.
2. Open language, Contact and PDF; try scrolling and use close/Escape. Check centred choices and sharp cross.
3. Download Desktop/Mobile in dark English and light Russian; inspect text and click Contact to open email.

Known format choice: each PDF is a continuous page for screen reading, not A4 pagination. Earlier Figma review frames predate this release’s SVG/action change; no Figma write is claimed.
