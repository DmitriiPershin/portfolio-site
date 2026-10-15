# Dmitrii Pershin — portfolio

Production portfolio implemented from the current desktop and mobile Figma layouts.

- Live site: https://portfolio-production-e2d0.up.railway.app
- GitHub: https://github.com/DmitriiPershin/portfolio-site

## Current state

Latest refinement (2026-10-15,locales/actions): floating avatar75px desktop/37.5px phone; lowercase english/russian and desktop pdf/mobile pdf share LINE Seed JP. First request follows explicit URL,manual preference,then browser language,with English fallback. Website lower actions now sit immediately below Audiomania; mobile PDF action rows stretch full width. Theme ×2 spacing matches its desktop/mobile Figma nodes. Verification: `docs/test-log-2026-10-15-cv-locales.md`.

- `/cv` implements the edited desktop `584:3` and mobile `584:4` layouts in EN/RU, with selectable experience text and a local exact SVG wordmark. The floating avatar opens Nice to meet you on CV and portfolio. Website action rows,above experience and directly after Audiomania,use filled Download PDF → outlined View portfolio with the Soft Skills contour/light response and Figma sizing. PDF retains Contact/mailto and View portfolio, without Download PDF.
- Both routes use the exact user-supplied `Group 3.svg` (951×214), stored as `public/assets/cv-wordmark.svg`. One SVG shrinks into CV and expands back on desktop, including browser Back; Senior Product Designer replays its entry animation on return. Mobile uses identical full-width SVG bounds at y80px on both pages and performs no logo flight. One shared header preserves menu/CV/globe at64/132/200px on desktop; CV theme occupies its own268px slot. Reduced-motion/modified-click/no-JavaScript paths keep native links.
- Eight public PDFs derive from `/cv`: EN/RU × dark/light × Desktop 1440 px/Mobile 390 px. Download PDF opens a centred full-screen picker with lowercase desktop pdf / mobile pdf and inherits the current language/theme. Each file preserves selectable text, vector logo and live links. Publication was explicitly authorized on 2026-10-14. See `docs/cv-pdf-review.md`.

