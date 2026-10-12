# CV PDF review and publication

Status: **Open - awaiting Dmitrii’s approval**, 2026-10-12.

## Source of truth

- Website: `/cv`, `src/pages/cv.astro`, `src/data/cv.json`, `src/data/cv-ru.json`, `src/styles/global.css`.
- Figma file: RohXp9xh64xj3NpvNcCe4j, page `584:2` (CV). Existing components are retained as instances; all text remains editable, logo remains vector, no full-page raster.
- Figma local Portfolio / CV collection now has a Light mode. Value remains the original dark mode; background/text/accent aliases change in Light, with legible filled-contact text.

| Language | Theme | Desktop | Mobile |
|---|---|---|---|
| EN | Dark | 621:48 | 621:148 |
| EN | Light | 621:227 | 621:327 |
| RU | Dark | 621:406 | 621:506 |
| RU | Light | 621:585 | 621:685 |

Review frames are to the right of the existing CV, English above Russian. Each has 36 editable text nodes, 9 existing-component instances and 14 logo vectors. No image-filled nodes or PDF download controls.

## Format decision

A single continuous page preserves the website composition for screen reading: Desktop width 1440 px (two columns) or Mobile width 390 px (one column). These are not A4 print documents. PDF uses the same CV with only interactive navigation and download buttons removed. It keeps portfolio/contact/project links. Source Figma and browser reflow differ by approximately 8 px in overall height, without section/content loss.

## Reproduce private review candidates

1. `npm ci && npx playwright install chromium` (once).
2. `npm run build && npm start`.
3. Set `CV_PDF_DIR` to a folder **outside this repository**, then run `node scripts/generate-cv-pdfs.mjs`. Optional `PORTFOLIO_BASE_URL` selects another running site.
4. Inspect each PDF with Poppler, check text/links and review `review-manifest.json` hashes. Files are never copied into public assets by this script.

The preview uses `/cv?lang=en&theme=dark&view=pdf-desktop`, with corresponding language/theme/layout values for the other candidates.

## Approval and publication

`src/data/cv-pdf-manifest.json` is false with no public URLs. Until explicit approval, the website shows the two format choices as disabled and explains review is pending.

After Dmitrii finishes editing and explicitly approves: reconcile Figma edits with the shared CV source, regenerate/verify candidates, copy only approved variants to public assets, and set approved=true with entries keyed by `en-dark-desktop`, `en-dark-mobile`, etc., each containing a real `url`. Rebuild/test, push main, deploy Railway and verify actual downloads for every selected combination. An absent variant remains unavailable. Do not treat layout edits as approval.
