# Motion map — complete portfolio

Date: 2026-08-20.

| Surface | Motion | Trigger and end state | Mobile | Reduced motion |
|---|---|---|---|---|
| Hero | Logo mask, then role text | Page load; logo opens horizontally, role rises 10 px | Same geometry, shorter visual distance | Immediately visible |
| Section icons | Scale-in plus ambient drift | Section entry; exact Figma artwork settles at 1, then drifts 1–2 px over 16 s | 180 px artwork | Static |
| Display headings | Vertical mask reveal | Follows icon on section entry | Uses dedicated mobile artwork | Immediately visible |
| Body copy | Ordered fade/rise | Follows heading; 18 px travel | Same | Immediately visible |
| Repeated cards | Staggered fade/rise | Section entry; 22 px travel with small stagger | Same, natural long scroll | Immediately visible |
| AI cards | Ordered context/tool reveal | Scene entry; context and tools settle in sequence | Mobile order follows the vertical Figma flow | Immediately visible |
| AI connectors | Clip reveal of original Figma SVGs | After cards; complete designed routes become visible | Dedicated mobile connector group reveals top-to-bottom | Complete connectors shown |
| Section cards | Pointer-positioned radial glow | Hover/focus; gradient follows pointer with 1 s easing and 0.6% scale | No hover dependency | Static border/glow |
| Fixed globe | Hover glow and scroll exit | Fixed initially; fades/scales out after 40 px scroll | Fixed left at 24 px | State change remains near-instant |
| Fixed menu | Soft scale/glow and line morph | Fixed; opens full overlay, lines morph into close | Fixed right at 24 px | Near-instant state |
| Fixed avatar | Soft scale/glow | Fixed; opens contact overlay | 60 px, bottom/right 14 px | Near-instant state |
| Mobile details | Disclosure | Button toggles detailed text and refreshes scroll geometry | Mobile only | Near-instant state |

## Timing tokens

- UI/hover response: 700–1000 ms, `cubic-bezier(0.16, 1, 0.3, 1)`.
- Main reveal: 720–900 ms, GSAP `power3.out`.
- Copy/card stagger: 40–110 ms.
- Ambient drift: 16 seconds, 1–2 px.
- No pinned scrolling, smooth-scroll runtime, or second animation library.

## Figma motion note

`get_motion_context` returned no authored timeline/keyframes for the inspected desktop, mobile, Focus, and AI Workflow nodes. The production choreography therefore implements Dmitrii's requested behaviour while keeping the exact Figma geometry and artwork.
