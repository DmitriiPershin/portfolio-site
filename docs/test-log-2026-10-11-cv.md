# CV release checks — 2026-10-11

Source: user-edited Figma `584:3` and `584:4`; layout/copy parity read from the file. Baseline Git commit: `aed4c4d`. Final release commit is recorded below after commit creation.

## Technical results

- `npm run build`: PASS, 28 checked files, 0 errors/warnings/hints; production Astro + Node bundle generated.
- Targeted CV suite: 12/12 PASS at desktop, tablet and mobile; current copy, link intent, exact logo slot, 320 px/no-JavaScript access, reduced motion, intermediate logo shrink and browser Back cleanup.
- Extra browser checks: PASS for CV entry from hero and lower-page menu at 1440/390 px; ninth menu link fits at 320×568.
- Local static SVG: unchanged Figma export from node `586:3`, 7431 bytes, root 626×132; rendered in the authored 625.334×131.457 desktop / 342×71.895 mobile slots. No temporary asset URLs in runtime.
- `npm test -- --workers=4`: PASS, 86 passed / 19 intentional breakpoint skips, 55.4 s; 0 failed.
- `npm run qa:screenshots`: PASS; existing portfolio desktop/mobile, overlays and full-motion captures regenerated. Retained changed menu screenshots and new CV proof; unrelated baseline captures were not rewritten in Git.
- `git diff --check`: PASS.
- Website PNGs: `../artifacts/qa/cv/cv-1440.png`, `cv-390.png`, `transition-1440.png`, `transition-390.png`, `landing-1440.png`, `landing-390.png`. Full CV layouts and intermediate transition screenshots visually inspected; no clipped copy/overlaps.

## Issues found and resolved

- Numeric-only time parsing broke production timing when CSS minified 900 ms to .9 s. Unit-aware parser restored the intended 900 ms transition; intermediate-width regression now passes.
- The initial no-JavaScript shortcut overlapped the language control at 320 px. Bottom-left placement passes actual click/navigation.
- Initial test import needed an explicit JSON import attribute under Node 25. Fixed the test import.
- Initial browser test waited for navigation before sampling animation. No-wait click observes the real intermediate state.

## PDF review (not published)

Latest revision follows Dmitrii's feedback: exact vector logo once; no repeated page-2 header, page numbers or footer numbering; line before Earlier experience and each remaining purple section heading; Contact / Portfolio beneath introduction and at the end.

PASS: 2 A4 pages; all experience copy/date strings match current source after whitespace/ASCII dash normalization; 7 dividers (2 on page 1, 5 on page 2); 5 working URI annotations; embedded LINE Seed JP faces; no raster images; text inside 44 pt page margins. Both pages rendered at 110 dpi and visually inspected. Stored in the separate Codex task output: `/Users/dmitriipershin/Documents/Codex/2026-10-08/referenced-chatgpt-conversation-this-is-an/output/pdf/dmitrii-pershin-cv-review.pdf`.

Status: awaiting explicit approval. Review file is outside this repository and excluded from GitHub/Railway uploads and no PDF route/file is publicly exposed. Both Download PDF buttons are intentionally disabled.

## Product review for Dmitrii

1. Open main menu → CV on desktop/mobile, observe the logo arriving at the CV header size, then use browser Back.
2. Check current copy and Contact / View portfolio / View project links.
3. Review PDF section spacing, separators and final Contact row; approve before enabling downloads.
