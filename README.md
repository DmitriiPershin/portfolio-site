# Dmitrii Pershin — portfolio

Production portfolio implemented from the current desktop and mobile Figma layouts.

- Live site: https://portfolio-production-e2d0.up.railway.app
- GitHub: https://github.com/DmitriiPershin/portfolio-site

## Current state

- All portfolio sections are implemented: Hero, Focus, Hard/Soft Skills, AI Workflow, Process & AI, Theme Builders, Interfaces, Pet Project, and the final Figma contact block.
- Astro + TypeScript application with GSAP + ScrollTrigger for staged and scroll-triggered motion.
- Exact Figma-exported section icons, display headings, SVG AI routes, overlay typography, project visuals, and avatar are stored locally.
- On desktop the globe opens the exact Figma language selector (`501:2`); its Russian hover swaps Outline for Regular at 40% purple. The chosen RU/EN content layer persists locally. Mobile keeps the compact direct toggle.
- Desktop menu and language controls use the Figma `64 px` geometry at `top: 64/148 px; right: 48 px`. They remain fixed through the introduction and fade out when the Hard Skills artwork enters the viewport. Mobile keeps the authored `343 × 48 px` document header at `24 px` top/left and scrolls away naturally.
- The avatar opens the exact Figma contact overlay with Telegram, email, closing artwork, and close control. Its title scales only on short desktop viewports so `Nice to meet you` always remains visible.
- The avatar follows the responsive Figma geometry: `120 × 120 px` desktop and `60 × 60 px` mobile, with `110.118/55.059 px` inner crops and the authored image zoom.
- Desktop and mobile layouts follow separate Figma geometry where needed, especially AI Workflow.
- AI Workflow uses seven exact transparent SVG route groups where each arrow, chip, dash, gradient, and shadow remains one crisp unit. The current tool icons and gradient card strokes come from the same Figma nodes. Mobile keeps its dedicated `342 × 1806 px` sequence with one-, two-, and three-track connector groups.
- Focus follows the separate desktop/mobile Figma text composition: `40/52 px` headline and `16/32 px` body on desktop; hidden display headline, `14/22 px` body, explicit line break, and `20 px` paragraph gap on mobile.
- Hard and Soft Skills use the exact five-stop `#765592` gradient stroke, separate authored fills, `26 px` radius, and `60 px / -17.68 px` inset effect. Process cards use the matching Figma green gradient stroke instead of a solid approximation. Both sections retain the same-colour cursor highlight with eased angle and opacity.
- Theme Builder uses separate exact Figma artwork on desktop and mobile so the authored crop, orange form, and apparent size remain intact. Interfaces numbers are exact Figma text exports, so Joyride WIDE glyph shapes are preserved without shipping the local font software.
- Card borders use a cursor-proximity glow derived from PremiumExchanger on desktop. On mobile the same conic highlight changes angle with page scroll while the Figma base stroke and inset effect remain unchanged. A separate low-opacity purple light follows a fine pointer without affecting layout or touch devices.
- Mobile Process & AI and Theme Builders details reveal additional copy once with a smooth height/fade transition; the control moves with the expanding content and then disappears.
- Pet Project follows the new desktop Figma composition: a borderless outer stack, a `1066 × 600 px` linked preview, and an `809 px` three-card platform row. All supplied website, Chrome, and ChatGPT destinations are connected.
- Major layout, spacing, and timing values are CSS custom properties.
- Full-motion and `prefers-reduced-motion` paths are supported.
- The end of the page uses the current SVG `THANK / YOU` heading and live LINE Seed contact text, ordered email then Telegram. The floating avatar hides while this section is visible so it cannot cover the contacts.
- Playwright covers desktop, tablet, mobile, overflow, languages, responsive navigation, both contact surfaces, one-way mobile disclosures, scroll-linked and pointer-linked border glow, project links, exact Focus/Process/Theme geometry, and health.
- Railway-ready Node server with `/api/health`.

The historical prototype remains in `../designer/site/`; production changes belong here.

## Read first

1. `project-context.md`
2. `decisions.md`
3. `docs/motion-map.md`
4. `checks.md`
5. `Bugs.md`

## Install

Requirements: Node.js 22–25 and npm.

