import {test,expect} from '@playwright/test';

test('CV from a lower section fades in one logo before settling into its final slot',async({page})=>{
 test.skip(page.viewportSize()!.width<=640,'Phone keeps identical logo geometry and native route');
 await page.addInitScript(()=>window.addEventListener('beforeunload',()=>{
  const el=document.querySelector('.cv-route-transition__logo');if(!el)return;const r=el.getBoundingClientRect();
  sessionStorage.setItem('lower-flight-final',JSON.stringify({x:r.x,y:r.y,width:r.width,height:r.height,opacity:getComputedStyle(el).opacity}));
 }));
 await page.goto('/');await page.waitForFunction(()=>document.documentElement.dataset.motion==='full');
 await page.evaluate(()=>scrollTo({top:1800,behavior:'instant'}));await page.waitForTimeout(200);
 await page.evaluate(()=>scrollTo({top:1650,behavior:'instant'}));
 await expect(page.locator('[data-cv-link]')).toBeVisible();
 expect(await page.locator('.hero__logo img').evaluate(el=>el.getBoundingClientRect().bottom)).toBeLessThan(0);
 // Collect the entire staged transition, including its first zero-alpha frame.
 await page.evaluate(()=>{
  const values:{opacity:number;width:number;height:number}[]=[];(window as any).flightSamples=values;
  const tick=()=>{const logo=document.querySelector('.cv-route-transition__logo');if(logo){const r=logo.getBoundingClientRect();values.push({opacity:Number(getComputedStyle(logo).opacity),width:r.width,height:r.height});}if(!values.length||document.querySelector('.cv-route-transition'))requestAnimationFrame(tick);};requestAnimationFrame(tick);
  (document.querySelector('[data-cv-link]') as HTMLElement).click();
 });
 await expect(page.locator('.cv-route-transition__logo')).toBeAttached();
 await expect(page.locator('.cv-route-transition img')).toHaveCount(1);
 await page.waitForTimeout(450);
 const values=await page.evaluate(()=>(window as any).flightSamples as {opacity:number;width:number;height:number}[]);
 expect(values[0].opacity).toBeLessThan(.1);expect(values.some(v=>v.opacity>.1&&v.opacity<.9)).toBe(true);
 expect(values[0].width).toBeGreaterThan(625.334);
 for(const value of values)expect(value.width/value.height).toBeCloseTo(951/214,3);
 await page.waitForURL('**/cv');await page.locator('html[data-cv-controls-ready]').waitFor();
 const final=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('lower-flight-final')!));const actual=await page.locator('.cv-wordmark img').boundingBox();
 for(const key of ['x','y','width','height'] as const)expect(final[key]).toBeCloseTo(actual![key],0);expect(final.opacity).toBe('1');
});

test('CV actions keep the soft-skill contour after theme and language changes',async({page})=>{
 await page.goto('/cv');await page.locator('html[data-cv-controls-ready]').waitFor();await page.evaluate(()=>document.fonts.ready);await expect(page.locator('.cv-profile .cv-actions')).toHaveCSS('opacity','1');
 const action=page.locator('.cv-profile .cv-action[data-portfolio-link]');
 for(const translated of [false,true]){
  if(translated){await page.locator('[data-language-toggle]').click();await page.locator('[data-language-option="ru"]').click();await expect(page.locator('html')).toHaveAttribute('lang','ru');await page.locator('.cv-control--theme').click();await expect(page.locator('html')).toHaveAttribute('data-cv-theme','light');}
  await expect(action).toBeVisible();const stroke=action.locator(':scope > .card-border');await expect(stroke).toHaveCount(1);await expect(stroke).toHaveAttribute('data-stroke-width','1');
  await expect(page.locator('.cv-profile [data-pdf-download]')).toBeVisible();
  const bounds=await action.boundingBox();const before=await action.evaluate(el=>getComputedStyle(el).getPropertyValue('--glow-angle'));
  if(page.viewportSize()!.width>640){await action.hover({position:{x:bounds!.width-12,y:bounds!.height/2}});await expect.poll(()=>action.evaluate(el=>getComputedStyle(el).getPropertyValue('--glow-angle'))).not.toBe(before);await expect.poll(()=>action.evaluate(el=>Number(getComputedStyle(el).getPropertyValue('--glow-opacity')))).toBeGreaterThan(.7);}
  else {await page.evaluate(()=>scrollBy({top:80,behavior:'instant'}));await expect.poll(()=>action.evaluate(el=>getComputedStyle(el).getPropertyValue('--glow-angle'))).not.toBe(before);}
  expect(await stroke.evaluate(el=>getComputedStyle(el,'::before').backgroundImage)).toContain('conic-gradient');
 }
 await expect(page.locator('.avatar-button')).toHaveCSS('width',page.viewportSize()!.width<=640?'37.5px':'75px');
});
