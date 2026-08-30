# Motion map — complete portfolio

Date: 2026-08-30.

| Surface | Motion | Trigger and end state | Mobile | Reduced motion |
|---|---|---|---|---|
| Hero | Logo mask, then role text | Page load; logo opens horizontally, role rises 10 px | Same geometry, shorter visual distance | Immediately visible |
| Section icons | Scale-in, ambient drift, silhouette light | Section entry; exact Figma artwork settles at 1, drifts 1–2 px over 16 s, and brightens in its section colour near a pointer | 180 px artwork; scroll glow variables remain available | Static |
| Display headings | Vertical mask reveal | Each live Joyride heading reveals on its own viewport entry, including Soft Skills | Live text reflows into authored line groups | Immediately visible |
| Body copy | Fade/rise | Each copy group reveals on its own viewport entry; 18 px travel | Same | Immediately visible |
| Repeated cards | Staggered fade/rise | Section entry; 22 px travel with small stagger | Same, natural long scroll | Immediately visible |
| AI cards | Ordered context/tool reveal | Scene entry; context and tools settle in sequence | Mobile order follows the vertical Figma flow | Immediately visible |
| AI connectors | Clip reveal of original Figma SVGs | After cards; complete designed desktop routes become visible. Context's real dashed CSS border gets a masked dashed light | Six local 116 px rows reveal in sequence; each one/two/three-track group shares its grid with the chips | Complete connectors shown |
| Section cards | Responsive border segment | Within 300 px of a fine pointer, a same-colour conic segment follows pointer angle and fades by distance | A shared ScrollTrigger rotates the segment by scroll position with a per-card offset | Static Figma border/inset effect |
| Cursor light | Section-coloured radial follow | Fine pointer; a radial light interpolates toward the pointer and reads the nearest section's heading RGB | Disabled for touch/coarse pointers | Disabled |
| Globe | Directional fixed control | Fixed at desktop/mobile Figma coordinates; hides on down-scroll beyond 40 px, returns on up-scroll, opens a full selector | Same behaviour in the `390 × 68 px` header | Near-instant state |
| Menu | Directional fixed control and overlay | Same scroll logic as globe; opens the live-text menu | Same behaviour in the `390 × 68 px` header | Near-instant state |
| Fixed avatar | Soft scale/glow | Fixed; opens contact overlay | 60 px, bottom/right 14 px | Near-instant state |
| Mobile details | One-way disclosure | Extra text expands/fades in over 720 ms; button follows the new height, fades, then disappears | Mobile only | Text appears and button disappears immediately |

## Timing tokens

- Border glow: `300 px` proximity, `0.075` angle interpolation, `0.055` opacity interpolation, and `0.82` maximum opacity in `requestAnimationFrame`.
- Cursor light: `380 px`, `0.5` maximum opacity, `0.12` position interpolation, and 600 ms enter/exit fade.
- Mobile scroll glow: one ScrollTrigger; angle is `scrollY × 0.22 + cardIndex × 23deg`.
- Details reveal: 720 ms plus 80 ms stagger for multi-paragraph Theme Builders copy, `power3.out`.
- Main reveal: 720–900 ms, GSAP `power3.out`.
- Copy/card stagger: 40–110 ms.
- Ambient drift: 16 seconds, 1–2 px.
- No pinned scrolling, smooth-scroll runtime, or second animation library.

## Figma motion note

`get_motion_context` returned no authored timeline/keyframes for the inspected desktop, mobile, Focus, AI Workflow, Process & AI, and Theme Builders nodes. The production choreography therefore implements Dmitrii's requested behaviour while keeping the exact Figma geometry and artwork.
