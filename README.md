# Dmitrii Pershin — portfolio

Production portfolio implemented from the current desktop and mobile Figma layouts.

- Live site: https://portfolio-production-e2d0.up.railway.app
- GitHub: https://github.com/DmitriiPershin/portfolio-site

## Current state

- All portfolio sections are implemented: Hero, Focus, Hard/Soft Skills, AI Workflow, Process & AI, Theme Builders, Interfaces, Pet Project, and closing/contact.
- Astro + TypeScript application with GSAP + ScrollTrigger for staged and scroll-triggered motion.
- Exact Figma-exported section icons, display headings, AI connectors, project visuals, and avatar are stored locally.
- Russian and English content can be switched from the fixed globe control; the choice persists locally.
- The globe fades away after 40 px of scroll. The menu and bottom-right avatar remain fixed.
- The avatar opens a contact panel with Telegram and email.
- Desktop and mobile layouts follow separate Figma geometry where needed, especially AI Workflow.
- AI Workflow now uses the exact Figma desktop coordinates and a dedicated `342 × 1806 px` mobile sequence, so arrow endpoints, labels, card radii, and 40 px vertical rhythm stay locked together.
- Hard/Soft Skills, Theme Builders, and Interfaces use the Figma gradient strokes, radii, inset shadows, dimensions, copy, and responsive ordering.
- Theme Builder and Interfaces numbers are exact Figma text exports, so Joyride WIDE glyph shapes are preserved without shipping the local font software.
- Card borders use a cursor-proximity glow derived from PremiumExchanger: the highlight follows the pointer while the Figma base stroke and inset effect remain unchanged.
- Major layout, spacing, and timing values are CSS custom properties.
- Full-motion and `prefers-reduced-motion` paths are supported.
- Playwright covers desktop, tablet, mobile, overflow, languages, fixed controls, menu, contacts, mobile disclosures, reduced motion, Premium-style border glow, exact workflow/card geometry, and health.
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
- AI Workflow: original Figma connector SVGs reveal after the cards. Desktop and mobile use separate connector systems.
- Hover: a conic-gradient border segment activates within 160 px of the pointer, follows its angle, and fades with proximity. It does not replace or deform the Figma border, radius, fill, or inset shadow.
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
