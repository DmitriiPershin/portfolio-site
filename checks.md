# Checks

## Technical checks run by the agent

1. `npm run check` and `npm run build`: Astro/TypeScript diagnostics and production server build.
2. `npm test`: Playwright suite across Chromium desktop `1440×900`, tablet `1024×768`, and mobile `390×844`.
3. Confirm all ten accessible page headings are present.
4. Scroll the page and confirm there are no browser console or uncaught runtime errors.
5. Confirm no horizontal overflow at all three widths.
6. Switch RU → EN, reload, and confirm the saved language and English content remain active.
7. Confirm fixed controls start at desktop `top: 64/148 px; right: 48 px`; mobile outer edges align with the logo and the role stays centred. Scroll down beyond `40 px`: controls hide. Scroll up: controls return.
8. Open/close the section menu and language selector with keyboard and Escape on both breakpoints; confirm all nine navigation links, live Joyride font states, mobile current-state colour, and persisted RU/EN state.
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
26. At `1280 × 600`, all nine desktop menu links fit; hovered text stays at full opacity. Mobile skill rows fill their width, including paired chips. Only the `250` ribbon uses 1.8 s; Interfaces remain at 0.9 s.
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
6. Desktop and mobile: menu/CV/globe stay fixed, disappear while scrolling down, and return when scrolling up. The avatar hides over menu/language and final contacts; in the desktop contact overlay it remains at the authored bottom-right position.
7. Switch to English, reload, and scan line breaks in every section.
8. At 390 px, open each “Подробнее” control once; existing text must remain, additional text must animate smoothly, and the button must disappear.
9. Enable Reduce Motion in the OS and confirm the site remains complete and deliberate.
10. Tune the layout tokens at the top of `src/styles/global.css`; verify page rhythm changes predictably.
11. Open contacts through the avatar at `1024 × 768` and `390 × 844`; confirm `Nice to meet you` fits and email stays on one line. Verify the same contacts at the end.
12. Scroll Theme Builders and Interfaces once and compare the digit-roll timing with PremiumExchanger: one full pass, firm deceleration, no bounce, and no replay from incidental layout movement.
13. Compare the semantic spacing/radius audit with Figma and decide whether to normalize the flagged legacy decimals and one-pixel differences in the source design.
14. Compare menu and RUS/ENG hover: both should crossfade at the same speed without dimming the complete label. Open contacts over a bright card and check that nothing shows through the avatar backing.

## CV checks (2026-10-11)

- Test current Figma copy, exact logo dimensions, intended contact/portfolio/timer links, no horizontal overflow and PDF format choices disabled pending approval at desktop/tablet/mobile.
- Sample logo width during direct header navigation, check direct /cv, reduced motion, no JavaScript at 320 px, and browser Back cleanup.
- Compare both website renders against the latest Figma frames.
- PDF: the prior 2-page layout is superseded by the 2026-10-12 shared-layout export below.
- Dmitrii: review final PDF spacing and explicitly approve it before the download file is published.

## Authored CV navigation (2026-10-11)

- Compare desktop menu / CV / globe at y=64 / 132 / 200, right=48, size=64 with Figma `601:78`.
- At 390 px, compare globe / CV / menu with 12 px side gutters, y=20 and 48 px controls; role is below the logo with a 12 px gap.
- Check eight section links, direct CV entry, logo transition, browser Back, directional hiding, language overlays, reduced motion and native no-JavaScript entry.
- Dmitrii: compare both headers visually against Figma and click CV directly from each. PDF approval remains separate.

## CV preferences and PDF review (2026-10-12)

