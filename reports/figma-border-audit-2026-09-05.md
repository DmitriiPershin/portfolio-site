# Border audit — raw Figma properties

Checked: 2026-09-05. Source: `RohXp9xh64xj3NpvNcCe4j`, read-only Plugin API inspection. No Figma nodes were changed.

## Fact: generated design context omitted material styling

Generated context described Hard Skills and Process borders as solid. Actual visible `strokes` are linear gradients. It also omitted `cornerSmoothing: 1` and some inner-shadow spread values. The source layer data and screenshot take precedence over generated CSS. Historical reports of “restored solid Figma border” were incorrect.

| Family / checked nodes | Width; radius; smoothing | Visible inner shadow |
|---|---|---|
| Hard Skills `358:558`, `372:972` | 1 px; 26 px; 100% | #765592 / 60%, blur60, spread−17.68 |
| Soft Skills `372:1030`, `372:1032`, `372:1040` | 1 px; 26 px; 100% | #765592 / 60%, blur60, spread−17.68 |
| Context `358:649` | 2 px dashed4/4; 85.0555 px; 100% | None (all listed effects hidden) |
| Desktop tool `358:686` | 2 px; 85.0555 px; 100% | #4058f4 / 30%, blur160, spread5.31597 |
| Process `358:788`, `358:781` | 1 px; 80 px; 100% | #35bf27 / 40%, blur60, spread5.31597 |
| Mobile Process `372:1124`, `372:1128`, `372:1132` | 1 px; 26 px; 100% | #35bf27 / 40%, blur60, spread5.31597 |

Fact: Skills use #765592 stops at `0/1`, `.228167787/.1`, `.4742558/.627451`, `.66751188/.367585748`, `1/1` (position/alpha).

Fact: Context/tool gradient: #4058f4 at0/1; #a0acfb at.228167787/.1 and.4742558/0; #4058f4 at1/1.

Fact: Process gradient: #35bf27 at0/1; RGB(176.266,254.573,189.317) at.228167787/.1; RGB(114.633,222.787,114.159) at.4742558/0; #35bf27 at1/1. Its transparent interval is intentional; a uniform green ring is wrong.

Fact: these inspected gradients share transform `[[.4895232618,.6969469786,-.1156727895],[-.779302001,.6678535938,.5921934843]]`. The implementation preserves the equivalent normalized gradient line and rotates its paint for the requested motion.

Original implementation decision (superseded for motion/corners): one smoothed SVG contour owned the stroke and animation. After reviewing it, Dmitrii explicitly requested ordinary circular corners at the same radius numbers and the previous conic light. The current single-mask treatment is defined in `decisions.md`; this report remains source evidence, not authority to reintroduce corner smoothing.

Open: final perceptual approval of hover intensity and corner rendering belongs to Dmitrii. Radius normalization proposed in the earlier spacing audit remains a separate source-design decision; this task did not normalize Figma values.
