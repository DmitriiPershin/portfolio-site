# CV PDF exports and publication

Status: **Published variants authorized by Dmitrii, 2026-10-14**. This supersedes the earlier approval gate.

The current source is `/cv`: `src/pages/cv.astro`, EN/RU data, global CSS and the exact supplied `Group 3.svg`. PDF uses the same selectable page content and vector logo. Website Contact opens Nice to meet you; PDF Contact uses mailto. Both action rows are Contact → Download PDF → View portfolio. Download links within each PDF point to its own public variant.

There are eight variants: EN/RU × dark/light × Desktop/Mobile. Each is one continuous screen-reading page: Desktop width1440 px, two columns; Mobile width390 px, one column. These are not A4 documents. Interactive navigation/overlays are excluded. The fullscreen format picker inherits current language/theme and has no automatic device detection.

## Reproduce and verify

1. Install with `npm ci && npx playwright install chromium`.
2. `npm run build`, then `npm start`.
3. Set `CV_PDF_DIR` to a staging folder outside the repository; run `node scripts/generate-cv-pdfs.mjs`. Optional `PORTFOLIO_BASE_URL` selects another server.
4. Reopen each export: one page, selectable text, all four employers and eight correct URI annotations. Render with Poppler and inspect every file; do not trust screenshots alone.
5. Copy verified variants into `public/cv/`. Update `src/data/cv-pdf-manifest.json` with URLs, SHA256, bytes and dimensions. Rebuild/test, push main, Railway CLI deploy, then verify actual download bytes for all eight.

`review-manifest.json` in the staging folder records export metadata. Public files/metadata belong in GitHub; intermediate PNGs and staging logs stay outside Railway uploads.

## Earlier Figma review evidence

Figma file RohXp9xh64xj3NpvNcCe4j, CV page584:2. Review frames: EN dark621:48/148; EN light621:227/327; RU dark621:406/506; RU light621:585/685. These editable frames predate the 2026-10-14 supplied SVG and three-button order. They are historical review evidence; website source is the current export source. No Figma write occurred in this release.
