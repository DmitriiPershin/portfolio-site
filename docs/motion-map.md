# Motion map — complete portfolio

Date: 2026-09-05.

| Surface | Motion | Trigger and end state | Mobile | Reduced motion |
|---|---|---|---|---|
| Hero | Padded logo mask, then role text | After fonts settle; logo opens horizontally with 40 px ink allowance, role rises 10 px | Same stable geometry | Visible after fonts settle |
| Section icons | Scale-in, ambient drift, silhouette light | Section entry; exact Figma artwork settles at 1, drifts 1–2 px over 16 s, and brightens in its section colour near a pointer | 180 px artwork; scroll glow variables remain available | Static |
| Display headings | Vertical mask reveal | Each live Joyride heading reveals on its own viewport entry, including Soft Skills | Live text reflows into authored line groups | Immediately visible |
| Body copy | Fade/rise | Each copy group reveals on its own viewport entry; 18 px travel | Same | Immediately visible |
| Repeated cards | Staggered fade/rise | Section entry; 22 px travel with small stagger | Same, natural long scroll | Immediately visible |
| AI cards | Ordered context/tool reveal | Scene entry; context and tools settle in sequence | Mobile order follows the vertical Figma flow | Immediately visible |
| AI connectors | Clip reveal of original Figma SVGs | After cards; complete designed desktop routes appear, including live RU/EN text inside the original chips | Six local 116 px rows reveal in sequence | Complete connectors shown |
| Section cards and icon frames | One contour, restored conic light | Within 340 px of a fine pointer, the previous conic highlight rotates above static authored paint inside ONE ordinary rounded mask; the contour never moves | A shared ScrollTrigger rotates the light with individual phases | Static Figma gradient/inset effect |
| Cursor light | Section-coloured radial follow | Fine pointer; faster position response; colour updates on pointer movement AND scroll, with cached section geometry | Disabled for touch/coarse pointers | Disabled |
| Native scrollbar | Section colour | Uses the section at 40% viewport height as the reading position; scrollbar visibility remains controlled by the browser/OS | Native browser behaviour | Colour stays available |
| Menu/language labels | Live type crossfade | Outline → Regular faces overlap in a stable grid; intensity follows the same smoothing as borders; full control opacity | Both faces retain mobile LINE Seed JP | Immediate state |
| Globe | Directional fixed control | Fixed at desktop/mobile Figma coordinates; hides on down-scroll beyond 40 px, returns on up-scroll, opens a full selector | Same behaviour in the `390 × 68 px` header | Near-instant state |
| Menu | Directional fixed control and overlay | Same scroll logic as globe; opens the live-text menu | Same behaviour in the `390 × 68 px` header | Near-instant state |
| Fixed avatar | Soft scale/glow | Fixed; opens contact overlay; opaque black ring/portrait backing | 60 px, bottom/right 14 px | Near-instant state |
| Numeric metrics | Per-digit ribbon counter | First viewport entry; each digit makes one full `0–9` pass and settles on the authored value | Same motion with mobile type metrics | Final value immediately visible |
| Mobile details | One-way disclosure | Extra text expands/fades in over 720 ms; button follows the new height, fades, then disappears | Mobile only | Text appears and button disappears immediately |

## Timing tokens

- Border glow: `340 px` proximity, `0.055` angle interpolation, `0.04` intensity interpolation, and `0.9` maximum intensity. Time-normalized against 60 Hz. The old conic profile is restored inside the same mask as the authored gradient, not on a second contour. Exact icon artwork stays at its original size; its baked outer rim is clipped and replaced by that one animated mask.
- Menu and language type crossfade: the same `0.04` intensity interpolation, time-normalized against 60 Hz; snap within `0.002` of the end state. Control opacity remains 1.
- Cursor light: `266 px`, `0.45` maximum opacity, `0.32` time-normalized position interpolation, and 600 ms enter/exit fade. Scroll snaps to the current screen-space pointer and updates section colour even without pointer movement.
- Border start angles: deterministic `cardIndex × 137.5deg` golden-angle offsets on desktop and mobile, preventing repeated cards from moving in lockstep.
- Mobile scroll glow: one ScrollTrigger; angle is `scrollY × 0.22 + cardIndex × 137.5deg`.
- Numeric ribbons: `0.9 s` (only Theme `250`: `1.8 s`), `cubic-bezier(0.22, 1, 0.36, 1)`, and `45 ms` per-digit stagger; final DOM text remains available to assistive technology.
- Details reveal: 720 ms plus 80 ms stagger for multi-paragraph Theme Builders copy, `power3.out`.
- Main reveal: 720–900 ms, GSAP `power3.out`.
- Copy/card stagger: 40–110 ms.
- Ambient drift: 16 seconds, 1–2 px.
- No pinned scrolling, smooth-scroll runtime, or second animation library.

## Figma motion note

`get_motion_context` returned no authored timeline/keyframes for the inspected desktop, mobile, Focus, AI Workflow, Process & AI, and Theme Builders nodes. The production choreography therefore implements Dmitrii's requested behaviour. The latest explicit geometry override removes corner smoothing but keeps the numeric Figma radii, dimensions and artwork.
