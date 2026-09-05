# Verification log — 2026-09-05 motion revision

## Revision and scope

- Runtime and regression-test commit: `bc84b675326932ce8281c7405ab5e66d431fc4ce` (`fix: restore smooth single-border motion and responsive section feedback`).
- Branch: `main`. Local checks below ran against the exact source tree recorded in that commit; no runtime edits followed the passing run.
- Source evidence: `reports/figma-border-audit-2026-09-05.md`; Process node `358:788` was also re-read through Figma design context. The user explicitly overrides corner smoothing, not the numeric radii or paint values.
- Visual evidence: `artifacts/qa-2026-09-05-motion/`, generated against the production server build at `http://127.0.0.1:4322`.

## Technical checks

| Check | Result |
|---|---|
| `npm run build` | 25 files; 0 errors, 0 warnings, 0 hints; production server build completed |
| `PORTFOLIO_BASE_URL=http://127.0.0.1:4322 npm test -- --workers=2` | 74 passed, 19 intentional breakpoint-specific skips, 0 failures; 53.9 s |
| Desktop / tablet / mobile | 1440×900 / 1024×768 / 390×844; no horizontal overflow or runtime console errors |
| Single contour and motion | One mask per card/icon; native border paint disabled; conic highlight moves while mask and base gradient stay unchanged |
| Ordinary corners | Numeric Figma radii retained (Process 80 / 26 px), circular SVG rect corners and matching outer clip; reduced-motion path also passes |
| Icon frames | App and Process lights move on desktop hover and mobile scroll; original baked rims clipped, artwork scale retained, frame backing transparent |
| Section feedback | With a stationary pointer, rapid Process→Theme→Workflow scrolling updates scrollbar/cursor colour and keeps fixed-screen pointer coordinates |
| Menu and RUS/ENG | Frame-sampled gradual type crossfade, identical intensity timing, stable label bounds, full control opacity; all eight links still fit short desktop viewports |
| Avatar | Both ring and portrait containers have opaque black backing |
| Existing regression coverage | RU/EN persistence, one active route label, live fonts/cold hero reveal, odometer timing, mobile disclosures/header/chips, overlays, keyboard access and health checks pass |
| Fallbacks | Reduced motion and no JavaScript remain usable at every tested width |
| `git diff --check` | Passed before runtime commit |

Initial verification found and resolved three issues: thin replacement strokes could be clipped at the card padding edge; an older `html` rule overrode scrollbar colour; reduced-motion CSS/GSAP reset ordinary card clips. Final clean run passed without retries. The fixes are recorded in `Bugs.md`.

## Visual review

- Desktop Workflow: Context retains a dashed, fading single contour; card corners are circular; routes and chips remain joined. App artwork retains its size.
- Desktop/mobile Process: one fading green border, correct existing numeric radius, one icon frame. Desktop artwork stays on the right.
- Desktop menu and language selector: live Outline labels, stable placement, all menu entries visible.
- Mobile contact overlay: title and contacts fit; avatar sits on opaque backing.
- Capture set also includes hero reveal, mobile scroll glow, all sections, localized Workflow, disclosures and desktop card/icon hover states.

## Product check for Dmitrii

1. Move the pointer around Process and Workflow app icons: compare the restored soft highlight with the previous iteration. Only one contour should be visible at every corner.
2. Keep the pointer still and scroll quickly forward/backward: its colour should follow the section without lag. The native scrollbar should change colour when visible (visibility is controlled by the browser/OS).
3. Compare section-menu and RUS/ENG hover: same gradual type crossfade, no dimming. Check the avatar over a bright card for transparency.

## Production

Pending deployment and verification; this section will be completed only after Railway reports success and the live checks pass.
