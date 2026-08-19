# Motion map — sprint 1

Date: 2026-08-19.

| Section | Element | Purpose | Trigger and end state | Mobile | Reduced motion | Risk |
|---|---|---|---|---|---|---|
| Hero | Logo artwork | Establish the visual identity without a generic fade | Page load; horizontal mask opens and settles at full opacity | Shorter distance and duration | Immediately visible | Low |
| Hero | Role text | Clarify the role after the name is read | Follows logo by 120 ms; rises 12 px | Same | Immediately visible | Low |
| Focus | Shader-like icon | Introduce the section as a living system | Viewport entry; scale 0.96 → 1, then very slow 3–4 px drift | Drift amplitude halved | Static final state | Low |
| Focus | Display heading and copy | Preserve reading order | Viewport entry; heading mask, then headline/body stagger | Body only follows heading; desktop headline is intentionally absent in Figma mobile | Static final state | Low |
| AI Workflow | Icon and heading | Announce the main story | Viewport entry; icon, heading, supporting headline | Same, shorter | Static final state | Low |
| AI Workflow | Context inputs | Show information gathering | Context card enters, then four inputs stagger by 60 ms | 2×2 input grid | All visible | Medium |
| AI Workflow | Tool cards | Explain the production sequence | Each card reveals once as it reaches the viewport | Natural long scroll, no pinning | All visible | Medium |
| AI Workflow | Connector arrows | Make causality explicit | Each path draws toward the newly revealed card | Vertical paths between cards | Full lines shown | Medium |
| AI Workflow | Card borders | Give subtle system feedback | Border glow breathes once on reveal; small hover response | No hover dependency | Static border | Low |

## Tokens

- Fast UI: 160 ms.
- UI state: 240 ms.
- Reveal: 600 ms.
- Reveal distance: 12–32 px.
- Stagger: 40–70 ms.
- Ambient drift: 10–14 seconds, 3–6 px amplitude.
- Main reveal ease: `power3.out`.
- No pinned scene in sprint 1.
