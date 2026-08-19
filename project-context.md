# Project context

## Purpose

A production portfolio for Dmitrii Pershin, a senior product designer focused on white-label systems, AI-assisted design production, and complex fintech interfaces.

## Audience

Hiring managers, design leaders, founders, and product teams evaluating senior product/system design work.

## Current scope

The first production slice implements three Russian-language sections from Figma:

1. Hero.
2. Focus.
3. AI Workflow.

The slice is intentionally used to validate visual fidelity, responsive behavior, spacing tokens, and the motion direction before building the remaining sections.

## Design source

- Figma file: `RohXp9xh64xj3NpvNcCe4j`.
- Desktop frame: `358:434`.
- Mobile frame: `372:928`.
- Implemented desktop nodes: `358:512`, `358:519`, `358:631`.
- Implemented mobile nodes: `372:932`, `372:935`, `372:1042`.

## Constraints

- Astro + TypeScript.
- CSS for layout, hover/focus, and ambient motion.
- GSAP + ScrollTrigger as the only animation library.
- No React, smooth-scroll library, WebGL, or second animation runtime in this slice.
- Essential content is visible without JavaScript.
- `prefers-reduced-motion` disables transforms, drawing, and ambient drift.
- Joyride is represented by exported Figma artwork; the locally installed desktop font is not redistributed as a webfont.
- LINE Seed JP is distributed under SIL OFL 1.1 and is self-hosted.
