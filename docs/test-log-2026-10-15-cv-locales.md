# Browser locale, CV actions and mobile PDF verification — 2026-10-15

Runtime/test commit:16c08fcfe0cb3576834213a9198bf8cd921e7153,based on5c9e273a90d4adb1067483dc255092bc80f7b37d. Build and full suite ran against the same final runtime/test/PDF tree; no subsequent runtime changes.

- `npm run build`:PASS,44Astro files,zero errors/warnings/hints. `cv-locales-build-2026-10-15.txt`.
- `npm test -- --workers=2`:129passed,27intentional breakpoint-specific skips,zero failures (1.7minutes). `cv-locales-local-tests-2026-10-15.txt`.
- Browser/server locale coverage: Russian,English,unsupported French,missing preferences,q=0 exclusions,weighted language ordering; explicit URL override; manual preference persists across CV/portfolio and reload. First paint/no-JS HTML already has the right visible locale spans. Vary includes Accept-Language/Cookie.
- Language/PDF pickers:LINE Seed JP and real lowercase english/russian,desktop pdf/mobile pdf. Existing section menu typography/motion is unchanged.
- Avatar75px desktop/37.5px mobile; lower website actions sit immediately after Audiomania,before phone Focus/sidebar content. Exactly two website action rows remain.
- Figma source metric spacing:desktop358:827gap28,font56/56;phone383:34gap0,font60/86. Evidence:`../reports/figma-theme-speed-gap-2026-10-15.md` and `../artifacts/qa/cv-locales-2026-10-15/local/`.
- Regenerated only four mobile PDFs with `CV_PDF_LAYOUTS=mobile`. Chromium exports the same CV HTML/CSS; Poppler render inspected for every variant. Pypdf verifies one page,six working URI annotations,two full-width mailto links,selectable employer text,no Download PDF controls,no raster XObjects. `cv-locales-pdf-validation-2026-10-15.json`;renders in `../artifacts/qa/cv-locales-2026-10-15/pdf/`. Four desktop binaries/manifest entries are unchanged; final suite checks all8PDF bytes/SHA values.

Production verification:Open until Railway deployment/public checks finish. Final release identity and post-publication smoke will be recorded in workspace `outputs/cv-locales-release-receipt-2026-10-15.json`.

Dmitrii:use a private session with Russian/English browser preferences,choose the other language,then navigate CV↔portfolio. On phone,read through Audiomania,use the following actions,and compare the mobile PDF button widths and ×2text gap with the live page.