- Direct `/cv` defaults to dark/English. Switch to light (moon icon), choose Russian, reload, and return to dark (sun icon); each preference preserves the other.
- Compare Figma controls at desktop y=64/136/208; at 390/320 px ensure the horizontal toolbar does not overlap the logo. Check menu anchors and language-dialog keyboard focus / Escape.
- Download PDF opens two explicit choices, Desktop PDF and Mobile PDF, with current language/theme. Until approved both choices remain disabled and no PDF URL is exposed.
- Generate all 8 candidates outside the repository using the procedure in docs/cv-pdf-review.md. Verify selectable text, around-20-years sentence, all four employers, correct widths, background colours, 6 external/mail links, no localhost URLs, no extra page numbering or interactive download/navigation controls. Render with Poppler and inspect every candidate.
- Dmitrii: review/edit the eight Figma PDF frames, particularly the long-page format, summary, Russian copy, margins and links; then explicitly approve publication.

## Refined CV motion (2026-10-12)

- Sample intermediate theme background colours in both directions; no document reload or horizontal overflow, unchanged scroll position. Rapidly reverse a switch and confirm the final theme/icon/URL/PDF selection agree.
- CV menu/language use the portfolio’s full-screen composition and shared helpers; sample opening/closing opacity and desktop Outline→Regular hover. Check menu anchor smooth scrolling, Escape/focus return and legible close crosses in light/dark.
- Select RUS/ENG and verify the same document remains, content/metadata update, theme persists, and translated Download PDF buttons still work.
- Hero and CV use the same SVG URL. During entry exactly one transition image remains visible and keeps its aspect ratio; compare settled transition bounds with the destination image within 1 px. Test modified clicks, reduced motion, no JavaScript, direct CV visits and Back.
- Dmitrii: compare theme switching in both directions, section/menu/language interaction, and the logo flight on desktop/mobile. PDF approval remains separate.

## Current CV release (2026-10-14; supersedes earlier PDF approval checks)

Technical: build/typecheck and full Playwright suite at desktop/tablet/mobile. Compare control rectangles on both routes; sample forward/reverse SVG sizes including browser Back. Verify centred language/PDF groups, vector closes, locked wheel scroll, Contact overlay/focus return, and three-action ordering. Fetch all eight public PDFs, check MIME/header/size/SHA against manifest. Reopen PDFs: one continuous page, all four employers, around-20-years sentence, eight URI annotations (two mailto, two same-variant PDF, three portfolio, one project). Poppler-render and visually inspect all eight. Deployment must match pushed main and actual public bytes.

Dmitrii: 1) CV → View portfolio → CV → browser Back; inspect logo motion and toolbar on phone/desktop. 2) Open language, Contact and PDF; try scrolling and closing. 3) Select Russian/light and English/dark, download Desktop and Mobile; verify appearance and email link. PDFs are authorized for publication; no further approval gate applies.

## Latest motion/system refinement (2026-10-14; supersedes earlier same-day behaviour)

Technical: full build/suite; exact desktop header slots throughout theme and route changes; pixel-row equality for light/dark burger; gradual CV entry and future-block reveal; return role fades; mobile logos equal viewport minus48px,y80px,951:214 ratio at320/390/480/640px,without flight; mobile header scrolls away while avatar remains. Check common Download/View hover,Figma164/160 widths,lowercase PDF labels,cursor glow,reduced/no-JavaScript paths and exported content. All8 PDFs:one page,zero raster images,zero Download PDF labels,6 URI links incl2 mailto; verify public bytes/hashes after Railway deploy.

Dmitrii: desktop switch theme and go CV↔portfolio (also browser Back); inspect header and role reveal. Phone:compare the logo,scroll until the header leaves,and open contacts from the fixed avatar. Read down CV to assess reveal speed,then download both PDF formats in matching theme/language.

## CV/avatar polish — 2026-10-15

Technical: build/typecheck; full desktop/tablet/mobile suite; sample off-screen CV transition alpha/geometry; check both action rows, shared one-mask/conic border response after language/theme changes; compare PDF picker font with ENG/RUS; avatar60/30px and proportional crops/status. Existing reduced-motion/no-JS, header stability, mobile native route and eight PDF-byte checks remain required. Save logs in `docs/cv-polish-*-2026-10-15.txt`.

Dmitrii: 1) scroll down portfolio, then slightly up; open CV using the returning CV control and assess the logo fade/flight. 2) Check smaller avatar on both pages. 3) Hover Download PDF/View portfolio and open PDF selection; compare its typography with ENG/RUS. Repeat CV in Russian/light and on phone.

