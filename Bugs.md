# Bugs

## Open

- Final spacing values remain provisional until Dmitrii reviews the deployed desktop and mobile renders against Figma.
- English has no dedicated Figma frame, so long English labels may need a later typography pass.

## Resolved

- 2026-08-31: The cursor glow still occupied the old `380 px` footprint. Reduced its diameter by 30% to `266 px` while retaining the section-colour response.
- 2026-08-31: Live Joyride hero and Theme Builders text was clipped by reveal masks after animation. Release the masks after the reveal so the font's real overhang remains visible on desktop and mobile.
- 2026-08-31: Hard Skills chips had synchronized border highlights and the mobile scroll highlight was being overwritten by desktop pointer state. Added deterministic `137.5deg` phase offsets and isolated pointer motion from the mobile ScrollTrigger path.
- 2026-08-31: AI Workflow app icons were rebuilt inside generic filled frames, changing their transparent centres, glow, and artwork scale. Replaced every desktop/mobile frame with the exact current Figma export and restored the solid `#4058f4` card stroke with the authored 30% inset light.
- 2026-08-31: Theme Builders and Interfaces metrics appeared as static values. Added accessible PremiumExchanger-style per-digit ribbons with one full pass, authored live Joyride text, and immediate reduced-motion/no-JavaScript fallbacks.
- 2026-08-31: The mobile menu selector missed all three burger lines because an image preceded them in the DOM; `:nth-child` counted the image. Switched to `:nth-of-type` and restored the exact three-line Figma geometry.
- 2026-08-31: Desktop contact links floated toward the middle and the overlay suppressed the authored bottom-right avatar. Anchored the links to the dialog bottom and preserved the desktop avatar; the mobile overlay continues to use its central avatar.
- 2026-08-30: Signature headings, hero logo, overlay labels, closing copy, and metrics were static SVG/PNG exports. Added the user-supplied Joyride faces as preloaded local fonts and rebuilt every signature label as selectable live text.
- 2026-08-30: The mobile hero, menu, language selector, contact overlay, and Pet Project still followed older layouts. Rebuilt them from nodes `523:123`, `530:1051`, `530:1103`, `528:563`, and `372:1205`.
- 2026-08-30: Navigation either stayed visible through downward reading or disappeared without returning. Both breakpoints now hide after a downward scroll beyond `40 px` and return immediately on upward intent.
- 2026-08-30: AI Context used an SVG dash plus a second generic solid glow. Replaced the SVG border with a real `2 px` CSS dashed border and an identically dashed masked light; app icons now use clean assets inside the Figma gradient frames.
- 2026-08-30: Section icons gained a rectangular/opaque-looking glow when duplicating raster artwork. Removed the drop-shadow backing and now brighten the exact icon silhouette with screen blending.
- 2026-08-30: Hard Skills retained the wrong gradient stroke, and Process cards retained a gradient approximation. Restored the current solid `#765592` and `#35bf27` strokes while leaving Soft Skills on its separate authored gradient.
- 2026-08-30: The email icon was a malformed raster-like asset and the mobile email wrapped to two lines. Rebuilt the icon as SVG, kept the mobile contact rows at `342 × 52 px`, and fitted the email on one line.
- 2026-08-30: The floating avatar remained visible over menu/language overlays and the final contacts. It now hides on those surfaces; desktop contacts intentionally preserve the authored bottom-right avatar and mobile contacts use their central avatar.

- 2026-08-28: Desktop language switching skipped the authored selector and changed content immediately. Added the exact `501:2` overlay, Figma globe asset, persisted choices, and the Outline → Regular 40% hover from `501:45`.
- 2026-08-28: Desktop menu/language controls either scrolled away immediately or stayed visible for the whole page. They now remain fixed only until the Hard Skills artwork appears; mobile remains document-positioned.
- 2026-08-28: AI Workflow routes were PNG exports processed through an alpha filter, which blurred chips and shifted arrow bounds. Replaced all seven routes with transparent SVG groups from the current Figma nodes, restored exact visual bounds, and updated every tool icon.
- 2026-08-28: Hard/Soft Skills and Process cards used solid or incomplete borders. Restored the authored gradient transforms/stops and inset-shadow spread values from Figma.
- 2026-08-28: Pet Project still used the old bordered outer card. Rebuilt desktop to the current borderless `1066 × 600 px` preview plus `809 px` platform row and kept the supplied destinations.
- 2026-08-28: The closing block used an older raster heading/order and the fixed avatar covered it. Added the current SVG heading, live email/Telegram text in Figma order, stronger hover light, and visibility-driven avatar hiding.
- 2026-08-28: Menu typography used blurry PNG-only states and translated on hover. Replaced desktop states with crisp Figma SVG paths and a slow typeface/40%-opacity crossfade without positional movement.

