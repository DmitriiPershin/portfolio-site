import sharp from 'sharp';
// Exact outlined SVG exports from Figma 634:681 and 634:682. No external fonts.
await Promise.all([
  sharp('public/favicon.svg').resize(32,32).png().toFile('public/favicon-32.png'),
  sharp('public/favicon.svg').resize(180,180).png().toFile('public/apple-touch-icon.png'),
  sharp('public/assets/og-image.svg').png().toFile('public/assets/og-image.png'),
]);
console.log('Exported favicon 32/180 and OG 1280×630 from exact Figma SVG sources.');
