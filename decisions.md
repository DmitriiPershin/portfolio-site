# Decisions

### 2026-08-19 - Validate a three-section production slice first

What we decided:

Build Hero, Focus, and AI Workflow before the rest of the long portfolio.

Why:

These sections validate the typography, shader-like icons, section rhythm, responsive strategy, and the most complex scroll narrative at a much lower rework cost.

How it worked before:

The workspace contained a historical static prototype that did not match the current Figma art direction.

What this changes:

`portfolio-site/` is the production codebase; `designer/site/` remains historical reference material.

### 2026-08-19 - Use tokenized spacing and one motion runtime

What we decided:

All important gaps and animation values live in CSS custom properties. GSAP/ScrollTrigger handles scroll choreography; CSS handles small continuous movement and hover/focus.

Why:

The Figma spacing is still being refined, and mixing multiple motion libraries would make timing and cleanup harder to control.

How it worked before:

Spacing was encoded per block in the prototype and there was no shared motion system.

What this changes:

Section spacing can be tuned from one token block, and reduced-motion behavior is consistent.

### 2026-08-19 - Do not publish Joyride font binaries

What we decided:

Use Figma-exported artwork for Joyride display typography and keep accessible text in the DOM.

Why:

The available Joyride files are desktop-font files and no webfont license or webfont kit is present. LINE Seed JP is safe to self-host under OFL.

How it worked before:

Figma Desktop used the locally installed Joyride font.

What this changes:

The deployed site preserves the intended display forms without redistributing the font software.

### 2026-08-20 - Use exact Figma exports for signature visuals

What we decided:

Section icons, display headings, AI Workflow connectors, project imagery, and the avatar use local exports from their exact Figma nodes.

Why:

The Focus icon and generated AI arrows changed the character and geometry of Dmitrii's design. These are signature assets, not generic decorations.

What this changes:

Animation affects containers, masks, and reveal state without redrawing the artwork. Runtime code never depends on expiring Figma URLs.

### 2026-08-20 - Keep Russian and English in one geometry

What we decided:

Render both languages in the DOM, switch them with a fixed globe control, and persist the choice locally.

Why:

Figma defines Russian desktop/mobile frames but the site needs immediate language switching without duplicating every component.

What this changes:

Russian remains the default source layout. English uses the same responsive system and can receive a dedicated copy/line-break pass later without changing component structure.

### 2026-08-20 - Use quiet, section-coloured hover motion

What we decided:

Every interactive card uses a pointer-positioned gradient, its Figma border colour, an inset glow, and at most a 0.6% scale response.

Why:

The portfolio needs visible hover feedback while Dmitrii requested ultra-smooth, nearly imperceptible movement.

What this changes:

Hover feedback is consistent but keeps the purple, blue, green, orange, pink, and sky section identities.

### 2026-08-24 - Keep responsive signature art as separate Figma exports

What we decided:

Use distinct desktop and mobile exports when Figma authors a materially different icon crop instead of scaling one oversized bitmap across breakpoints.

Why:

Theme Builder's desktop artwork bleeds far outside its `300 × 300 px` clip, while mobile defines a separate `180 × 180 px` orange composition. Scaling the desktop export changed both apparent size and colour balance.

What this changes:

The component keeps one semantic icon but its `<picture>` source follows the matching Figma breakpoint. The same rule applies to future signature art with breakpoint-specific composition.

### 2026-08-24 - Tokenize subtle pointer motion independently from layout

What we decided:

Keep the card-border highlight and ambient cursor light as independent, CSS-tokenized layers.

Why:

The border needs slow local feedback while the ambient light should remain faint across empty page areas. Coupling them would make tuning one effect alter the other or the authored card styles.

What this changes:

Radius, opacity, and interpolation live in the root token block; touch and reduced-motion modes remove the ambient cursor layer and retain static Figma geometry.

### 2026-08-28 - Keep Workflow routes as exact SVG groups

What we decided:

Each desktop AI Workflow transition is one local transparent SVG exported from its current Figma group, including arrow, chip, dash, gradient, and shadow.

Why:

PNG route screenshots became soft after scaling and their alpha-filter bounds drifted away from the cards. Reconstructing the routes from separate DOM layers repeated the same positioning problem.

What this changes:

Cards and icons remain semantic DOM, while connector geometry is treated as authored artwork. Route changes start in Figma and are re-exported as SVG.

### 2026-08-28 - Limit desktop floating controls by content context

What we decided:

Keep menu and language fixed during the introduction, then hide both as soon as the Hard Skills artwork enters. Hide the avatar when the final contacts are visible. Mobile navigation continues to scroll with the document.

Why:

Permanent navigation competes with long-form portfolio content, but immediate document scrolling removes it before the introductory scan is complete. The final avatar also covered the contact surface it was meant to expose.

What this changes:

