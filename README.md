# Dmitrii Pershin — portfolio

Production portfolio based on the current Figma layouts. The first validated slice contains Hero, Focus, and AI Workflow in desktop and mobile layouts, with a shared spacing system and accessible scroll animation.

## Current state

- Astro + TypeScript application.
- GSAP + ScrollTrigger for staged and scroll-triggered motion.
- CSS custom properties for all major spacing and motion values.
- Figma assets stored locally; no expiring MCP URLs are used at runtime.
- Russian content from the current desktop/mobile frames.
- Full-motion and `prefers-reduced-motion` paths.
- Keyboard-accessible overlay menu.
- Playwright checks for desktop, tablet, mobile, reduced motion, overflow, menu, and health endpoint.
- Railway-ready Node server with `/api/health`.

The historical prototype remains in `../designer/site/`; do not build production changes there.

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

Copy `.env.example` to `.env` only if local host/port overrides are needed. There are no secrets in the current slice.

## Run locally

Development:

```bash
npm run dev
```

Production build and server:

```bash
npm run build
npm start
```

## Checks

```bash
npm run check
npm run build
npm run test:smoke
npm run qa:screenshots
```

The complete checklist and Dmitrii's product review steps are in `checks.md`.
The latest recorded verification is in `docs/test-log-2026-08-19.md`.

Committed reduced-motion review renders are stored in `artifacts/qa/`. They make layout comparison repeatable even when scroll reveals are intentionally disabled.

## Spacing changes

Change the token block at the top of `src/styles/global.css`:

- `--page-gutter`: page-side padding;
- `--section-gap`: vertical distance between major sections;
- `--section-content-gap`: distance between icon, heading, and content;
- `--copy-gap`: heading/copy rhythm;
- `--workflow-gap`: AI Workflow card gap.

The mobile breakpoint overrides the same tokens instead of scattering one-off values through components.

## Motion system

- Hero logo: one-time mask reveal.
- Section icon/heading/copy: shared reveal timeline.
- Shader-like icons: 12-second, 3–6 px ambient drift.
- Workflow cards: reveal once on entry.
- Borders: one subtle glow response after reveal plus hover feedback.
- Workflow arrows: SVG paths computed from live card positions and drawn toward each next tool.
- Reduced motion: all content and complete paths are immediately visible; no drift or long transforms.

See `docs/motion-map.md` for the intent, risks, and follow-up scope.

## Font licensing

LINE Seed JP is self-hosted under SIL Open Font License 1.1. Joyride is not committed as font software: the display typography is exported as static Figma artwork and paired with accessible DOM headings. If a valid Joyride webfont kit is purchased later, these assets can be replaced with live text.

## Railway deployment

The repository includes `railway.json` and a reproducible `Dockerfile`.

1. Push changes to GitHub `main`.
2. Connect the GitHub repository to Railway, or link the local folder once with `railway link`.
3. Railway runs `npm ci && npm run build` and starts with `npm start`.
4. Verify `https://<domain>/api/health` returns `{ "status": "ok" }`.
5. Smoke-test the production page at desktop and mobile widths.

## Known limitations

- Only the first three sections are implemented. Process & AI and Theme Builders are the recommended next motion sprint.
- Final spacing tokens need visual approval after the first production comparison.
- The page is currently Russian-only; language switching belongs to a later content pass.

## Source references

- Figma file: `RohXp9xh64xj3NpvNcCe4j`.
- Desktop nodes: Hero `358:512`, Focus `358:519`, AI Workflow `358:631`.
- Mobile nodes: Hero `372:932`, Focus `372:935`, AI Workflow `372:1042`.
