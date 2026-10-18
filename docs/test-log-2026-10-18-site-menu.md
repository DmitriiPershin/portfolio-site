# Shared menus, corrected Process copy and custom domain — 2026-10-18

Based on GitHub main ba0c732200ddd160e97f278eacf0cf211751d512. Runtime revision and deployment identity will be recorded in the release receipt after publication.

Figma read/screenshot evidence: main473:110/473:115 and phone530:1051/530:1081; language501:2 and phone530:1103; CV footer621:99/621:199; ×2card358:827; Process copy358:791. Source file RohXp9xh64xj3NpvNcCe4j. Implementation decisions are canonical in `motion-system.md`.

Initial checks exposed stale test selectors for newly separate responsive labels and the added footer Contact fallback. Corrected those selectors without weakening assertions. New cross-page tests found a real full-motion ScrollTrigger refresh/anchor conflict; fixed by preserving initial section arrival until reader input. Short-phone menu composition was corrected to68px top/20px bottom and valid length tokens. Final build/local/live results follow below.

Domain: user corrected spelling to pershindmitrii.com. Railway CLI domain command returned Unauthorized despite valid project access; used the already-authenticated Railway browser to attach the domain to portfolio8080. DNS changed from a parking IP to Railway; TLS provisioning completed and a certificate-verified HTTPS request returned200. No credential or billing changes were made.

Local verification: PASS. `npm run build`:48Astro files,zero errors/warnings/hints; `site-menu-build-2026-10-18.txt`. Full `npm test -- --workers=2`:144passed,27intentional breakpoint-specific skips,zero failures (2.1minutes); `site-menu-tests-local-2026-10-18.txt`. Focused shared-menu suite:12passed,including every section in full/reduced motion and subsequent reader scroll/resize. Visual captures in `../artifacts/qa/site-menu-2026-10-18/local/` were inspected for desktop/phone main menu,language choices,Audiomania footer and Process copy. Local HTTP checks4/4 and unchanged PDF byte/SHA/MIME checks8/8 pass; `site-menu-validation-local-2026-10-18.json`.

Product review for Dmitrii: compare menu/language type to Figma on desktop/phone; on CV choose any portfolio section and keep reading; after Audiomania open Contact and return via View portfolio. Inspect the corrected GitLab bullet and ×2spacing.
