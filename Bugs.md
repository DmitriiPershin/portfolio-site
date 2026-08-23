# Bugs

## Open

- Final spacing values remain provisional until Dmitrii reviews the deployed desktop and mobile renders against Figma.
- English has no dedicated Figma frame, so long English labels may need a later typography pass.
- Joyride display copy is image-based until a valid webfont license/kit is supplied.

## Resolved

- 2026-08-23: Mobile menu/language controls stayed fixed and no longer matched the Figma header. Moved both into the exact `343 × 48 px` absolute header at `24 px` top/left so they scroll away naturally; desktop fixed behaviour remains unchanged.
- 2026-08-23: Mobile cards had no equivalent for the desktop pointer glow. Added one shared ScrollTrigger-driven border system that rotates every card's conic highlight with scroll and disables it for reduced motion.
- 2026-08-23: The single mobile Workflow connector asset could not keep one-, two-, and three-chip arrow groups centred after responsive text/layout changes. Replaced it with six local `116 px` connector rows whose tracks and chips share the same grid.
- 2026-08-23: Process and Theme Builders disclosures jumped open, remained reversible, and left the control in the wrong position. They now reveal extra text smoothly once; the button follows the expanding content and then disappears without replacing existing copy.
- 2026-08-23: The mobile Theme Builders icon was capped to its `180 px` container and appeared much smaller than the Figma artwork. Restored the exported artwork's `300 × 222 px` render inside the exact `180 × 180 px` node.
- 2026-08-23: Avatar photo padding and status-dot sizing did not match the responsive Figma ellipses. Corrected the `120/60 px` outer sizes, `110.118/55.059 px` inner artwork, and `18/9 px` status rings.
- 2026-08-23: Pet Project platform cards used placeholder destinations and labels. Connected the preview plus website, Chrome Web Store, and ChatGPT cards to the supplied URLs and restored the responsive Figma card typography/icon sizing.
- 2026-08-23: Desktop AI Workflow rows were positioned by repeated percentages, which accumulated vertical error and moved arrows away from card endpoints. Replaced them with the exact `1152 × 2128` Figma coordinates and corrected every row, connector, label, radius, and padding.
- 2026-08-23: Mobile AI Workflow mixed flex gaps with absolutely positioned labels, so the shared connector SVG missed cards. Rebuilt it as the Figma `342 × 1806.154` sequence with 40 px gaps, `342 × 136` elliptical tool cards, and the connector group at `top: 306.921px`.
- 2026-08-23: The second Soft Skills heading stayed transparent because only the first heading in a section received a reveal animation. Each heading now owns its own scroll trigger and the mobile heading is covered by a visibility regression test.
- 2026-08-23: Hard/Soft skill chips used flat borders and approximate shadows. Restored the Figma gradient stroke, `26px` radius, `60px / -17.68px` inset shadow, exact desktop chip copy, and the designed mobile row composition.
- 2026-08-23: Theme Builder metrics and Interfaces metrics used approximate sizes, type, order, and effects. Restored the exact Figma desktop/mobile geometry, gradient strokes, inset shadows, missing Interfaces headline, and path-safe Figma exports for every Joyride number.
- 2026-08-23: The menu had an unwanted blur/drop shadow. It remains viewport-fixed but now has a transparent, shadowless surface; scroll position is regression-tested.
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
- Do not publish local Joyride font files.
