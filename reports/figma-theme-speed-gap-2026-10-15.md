# Theme ×2 spacing evidence

Fact,checked2026-10-15 using Figma get_design_context including rendered references. Source file: RohXp9xh64xj3NpvNcCe4j.

| Surface | Source | Text-box gap | Metric typography | Label |
|---|---|---|---|---|
| Desktop | [358:827](https://www.figma.com/design/RohXp9xh64xj3NpvNcCe4j/Dmitrii-Pershin?node-id=358-827) |28px|Joyride WIDE56px,line56px|16px,line32px|
| Phone | [383:34](https://www.figma.com/design/RohXp9xh64xj3NpvNcCe4j/Dmitrii-Pershin?node-id=383-34) |0px|Joyride WIDE60px,line86px|20px,line28px|

Phone outer card342×196,padding40px vertical/20px horizontal; inner text group300×114px. Existing code incorrectly added28px between its86px metric slot and28px label. Static section artwork/icons remain the existing local Figma exports; this correction only changes the speed-card text layout. Website glyph remains the user’s ×2.

Implementation/visual evidence: src/styles/global.css and artifacts/qa/cv-locales-2026-10-15/{local,production}/. Other motion/section styling is outside this correction.
