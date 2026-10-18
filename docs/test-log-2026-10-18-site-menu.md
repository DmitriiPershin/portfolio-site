# Shared menus, corrected Process copy and custom domain — 2026-10-18

Based on GitHub main ba0c732200ddd160e97f278eacf0cf211751d512. Tested/runtime revision:e189208416703f09b4853b440857b7bd297df53a. Railway deployment47014dcb-1b01-4874-a324-e394b4f06840 reached SUCCESS. Subsequent evidence-only publication keeps the same src/public trees.

Figma read/screenshot evidence: main473:110/473:115 and phone530:1051/530:1081; language501:2 and phone530:1103; CV footer621:99/621:199; ×2card358:827; Process copy358:791. Source file RohXp9xh64xj3NpvNcCe4j. Implementation decisions are canonical in `motion-system.md`.

Initial checks exposed stale test selectors for newly separate responsive labels and the added footer Contact fallback. Corrected those selectors without weakening assertions. New cross-page tests found a real full-motion ScrollTrigger refresh/anchor conflict; fixed by preserving initial section arrival until reader input. Short-phone menu composition was corrected to68px top/20px bottom and valid length tokens. Final build/local/live results follow below.

Domain: user corrected spelling to pershindmitrii.com. Railway CLI domain command returned Unauthorized despite valid project access; used the already-authenticated Railway browser to attach the domain to portfolio8080. DNS changed from a parking IP to Railway; TLS provisioning completed and a certificate-verified HTTPS request returned200. No credential or billing changes were made.

Local verification: PASS. `npm run build`:48Astro files,zero errors/warnings/hints; `site-menu-build-2026-10-18.txt`. Full `npm test -- --workers=2`:144passed,27intentional breakpoint-specific skips,zero failures (2.1minutes); `site-menu-tests-local-2026-10-18.txt`. Focused shared-menu suite:12passed,including every section in full/reduced motion and subsequent reader scroll/resize. Visual captures in `../artifacts/qa/site-menu-2026-10-18/local/` were inspected for desktop/phone main menu,language choices,Audiomania footer and Process copy. Local HTTP checks4/4 and unchanged PDF byte/SHA/MIME checks8/8 pass; `site-menu-validation-local-2026-10-18.json`.

Product review for Dmitrii: compare menu/language type to Figma on desktop/phone; on CV choose any portfolio section and keep reading; after Audiomania open Contact and return via View portfolio. Inspect the corrected GitLab bullet and ×2spacing.

Production verification: PASS on **https://pershindmitrii.com** at runtime e189208416703f09b4853b440857b7bd297df53a. Full suite144passed,27intentional skips,zero failures (3.1minutes); `site-menu-tests-production-2026-10-18.txt`. All three breakpoints pass the nine-entry shared menu,CV→all8sections in full/reduced motion,and reader scroll/resize after arrival. Additional actual menu-CV-entry and browser-Back checks pass on desktop/mobile with zero runtime errors; `site-menu-menu-entry-production-2026-10-18.json`.

Public route checks4/4 and PDF SHA/bytes/MIME checks8/8 pass,with all PDF files unchanged; `site-menu-validation-production-2026-10-18.json`. Certificate-verified HTTPS and both custom/fallback health checks pass; `site-menu-domain-2026-10-18.json`. HTTP redirects301 to HTTPS. Production screenshots were inspected and saved in `../artifacts/qa/site-menu-2026-10-18/production/`. Railway build/healthcheck evidence:`site-menu-railway-build-2026-10-18.txt`.

Final publication adds only QA/documentation artifacts after the tested runtime commit. Application src/public trees remain9615e192f07eafd47ff4470c029cd3f9907260ef / e7b10fe350e8383acb57857980109df3fff09342; no second full test run is needed for these evidence-only changes. The final clean-main CLI upload must reach SUCCESS and pass a final health/content/PDF smoke check.
