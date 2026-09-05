# Dmitrii Pershin — portfolio

Production portfolio implemented from the current desktop and mobile Figma layouts.

- Live site: https://portfolio-production-e2d0.up.railway.app
- GitHub: https://github.com/DmitriiPershin/portfolio-site

## Current state

- All portfolio sections are implemented in Astro + TypeScript with GSAP/ScrollTrigger as the only motion runtime.
- Exact Figma section icons, desktop AI routes, project visuals, and avatar are stored locally. Hero, section headings, overlays, closing title, and metrics are selectable live Joyride text.
- The language selector opens on every breakpoint. Desktop follows `501:2`/`501:45`; mobile follows `530:1103`. RU/EN persists locally.
- Desktop controls retain the Figma `64 px` geometry at `top: 64/148 px; right: 48 px`. Mobile controls align to the hero logo's outer edges, with the role centred between them. After `40 px`, downward scrolling hides the header and upward scrolling restores it on both breakpoints.
- The desktop menu scales as one group to fit all eight entries even in a short viewport. Menu and RUS/ENG use the same smooth Outline→Regular crossfade at full control opacity, with the border highlight's response timing. Both faces remain live text and label geometry stays fixed.
- The avatar opens the responsive Figma contact overlay. It is `120 × 120 px` desktop and `60 × 60 px` mobile, with `110.118/55.059 px` inner crops. It remains visible in the authored desktop contact composition, while mobile uses the overlay's central avatar; it hides over the final contacts and non-contact overlays.
- AI Workflow keeps seven crisp desktop SVG route groups. The three translated route labels are live text inside their original SVG chips, never a second chip over a Russian export. Each `150/54 px` application frame retains the exact Figma artwork; its baked outer rim is clipped and replaced by one animated contour. Mobile keeps the authored centred arrow groups.
- Focus follows the separate desktop/mobile copy composition: `40/52 px` headline and `16/32 px` body on desktop; `14/22 px` body with the authored break and `20 px` paragraph gap on mobile.
- Cards use ordinary circular corners at the existing Figma radius values (no corner smoothing, per Dmitrii's latest decision). One mask owns the border: its authored gradient stays still while the previous conic light moves inside the same contour. Context retains its `2 px / 4 4` dashes. Source paint values are recorded in `reports/figma-border-audit-2026-09-05.md`.
- Each card and app/Process icon frame has a deterministic golden-angle phase. The `266 px / 0.45` cursor light updates its section colour on pointer movement AND scrolling, with faster position response. The native scrollbar follows the section at 40% viewport height. Mobile skill rows stretch to both container edges.
- Avatar buttons and the contact avatar have an opaque black circular backing, preventing content from showing between ring and portrait.
- Theme Builder uses separate desktop/mobile artwork; its `250` counter now takes `1.8 s`, while Interfaces counters retain `0.9 s`.
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
The latest motion revision is recorded in `docs/test-log-2026-09-05-motion.md`; the earlier contour correction remains in `docs/test-log-2026-09-05.md`.
For an already running deployment, use `PORTFOLIO_BASE_URL=https://your-deployment npm test` (no local server is started).

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

- Hero: waits for the preloaded signature fonts, then reveals inside a mask with `40 px` extra ink allowance on every edge. Its layout box does not change when the mask is released.
- Section icons: exact artwork with a 1–2 px, 16-second ambient drift.
- Headings and copy: independent scroll reveals, including the second Soft Skills heading.
- Cards: soft entry with 18–22 px travel.
- AI Workflow: seven joined Figma route groups reveal after the desktop cards; mobile uses grouped CSS tracks tied directly to the one/two/three-chip rows.
- Desktop hover: restored the previous conic light's 38/82/112/150/220-degree profile inside one border mask. The authored base gradient stays still. Pointer proximity is `340 px`, angle response `0.055`, intensity response `0.04`, maximum intensity `0.9`; response is normalized to a 60 Hz reference and shared with menu/language crossfades.
- Cursor light: `266 px`, `0.32` position response, `0.45` maximum opacity. Scroll updates colour independently of pointer events and snaps to current screen coordinates. Touch and reduced-motion modes omit the light; the native scrollbar still receives section colour. OS settings control whether the scrollbar itself is visible.
- Mobile scroll: the conic light rotates at `0.22deg` per scroll pixel, with a `137.5deg` offset per card/icon. Original app/Process artwork keeps its scale; only the baked outer frame is clipped out, replaced by the single animated normal-radius contour. No additional backing is added to these icon frames.
- Numeric metrics: each digit makes one full `0–9` pass over `0.9 s` (`1.8 s` only for `250`), with `cubic-bezier(0.22, 1, 0.36, 1)` and a `45 ms` stagger. Reduced motion and no-JavaScript states show the final value immediately.
- Mobile Details: extra copy expands over 720 ms with `power3.out`; the button follows the new height, fades, and cannot be toggled closed accidentally.
- Reduced motion: all content and complete connectors are immediately visible, with no ambient drift or long transforms.

See `docs/motion-map.md` for the detailed map.

## Font licensing

LINE Seed JP is self-hosted under SIL Open Font License 1.1. The Joyride OTF files were supplied directly by Dmitrii for this portfolio and are preloaded locally so signature text is selectable and does not flash through a substitute typeface. Reuse outside this repository still requires an independent licence check.

## Railway deployment

The repository includes `railway.json` and a reproducible `Dockerfile`. The production service is `portfolio` in the Railway project `dmitrii-pershin-portfolio`.
The `.railwayignore` file keeps committed QA screenshots, tests, reports, and documentation out of the direct CLI upload while retaining them in GitHub.

1. Push changes to GitHub `main`.
2. From the clean checkout matching pushed `main`, run `railway up --service portfolio --detach`. The current service uses direct CLI uploads; pushing alone does not trigger it. The Docker build runs `npm ci && npm run build` and starts with `npm start`.
3. Wait for that deployment to reach `SUCCESS`, then verify `https://portfolio-production-e2d0.up.railway.app/api/health` returns `{ "status": "ok" }`.
4. Run the production checks with `PORTFOLIO_BASE_URL=https://portfolio-production-e2d0.up.railway.app npm test -- --workers=2`.

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
