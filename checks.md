# Checks

## Technical checks run by the agent

1. `npm run check` and `npm run build`: Astro/TypeScript diagnostics and production server build.
2. `npm test`: Playwright suite across Chromium desktop `1440×900`, tablet `1024×768`, and mobile `390×844`.
3. Confirm all ten accessible page headings are present.
4. Scroll the page and confirm there are no browser console or uncaught runtime errors.
5. Confirm no horizontal overflow at all three widths.
6. Switch RU → EN, reload, and confirm the saved language and English content remain active.
7. Scroll past 40 px, confirm the globe hides, and confirm the fixed menu position does not move.
8. Open/close the section menu with keyboard and Escape; confirm all eight section links.
9. Open the avatar contact panel and verify Telegram/email links.
10. Emulate reduced motion and confirm every card plus all eight desktop Figma connector assets remain visible.
11. On mobile, open a “Подробнее” disclosure and confirm the detailed content appears.
12. Capture reduced-motion desktop/mobile layouts and focused AI Workflow/Pet Project screenshots into `artifacts/qa/`.
13. Confirm `/api/health` returns HTTP 200 locally and on Railway.
14. Confirm Railway deployed the same GitHub `main` revision.

## Product checks for Dmitrii

1. Compare Focus, all section icons, and each display heading against the Figma desktop and mobile frames.
2. On desktop, follow every AI Workflow route from client context through Claude/Magnific/Figma to Designer/Frontend.
3. Hover skills, workflow cards, green process cards, orange metrics, pink interface metrics, and the blue pet-project card; check that the gradient feels smooth and almost imperceptible.
4. Scroll 50 px: the globe should disappear, while menu and avatar stay anchored.
5. Switch to English, reload, and scan line breaks in every section.
6. At 390 px, open each “Подробнее” control and verify the expanded text remains readable.
7. Enable Reduce Motion in the OS and confirm the site remains complete and deliberate.
8. Tune the layout tokens at the top of `src/styles/global.css`; verify page rhythm changes predictably.
