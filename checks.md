# Checks

## Technical checks run by the agent

1. `npm ci`
2. `npm run check`
3. `npm run build`
4. `npm run test:smoke`
5. Browser screenshots at `1440x900`, `1024x768`, and `390x844`.
6. Confirm there is no horizontal overflow at those widths.
7. Confirm the menu works with keyboard and Escape.
8. Confirm the reduced-motion emulation leaves all content visible and removes long transforms.
9. Confirm `/api/health` returns HTTP 200 locally and on Railway.
10. Confirm the deployed Railway source matches GitHub `main`.

## Product checks for Dmitrii

1. At desktop width, compare the Hero, Focus icon, heading scale, and AI Workflow cards with Figma.
2. At 390 px, confirm the sequence reads naturally without waiting for animation.
3. Scroll quickly through AI Workflow and confirm the arrows explain the sequence rather than distracting from it.
4. Enable “Reduce motion” in the OS and confirm the site still feels deliberate, not broken.
5. Tune the spacing tokens at the top of `src/styles/global.css`; verify the whole page rhythm changes predictably.
6. Decide whether the next sprint should prioritize Process & AI or Theme Builders.
