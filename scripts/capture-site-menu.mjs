import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';

const base=process.env.PORTFOLIO_BASE_URL||'http://127.0.0.1:4321';
const target=process.env.PORTFOLIO_BASE_URL?'production':'local';
const output=`artifacts/qa/site-menu-2026-10-18/${target}`;
await fs.mkdir(output,{recursive:true});
const report={base,checkedAt:new Date().toISOString(),screens:[],routes:[],pdfs:[]};
const browser=await chromium.launch();
try{
 for(const [device,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:900}]]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce',locale:'en-US'});
  const page=await context.newPage();
  for(const [route,name] of [['/','portfolio'],['/cv?lang=en','cv']]){
   await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);
   await page.locator(name==='cv'?'html[data-cv-controls-ready]':'html[data-motion]').waitFor();
   for(const kind of ['menu','language']){
    await page.locator(`[data-${kind}-toggle]`).click();
    await page.locator(`[data-${kind}-overlay][aria-hidden="false"]`).waitFor();
    const file=`${device}-${name}-${kind}.png`;await page.screenshot({path:`${output}/${file}`});
    report.screens.push({file,route,viewport});await page.keyboard.press('Escape');
   }
   if(name==='cv'){
    const row=page.locator('.cv-actions--experience');await row.scrollIntoViewIfNeeded();
    await page.screenshot({path:`${output}/${device}-cv-footer.png`});
    await row.locator('[data-contact-toggle]').click();
    await page.locator('[data-contact-overlay][aria-hidden="false"]').waitFor();
    await page.screenshot({path:`${output}/${device}-cv-contact.png`});
   }
  }
  await page.goto(base+'/?lang=ru');await page.locator('#theme-builders').scrollIntoViewIfNeeded();
  await page.screenshot({path:`${output}/${device}-theme-builders.png`});
  await page.goto(base+'/?lang=ru');await page.locator('.process-card').first().scrollIntoViewIfNeeded();
  if(device==='mobile')await page.locator('.process-card').first().locator('[data-details-toggle]').click();
  await page.screenshot({path:`${output}/${device}-process-copy.png`});
  await context.close();
 }
 const request=await browser.newContext();
 for(const route of ['/','/cv','/cv?lang=ru&theme=light','/api/health']){
  const response=await request.request.get(base+route);report.routes.push({route,status:response.status()});
  if(response.status()!==200)throw new Error(`HTTP ${response.status()}: ${route}`);
 }
 const manifest=JSON.parse(await fs.readFile('src/data/cv-pdf-manifest.json','utf8'));
 for(const [variant,entry] of Object.entries(manifest.variants)){
  const response=await request.request.get(base+entry.url);const bytes=await response.body();const sha256=createHash('sha256').update(bytes).digest('hex');
  const item={variant,status:response.status(),mime:response.headers()['content-type'],bytes:bytes.length,sha256,unchanged:sha256===entry.sha256};report.pdfs.push(item);
  if(!item.unchanged||item.status!==200||!item.mime?.includes('application/pdf'))throw new Error(`Invalid PDF ${variant}`);
 }
 await request.close();
}finally{await browser.close();await fs.writeFile(`docs/site-menu-validation-${target}-2026-10-18.json`,JSON.stringify(report,null,2)+'\n');}
console.log(`Saved ${target} screenshots, ${report.routes.length} route checks and ${report.pdfs.length} PDF validations.`);
