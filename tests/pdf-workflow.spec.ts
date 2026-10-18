import {test,expect} from '@playwright/test';

test('workflow stays connected across narrow desktop widths in both languages',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='chromium','One width matrix covers the shared CSS container query');test.setTimeout(90_000);
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const lang of ['en','ru'])for(const width of [320,390,640,641,768,900,1024,1200,1247,1248,1280,1440]){
  await page.setViewportSize({width,height:900});await page.goto(`/?lang=${lang}`);await page.locator('html[data-motion]').waitFor();
  const stageWidth=await page.locator('.workflow-stage').evaluate(el=>el.getBoundingClientRect().width);
  const compact=stageWidth<1152;
  await expect(page.locator(`.workflow-scene--${compact?'mobile':'desktop'}`)).toBeVisible();await expect(page.locator(`.workflow-scene--${compact?'desktop':'mobile'}`)).toBeHidden();
  const scene=page.locator(`.workflow-scene--${compact?'mobile':'desktop'}`);
  const context=scene.locator('.workflow-context');const bounds=(await context.boundingBox())!;
  for(const input of await context.locator('.workflow-input').all()){
   const r=(await input.boundingBox())!;expect(r.x).toBeGreaterThanOrEqual(bounds.x);expect(r.x+r.width).toBeLessThanOrEqual(bounds.x+bounds.width);expect(r.y+r.height).toBeLessThanOrEqual(bounds.y+bounds.height);
  }
  if(compact){
   const nodes=await scene.locator('[data-mobile-workflow-node]').all();const flows=await scene.locator('[data-mobile-flow]').all();expect(nodes).toHaveLength(7);expect(flows).toHaveLength(6);
   for(let i=0;i<flows.length;i++){
    const a=(await nodes[i].boundingBox())!,b=(await nodes[i+1].boundingBox())!,flow=(await flows[i].boundingBox())!;
    expect(flow.y).toBeCloseTo(a.y+a.height,0);expect(flow.y+flow.height).toBeCloseTo(b.y,0);expect(flow.x+flow.width/2).toBeCloseTo(a.x+a.width/2,0);
    const labels=await flows[i].locator('.mobile-flow-label').all();let right=-Infinity;
    for(const label of labels){const r=(await label.boundingBox())!;expect(r.x).toBeGreaterThanOrEqual(right);right=r.x+r.width;}
   }
  }else{
   expect((await scene.boundingBox())!.width).toBe(1152);
   for(const route of await scene.locator('.workflow-route').all()){const r=(await route.boundingBox())!;expect(r.x).toBeGreaterThanOrEqual(0);expect(r.x+r.width).toBeLessThanOrEqual(width);}
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  if(width===1024){await expect(page.locator('.menu-button')).toHaveCSS('position','fixed');expect(Math.round((await page.locator('.menu-button').boundingBox())!.y)).toBe(64);}
 }
});

test('workflow can switch layout during reading without a reload or missing animation',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/');await page.locator('html[data-motion="full"]').waitFor();await page.locator('.workflow-stage').scrollIntoViewIfNeeded();
 const documentId=await page.evaluate(()=>performance.timeOrigin);
 await page.setViewportSize({width:1024,height:900});await expect(page.locator('.workflow-scene--mobile')).toBeVisible();await expect(page.locator('[data-mobile-workflow-node="frontend"]')).toHaveCSS('opacity','1');
 await page.setViewportSize({width:1440,height:900});await expect(page.locator('.workflow-scene--desktop')).toBeVisible();await expect(page.locator('.workflow-route--context')).toHaveCSS('opacity','1');
 expect(await page.evaluate(()=>performance.timeOrigin)).toBe(documentId);
});

test('PDF format overlay follows Figma typography, fits the viewport and keeps variant downloads',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});const mobile=page.viewportSize()!.width<=640;
 for(const lang of ['en','ru'])for(const theme of ['dark','light']){
  await page.goto(`/cv?lang=${lang}&theme=${theme}`);await page.locator('html[data-cv-controls-ready]').waitFor();await page.locator('[data-pdf-download]').click();
  const overlay=page.locator('[data-pdf-overlay]'),dialog=overlay.locator('.language-dialog');await expect(overlay).toHaveAttribute('aria-hidden','false');
  const r=(await dialog.boundingBox())!;expect(r.x+r.width/2).toBeCloseTo(page.viewportSize()!.width/2,0);expect(r.y+r.height/2).toBeCloseTo(page.viewportSize()!.height/2,0);
  const labels=overlay.locator('.morph-label__base:visible');expect(await labels.allTextContents()).toEqual(mobile?['desktop','mobile']:['dEsktOp','mObile']);
  await expect(labels.first()).toHaveCSS('font-family',mobile?/LINE Seed JP/:/Joyride Outline/);
  await expect(overlay.locator('.morph-label__fill:visible').first()).toHaveCSS('font-family',mobile?/LINE Seed JP/:/Joyride Regular/);
  for(const format of ['desktop','mobile'])await expect(overlay.locator(`[data-pdf-format="${format}"]`)).toHaveAttribute('href',`/cv/dmitrii-pershin-cv-${lang}-${theme}-${format}.pdf`);
  await page.keyboard.press('Tab');await overlay.locator('[data-pdf-format="desktop"]').focus();await expect(overlay.locator('[data-pdf-format="desktop"]')).toBeFocused();await expect(overlay.locator('.morph-label__fill:visible').first()).toHaveCSS('opacity','1');
  for(const format of ['desktop','mobile']){
   const downloadEvent=page.waitForEvent('download');await overlay.locator(`[data-pdf-format="${format}"]`).click();const download=await downloadEvent;
   expect(download.suggestedFilename()).toBe(`Pershin_Dmitrii-Product_Senior_Designer-CV-${lang.toUpperCase()}-${format}.pdf`);
  }
  const y=await page.evaluate(()=>scrollY);await page.mouse.wheel(0,600);await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(y);await page.keyboard.press('Escape');await expect(page.locator('[data-pdf-download]')).toBeFocused();
 }
});

test('compact workflow is complete without JavaScript at a tablet width',async({browser,baseURL})=>{
 const context=await browser.newContext({baseURL,viewport:{width:1024,height:768},javaScriptEnabled:false});const page=await context.newPage();await page.goto('/?lang=en');
 await expect(page.locator('.workflow-scene--mobile')).toBeVisible();await expect(page.locator('.workflow-scene--desktop')).toBeHidden();
 await expect(page.locator('[data-mobile-workflow-node="frontend"]')).toBeVisible();await expect(page.locator('.workflow-scene--mobile .workflow-input')).toHaveCount(4);await context.close();
});
