import {test,expect} from '@playwright/test';

const sections=['focus','hard-skills','soft-skills','ai-workflow','process-ai','theme-builders','interfaces','pet-project'];

test('CV and portfolio share all nine menu entries and current CV closes without navigating',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 let labels:string[]=[];
 for(const route of ['/','/cv?lang=en&theme=light']){
  await page.goto(route);await page.evaluate(()=>document.fonts.ready);
  await page.locator('[data-menu-toggle]').click();
  const links=page.locator('[data-menu-overlay] nav a');await expect(links).toHaveCount(9);
  const current=await links.locator('.morph-label__base').allTextContents();
  expect(current[0]).toBe('CV');if(labels.length)expect(current).toEqual(labels);labels=current;
  for(let i=0;i<sections.length;i++)await expect(links.nth(i+1)).toHaveAttribute('href',`${route==='/'?'':'/'}#${sections[i]}`);
  if(route!=='/'){
   await expect(links.first()).toHaveAttribute('aria-current','page');
   const before=await page.evaluate(()=>performance.timeOrigin);await links.first().click();
   await expect(page.locator('[data-menu-overlay]')).toHaveAttribute('aria-hidden','true');
   expect(await page.evaluate(()=>performance.timeOrigin)).toBe(before);await expect(page.locator('[data-menu-toggle]')).toBeFocused();
  }
 }
});

test('every CV menu section reaches its actual portfolio section without a hero return',async({page})=>{
 test.setTimeout(90_000);
 for(const reducedMotion of ['reduce','no-preference'] as const){
  await page.emulateMedia({reducedMotion});
  for(const id of sections){
   await page.goto('/cv?lang=en');await page.locator('html[data-cv-controls-ready]').waitFor();
   await page.locator('[data-menu-toggle]').click();await page.locator(`[data-menu-overlay] a[href="/#${id}"]`).click();
   await expect(page).toHaveURL(new RegExp(`/#${id}$`));
   await page.waitForFunction(()=>Boolean(document.documentElement.dataset.motion));await page.evaluate(()=>document.fonts.ready);
   await expect.poll(async()=>page.locator(`#${id}`).evaluate(el=>Math.abs(el.getBoundingClientRect().top)),{message:`${reducedMotion}: ${id} section arrival`}).toBeLessThan(3);
   await expect(page.locator('.cv-route-transition')).toHaveCount(0);
   await expect(page.locator('html')).not.toHaveAttribute('data-route-arrival');
  }
  const before=await page.evaluate(()=>scrollY);await page.mouse.wheel(0,300);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before+30);
  await expect(page.locator('html')).not.toHaveAttribute('data-section-arrival');
  const viewport=page.viewportSize()!;await page.setViewportSize({...viewport,height:viewport.height-1});
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before+30);
 }
});

test('shared menu fits short desktop and mobile viewports on both routes',async({page})=>{
 const mobile=page.viewportSize()!.width<=640;await page.setViewportSize(mobile?{width:320,height:540}:{width:1280,height:600});
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of ['/','/cv']){
  await page.goto(route);await page.evaluate(()=>document.fonts.ready);await page.locator('[data-menu-toggle]').click();
  const bounds=await page.locator('[data-menu-overlay] nav a').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right};}));
  expect(bounds).toHaveLength(9);for(const r of bounds){expect(r.top).toBeGreaterThanOrEqual(mobile?68:39);expect(r.bottom).toBeLessThanOrEqual(page.viewportSize()!.height-19);expect(r.left).toBeGreaterThan(0);expect(r.right).toBeLessThanOrEqual(page.viewportSize()!.width);}
  const before=await page.evaluate(()=>scrollY);await page.mouse.wheel(0,800);await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(before);
 }
});

test('Audiomania footer matches Figma actions and Contact opens the shared overlay',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/cv?lang=en');await page.locator('html[data-cv-controls-ready]').waitFor();
 const row=page.locator('.cv-actions--experience');await row.scrollIntoViewIfNeeded();
 expect(await row.locator('a').allTextContents()).toEqual(['Contact','View portfolio →']);
 await expect(row.locator('[data-pdf-download]')).toHaveCount(0);
 const parent=(await row.boundingBox())!,contact=(await row.locator('a').first().boundingBox())!,portfolio=(await row.locator('a').last().boundingBox())!;
 expect(contact.height).toBe(40);expect(portfolio.height).toBe(40);
 if(page.viewportSize()!.width<=640){expect(contact.width).toBeCloseTo(parent.width,0);expect(portfolio.width).toBeCloseTo(parent.width,0);expect(portfolio.y-contact.y-contact.height).toBe(12);}
 else{expect(contact.width).toBe(96);expect(portfolio.width).toBe(164);expect(portfolio.x-contact.x-contact.width).toBe(12);}
 await row.locator('[data-contact-toggle]').click();await expect(page.locator('[data-contact-overlay]')).toHaveAttribute('aria-hidden','false');
 await page.keyboard.press('Escape');await expect(row.locator('[data-contact-toggle]')).toBeFocused();
});
