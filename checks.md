# Checks

## Technical checks run by the agent

1. `npm run check` and `npm run build`: Astro/TypeScript diagnostics and production server build.
2. `npm test`: Playwright suite across Chromium desktop `1440×900`, tablet `1024×768`, and mobile `390×844`.
3. Confirm all ten accessible page headings are present.
4. Scroll the page and confirm there are no browser console or uncaught runtime errors.
5. Confirm no horizontal overflow at all three widths.
6. Switch RU → EN, reload, and confirm the saved language and English content remain active.
7. Confirm fixed controls start at desktop `top: 64/148 px; right: 48 px`; mobile outer edges align with the logo and the role stays centred. Scroll down beyond `40 px`: controls hide. Scroll up: controls return.
8. Open/close the section menu and language selector with keyboard and Escape on both breakpoints; confirm all eight section links, live Joyride font states, mobile current-state colour, and persisted RU/EN state.
9. Open the avatar contact panel and verify Telegram/email links.
10. Emulate reduced motion and confirm the relevant desktop/mobile workflow plus all seven desktop Figma SVG connector groups and the real dashed context border remain visible.
11. Confirm each card has exactly one masked contour: native paint is transparent and the resting gradient plus moving conic light share one mask. Pointer motion changes the light, never the mask or shadow. Original app/Process icon rims are clipped before replacement, so each frame also has only one animated contour. Cursor light stays at 0.45 opacity and is absent on touch/reduced motion.
12. Assert desktop/mobile Focus text metrics, Process card dimensions, separate Theme Builder assets, and Interfaces dimensions against their Figma values.
13. Scroll to Soft Skills on mobile and confirm the second display heading is visible.
14. On mobile, scroll and confirm the existing border's gradient transform changes with individual phases; reduced motion keeps static authored gradients.
15. On mobile, open Process and Theme Builders “Подробнее” controls once; confirm existing copy remains, new copy animates in, and the button disappears.
16. Verify the `1066 × 600 px` timer preview, `809 px` platform row, and all three platform cards use the supplied external destinations.
17. Capture reduced-motion full pages and focused Focus, Skills, AI Workflow, Process, Theme Builders, Interfaces, Pet Project, and final-contact screenshots into `artifacts/qa/`.
18. At `1024 × 768`, open the contact overlay and confirm the complete `Nice to meet you` artwork stays inside the viewport.
19. Confirm the final email and Telegram rows are live one-line text and the email icon is SVG. The avatar hides over the final section and menu/language overlays; desktop contacts preserve the authored bottom-right avatar while mobile contacts use the central overlay avatar.
20. Confirm the hero, all display headings, overlay labels, closing title, and Theme/Interfaces metrics use loaded live Joyride faces and contain no heading/metric images.
21. Confirm AI Context's single mask has a `2 px` stroke with `4 4` dashes; app icon frames are exact `150 × 150` desktop and `54 × 54` mobile exports. RU/EN route labels switch inside one SVG chip and never overlay another chip.
22. Scroll Theme Builders and Interfaces into view and confirm every numeric digit completes one full ribbon with a `45 ms` stagger, then exposes the correct accessible value. Reduced motion must skip the roll.
23. Confirm `/api/health` returns HTTP 200 locally and on Railway.
24. Confirm Railway deployed the same GitHub `main` revision.
25. Delay font requests and verify the hero waits, retains 40 px of reveal ink allowance, and never changes layout bounds when fonts load or the mask ends.
26. At `1280 × 600`, all eight desktop menu links fit; hovered text stays at full opacity. Mobile skill rows fill their width, including paired chips. Only the `250` ribbon uses 1.8 s; Interfaces remain at 0.9 s.
27. Verify ordinary circular mask corners retain numeric Figma radii (Process: 80 px desktop / 26 px mobile), including reduced motion. The outer clip must not cut the stroke at the padding edge.
28. Keep the pointer still and scroll quickly through Process → Theme → Workflow and back: cursor colour and native scrollbar colour must update without a mousemove; cursor screen position must not trail the scroll.
29. Sample real browser frames during both section-menu and language-selector hover: full control opacity, stable bounds, smooth 0→1 type crossfade using the border intensity timing. The duplicate visual face is aria-hidden.
30. Confirm both avatar instances have an opaque black backing beneath the portrait and ring.

## Product checks for Dmitrii

1. Compare Focus, all section icons, and each display heading against the Figma desktop and mobile frames.
2. On desktop, follow every AI Workflow route from client context through Claude/Magnific/Figma to Designer/Frontend; each arrow and label should land exactly as in Figma.
3. On mobile, verify each Workflow arrow group is vertically centred between cards: one line for single chips, two centred tracks for JSON chips, and three centred tracks for the final asset chips.
4. On desktop, move the pointer around cards and app/Process icons: the restored light should follow slowly inside one ordinary rounded contour. On mobile, scroll through cards and verify individual light phases without changing geometry. Keep the pointer still while scrolling back quickly: its colour and the scrollbar should follow the section.
5. Compare Focus wrapping, Hard/Soft outlines, Process strokes, Theme Builder artwork, and Interfaces number shapes/order against Figma.
6. Desktop and mobile: menu/globe stay fixed, disappear while scrolling down, and return when scrolling up. The avatar hides over menu/language and final contacts; in the desktop contact overlay it remains at the authored bottom-right position.
7. Switch to English, reload, and scan line breaks in every section.
8. At 390 px, open each “Подробнее” control once; existing text must remain, additional text must animate smoothly, and the button must disappear.
9. Enable Reduce Motion in the OS and confirm the site remains complete and deliberate.
10. Tune the layout tokens at the top of `src/styles/global.css`; verify page rhythm changes predictably.
11. Open contacts through the avatar at `1024 × 768` and `390 × 844`; confirm `Nice to meet you` fits and email stays on one line. Verify the same contacts at the end.
12. Scroll Theme Builders and Interfaces once and compare the digit-roll timing with PremiumExchanger: one full pass, firm deceleration, no bounce, and no replay from incidental layout movement.
13. Compare the semantic spacing/radius audit with Figma and decide whether to normalize the flagged legacy decimals and one-pixel differences in the source design.
14. Compare menu and RUS/ENG hover: both should crossfade at the same speed without dimming the complete label. Open contacts over a bright card and check that nothing shows through the avatar backing.
