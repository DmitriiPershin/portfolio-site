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
10. Emulate reduced motion and confirm the relevant desktop/mobile workflow plus all eight desktop Figma connector assets remain visible.
11. Confirm the PremiumExchanger-style glow layer follows a desktop pointer while the card shadow and transform remain unchanged.
12. Assert desktop Theme Builder/Interfaces dimensions and mobile Workflow/Interfaces dimensions against their Figma values.
13. Scroll to Soft Skills on mobile and confirm the second display heading is visible.
14. On mobile, open a “Подробнее” disclosure and confirm the detailed content appears.
15. Capture reduced-motion full pages and focused Skills, AI Workflow, Theme Builders, and Interfaces screenshots into `artifacts/qa/`.
16. Confirm `/api/health` returns HTTP 200 locally and on Railway.
17. Confirm Railway deployed the same GitHub `main` revision.

## Product checks for Dmitrii

1. Compare Focus, all section icons, and each display heading against the Figma desktop and mobile frames.
2. On desktop, follow every AI Workflow route from client context through Claude/Magnific/Figma to Designer/Frontend; each arrow and label should land exactly as in Figma.
3. On mobile, verify the Workflow arrows remain centred through Context → Claude → Magnific → Claude → Figma → Designer → Frontend and that tool cards are elliptical.
4. Hover skills, workflow cards, green process cards, orange metrics, pink interface metrics, and the blue pet-project card; the bright border segment should follow the cursor without scaling the card or replacing its base border.
5. Compare Hard/Soft outlines, Theme Builder metrics, and Interfaces number shapes/order against Figma.
6. Scroll 50 px: the globe should disappear, while the shadowless menu and avatar stay anchored.
7. Switch to English, reload, and scan line breaks in every section.
8. At 390 px, open each “Подробнее” control and verify the expanded text remains readable.
9. Enable Reduce Motion in the OS and confirm the site remains complete and deliberate.
10. Tune the layout tokens at the top of `src/styles/global.css`; verify page rhythm changes predictably.
