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
