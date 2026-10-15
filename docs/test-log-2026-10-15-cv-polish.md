# CV/avatar polish verification — 2026-10-15

Runtime and test commit: `f6061fb4e9a72d8c7d2fac7b27d28370aeb7e270`, based on `062bb428d4037b254ce82ae275522a1522fac0b6`. Build input runtime tree matches this commit; no source/test changes followed the successful full run.

- `npm run build`: PASS,39files,zero errors/warnings/hints. Log: `cv-polish-build-2026-10-15.txt`.
- `npm test -- --workers=2`:117passed,27intentional breakpoint-specific skips,zero failures. Log: `cv-polish-local-tests-2026-10-15.txt`.
- Initial probes found two test targeting/synchronization issues: hover coordinates fell outside the pill's circular clip; another check started before the CV action reveal finished. Tests now aim inside the painted pill and wait for fonts/content entry. Initial logs are retained as `cv-polish-initial-tests-2026-10-15.txt` and `cv-polish-second-tests-2026-10-15.txt`; the final suite above supersedes both.
- Off-screen desktop entry samples: one SVG,initialalpha<.1,intermediatealpha,uniform951:214ratio,exact final CV bounds. Existing in-view flight,Back,phone/reduced/no-JS paths pass.
- Actions: both rows retain Download PDF/View portfolio; one masked gradient/conic contour on each,with existing pointer/phone scroll response after EN→RU/dark→light. Avatar60px desktop/30px phone,proportional photo/status.
- Picker font matches ENG/RUS at each breakpoint. Desktop Joyride shows capital-shaped glyphs even for lowercase source labels. No overflow at1440/1024/390px.
- Visual captures: `../artifacts/qa/cv-polish-2026-10-15/` (CV,picker and geometry per breakpoint). PDF data/content unchanged; all8manifest byte checks pass locally.

Deployment/public verification: Railway deployment `22c3eb3d-2bd4-4480-932e-715fa3301588` SUCCESS,from GitHub main `bb55a16112cefd7e27904a20e0bda2d743e0350b`;runtime remains `f6061fb`. `PORTFOLIO_BASE_URL=https://portfolio-production-e2d0.up.railway.app npm test -- --workers=2`:117passed,27intentional skips,zero failures (2.5minutes). Log: `cv-polish-production-tests-2026-10-15.txt`. Four public routes200 and all8PDF MIME/header/byte/SHA checks PASS (`cv-polish-public-validation-2026-10-15.json`). Production screenshots/geometry are in `../artifacts/qa/cv-polish-2026-10-15/production/`.

Evidence-only commits after the runtime commit do not change deployed application inputs. Final main/deployment identity and post-publication smoke checks are recorded in the workspace release receipt `outputs/cv-polish-release-receipt-2026-10-15.json`.

Railway also reported dependency advisories; `npm audit --omit=dev` confirms9findings. They are recorded as an independent Open triage item in `../Bugs.md`,with the audit JSON and primary advisory source. No dependency updates or assertion of application exploitability is part of this UI release. Current interaction rules are in `motion-system.md`; resolved defects are in `../Bugs.md`.

Product check for Dmitrii: scroll below the portfolio hero,slightly back up,and click the returning CV control. Assess the fade/flight; compare the smaller floating avatar on both pages. Hover the two CV actions and compare PDF selector typography with ENG/RUS. Repeat Russian/light and phone.
