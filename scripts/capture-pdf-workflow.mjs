import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base=process.env.PORTFOLIO_BASE_URL||'http://127.0.0.1:4321';
const target=process.env.PORTFOLIO_BASE_URL?'production':'local';
const out=`artifacts/qa/pdf-workflow-2026-10-18/${target}`;
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch();const report={base,checkedAt:new Date().toISOString(),workflow:[],assets:[],pdfs:[]};
try{
 const page=await browser.newPage({locale:'en-US',reducedMotion:'reduce'});
 for(const width of [320,390,640,641,768,900,1024,1200,1247,1248,1280,1440]){
  await page.setViewportSize({width,height:900});await page.goto(base+'/?lang=en');await page.locator('html[data-motion]').waitFor();
  const scene=page.locator('.workflow-scene:visible');await scene.scrollIntoViewIfNeeded();
  const geometry=await scene.evaluate(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height,compact:el.classList.contains('workflow-scene--mobile'),stageWidth:el.parentElement.getBoundingClientRect().width,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};});
  report.workflow.push({viewport:width,...geometry});
  if([390,900,1024,1248,1440].includes(width))await scene.screenshot({path:`${out}/workflow-${width}.png`,animations:'disabled'});
  if(width===1024||width===1440){
   const assets=await scene.locator('img').evaluateAll(images=>images.map(img=>({url:img.getAttribute('src'),loaded:img.complete&&img.naturalWidth>0,width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height})));
   for(const asset of assets){expect(asset.loaded).toBe(true);expect((await fs.stat('public'+asset.url)).size).toBeGreaterThan(0);}report.assets.push({viewport:width,assets});
  }
 }
 for(const width of [390,1440])for(const theme of ['dark','light']){
  await page.setViewportSize({width,height:900});await page.goto(`${base}/cv?lang=en&theme=${theme}`);await page.locator('html[data-cv-controls-ready]').waitFor();await page.locator('[data-pdf-download]').click();
  await page.locator('[data-pdf-format="desktop"]').hover();await expect(page.locator('[data-pdf-format="desktop"] .morph-label__fill:visible')).toHaveCSS('opacity','1');
  await page.screenshot({path:`${out}/pdf-menu-${width}-${theme}.png`});
 }
 const manifest=JSON.parse(await fs.readFile('src/data/cv-pdf-manifest.json','utf8'));
 for(const [variant,entry] of Object.entries(manifest.variants)){
  const response=await page.request.get(base+entry.url);const bytes=await response.body();const sha256=createHash('sha256').update(bytes).digest('hex');
  expect(response.status()).toBe(200);expect(sha256).toBe(entry.sha256);report.pdfs.push({variant,status:response.status(),bytes:bytes.length,sha256,unchanged:true});
 }
}finally{await browser.close();await fs.writeFile(`docs/pdf-workflow-validation-${target}-2026-10-18.json`,JSON.stringify(report,null,2)+'\n');}
console.log(`Saved ${target} responsive/PDF menu captures and validated all eight unchanged PDF files.`);
