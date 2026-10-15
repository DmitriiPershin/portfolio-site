# CV/avatar polish verification — 2026-10-15

Runtime and test commit: `f6061fb4e9a72d8c7d2fac7b27d28370aeb7e270`, based on `062bb428d4037b254ce82ae275522a1522fac0b6`. Build input runtime tree matches this commit; no source/test changes followed the successful full run.

- `npm run build`: PASS,39files,zero errors/warnings/hints. Log: `cv-polish-build-2026-10-15.txt`.
- `npm test -- --workers=2`:117passed,27intentional breakpoint-specific skips,zero failures. Log: `cv-polish-local-tests-2026-10-15.txt`.
- Initial probes found two test targeting/synchronization issues: hover coordinates fell outside the pill's circular clip; another check started before the CV action reveal finished. Tests now aim inside the painted pill and wait for fonts/content entry. Initial logs are retained as `cv-polish-initial-tests-2026-10-15.txt` and `cv-polish-second-tests-2026-10-15.txt`; the final suite above supersedes both.
- Off-screen desktop entry samples: one SVG,initialalpha<.1,intermediatealpha,uniform951:214ratio,exact final CV bounds. Existing in-view flight,Back,phone/reduced/no-JS paths pass.
- Actions: both rows retain Download PDF/View portfolio; one masked gradient/conic contour on each,with existing pointer/phone scroll response after EN→RU/dark→light. Avatar60px desktop/30px phone,proportional photo/status.
- Picker font matches ENG/RUS at each breakpoint. Desktop Joyride shows capital-shaped glyphs even for lowercase source labels. No overflow at1440/1024/390px.
- Visual captures: `../artifacts/qa/cv-polish-2026-10-15/` (CV,picker and geometry per breakpoint). PDF data/content unchanged; all8manifest byte checks pass locally.

Deployment/public verification: Open until Railway finishes and the production suite completes. Current interaction rules are in `motion-system.md`; resolved defects are in `../Bugs.md`.

Product check for Dmitrii: scroll below the portfolio hero,slightly back up,and click the returning CV control. Assess the fade/flight; compare the smaller floating avatar on both pages. Hover the two CV actions and compare PDF selector typography with ENG/RUS. Repeat Russian/light and phone.
