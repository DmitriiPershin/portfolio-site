# CV / portfolio motion-system refinement — 2026-10-14

Scope: latest user instructions supersede earlier same-day action, mobile-flight and header choices. Figma high-fidelity Profile586:26 and Primary actions586:111 confirm button padding,type,filled/outlined treatment and mobile164/160/40px geometry. User’s latest instruction removes website Contact in favour of the shared avatar.

## Technical verification

- Astro production build:0errors,0warnings,0hints.
- Earlier revised full suite:110 passed/25 intentional skips; adding visible-burger regression brought the next run to112 passed/26 skips. Final local suite including actual-lowercase font verification:112 passed,26 intentional skips,zero failures in1.5min. Production full suite:112 passed,26 intentional skips,zero failures in2.1min.
- Tests sample CV role opacity during entry; require below-fold jobs to remain hidden until scrolling,then become fully readable. Role replays on return; no reload on preference changes. Reduced/PDF/no-JavaScript content remains complete.
- Desktop control rectangles are sampled throughout theme changes and compared between routes. Pixel tests compare actual burger-stroke rows in dark/light; a5px optical offset was found and corrected independently of button geometry.
- Mobile320/390/480/640:both logos have viewport−48px width,y80px,951:214ratio; no flight. Header scrolls away; avatar stays in viewport. Original390px hero cap was discovered and removed.
- Shared button hover,Figma action geometry,lowercase labels with actual lowercase font,avatar contact flow,Hero-equivalent CV cursor glow and export visibility are covered.
- All8PDFs reopened with pypdf:one continuous page;all4employers and20-years copy;zero raster images;zero Download PDF labels;6URI annotations incl2mailto. Poppler renders visually inspected for each variant. SHA,size and real public bytes are verified against src/data/cv-pdf-manifest.json.
- QA:artifacts/qa/cv-system-2026-10-14/,including reduced-motion layouts,overlays,normal-motion entry/scroll frames and cursor glow.

Motion-family source of truth:docs/motion-system.md. Export source is the shared CV page,not a separate PDF design. Earlier Figma PDF review frames are historical; no Figma write is claimed.

## Product checks for Dmitrii

1. Desktop: switch theme,go CV↔portfolio,and use browser Back. Compare menu/CV/language positions and Senior Product Designer entry.
2. Phone: compare the full-width logo,scroll until the header leaves,and open contacts from the floating avatar.
3. Read down CV to assess reveal pacing; download desktop pdf/mobile pdf in both themes/languages and confirm no Download PDF inside.

## Production evidence

- Tested runtime/main:374a33a5571dc4da4d2413ed35e334f70fe9e843. Railway6db2352a-8843-4978-9651-a62961ba1248:SUCCESS.
- Full published-site suite passes,including all8actual PDF MIME/size/SHA checks and optical burger-row comparison.
- Additional real390px return check:CV and portfolio logos both{x24,y80,width342,height76.953125};no movement;role has intermediate opacity and finishes at1.
- Live layouts/overlays captured in artifacts/qa/cv-system-2026-10-14/production/ and visually inspected.
- Build/local/production/PDF logs are adjacent cv-system-* files. The following QA/docs-only commit leaves runtime/assets unchanged and is redeployed to match pushed main; final deployment receipt is in the calling task outputs.
