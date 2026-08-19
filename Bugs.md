# Bugs

## Open

- The remaining Figma sections are not part of the first production slice yet.
- Final spacing values are provisional until Dmitrii reviews the production render against Figma.
- Joyride display copy is image-based until a valid webfont license/kit is supplied.

## Resolved

- 2026-08-19: Figma canvas node `358:433` could not be used directly for design context. Resolved by reading its metadata and querying the concrete desktop/mobile section frames.
- 2026-08-19: Hero artwork initially shrank to intrinsic grid width on desktop. Resolved with a fixed `950 px` max-width flex layout while preserving the `342 px` mobile width.
- 2026-08-19: Adjacent inline paragraphs in desktop Focus lost their separating space. Resolved with a desktop-only generated separator; mobile paragraphs remain stacked.
- 2026-08-19: The keyboard-menu test reused an accessible-name locator after the button correctly changed its label from “Открыть” to “Закрыть”. Resolved by locating the stable control and asserting both names.
- 2026-08-19: A manual preview process stayed alive while `dist/` was rebuilt, so it served HTML that referenced a deleted CSS hash. Resolved by restarting the production process before browser checks; Railway performs this restart automatically after each build.

## Agent mistakes to avoid

- Do not treat `designer/site/` as the production app.
- Do not add React, Motion, Lenis, Three.js, or another animation library without a demonstrated need.
- Do not publish local Joyride font files.
