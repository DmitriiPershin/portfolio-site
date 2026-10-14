import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const out='artifacts/qa/cv-release-2026-10-14';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch();
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844],['small',320,640]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 await page.goto('http://localhost:4321/cv?theme=light');await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:`${out}/${name}-cv.png`,fullPage:true});
 for(const [type,trigger] of [['language','[data-language-toggle]'],['contact','[data-contact-toggle]'],['pdf','[data-pdf-toggle]']]){
  await page.locator(trigger).first().click();await page.waitForTimeout(600);await page.screenshot({path:`${out}/${name}-${type}.png`});await page.keyboard.press('Escape');
 }
 await page.goto('http://localhost:4321/');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${out}/${name}-hero.png`});await page.close();
}
await browser.close();