- All portfolio sections are implemented in Astro + TypeScript with GSAP/ScrollTrigger as the only motion runtime.
- Exact Figma section icons, desktop AI routes, project visuals, and avatar are stored locally. Section headings, overlays, closing title, and metrics are selectable live Joyride text. At Dmitrii’s explicit request the hero and CV use the same exact SVG; accessible name text remains in the DOM.
- CV reuses the portfolio’s full-screen menu/language overlays, opening/closing animation, keyboard behaviour, menu fitting and Outline→Regular hover implementation. CV copy/jobs/practice fade in on scroll using the portfolio’s shared1000ms reveal curve. Theme colours blend over720ms and the sun/moon fades without scale/rotation; language updates the same document without reloading, with native URL fallbacks.
- The language selector opens on every breakpoint with lowercase english/russian. Explicit choices persist in a first-party cookie/local storage and apply across CV/portfolio. Server-rendered first paint and no-JavaScript content negotiate Accept-Language; unsupported/missing preferences fall back to English.
- Desktop menu / CV / language form a `64 px` column at `top: 64/132/200 px; right: 48 px`, with `4 px` gaps. Mobile uses `12 px` side gutters, `48 px` globe/menu controls and a centred CV link; Senior Product Designer appears beneath the logo. Desktop directional scrolling changes header visibility without translating controls. Mobile headers scroll away with the page; they do not float.
- The desktop menu scales as one group to fit all eight section entries even in a short viewport. Menu uses Joyride Outline→Regular; language/PDF choices use LINE Seed JP regular→bold with the same smooth crossfade at full control opacity, with the border highlight's response timing. Both faces remain live text and label geometry stays fixed.
- The avatar opens the responsive Figma contact overlay. It is `75 × 75 px` desktop and `37.5 × 37.5 px` mobile, with proportional inner crops; the mobile contact overlay retains its separate120px portrait. It remains visible in the authored desktop contact composition, while mobile uses the overlay's central avatar; it hides over the final contacts and non-contact overlays.
- AI Workflow keeps seven crisp desktop SVG route groups. The three translated route labels are live text inside their original SVG chips, never a second chip over a Russian export. Each `150/54 px` application frame retains the exact Figma artwork; its baked outer rim is clipped and replaced by one animated contour. Mobile keeps the authored centred arrow groups.
- Focus follows the separate desktop/mobile copy composition: `40/52 px` headline and `16/32 px` body on desktop; `14/22 px` body with the authored break and `20 px` paragraph gap on mobile.
- Cards use ordinary circular corners at the existing Figma radius values (no corner smoothing, per Dmitrii's latest decision). One mask owns the border: its authored gradient stays still while the previous conic light moves inside the same contour. Context retains its `2 px / 4 4` dashes. Source paint values are recorded in `reports/figma-border-audit-2026-09-05.md`.
- Each card and app/Process icon frame has a deterministic golden-angle phase. The `266 px / 0.45` cursor light updates its section colour on pointer movement AND scrolling, with faster position response. The native scrollbar follows the section at 40% viewport height. Mobile skill rows stretch to both container edges.
- Avatar buttons and the contact avatar have an opaque black circular backing, preventing content from showing between ring and portrait.
- Theme Builder uses separate desktop/mobile artwork; its `250` counter now takes `1.8 s`, while Interfaces counters retain `0.9 s`.
- Mobile Process & AI and Theme Builders details reveal additional copy once; the button moves with expansion and disappears.
- Pet Project uses the new desktop and mobile compositions: `1066 × 600 px` desktop preview and `342 × 195 px` mobile preview, with supplied website, Chrome, and ChatGPT destinations.
- The final block uses live Joyride `THANK / YOU`, live contact text, and a crisp SVG email icon. The floating avatar hides there.
- Semantic reveal/change/route curves and major layout, spacing, and timing values are CSS custom properties; see `docs/motion-system.md`. Full-motion, no-JavaScript content, and `prefers-reduced-motion` paths are supported.
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
The current release checks are in `docs/test-log-2026-10-14-cv-release.md`. Earlier CV implementation and checks are recorded in `docs/test-log-2026-10-11-cv.md`, `docs/test-log-2026-10-12-cv.md` and `docs/test-log-2026-10-12-cv-motion.md`.
The latest earlier motion revision is recorded in `docs/test-log-2026-09-05-motion.md`; the earlier contour correction remains in `docs/test-log-2026-09-05.md`.
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

- Hero: the shared SVG keeps a stable aspect ratio; after the preloaded fonts are ready, it reveals inside a mask with `40 px` extra ink allowance on every edge. Its layout box does not change when the mask is released.
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

- Dependency advisories found during Railway installation are recorded for separate triage in `Bugs.md`; the CV change does not update dependencies.

- Final spacing tokens still need Dmitrii's visual approval; they are intentionally centralized for quick adjustment.
- The English content is a parallel content layer. Figma currently defines Russian desktop/mobile geometry only.
- Figma contains a few legacy fractional radii and one-pixel mobile size differences. The audit and proposed normalized tokens are recorded in `reports/figma-spacing-radius-audit-2026-08-30.md`; they are not silently pushed back into Figma.

## Figma source

- File: `RohXp9xh64xj3NpvNcCe4j`.
- Desktop full frame: `358:434`.
- Mobile full frame: `372:928`.
- Desktop header control group: `601:78` (menu / CV / language); mobile header: `372:929`, hero wrapper `581:13`.
- Desktop menu and language selector: `473:110`, `501:2`, `501:45`.
- Desktop sections: `358:512`, `358:519`, `358:537`, `358:631`, `358:762`, `358:808`, `358:837`, `358:892`, `358:909`.
- Mobile hero/header and sections: `523:123`, `372:935`, `372:952`, `372:1042`, `372:1106`, `372:1136`, `372:1157`, `372:1205`, `530:1050`.
- Mobile menu/language/contact overlays: `530:1051`, `530:1103`, `528:563`.

## CV source and review

- Figma CV: `584:3` desktop, `584:4` mobile; navigation `612:61`, light-state moon `617:107`; checked 2026-10-12.
- CV controls: desktop menu / language / theme at y=64 / 136 / 208 with 8 px gaps. Mobile controls use a horizontal row and reserve 104 px above the logo. The sun switches to light, and the moon switches to dark.
- The summary includes “around 20 years of experience in design” / “около 20 лет опыта в дизайне”; it does not claim 20 years specifically in product design.
- Editable PDF review IDs and the publication procedure: `docs/cv-pdf-review.md`. Validation: `docs/test-log-2026-10-12-cv.md`.
- `src/data/cv.json` is the rendered-content snapshot from these frames. Career evidence remains in the existing career-context registry linked from the parent workspace.
- `/cv` supports EN/RU and dark/light using URL preferences (`?lang=ru&theme=light`); direct `/cv` defaults to English and dark. Switching either preference preserves the other and survives reload, without changing the portfolio’s separate RU/EN preference. JavaScript switches themes and languages in place; direct URL / no-JavaScript paths remain server-rendered.
- Product review: open CV and return through View portfolio and browser Back on desktop/mobile; check stable controls and the logo flight. Open contacts through the avatar, plus language and PDF overlays: centred content, sharp SVG close, no scrolling. Change theme/language and download both formats; verify PDF Contact opens email.
- No database, new secrets or environment variables are required.
