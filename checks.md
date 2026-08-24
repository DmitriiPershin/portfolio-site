# Checks

## Technical checks run by the agent

1. `npm run check` and `npm run build`: Astro/TypeScript diagnostics and production server build.
2. `npm test`: Playwright suite across Chromium desktop `1440×900`, tablet `1024×768`, and mobile `390×844`.
3. Confirm all ten accessible page headings are present.
4. Scroll the page and confirm there are no browser console or uncaught runtime errors.
5. Confirm no horizontal overflow at all three widths.
6. Switch RU → EN, reload, and confirm the saved language and English content remain active.
7. On desktop, confirm the controls start at Figma's `top: 64/148 px; right: 48 px` coordinates and both scroll away with the page. On mobile, confirm the `48 px` controls start at the Figma `24 px` offsets and also scroll away.
8. Open/close the section menu with keyboard and Escape; confirm all eight section links.
9. Open the avatar contact panel and verify Telegram/email links.
10. Emulate reduced motion and confirm the relevant desktop/mobile workflow plus all eight desktop Figma connector assets remain visible.
11. Confirm the PremiumExchanger-style glow layer follows a desktop pointer while the card shadow and transform remain unchanged; confirm the subtle ambient cursor light follows independently and is absent on touch/reduced motion.
12. Assert desktop/mobile Focus text metrics, Process card dimensions, separate Theme Builder assets, and Interfaces dimensions against their Figma values.
13. Scroll to Soft Skills on mobile and confirm the second display heading is visible.
14. On mobile, scroll and confirm card `--glow-angle` changes while the conic border layer stays visible; reduced motion must disable it.
15. On mobile, open Process and Theme Builders “Подробнее” controls once; confirm existing copy remains, new copy animates in, and the button disappears.
16. Verify the timer preview and all three platform cards use the supplied external destinations.
17. Capture reduced-motion full pages and focused Focus, Skills, AI Workflow, Process, Theme Builders, Interfaces, Pet Project, and final-contact screenshots into `artifacts/qa/`.
18. At `1024 × 768`, open the contact overlay and confirm the complete `Nice to meet you` artwork stays inside the viewport.
19. Confirm the final Telegram and email rows are present and usable on desktop and mobile.
20. Confirm `/api/health` returns HTTP 200 locally and on Railway.
21. Confirm Railway deployed the same GitHub `main` revision.

## Product checks for Dmitrii

1. Compare Focus, all section icons, and each display heading against the Figma desktop and mobile frames.
2. On desktop, follow every AI Workflow route from client context through Claude/Magnific/Figma to Designer/Frontend; each arrow and label should land exactly as in Figma.
3. On mobile, verify each Workflow arrow group is vertically centred between cards: one line for single chips, two centred tracks for JSON chips, and three centred tracks for the final asset chips.
4. On desktop, move the pointer around cards: the border should follow slowly and the light under the cursor should remain subtle. On mobile, scroll through cards and verify the same gradient rotates smoothly without changing card geometry.
5. Compare Focus wrapping, Hard/Soft outlines, Process strokes, Theme Builder artwork, and Interfaces number shapes/order against Figma.
6. Desktop and mobile: the shadowless globe and menu must scroll away from their exact Figma starting positions; only the avatar stays fixed.
7. Switch to English, reload, and scan line breaks in every section.
8. At 390 px, open each “Подробнее” control once; existing text must remain, additional text must animate smoothly, and the button must disappear.
9. Enable Reduce Motion in the OS and confirm the site remains complete and deliberate.
10. Tune the layout tokens at the top of `src/styles/global.css`; verify page rhythm changes predictably.
11. Open contacts through the avatar at `1024 × 768` and confirm `Nice to meet you` fits; then verify Telegram/email again at the end of the page on desktop and mobile.
