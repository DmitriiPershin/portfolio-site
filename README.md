# Dmitrii Pershin — portfolio

Production portfolio implemented from the current desktop and mobile Figma layouts.

- Live site: https://portfolio-production-e2d0.up.railway.app
- GitHub: https://github.com/DmitriiPershin/portfolio-site

## Current state

- All portfolio sections are implemented in Astro + TypeScript with GSAP/ScrollTrigger as the only motion runtime.
- Exact Figma section icons, desktop AI routes, project visuals, and avatar are stored locally. Hero, section headings, overlays, closing title, and metrics are selectable live Joyride text.
- The language selector opens on every breakpoint. Desktop follows `501:2`/`501:45`; mobile follows `530:1103`. RU/EN persists locally.
- Desktop controls use the Figma `64 px` geometry at `top: 64/148 px; right: 48 px`. Mobile uses the new fixed `390 × 68 px` header with `48 px` controls at `12 px` side offsets. After `40 px`, downward scrolling hides the header and upward scrolling restores it on both breakpoints.
- The avatar opens the responsive Figma contact overlay. It is `120 × 120 px` desktop and `60 × 60 px` mobile, with `110.118/55.059 px` inner crops, and hides while final contacts or another overlay are visible.
- AI Workflow keeps seven crisp desktop SVG route groups. Its context is a real CSS `2 px / 4 4` dashed border whose glow follows the same dashes. Clean app artwork sits inside exact `150/54 px` gradient icon frames. Mobile uses the authored `342 × 1844 px` sequence with centred one-, two-, and three-track groups.
- Focus follows the separate desktop/mobile copy composition: `40/52 px` headline and `16/32 px` body on desktop; `14/22 px` body with the authored break and `20 px` paragraph gap on mobile.
- Hard Skills uses the current solid `#765592` border, 30% purple backing, `26 px` radius, and authored inset glow. Soft Skills keeps its separate gradient stroke. Process cards use the solid `#35bf27` border with `80/26 px` radii.
- Card highlights follow the existing border geometry. Desktop uses pointer proximity; mobile rotates the same conic segment with scroll. A `380 px` pointer light adopts the current section heading colour.
- Theme Builder uses separate desktop/mobile artwork; Theme and Interfaces metrics are live Joyride WIDE text.
- Mobile Process & AI and Theme Builders details reveal additional copy once; the button moves with expansion and disappears.
- Pet Project uses the new desktop and mobile compositions: `1066 × 600 px` desktop preview and `342 × 195 px` mobile preview, with supplied website, Chrome, and ChatGPT destinations.
- The final block uses live Joyride `THANK / YOU`, live contact text, and a crisp SVG email icon. The floating avatar hides there.
- Major layout, spacing, and timing values are CSS custom properties. Full-motion, no-JavaScript content, and `prefers-reduced-motion` paths are supported.
- Playwright covers desktop, tablet, mobile, overflow, fonts, languages, overlays, directional navigation, disclosure, glow geometry, workflow, external links, and `/api/health`.
- Railway-ready Node server with reproducible Docker build.

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
The latest recorded verification is in `docs/test-log-2026-08-30.md`.

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
- Cursor light: a `380 px` section-coloured radial glow follows a fine pointer with `0.12` interpolation and `0.5` maximum opacity; it is removed for touch and reduced motion.
- Mobile scroll: the same border segment rotates at `0.22deg` per scroll pixel, with a stable offset per card. It does not replace or deform the Figma border, radius, fill, or inset shadow.
- Mobile Details: extra copy expands over 720 ms with `power3.out`; the button follows the new height, fades, and cannot be toggled closed accidentally.
- Reduced motion: all content and complete connectors are immediately visible, with no ambient drift or long transforms.

See `docs/motion-map.md` for the detailed map.

## Font licensing

LINE Seed JP is self-hosted under SIL Open Font License 1.1. The Joyride OTF files were supplied directly by Dmitrii for this portfolio and are preloaded locally so signature text is selectable and does not flash through a substitute typeface. Reuse outside this repository still requires an independent licence check.

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
- Figma contains a few legacy fractional radii and one-pixel mobile size differences. The audit and proposed normalized tokens are recorded in `reports/figma-spacing-radius-audit-2026-08-30.md`; they are not silently pushed back into Figma.

## Figma source

- File: `RohXp9xh64xj3NpvNcCe4j`.
- Desktop full frame: `358:434`.
- Mobile full frame: `372:928`.
- Desktop menu and language selector: `473:110`, `501:2`, `501:45`.
- Desktop sections: `358:512`, `358:519`, `358:537`, `358:631`, `358:762`, `358:808`, `358:837`, `358:892`, `358:909`.
- Mobile hero/header and sections: `523:123`, `372:935`, `372:952`, `372:1042`, `372:1106`, `372:1136`, `372:1157`, `372:1205`, `530:1050`.
- Mobile menu/language/contact overlays: `530:1051`, `530:1103`, `528:563`.
