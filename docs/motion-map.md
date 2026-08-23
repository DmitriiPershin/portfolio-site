# Motion map — complete portfolio

Date: 2026-08-23.

| Surface | Motion | Trigger and end state | Mobile | Reduced motion |
|---|---|---|---|---|
| Hero | Logo mask, then role text | Page load; logo opens horizontally, role rises 10 px | Same geometry, shorter visual distance | Immediately visible |
| Section icons | Scale-in plus ambient drift | Section entry; exact Figma artwork settles at 1, then drifts 1–2 px over 16 s | 180 px artwork | Static |
| Display headings | Vertical mask reveal | Each heading reveals on its own viewport entry, including Soft Skills | Uses dedicated mobile artwork | Immediately visible |
| Body copy | Fade/rise | Each copy group reveals on its own viewport entry; 18 px travel | Same | Immediately visible |
| Repeated cards | Staggered fade/rise | Section entry; 22 px travel with small stagger | Same, natural long scroll | Immediately visible |
| AI cards | Ordered context/tool reveal | Scene entry; context and tools settle in sequence | Mobile order follows the vertical Figma flow | Immediately visible |
| AI connectors | Clip reveal of original Figma SVGs | After cards; complete designed routes become visible | Dedicated mobile connector group reveals top-to-bottom | Complete connectors shown |
| Section cards | Cursor-proximity border segment | Within 160 px of a fine pointer; conic segment follows pointer angle and fades by distance without changing base Figma styling | Disabled on touch | Static Figma border/inset effect |
| Fixed globe | Hover glow and scroll exit | Fixed initially; fades/scales out after 40 px scroll | Fixed left at 24 px | State change remains near-instant |
| Fixed menu | Soft scale and line morph | Viewport-fixed, transparent, no shadow; opens full overlay and morphs into close | Fixed right at 24 px | Near-instant state |
| Fixed avatar | Soft scale/glow | Fixed; opens contact overlay | 60 px, bottom/right 14 px | Near-instant state |
| Mobile details | Disclosure | Button toggles detailed text and refreshes scroll geometry | Mobile only | Near-instant state |

## Timing tokens

- Border-glow fade: 420 ms, `cubic-bezier(0.37, 0, 0.67, 1)`; pointer angle updates in `requestAnimationFrame`.
- Main reveal: 720–900 ms, GSAP `power3.out`.
- Copy/card stagger: 40–110 ms.
- Ambient drift: 16 seconds, 1–2 px.
- No pinned scrolling, smooth-scroll runtime, or second animation library.

## Figma motion note

`get_motion_context` returned no authored timeline/keyframes for the inspected desktop, mobile, Focus, and AI Workflow nodes. The production choreography therefore implements Dmitrii's requested behaviour while keeping the exact Figma geometry and artwork.
