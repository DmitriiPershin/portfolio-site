import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = process.env.CV_PDF_DIR && path.resolve(process.env.CV_PDF_DIR);
if (!output || output === repo || output.startsWith(repo + path.sep)) throw new Error('Set CV_PDF_DIR to a review folder outside the repository. Publication requires separate approval.');
const base = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4321';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch();
const variants = {};
try {
  for (const lang of ['en', 'ru']) for (const theme of ['dark', 'light']) for (const layout of ['desktop', 'mobile']) {
    const width = layout === 'desktop' ? 1440 : 390;
    const key = `${lang}-${theme}-${layout}`;
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const response = await page.goto(`${base}/cv?lang=${lang}&theme=${theme}&view=pdf-${layout}`);
    if (response?.status() !== 200) throw new Error(`CV preview failed: ${key}`);
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: 'print' });
    const height = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`PDF content overflow: ${key}`);
    const file = path.join(output, `dmitrii-pershin-cv-${key}.pdf`);
    await page.pdf({ path: file, width: `${width}px`, height: `${height}px`, printBackground: true, displayHeaderFooter: false, margin: {top:0,right:0,bottom:0,left:0}, tagged: true, outline: true });
    await page.screenshot({path:path.join(output, `${key}.png`), fullPage:true});
    const bytes = await fs.readFile(file);
    variants[key] = { file, width, height, bytes:bytes.length, sha256:createHash('sha256').update(bytes).digest('hex') };
    console.log(JSON.stringify({key,width,height,bytes:bytes.length}));
    await page.close();
  }
} finally { await browser.close(); }
await fs.writeFile(path.join(output, 'review-manifest.json'), JSON.stringify({approved:false,source:'/cv',variants},null,2)+'\n');
