# Checks

## Technical checks run by the agent

1. `npm run check` and `npm run build`: Astro/TypeScript diagnostics and production server build.
2. `npm test`: Playwright suite across Chromium desktop `1440×900`, tablet `1024×768`, and mobile `390×844`.
3. Confirm all ten accessible page headings are present.
4. Scroll the page and confirm there are no browser console or uncaught runtime errors.
5. Confirm no horizontal overflow at all three widths.
6. Switch RU → EN, reload, and confirm the saved language and English content remain active.
7. On desktop, scroll past 40 px and confirm the globe hides while the menu stays fixed. On mobile, confirm the `48 px` controls start at Figma's `24 px` offsets and both scroll with the page.
8. Open/close the section menu with keyboard and Escape; confirm all eight section links.
9. Open the avatar contact panel and verify Telegram/email links.
10. Emulate reduced motion and confirm the relevant desktop/mobile workflow plus all eight desktop Figma connector assets remain visible.
11. Confirm the PremiumExchanger-style glow layer follows a desktop pointer while the card shadow and transform remain unchanged.
12. Assert desktop Theme Builder/Interfaces dimensions and mobile Workflow/Interfaces dimensions against their Figma values.
13. Scroll to Soft Skills on mobile and confirm the second display heading is visible.
14. On mobile, scroll and confirm card `--glow-angle` changes while the conic border layer stays visible; reduced motion must disable it.
15. On mobile, open Process and Theme Builders “Подробнее” controls once; confirm existing copy remains, new copy animates in, and the button disappears.
16. Verify the timer preview and all three platform cards use the supplied external destinations.
17. Capture reduced-motion full pages and focused Skills, AI Workflow, Process, Theme Builders, Interfaces, and Pet Project screenshots into `artifacts/qa/`.
18. Confirm `/api/health` returns HTTP 200 locally and on Railway.
19. Confirm Railway deployed the same GitHub `main` revision.

## Product checks for Dmitrii

1. Compare Focus, all section icons, and each display heading against the Figma desktop and mobile frames.
2. On desktop, follow every AI Workflow route from client context through Claude/Magnific/Figma to Designer/Frontend; each arrow and label should land exactly as in Figma.
3. On mobile, verify each Workflow arrow group is vertically centred between cards: one line for single chips, two centred tracks for JSON chips, and three centred tracks for the final asset chips.
4. On desktop, hover cards and verify the bright border follows the cursor. On mobile, scroll through cards and verify the same gradient rotates smoothly without changing card geometry.
5. Compare Hard/Soft outlines, Theme Builder metrics, and Interfaces number shapes/order against Figma.
6. Desktop: after 50 px the globe disappears while the shadowless menu stays anchored. Mobile: globe and menu scroll away together from their exact 24 px offsets; the avatar stays fixed at 60 px.
7. Switch to English, reload, and scan line breaks in every section.
8. At 390 px, open each “Подробнее” control once; existing text must remain, additional text must animate smoothly, and the button must disappear.
9. Enable Reduce Motion in the OS and confirm the site remains complete and deliberate.
10. Tune the layout tokens at the top of `src/styles/global.css`; verify page rhythm changes predictably.
