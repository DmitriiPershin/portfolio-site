# Shared motion system

Decision,2026-10-14: portfolio and CV use the same semantic motion families through `motion-tokens.ts`. CSS owns durations/easings/distances; GSAP owns application and ScrollTrigger. Do not add per-page curves or ad hoc durations.

| Family | Token / curve | Use |
|---|---|---|
| Content entry | `--motion-reveal-duration`1000ms,`--motion-ease-reveal`power3.out | Portfolio copy/headings/cards; CV role/profile/jobs/practice/footer |
| Hero mask | `--motion-hero-duration`1100ms; same reveal curve | Initial portfolio SVG reveal; role overlaps by550ms |
| Route | `--motion-route-duration`1040ms,`--motion-ease-route`power3.inOut | One SVG desktop logo flight; no mobile flight |
| Theme | `--motion-theme-duration`720ms,`--motion-ease-change`sine.inOut | Background/text/accent interpolation; icon changes opacity only |
| UI | `--motion-ui-duration`240ms; CSS`--ease-ui` | Shared CV action hover; theme-icon alpha |
| Overlay | `--motion-overlay-duration`550ms; CSS`--ease-ui` | Header/overlay/contact response |
| Workflow | `--motion-workflow-duration`720ms / input400ms; reveal curve | Existing staged portfolio diagram |

Staggers: reveal110ms,flow80ms,chip40ms. Existing counters and continuous border/cursor smoothing retain their authored tokens because they encode reading/feedback behaviour rather than entry transitions. Change their canonical CSS tokens, not runtime literals.

CV content is always in HTML. Full motion fades/translates elements as they enter88% of viewport; above-viewport content and existing visible content after a language change remain readable. Reduced motion and PDF render all content immediately. PDFs omit navigation/avatar and Download PDF, preserving vector/selectable content and Contact/mail links.

Both routes use `SiteHeader.astro` and `AvatarButton.astro`. Desktop menu/CV/language occupy64/132/200px; CV theme occupies268px. Mobile header is absolute in the document (scrolls away); avatar remains fixed. Mobile logo is viewport minus48px,at y80px,with original951:214 ratio on both routes. Desktop gutter reservation avoids scrollbar-induced layout shifts. Light burger stroke ink uses a-5px optical offset to align with the exported dark SVG, independently of the unchanged64px control box.

Return to portfolio replays `revealHeroRole()` with the same entry settings. Desktop logo flight remains; phone changes routes natively with identical SVG bounds. Modifier clicks,reduced motion,no-JavaScript links remain native.