```bash
npm ci
```

## Environment

Copy `.env.example` to `.env` only if local host/port overrides are needed. The current site has no required secrets or database.

## Run locally

Development:

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

## Checks

```bash
npm run check
npm run build
npm test
npm run qa:screenshots
```

The product review checklist is in `checks.md`. Reduced-motion desktop/mobile renders are written to `artifacts/qa/`.
The latest recorded verification is in `docs/test-log-2026-08-28.md`.

## Spacing changes

Start with the token block at the top of `src/styles/global.css`:

- `--page-gutter`: page-side padding;
- `--section-gap`: distance between major sections;
- `--section-content-gap`: icon/heading/content rhythm;
- `--copy-gap`: heading/copy rhythm;
- `--card-gap`: repeated-card spacing;
- `--content-wide` and `--content-copy`: the two main content widths.

The mobile breakpoint overrides the same tokens. Section-specific geometry remains next to its component class so it can be compared with the corresponding Figma node.

## Motion and hover system

- Hero: one-time mask reveal.
- Section icons: exact artwork with a 1–2 px, 16-second ambient drift.
- Headings and copy: independent scroll reveals, including the second Soft Skills heading.
- Cards: soft entry with 18–22 px travel.
- AI Workflow: seven joined Figma route groups reveal after the desktop cards; mobile uses grouped CSS tracks tied directly to the one/two/three-chip rows.
- Desktop hover: a same-colour conic-gradient border segment activates within `340 px` of the pointer. Angle interpolation is `0.055`, opacity interpolation is `0.04`, maximum opacity is `0.9`, and a smoothstep falloff removes the hard edge.
- Cursor light: a `300 px` purple radial glow follows a fine pointer with `0.12` interpolation and `0.24` maximum opacity; it is removed for touch and reduced motion.
- Mobile scroll: the same border segment rotates at `0.22deg` per scroll pixel, with a stable offset per card. It does not replace or deform the Figma border, radius, fill, or inset shadow.
- Mobile Details: extra copy expands over 720 ms with `power3.out`; the button follows the new height, fades, and cannot be toggled closed accidentally.
- Reduced motion: all content and complete connectors are immediately visible, with no ambient drift or long transforms.

See `docs/motion-map.md` for the detailed map.

## Font licensing

LINE Seed JP is self-hosted under SIL Open Font License 1.1. Joyride is not committed as font software: display headings and numeric glyphs are exact static Figma exports paired with accessible DOM text/alt labels.

## Railway deployment

The repository includes `railway.json` and a reproducible `Dockerfile`. The production service is `portfolio` in the Railway project `dmitrii-pershin-portfolio`.
The `.railwayignore` file keeps committed QA screenshots, tests, reports, and documentation out of the direct CLI upload while retaining them in GitHub.

1. Push changes to GitHub `main`.
2. Railway builds the GitHub revision with `npm ci && npm run build` and starts it with `npm start`.
3. Verify `https://portfolio-production-e2d0.up.railway.app/api/health` returns `{ "status": "ok" }`.
4. Smoke-test the production page at desktop and mobile widths.

## Known limitations

- Final spacing tokens still need Dmitrii's visual approval; they are intentionally centralized for quick adjustment.
- The English content is a parallel content layer. Figma currently defines Russian desktop/mobile geometry only.
- Joyride display typography intentionally remains image-based until a valid webfont kit is available; this preserves the Figma shapes without redistributing the local font.
- Joyride menu hover and section headings can become live font text only after licensed Joyride WIDE, Outline, Regular, and ALT webfonts are supplied. Until then the exact Figma SVG/PNG paths are the production source.

## Figma source

- File: `RohXp9xh64xj3NpvNcCe4j`.
- Desktop full frame: `358:434`.
- Mobile full frame: `372:928`.
- Desktop menu and language selector: `473:110`, `501:2`, `501:45`.
- Desktop sections: `358:512`, `358:519`, `358:537`, `358:631`, `358:762`, `358:808`, `358:837`, `358:892`, `358:909`.
- Mobile sections: `372:932`, `372:935`, `372:952`, `372:1042`, `372:1106`, `372:1136`, `372:1157`, `372:1205`, `383:45`.
