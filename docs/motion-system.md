# Shared motion system

Decision,2026-10-14: portfolio and CV use the same semantic motion families through `motion-tokens.ts`. CSS owns durations/easings/distances; GSAP owns application and ScrollTrigger. Do not add per-page curves or ad hoc durations.

| Family | Token / curve | Use |
|---|---|---|
| Content entry | `--motion-reveal-duration`1000ms,`--motion-ease-reveal`power3.out | Portfolio copy/headings/cards; CV role/profile/jobs/practice/footer |
| Hero mask | `--motion-hero-duration`1100ms; same reveal curve | Initial portfolio SVG reveal; role overlaps by550ms |
| Route | `--motion-route-duration`1040ms,`--motion-ease-route`power3.inOut | One SVG desktop logo flight; no mobile flight |
| Theme | `--motion-theme-duration`720ms,`--motion-ease-change`sine.inOut | Background/text/accent interpolation; icon changes opacity only |
| UI | `--motion-ui-duration`240ms; CSS`--ease-ui` | Control transitions; theme-icon alpha |
| Overlay | `--motion-overlay-duration`550ms; CSS`--ease-ui` | Header/overlay/contact response |
| Workflow | `--motion-workflow-duration`720ms / input400ms; reveal curve | Existing staged portfolio diagram |

Staggers: reveal110ms,flow80ms,chip40ms. Existing counters and continuous border/cursor smoothing retain their authored tokens because they encode reading/feedback behaviour rather than entry transitions. Change their canonical CSS tokens, not runtime literals.

CV content is always in HTML. Full motion fades/translates elements as they enter88% of viewport; above-viewport content and existing visible content after a language change remain readable. Reduced motion and PDF render all content immediately. PDFs omit navigation/avatar and Download PDF, preserving vector/selectable content and Contact/mail links.

Both routes use `SiteHeader.astro` and `AvatarButton.astro`. Desktop menu/CV/language occupy64/132/200px; CV theme occupies268px. Mobile header is absolute in the document (scrolls away); avatar remains fixed. Mobile logo is viewport minus48px,at y80px,with original951:214 ratio on both routes. Desktop gutter reservation avoids scrollbar-induced layout shifts. Light burger stroke ink uses a-5px optical offset to align with the exported dark SVG, independently of the unchanged64px control box.

Return to portfolio replays `revealHeroRole()` with the same entry settings. Desktop logo flight remains; phone changes routes natively with identical SVG bounds. Modifier clicks,reduced motion,no-JavaScript links remain native.

## CV refinement — 2026-10-15

Decision: when the source logo is off-screen, stage the same SVG at the portfolio logo bounds with zero alpha. Fade it in over the shared backdrop360ms; start the existing1040ms uniform flight halfway through that fade. In-view desktop flights and native mobile routes retain their previous behaviour. Desktop scroll position is preserved behind the backdrop until navigation.

CV website action borders reuse `initCardBorders`, `initBorderGlow` and `initMobileScrollGlow`: the same masked resting gradient, pointer smoothing and scroll response as Soft Skills. Filled Download keeps its purple fill; View portfolio inherits the CV theme background. Reinitialize/dispose borders after language replacement and browser cache restoration; avoid duplicate masks or listeners. Static PDF views retain their original Contact/portfolio actions and no Download button.

PDF picker inherits the language picker's Joyride Outline→Regular on desktop and LINE Seed JP on mobile. Source labels remain desktop pdf/mobile pdf; Joyride renders their capital-shaped glyphs. This supersedes the2026-10-14 PDF-only LINE font override. Floating avatar size is controlled by `--avatar-size`:60px desktop/30px phone; photo,ring,status scale together.

## Locale and actions update — 2026-10-15

Decision superseding the prior same-day picker font choice: all language/PDF options now use LINE Seed JP regular→bold and real lowercase text. Labels are english/russian and desktop pdf/mobile pdf. Menu section labels retain Joyride Outline→Regular; the interaction runtime/easing stays shared. Avatar size increases25% from the preceding release to75px desktop/37.5px phone.

Language precedence: explicit supported URL `lang`,saved manual preference,first supported browser preference,English fallback. SSR reads cookie and Accept-Language with quality weighting; locale spans/SVG text render in the selected language before JavaScript. Responses vary by Accept-Language/Cookie. Client reads the new explicit-choice storage key or cookie; unmarked legacy storage is ignored because prior versions wrote an automatic Russian default. New explicit selections write the explicit-choice key,legacy key and cookie. Automatic detection does not create a manual preference. CV/portfolio selection stays consistent across navigation.

One `CvActions` component owns action rows. Website top/lower rows retain Download PDF/View portfolio; lower row is immediately after Audiomania,inside Experience (before Focus on phones). PDF keeps its top/bottom Contact+portfolio rows; both stretch full width in Mobile PDF. Desktop PDF binaries are unchanged.

Theme ×2: desktop text-box gap28px,font56/56; mobile gap0,font60/86,matching nodes358:827 and383:34. See `../reports/figma-theme-speed-gap-2026-10-15.md`.

## Shared section menu and Figma typography — 2026-10-18

Decision superseding the prior menu/language typography and lower website-action choices: `SiteMenu.astro` and `LanguageOverlay.astro` are used by both routes. CV is the first of nine entries,followed by all eight portfolio sections in the same order. On CV,current CV is marked with aria-current and closes the overlay without reloading; section links navigate natively to `/#section`. A section arrival skips the hero/logo return path. During initial font/load-triggered ScrollTrigger refreshes,CSS smooth scrolling is suspended and the section anchor is maintained until the first wheel,touch,pointer or keyboard interaction; thereafter the reader's scroll position is preserved. Reduced motion and no-JS retain ordinary anchor links. Desktop logo flights between CV and the hero remain unchanged.

Figma desktop473:110/473:115: Joyride Outline56→Regular56 on hover/current,40px gap,natural767px group at x86/y66.24 on1440×900. Scale and recenter the group in shorter viewports. Phone530:1051/530:1081: LINE Seed JP20/28,40px gap when space permits,current/hover white; adapt the gap for nine entries in short viewports,centre below the68px header with20px bottom inset.

Figma language501:2: desktop labels ENGLiSH/RUSSiAN in Joyride56,selected Regular and other Outline,40px gap,centred group. Phone530:1103 uses ENG/RUS in LINE Seed JP20/28 with selected white. The same shared crossfade runtime handles hover and persisted selected state without changing label bounds. PDF picker remains lowercase desktop pdf/mobile pdf in LINE Seed JP; it is intentionally unaffected by the language-menu type change.

CV footer621:99/621:199: directly after Audiomania,filled Contact96×40 then outlined View portfolio164×40,12px gap. Phone buttons stack at full width with the same gap. Web Contact opens Nice to meet you with mailto fallback; PDF Contact stays mailto. Website top retains Download PDF/View portfolio. All eight approved PDF binaries remain unchanged.

Theme ×2 desktop358:827 now has zero gap between metric and label,as explicitly requested. Phone retains its existing zero gap and60/86type. This supersedes the preceding28px desktop gap; see2026-10-18 release evidence.
