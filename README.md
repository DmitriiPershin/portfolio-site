# Dmitrii Pershin — portfolio

Production portfolio implemented from the current desktop and mobile Figma layouts.

- Live site: https://portfolio-production-e2d0.up.railway.app
- GitHub: https://github.com/DmitriiPershin/portfolio-site

## Current state

- All portfolio sections are implemented: Hero, Focus, Hard/Soft Skills, AI Workflow, Process & AI, Theme Builders, Interfaces, Pet Project, and closing/contact.
- Astro + TypeScript application with GSAP + ScrollTrigger for staged and scroll-triggered motion.
- Exact Figma-exported section icons, display headings, AI connectors, project visuals, and avatar are stored locally.
- Russian and English content can be switched from the globe control; the choice persists locally.
- On desktop the globe fades away after 40 px and the menu stays fixed. On mobile the `343 × 48 px` header sits at the exact Figma `24 px` offsets and scrolls away naturally with the page.
- The avatar opens a contact panel with Telegram and email.
- The avatar follows the exact responsive Figma geometry: `120 × 120 px` desktop and `60 × 60 px` mobile, including its inner photo and online indicator.
- Desktop and mobile layouts follow separate Figma geometry where needed, especially AI Workflow.
- AI Workflow uses the exact Figma desktop coordinates and a dedicated `342 × 1806 px` mobile sequence. Mobile connector rows are grouped per transition (one, two, or three tracks), keeping every arrow centred with its own chip between cards.
- Hard/Soft Skills, Theme Builders, and Interfaces use the Figma gradient strokes, radii, inset shadows, dimensions, copy, and responsive ordering.
- Theme Builder and Interfaces numbers are exact Figma text exports, so Joyride WIDE glyph shapes are preserved without shipping the local font software.
- Card borders use a cursor-proximity glow derived from PremiumExchanger on desktop. On mobile the same conic highlight changes angle with page scroll while the Figma base stroke and inset effect remain unchanged.
- Mobile Process & AI and Theme Builders details reveal additional copy once with a smooth height/fade transition; the control moves with the expanding content and then disappears.
- The Pet Project preview and all three platform cards link to the supplied 30 Minute Timer web, Chrome, and ChatGPT destinations.
- Major layout, spacing, and timing values are CSS custom properties.
- Full-motion and `prefers-reduced-motion` paths are supported.
- Playwright covers desktop, tablet, mobile, overflow, languages, responsive navigation, contacts, one-way mobile disclosures, scroll-linked and pointer-linked border glow, project links, exact workflow/card geometry, and health.
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
The latest recorded verification is in `docs/test-log-2026-08-23.md`.

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
- AI Workflow: original Figma connector SVGs reveal after the desktop cards; mobile uses grouped CSS tracks tied directly to the one/two/three-chip rows.
- Desktop hover: a conic-gradient border segment activates within 160 px of the pointer, follows its angle, and fades with proximity.
- Mobile scroll: the same border segment rotates at `0.22deg` per scroll pixel, with a stable offset per card. It does not replace or deform the Figma border, radius, fill, or inset shadow.
- Mobile Details: extra copy expands over 720 ms with `power3.out`; the button follows the new height, fades, and cannot be toggled closed accidentally.
- Reduced motion: all content and complete connectors are immediately visible, with no ambient drift or long transforms.

See `docs/motion-map.md` for the detailed map.

## Font licensing

LINE Seed JP is self-hosted under SIL Open Font License 1.1. Joyride is not committed as font software: display headings and numeric glyphs are exact static Figma exports paired with accessible DOM text/alt labels.

## Railway deployment

The repository includes `railway.json` and a reproducible `Dockerfile`. The production service is `portfolio` in the Railway project `dmitrii-pershin-portfolio`.

1. Push changes to GitHub `main`.
2. Railway builds the GitHub revision with `npm ci && npm run build` and starts it with `npm start`.
3. Verify `https://portfolio-production-e2d0.up.railway.app/api/health` returns `{ "status": "ok" }`.
4. Smoke-test the production page at desktop and mobile widths.

## Known limitations

- Final spacing tokens still need Dmitrii's visual approval; they are intentionally centralized for quick adjustment.
- The English content is a parallel content layer. Figma currently defines Russian desktop/mobile geometry only.
- Joyride display typography intentionally remains image-based until a valid webfont kit is available; this preserves the Figma shapes without redistributing the local font.

## Figma source

- File: `RohXp9xh64xj3NpvNcCe4j`.
- Desktop full frame: `358:434`.
- Mobile full frame: `372:928`.
- Desktop sections: `358:512`, `358:519`, `358:537`, `358:631`, `358:762`, `358:808`, `358:837`, `358:892`, `358:909`.
- Mobile sections: `372:932`, `372:935`, `372:952`, `372:1042`, `372:1106`, `372:1136`, `372:1157`, `372:1205`, `383:45`.
