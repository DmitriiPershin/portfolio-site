# Figma spacing and radius audit

Date checked: 2026-08-30  
Source: Figma file `RohXp9xh64xj3NpvNcCe4j`  
Frames: desktop `358:434`, mobile `372:928`, overlays `473:110`, `501:2`, `528:563`, `530:1051`, `530:1103`

## Short conclusion

The layout is not randomly inconsistent. It already has a usable semantic system, but it is obscured by legacy fractional values and a few one-pixel differences. Forcing one radius or one gap everywhere would be a weak solution: chips, process cards, workflow capsules, and large context containers are different component families.

The right cleanup is to normalize values inside each family and leave decorative icon geometry alone.

## Facts: spacing system already present

### Desktop

| Role | Current recurring value | Recommendation |
|---|---:|---|
| Page side position | `135.5 px` visual content origin in the 1440 frame | Keep as centered `1169 px` content, not as a reusable half-pixel token |
| Major section gap | `200 px` | Keep |
| Icon / heading / content rhythm | `72 px` | Keep |
| Heading / supporting copy | `28 px` | Keep |
| Process card gap | `20 px` | Keep as dense-card gap |
| Repeated chip/card gap | `12 px`, `40 px` | Keep both as small and large collection gaps |

### Mobile

| Role | Current recurring value | Recommendation |
|---|---:|---|
| Page gutter | `24 px` | Keep |
| Major section gap | `120 px` | Keep |
| Default section internal gap | `24 px` | Keep |
| Skills / closing internal gap | `40 px` | Keep as an explicit spacious variant |
| Dense rows | `8 px`, `12 px`, `16 px`, `20 px` | Keep as semantic steps, not arbitrary exceptions |

Recommended spacing scale for implementation: `8, 12, 16, 20, 24, 28, 40, 72, 120, 200`.

## Facts: radius families

### Desktop

| Family | Figma values | Normalize to |
|---|---:|---:|
| Chips and small metric cards | `26 px` | `26 px` |
| App/process icon frames | `39 px` | `39 px` |
| Workflow client inputs | `30.389 px` | `30 px` |
| Theme primary metric | `44 px` | `44 px` |
| Process cards | `80 px` | `80 px` |
| Workflow context/tool cards | `85.0555 px` | `85 px` |

### Mobile

| Family | Figma values | Normalize to |
|---|---:|---:|
| Chips, metrics, Process, platform cards | `26 px` | `26 px` |
| Workflow app icon frames | `12 px` | `12 px` |
| Workflow inputs | `24 px` | `24 px` |
| AI Context | `44 px` | `44 px` |
| Workflow tool pills | `104 px` | `104 px` |

## Real inconsistencies worth fixing in Figma

1. `85.0555 px` and `30.389 px` are legacy calculated values, not meaningful design decisions. Round them to `85 px` and `30 px` in the source components.
2. Mobile workflow inputs contain `95/97 px` source-height variants around a visually intended `96 px`. Normalize the component to `96 px`; let content align internally.
3. Mobile contact/platform surfaces contain `341.516/342 px` width variants. Normalize layout components to `342 px`.
4. Several desktop and mobile frame coordinates contain `.5` or long decimals because parent frames were scaled. Do not turn those coordinates into spacing tokens; center the fixed-width content frame instead.
5. Process card heights differ (`438/438/374 px` desktop and `420/448/448 px` mobile). This is content-driven, not a radius bug. In code, use the Figma values as `min-height` where translated copy can grow.

## Differences that should remain

- Workflow pills at `104 px` are intentionally elliptical. Converting them to `26 px` cards would destroy the visual language.
- Process at `80 px`, Workflow at `85 px`, and AI Context mobile at `44 px` belong to separate families.
- Decorative artwork contains many fractional internal radii. Those values describe the raster/vector illustration, not UI layout. Do not normalize them.
- Soft Skills and `THANK` use Joyride WIDE with a `2 px` text stroke. They are not the same treatment as Joyride Outline used in menu/contact text.
- Desktop and mobile can use different compositions when Figma does; scaling one version is not a token system.

## Decision proposed, not applied to Figma

**Open:** normalize the source design components to the semantic radius and spacing scales above. The production code already uses the normalized layout values where rounding does not change the composition. No Figma nodes were edited during this audit.

Suggested next Figma pass:

1. Create radius variables: `r12`, `r24`, `r26`, `r30`, `r39`, `r44`, `r80`, `r85`, `r104`.
2. Create spacing variables: `s8`, `s12`, `s16`, `s20`, `s24`, `s28`, `s40`, `s72`, `s120`, `s200`.
3. Bind only layout components; leave decorative icon vectors unbound.
4. Recheck translated English copy after binding min-heights instead of fixed heights.