## Locale/actions/mobile PDF — 2026-10-15

Technical: build and full suite on final assets; SSR/no-JS language negotiation with weighted Accept-Language,unsupported/missing language→English,URL override,manual cookie/storage preference across CV/portfolio; lowercase LINE picker typography. Verify75/37.5px avatar,lower actions after Audiomania,×2gap28desktop/0phone and60/86mobile type. Render all4mobile PDFs with Poppler; one page,six links,two full-width mailto buttons,selectable text,zero raster images. Preserve4desktop PDF SHA values and verify all8public bytes after Railway deployment.

Dmitrii: open privately with Russian/English browser language; choose the other language and navigate CV↔portfolio. On phone,read through Audiomania and use the following actions; compare mobile PDF button widths and ×2text spacing.

Resolved workflow —2026-10-15: local and production Playwright runs now have separate `test-results` and HTML report subdirectories. A shared output folder caused ENOENT during trace teardown when one run cleaned another run's artifacts. Keep simultaneous runs of the same target isolated with their own `--output`/HTML folder.

## Shared menus and custom domain — 2026-10-18 (current)

Technical: build/typecheck; full Playwright desktop/tablet/mobile suite; shared nine-item menu order/labels/current-CV close/focus return; all eight CV→portfolio section destinations in full and reduced motion. Verify desktop Joyride and phone LINE language labels/selected state,centred no-scroll overlays,short viewport fit1280×600/320×540. Assert Audiomania-footer96/164×40buttons with12gap,stacked full-width phone actions,Contact overlay and mailto fallback. Top Download PDF remains. Check ×2gap0 and corrected RU/EN Figma→GitLab copy. Preserve all8PDF hashes. Push main,deploy through Railway,wait SUCCESS,run live suite on pershindmitrii.com and check fallback/HTTPS/PDF bytes. Save screenshots and dated logs; exact revision/deployment identity belongs in the release receipt.

Dmitrii: 1) open the menu on CV and choose any portfolio section; check its arrival and menu type against Figma. 2) compare desktop ENGLiSH/RUSSiAN with mobile ENG/RUS; switch language and reopen. 3) after Audiomania,use Contact and View portfolio on phone/desktop; compare ×2spacing. 4) open https://pershindmitrii.com and /cv.

## PDF menu / responsive workflow / filenames — 2026-10-18 (current)

Technical: build/typecheck and full suite. PDF menu: current Figma Joyride desktop/LINE phone glyphs,centre alignment,shared hover and keyboard focus,Escape/scroll lock,both themes/languages,actual download suggested filenames for all8variants plus client language-change naming. No-JS anchors have the same filename pattern. Preserve all8PDF byte hashes. Workflow: EN/RU matrix320/390/640/641/768/900/1024/1200/1247/1248/1280/1440px; exactly one visible scene; every input within Context; all6vertical arrow groups align with adjacent cards and chips do not overlap; full desktop canvas and SVGs stay native with no viewport clipping. Resize full-motion diagram both directions without reload; no-JS at1024px stays complete. Header keeps desktop layout at1024px. Push main,CLI Railway deploy,SUCCESS,repeat live suite/asset/download checks,retain before/after geometry and screenshots.

Dmitrii: shrink the AI Workflow window through roughly1248px and1024/900px; check all arrows and the return to desktop when widened. Open Download PDF on desktop/phone and compare the labels to Figma. Switch RU/EN and dark/light,download both formats,and inspect the filename in Downloads.

Social preview —2026-10-18: verify exact FigmaSVG provenance and inspect exportedPNG against the reference. Check crawler/no-JavaScript HTML for both routes×both languages,title/description/canonical/image URL and dimensions; request public assets and compare SHA values. Test in-place language changes on all3viewports. After Railway publication,repeat against the primary domain. Dmitrii: open the site in a fresh tab to inspect the favicon; share the portfolio/CV link in a messenger and inspect its large preview and caption. Existing messenger previews may require the platform's cache refresh.
