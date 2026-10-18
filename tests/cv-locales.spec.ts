import {test,expect} from '@playwright/test';

test('first paint and no-JS content follow Accept-Language, with English fallback',async({request})=>{
 for(const [header,expected] of [['ru-RU,ru;q=0.9','ru'],['en-GB,en;q=0.9','en'],['fr-FR,fr;q=0.9','en'],['en;q=0.2,ru;q=0.9','ru'],['ru;q=0','en'],['','en']]){
  for(const route of ['/','/cv']){const response=await request.get(route,{headers:{'Accept-Language':header}});expect(response.status()).toBe(200);const html=await response.text();expect(html).toContain(`<html lang="${expected}"`);if(route==='/')expect(html).toMatch(new RegExp(`<span data-locale="${expected}"(?! hidden)`));}
 }
});

test('manual language survives CV/portfolio navigation and browser default can be overridden',async({browser,baseURL})=>{
 const context=await browser.newContext({baseURL,locale:'ru-RU',reducedMotion:'reduce'});const page=await context.newPage();
 await page.goto('/cv');await page.locator('html[data-cv-controls-ready]').waitFor();await expect(page.locator('html')).toHaveAttribute('lang','ru');
 await page.locator('[data-language-toggle]').click();await page.locator('[data-language-option="en"]').click();await expect(page.locator('html')).toHaveAttribute('lang','en');
 await page.locator('.cv-profile [data-portfolio-link]').click();await expect(page.locator('html')).toHaveAttribute('lang','en');await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','en');
 await page.locator('[data-language-toggle]').click();await expect(page.locator('[data-language-option="ru"]')).toBeVisible();await page.locator('[data-language-option="ru"]').click();await expect(page.locator('html')).toHaveAttribute('lang','ru');
 await page.locator('[data-cv-link]').click();await expect(page.locator('html')).toHaveAttribute('lang','ru');
 await page.goto('/cv?lang=en');await expect(page.locator('html')).toHaveAttribute('lang','en');await context.close();
});

test('language/PDF typography, experience actions and metric spacing match their surfaces',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/cv');await page.locator('html[data-cv-controls-ready]').waitFor();
 await expect(page.locator('[data-pdf-download]')).toHaveCount(1);const row=page.locator('.cv-actions--experience');const job=page.locator('.cv-job').last();await expect(job).toContainText('Audiomania');
 expect((await row.boundingBox())!.y).toBeGreaterThan((await job.boundingBox())!.y+(await job.boundingBox())!.height);
 await page.locator('[data-language-toggle]').click();for(const code of ['en','ru']){const option=page.locator(`[data-language-option="${code}"]`);await expect(option).toBeVisible();const face=option.locator(page.viewportSize()!.width<=640?'.language-name--mobile .morph-label__base':'.language-name--desktop .morph-label__base');await expect(face).toHaveCSS('font-family',page.viewportSize()!.width<=640?/LINE Seed JP/:/Joyride Outline/);}
 await page.keyboard.press('Escape');await page.locator('[data-pdf-download]').first().click();await expect(page.locator('[data-pdf-format] .morph-label__base').first()).toHaveCSS('font-family',/LINE Seed JP/);
 await page.goto('/');await page.evaluate(()=>document.fonts.ready);const mobile=page.viewportSize()!.width<=640;const metric=page.locator(mobile?'.theme-metric--mobile':'.theme-metric--desktop');
 const geometry=await metric.evaluate(el=>{const a=el.querySelector('strong')!.getBoundingClientRect(),b=el.querySelector('p')!.getBoundingClientRect();return {gap:b.y-a.bottom,line:getComputedStyle(el.querySelector('strong')!).lineHeight};});expect(geometry.gap).toBeCloseTo(0,0);expect(geometry.line).toBe(mobile?'86px':'56px');
});

test('mobile PDF action rows have full-width buttons in both themes and languages',async({page})=>{
 await page.setViewportSize({width:390,height:900});
 for(const lang of ['en','ru'])for(const theme of ['dark','light']){
  await page.goto(`/cv?lang=${lang}&theme=${theme}&view=pdf-mobile`);await page.evaluate(()=>document.fonts.ready);await expect(page.locator('[data-pdf-download]')).toHaveCount(0);
  for(const row of await page.locator('.cv-actions').all()){const parent=await row.boundingBox();expect(await row.locator('.cv-action').count()).toBe(2);for(const button of await row.locator('.cv-action').all()){const rect=await button.boundingBox();expect(rect!.x).toBeCloseTo(parent!.x,1);expect(rect!.width).toBeCloseTo(parent!.width,1);}}
 }
});


test('legacy automatic Russian storage does not override the browser language',async({browser,baseURL})=>{
 const context=await browser.newContext({baseURL,locale:'en-US',reducedMotion:'reduce'});
 await context.addInitScript(()=>localStorage.setItem('portfolio-language','ru'));
 const page=await context.newPage();await page.goto('/');await page.waitForFunction(()=>document.documentElement.dataset.motion==='reduced');await expect(page.locator('html')).toHaveAttribute('lang','en');
 await page.locator('[data-language-toggle]').click();await page.locator('[data-language-option="ru"]').click();await expect(page.locator('html')).toHaveAttribute('lang','ru');
 expect(await page.evaluate(()=>localStorage.getItem('portfolio-language-choice'))).toBe('ru');
 await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','ru');await context.close();
});
