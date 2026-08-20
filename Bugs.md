# Bugs

## Open

- Final spacing values remain provisional until Dmitrii reviews the deployed desktop and mobile renders against Figma.
- English has no dedicated Figma frame, so long English labels may need a later typography pass.
- Joyride display copy is image-based until a valid webfont license/kit is supplied.

## Resolved

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
- Do not hand-redraw section icons or AI Workflow connectors when exact Figma exports exist.
- Do not add React, Motion, Lenis, Three.js, or another animation library without a demonstrated need.
- Do not publish local Joyride font files.