Visibility is derived from section geometry, not arbitrary scroll pixels, so later spacing changes do not invalidate the behaviour.

### 2026-08-30 - Use the supplied Joyride files for live signature typography

What we decided:

Self-host and preload the Joyride Extended, Outline, Regular, and WIDE faces supplied by Dmitrii. Hero/logo, section headings, overlays, closing copy, and numeric metrics are live text.

Why:

The prior static exports were crisp but not selectable, made responsive typography brittle, and prevented the authored font-state hover. Dmitrii explicitly supplied the font files for this portfolio.

What this supersedes:

This replaces the 2026-08-19 decision to keep Joyride image-based. Reuse outside this repository still needs an independent licence check.

### 2026-08-30 - Hide navigation by scroll direction on every breakpoint

What we decided:

Keep menu and language controls fixed in their Figma positions. Once the page is beyond `40 px`, hide them while scrolling down and restore them while scrolling up, on desktop and mobile.

Why:

The controls should not compete with long-form content, but section-based hiding made them unavailable when a visitor deliberately reversed direction.

What this supersedes:

This replaces the 2026-08-28 Hard-Skills visibility rule and the document-positioned mobile header.

### 2026-08-30 - Animate authored border geometry, not replacement outlines

Deprecated by the 2026-09-05 single-contour decision below: two coincident outlines still produced different corners.

What we decided:

Keep each section's base border as authored. Solid/gradient cards receive a masked conic segment on the same radius; AI Context uses a second dashed segment with the identical `2 px / 4 4` geometry. Icon highlights reuse the exact icon artwork rather than adding a rectangular glow backing.

Why:

A generic solid overlay changed dash patterns, radii, and icon silhouettes. The motion must amplify the designed contour, not introduce another one.

### 2026-08-31 - Use deterministic varied border phases

What we decided:

Start every repeated card and icon highlight at a `137.5deg` golden-angle offset, then let desktop proximity or mobile scroll advance the same authored contour.

Why:

Identical start angles made chip grids read as one synchronized effect. True randomness would make screenshots, tests, and revisits inconsistent; the golden-angle sequence creates visual variation without nondeterminism.

### 2026-08-31 - Use one-revolution digit ribbons for numeric metrics

What we decided:

Render Theme Builders and Interfaces values as accessible live Joyride text, with each digit travelling through one complete `0–9` ribbon on first viewport entry. Use the PremiumExchanger reference timing: `0.9 s`, `cubic-bezier(0.22, 1, 0.36, 1)`, and `45 ms` digit stagger.

Why:

A whole-number tween changes glyphs abruptly and loses the mechanical counter character. Per-digit ribbons preserve the exact font, make the motion legible, and still expose the final value immediately for reduced motion, no JavaScript, and assistive technology.

### 2026-09-05 - One contour owns border paint and motion

Partially superseded by the motion revision below: keep one contour, replace corner smoothing and the rotating linear-gradient treatment.

Decision: replace the static-plus-highlight construction with one SVG path per card, including Context's dashes. Generate smooth corners from the authored radius using `figma-squircle` (geometry only, not a motion runtime). Animate only the gradient. Icon exports keep their existing contour without another ring. See the raw-property evidence in `reports/figma-border-audit-2026-09-05.md`.

Reason: matching CSS radii on two layers did not reproduce Figma's 100% corner smoothing and exposed doubled corners. Generated design context also flattened actual gradients into solid colours.

Decision: translate the three desktop route labels inside their existing SVG chips. Preserve arrow/chip geometry and never layer a second localization chip over outlined Russian text.

Decision: only the `250` ribbon slows to `1.8 s`; the prior `0.9 s` decision still applies to Interfaces. Menu hover remains fully opaque and desktop navigation scales together to fit all entries. Mobile header edges share the logo width, and skill rows fill the container.

### 2026-09-05 - Motion revision: ordinary corners and the previous light response

Decision, requested by Dmitrii: keep the existing numeric radii but remove Figma corner smoothing. Restore the earlier conic highlight movement without restoring two outlines: base paint and moving light share one rounded mask, including Context's dashes. Remove the now-unused squircle geometry dependency.

Decision: restore app/Process icon-frame light. Keep original asset bytes, scale and glyphs; clip their baked outer contour and render one animated ordinary-radius replacement, with no added icon backing. The decorative section illustrations remain untouched.

Decision: menu and language use identical live-text Outline→Regular crossfades at full control opacity. Their intensity response is the same exponential interpolation as card light (0.04 at60 Hz), normalized for refresh rate; border angle response stays0.055.

Decision: interpret “scroll in the section colour” as the native scrollbar. Its colour follows the section at40% viewport height; cursor colour independently follows the section at its screen Y. Update both on scrolling/resize and keep cursor position responsive. Give avatar rings an opaque black backing. No Figma source nodes were modified.

### 2026-10-11 - Publish edited CV independently of PDF approval

