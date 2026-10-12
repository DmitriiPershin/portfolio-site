# CV motion refinement - 2026-10-12

Code revision: `65da723e28678fddcc4a70f13ba5ddd29e025eb3`. The following documentation/QA commit contains no runtime code changes.

## Technical checks

- `npm run build`: PASS; Astro 0 errors / 0 warnings.
- Final `npm test -- --workers=2`: **92 passed / 19 intentional breakpoint skips / 0 failures**, 1.1 minutes. Includes all 18 CV checks at desktop/tablet/mobile.
- Theme: sampled multiple intermediate colours in both directions; same document remains, rapid reversal settles to matching theme/icon/URL, reading scroll position unchanged.
- Overlays: shared portfolio opening/closing, typography/hover, menu fitting, RUS/ENG composition, Escape, native smooth section scrolling. Language replaces server-rendered content in the same document and preserves theme; translated PDF actions still work.
- Logo: hero/CV/transition use the same local SVG; exactly one image in the transition layer, original image hidden during travel and restored on Back. Uniform scale, no second target or logo opacity handoff. Browser beforeunload records final bounds; landing differs by less than 1 px in each dimension/position at all three viewports.
- Reduced motion, direct URL and no-JavaScript CV paths remain usable.
- Visual QA: theme intermediate frames, both full-screen overlays, hero and logo flight at 1440/390 px. `artifacts/qa/cv-motion/`. Light close control retains a visible cross without its baked circular backing.

An initial geometry test paused native navigation and then waited for a locator during that pause, deadlocking the test harness. It was replaced with a browser beforeunload measurement; the final complete suite passes against real navigation.

## Product checks for Dmitrii

1. Switch dark/light in both directions and reverse once quickly; check the colour and sun/moon change.
2. Open the CV menu and language selector on desktop/mobile: compare their motion and type with the portfolio, select a section and RUS/ENG.
3. From the portfolio, click CV and watch the same logo move/scale into the header; use Back and repeat.

PDF approval remains open; this release changes interaction, not PDF publication or career content.

Logs: `/tmp/portfolio-cv-motion-build.log`, `/tmp/portfolio-cv-motion-local-tests.log`; Railway/production result will be recorded in the Codex workspace deployment receipt.