- 2026-08-24: Focus copy used browser-driven wrapping that did not reproduce the separate desktop/mobile Figma composition. Restored the exact type metrics, paragraph rhythm, hidden mobile display title, and authored mobile line break.
- 2026-08-24: Skills border light used a brighter generic core and responded too abruptly. Hard and Soft Skills now use the requested `#765592` highlight with `300 px` proximity, `0.075` angle interpolation, and `0.055` opacity interpolation.
- 2026-08-24: Process & AI cards retained approximate mobile dimensions and inconsistent inset effects. Restored the Figma green `1 px` stroke, black backing, per-card inset shadows, `26/80 px` mobile/desktop radii, exact mobile heights, and right-side desktop icons.
- 2026-08-24: Theme Builder reused the oversized desktop export on mobile and centred the desktop bleed incorrectly. Added the exact `180 × 180 px` mobile Figma export and corrected the desktop `300 × 300 px` clip origin.
- 2026-08-24: The contact-overlay title could extend beyond a `1024 × 768 px` viewport. Added height-aware desktop scaling while leaving the authored `1440 × 900 px` geometry unchanged.
- 2026-08-24: The closing section contained generic copy instead of the newly authored contacts. Replaced it with the exact desktop Telegram/email rows and a fitted `342 px` mobile layout.
- 2026-08-24: The page had no ambient cursor light outside card borders. Added a subtle tokenized purple radial glow for fine pointers, disabled on touch and reduced motion.
- 2026-08-23: Desktop navigation still used fixed positioning and the language control disappeared through scroll-state JavaScript. Both desktop controls now use the exact Figma absolute coordinates and scroll away with the page; the menu surface has no shadow.
- 2026-08-23: Menu and contact overlays used approximate live typography and centered card layouts. Rebuilt both from Figma nodes `473:110` and `473:124`, including exact Joyride exports, `85/86 px` placement, `62 px` contact icons, close controls, and responsive versions.
- 2026-08-23: The avatar displayed the full raw composite inside the inner ellipse, making the portrait appear too small. Added the exact `110.118/55.059 px` clipping ellipse and Figma's `-39.96% / 179.92%` image crop.
- 2026-08-23: Desktop AI Workflow arrows and labels were separate positioned layers and drifted apart. Replaced them with seven joined Figma route exports and removed their opaque export backgrounds at render time with a shared SVG alpha filter.
- 2026-08-23: Desktop Process cards stacked icons above copy and used approximate strokes/fills. Restored the Figma `676 + 28 + 150 px` horizontal layout, right-side icons, `1 px` stroke, black fill, `80 px` radius, and `20 px` card gap.
- 2026-08-23: Hard Skills used a gradient border instead of the authored solid stroke/backing. Restored the exact `#765592` stroke, 30% purple backing, `26 px` radius, and inset shadow.
- 2026-08-23: Theme Builders artwork was scaled from its full `633 × 468 px` export, shrinking the visible form. It now renders at export scale inside the exact clipped desktop Figma node; the later mobile-specific export is recorded above.
- 2026-08-23: Pointer-following borders reacted abruptly to every pointer event. Added smoothstep proximity falloff and independently tunable angle, opacity, radius, and maximum-opacity values; the latest values are recorded above.
- 2026-08-23: Direct Railway uploads could time out while transferring committed QA screenshots and leave `INITIALIZING` drafts without builds. Added `.railwayignore` so production snapshots contain only runtime/build inputs while QA artifacts remain versioned in GitHub.
- 2026-08-23: Mobile menu/language controls stayed fixed and no longer matched the Figma header. Moved both into the exact `343 × 48 px` absolute header at `24 px` top/left so they scroll away naturally.
- 2026-08-23: Mobile cards had no equivalent for the desktop pointer glow. Added one shared ScrollTrigger-driven border system that rotates every card's conic highlight with scroll and disables it for reduced motion.
- 2026-08-23: The single mobile Workflow connector asset could not keep one-, two-, and three-chip arrow groups centred after responsive text/layout changes. Replaced it with six local `116 px` connector rows whose tracks and chips share the same grid.
- 2026-08-23: Process and Theme Builders disclosures jumped open, remained reversible, and left the control in the wrong position. They now reveal extra text smoothly once; the button follows the expanding content and then disappears without replacing existing copy.
- 2026-08-23: The mobile Theme Builders icon was capped to the export bounds and appeared much smaller than the Figma artwork. Restored the `633 × 468 px` export scale inside the exact clipped `180 × 180 px` node.
- 2026-08-23: Avatar photo padding and status-dot sizing did not match the responsive Figma ellipses. Corrected the `120/60 px` outer sizes, `110.118/55.059 px` inner artwork, and `18/9 px` status rings.
- 2026-08-23: Pet Project platform cards used placeholder destinations and labels. Connected the preview plus website, Chrome Web Store, and ChatGPT cards to the supplied URLs and restored the responsive Figma card typography/icon sizing.
- 2026-08-23: Desktop AI Workflow rows were positioned by repeated percentages, which accumulated vertical error and moved arrows away from card endpoints. Replaced them with the exact `1152 × 2128` Figma coordinates and corrected every row, connector, label, radius, and padding.
- 2026-08-23: Mobile AI Workflow mixed flex gaps with absolutely positioned labels, so the shared connector SVG missed cards. Rebuilt it as the Figma `342 × 1806.154` sequence with 40 px gaps, `342 × 136` elliptical tool cards, and the connector group at `top: 306.921px`.
- 2026-08-23: The second Soft Skills heading stayed transparent because only the first heading in a section received a reveal animation. Each heading now owns its own scroll trigger and the mobile heading is covered by a visibility regression test.
- 2026-08-23: Soft skill chips used approximate shadows and row composition. Restored the Figma `26 px` radius, inset effect, exact desktop copy, and designed mobile rows; Hard Skills now follow their separate solid-stroke style.
- 2026-08-23: Theme Builder metrics and Interfaces metrics used approximate sizes, type, order, and effects. Restored the exact Figma desktop/mobile geometry, gradient strokes, inset shadows, missing Interfaces headline, and path-safe Figma exports for every Joyride number.
- 2026-08-23: The menu had an unwanted blur/drop shadow. It now has a transparent, shadowless trigger and scrolls with the document; position is regression-tested.
- 2026-08-23: The original hover changed card scale, fill, and inset shadow. Replaced it with the PremiumExchanger-style cursor-proximity border segment, leaving the Figma card styling untouched.
- 2026-08-23: Wide mobile artwork could enlarge full-page screenshots even though the document reported no scrolling overflow. Added clipping at the main viewport boundary and expanded QA captures to four focused sections per breakpoint.
- 2026-08-20: The Focus icon was an approximate CSS recreation and no longer matched Figma. Replaced it with the exact export from node `358:520`; ambient motion now affects only its container.
- 2026-08-20: AI Workflow connectors were generated from card positions and did not match the designed desktop routes. Replaced them with the original Figma vector assets and exact card-relative geometry; mobile keeps its dedicated vertical connector asset.
- 2026-08-20: Section cards had no meaningful hover treatment. Added pointer-positioned gradients, section-colour inset glows, and a very small scale response while preserving exact border styles.
- 2026-08-20: The mobile Theme Builders artwork increased document width by 308 px. Preserved the intentional wide crop inside a clipped viewport wrapper; all tested widths now have no horizontal overflow.
- 2026-08-20: The Pet Project preview used lazy loading and could be blank in automated full-page captures. It now loads eagerly because it is core portfolio content.
- 2026-08-20: The Pet Project source PNG weighed 9.6 MB. Replaced the runtime asset with a visually equivalent 2× WebP (285 KB) while keeping the Figma crop and dimensions.
- 2026-08-20: Type checking scanned generated Playwright report bundles after a failed run. Added `artifacts`, `test-results`, and `playwright-report` to TypeScript exclusions.
- 2026-08-19: Figma canvas node `358:433` could not be used directly for design context. Resolved by querying concrete desktop/mobile frames.
- 2026-08-19: Hero artwork initially shrank to intrinsic grid width on desktop. Resolved with the Figma `950 px` maximum and `342 px` mobile width.
- 2026-08-19: Adjacent inline Focus paragraphs lost their separating space. Resolved with a desktop-only generated separator.

## Agent mistakes to avoid

- Do not treat `designer/site/` as the production app.
- Do not hand-redraw section icons or desktop AI Workflow connectors when exact Figma exports exist. Mobile connectors are intentionally local layout primitives because their chip groups must remain responsively centred.
- Do not add React, Motion, Lenis, Three.js, or another animation library without a demonstrated need.
- Do not replace the user-supplied live Joyride typography with image exports; check licensing again before reusing the font files outside this portfolio.