Decision: add `/cv`. The original ninth menu entry was superseded by the authored header navigation below. Use actual visible copy from Figma `584:3` and `584:4`; do not restore removed team-summary or contact-list blocks. Keep correct mail/portfolio/download destinations even where Figma's footer instances retain stale hyperlinks.

Decision: use the exact exported CV SVG for the CV page and final transition state; preserve the existing live Joyride hero at the start. GSAP remains the only animation runtime. Honour modified clicks, no JavaScript, reduced motion, direct URL visits and browser Back.

Constraint: Dmitrii requested PDF approval before publishing its download. Keep review versions in the current Codex task workspace outside GitHub and Railway uploads. Keep Download PDF disabled until approval; no fake URL and no stale CV attachment.

Decision: PDF uses the vector logo once, no repeated page-2 header or page numbers, dividers before purple section headings, and Contact / Portfolio at the end as well as beneath the introduction. This is a layout decision, not approval to publish the file.

### 2026-10-11 - Follow the updated main-header navigation

Decision, requested by Dmitrii: implement Figma page `358:433`, desktop group `601:78` and mobile header `372:929` / wrapper `581:13`. Desktop stacks menu, CV and globe with 4 px gaps. Mobile centres CV between globe and menu with 12 px outer gutters, and moves Senior Product Designer beneath the logo. Keep eight section-menu links.

Decision: the same direct CV anchor serves native no-JavaScript navigation; remove the separate fallback shortcut. Preserve the existing GSAP logo transition, directional scroll visibility and overlay behavior. PDF download remains disabled pending explicit approval.

### 2026-10-12 - Shared CV/PDF layout, language and themes

Decision, requested by Dmitrii: add EN/RU and dark/light CV controls matching Figma 612:61; default to dark, with sun as the action to switch to light and moon (617:107) to switch to dark. Preferences live in the URL and preserve each other. On mobile use a horizontal control row above the logo to prevent overlap.

Decision: replace the separate two-page PDF layout with the same `/cv` content and CSS. Each export is one continuous page, Desktop 1440 px or Mobile 390 px, for screen reading. Preserve contact/portfolio/project links; remove only download controls and interactive navigation. An explicit Desktop PDF / Mobile PDF dialog selects the format; theme/language are inherited. No automatic device detection.

Constraint: create editable review layouts in the existing Figma CV page before publishing files. Eight language/theme/format combinations are review candidates, not approved downloads. The approval manifest remains false, format buttons disabled, and local PDF files outside the repository. See docs/cv-pdf-review.md.

Decision: state “around 20 years of experience in design” in the introductory summary, including Russian translation. Do not round to 25 or claim 20 years of product-specific experience.

### 2026-10-12 - Refine CV interaction and use one logo

Decision, requested by Dmitrii: replace CV’s small menu/language dialogs with the same full-screen overlays and shared opening/closing, menu fitting and live-text hover code as the portfolio. Keep the dedicated Desktop PDF / Mobile PDF dialog and publication approval gate.

Decision: interpolate theme background/text/accent in place over 720 ms, with a soft sun/moon change; update the URL and PDF theme selection without reloading. Update language content in place from the server-rendered CV, preserving theme and reading position. Abort superseded language requests and keep native navigation as a fetch-failure/no-JavaScript fallback.

Decision: use public/assets/cv-wordmark.svg for both the hero and CV and only one image in the transition layer. Scale uniformly over 1040 ms; no replacement glyphs, opacity handoff or second target logo. Destination geometry must match the final SVG within one pixel. This explicitly supersedes the live-text requirement for the hero wordmark only; section headings, overlays and metrics retain live Joyride.

### 2026-10-14 - Exact supplied logo, stable reverse navigation and published PDFs

Decision, explicit user request: replace both wordmarks with unchanged bytes from Downloads/Group 3.svg (951×214). Use one uniformly scaled SVG for entry, View portfolio return and browser Back. Preserve portfolio toolbar slots: desktop menu64/theme-or-CV132/globe200; mobile globe/theme-or-CV/menu. This supersedes the previous CV toolbar spacing.

Decision: language and PDF choices are centred fullscreen overlays with sharp vector closes, scroll locking and shared keyboard focus behaviour. Contact uses the same Nice to meet you overlay on both website routes, but retains mailto in PDF. Contact → Download PDF → View portfolio is the order in both action rows and exports. A small mobile contact layout must fit email and the three-line title.

Resolved constraint: user explicitly authorized generating and publishing all PDFs; earlier approval gates dated 2026-10-11/12 are superseded. Eight exported files are public assets with measured metadata/hashes in src/data/cv-pdf-manifest.json. Desktop/Mobile format selection is explicit; selected language/theme determines the download. PDF Download links target the same public variant. Existing Figma review frames predate this supplied SVG/action change; the shared website source is the current export source.
