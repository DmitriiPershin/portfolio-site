# Project context

## Purpose

A production portfolio for Dmitrii Pershin, a senior product designer focused on white-label systems, AI-assisted design production, and complex fintech interfaces.

## Audience

Hiring managers, design leaders, founders, and product teams evaluating senior product/system design work.

## Current scope

The full Russian desktop and mobile portfolio is implemented, with an English content layer:

1. Hero.
2. Focus.
3. Hard Skills and Soft Skills.
4. AI Workflow.
5. Process & AI.
6. Theme Builders.
7. Interfaces.
8. Pet Project.
9. Closing and contact.

## Design source

- Figma file: `RohXp9xh64xj3NpvNcCe4j`.
- Desktop frame: `358:434`.
- Mobile frame: `372:928`.
- Section node IDs are recorded in `README.md` and on the matching DOM sections.

## Constraints

- Astro + TypeScript.
- CSS for layout, hover/focus, and ambient motion.
- GSAP + ScrollTrigger as the only animation runtime.
- No React, smooth-scroll library, WebGL, or second motion library.
- Essential content is visible without JavaScript.
- `prefers-reduced-motion` disables reveals and ambient drift while preserving layout and connector geometry.
- Joyride is represented by exported Figma artwork; desktop font binaries are not redistributed.
- LINE Seed JP is self-hosted under SIL OFL 1.1.
- No database is required.
- GitHub `main` is the deployment source for Railway.
