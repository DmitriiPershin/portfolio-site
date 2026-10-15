import {test,expect} from '@playwright/test';

test('CV reveals content gradually on entry and when reading further',async({page})=>{
 await page.goto('/cv');await page.locator('html[data-cv-motion="full"]').waitFor();
 const samples=await page.locator('.cv-profile h1').evaluate(async el=>{const values:number[]=[];const start=performance.now();await new Promise<void>(resolve=>{const tick=()=>{values.push(Number(getComputedStyle(el).opacity));if(performance.now()-start<1100)requestAnimationFrame(tick);else resolve();};tick();});return values;});
 expect(samples.some(value=>value>0&&value<1)).toBe(true);expect(samples.at(-1)).toBe(1);
 const job=page.locator('.cv-job').last();await expect(job).toHaveCSS('opacity','0');
 await job.scrollIntoViewIfNeeded();
 await expect.poll(()=>job.evaluate(el=>Number(getComputedStyle(el).opacity))).toBeGreaterThan(0);
 await expect(job).toHaveCSS('opacity','1');
});

test('Download and portfolio share hover treatment and Contact is the floating avatar',async({page})=>{
 await page.goto('/cv');await page.locator('html[data-cv-controls-ready]').waitFor();await page.evaluate(()=>document.fonts.ready);await expect(page.locator('.cv-profile .cv-actions')).toHaveCSS('opacity','1');
 await expect(page.locator('.cv-actions [href^="mailto:"]')).toHaveCount(0);
 await expect(page.locator('.avatar-button[data-contact-toggle]')).toBeVisible();
 const download=page.locator('.cv-profile [data-pdf-download]');const portfolio=page.locator('.cv-profile [data-portfolio-link]');
 await expect(download).toBeVisible();await expect(portfolio).toBeVisible();
 for(const action of [download,portfolio])await expect(action.locator(':scope > .card-border')).toHaveCount(1);
 if(await page.evaluate(()=>matchMedia('(hover: hover)').matches)){
  for(const action of [download,portfolio]){await action.hover();await expect.poll(()=>action.evaluate(el=>Number(getComputedStyle(el).getPropertyValue('--glow-opacity')))).toBeGreaterThan(.7);}
 }
 await download.click();await expect(page.getByRole('link',{name:'desktop pdf',exact:true})).toBeVisible();await expect(page.getByRole('link',{name:'mobile pdf',exact:true})).toBeVisible();const pdfFont=await page.locator('.pdf-overlay .morph-label__base').first().evaluate(el=>getComputedStyle(el).fontFamily);const languageFont=await page.locator('[data-language-overlay] .morph-label__base').first().evaluate(el=>getComputedStyle(el).fontFamily);expect(pdfFont).toBe(languageFont);
 await page.keyboard.press('Escape');await page.locator('.avatar-button').click();await expect(page.locator('[data-contact-overlay]')).toHaveAttribute('aria-hidden','false');
});

test('theme and route changes leave desktop controls and their icons in stable slots',async({page})=>{
 test.skip(page.viewportSize()!.width<=640,'Desktop toolbar');
 await page.goto('/cv');await page.locator('html[data-cv-controls-ready]').waitFor();await page.evaluate(()=>document.fonts.ready);await expect(page.locator('.cv-profile .cv-actions')).toHaveCSS('opacity','1');
 const snapshots=await page.evaluate(async()=>{
  const read=()=>Array.from(document.querySelectorAll('.menu-button,.language-button,.floating-header__cv,.cv-control--theme')).map(el=>{const r=el.getBoundingClientRect();return [r.x,r.y,r.width,r.height];});
  const values=[read()];(document.querySelector('.cv-control--theme') as HTMLElement).click();const start=performance.now();await new Promise<void>(resolve=>{const tick=()=>{values.push(read());if(performance.now()-start<850)requestAnimationFrame(tick);else resolve();};tick();});return values;
 });
 for(const snapshot of snapshots)expect(snapshot).toEqual(snapshots[0]);
 const cvSlots=await page.locator('.menu-button,.language-button,.floating-header__cv').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return [r.x,r.y,r.width,r.height];}));
 await page.locator('.cv-profile [data-portfolio-link]').click();await page.waitForURL('**/');
 const mainSlots=await page.locator('.menu-button,.language-button,.floating-header__cv').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return [r.x,r.y,r.width,r.height];}));expect(mainSlots).toEqual(cvSlots);
 const role=page.locator('[data-hero-role]');
 const values=await role.evaluate(async el=>{const result:number[]=[];const start=performance.now();await new Promise<void>(resolve=>{const tick=()=>{result.push(Number(getComputedStyle(el).opacity));if(performance.now()-start<1200)requestAnimationFrame(tick);else resolve();};tick();});return result;});
 expect(values.some(value=>value>0&&value<1)).toBe(true);expect(values.at(-1)).toBe(1);
});

test('phone logo fits the same width and position on both pages and headers scroll away',async({page})=>{
 test.skip(page.viewportSize()!.width>640,'Mobile shared header');await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,390,480,640]){
  await page.setViewportSize({width,height:844});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  const hero=await page.locator('.hero__logo img').boundingBox();expect(hero!.width).toBe(width-48);expect(hero!.height).toBeCloseTo((width-48)*214/951,1);expect(hero!.y).toBe(80);
  await page.locator('[data-cv-link]').click();await page.locator('html[data-cv-controls-ready]').waitFor();expect(await page.locator('.cv-wordmark img').boundingBox()).toEqual(hero);
  await page.evaluate(()=>scrollTo({top:600,behavior:'instant'}));
  expect(await page.locator('.cv-controls').evaluate(el=>el.getBoundingClientRect().bottom)).toBeLessThan(0);await expect(page.locator('.avatar-button')).toBeInViewport();
 }
});

test('CV retains the portfolio hero cursor glow and static export content',async({page})=>{
 test.skip(page.viewportSize()!.width<=640,'Fine-pointer glow');await page.goto('/cv');await page.locator('html[data-cv-controls-ready]').waitFor();await page.mouse.move(500,400);
 await expect(page.locator('[data-cursor-glow]')).toHaveAttribute('data-active','true');await expect(page.locator('[data-cursor-glow]')).toHaveCSS('opacity','0.45');await expect(page.locator('[data-cursor-glow]')).toHaveCSS('width','266px');
 await page.goto('/cv?view=pdf-desktop');await page.evaluate(()=>document.fonts.ready);
 await expect(page.locator('[data-pdf-download]')).toHaveCount(0);await expect(page.locator('.cv-actions [href^="mailto:"]')).toHaveCount(2);
 for(const job of await page.locator('.cv-job').all())await expect(job).toHaveCSS('opacity','1');
});

test('burger strokes stay at the same visible rows when changing theme',async({page})=>{
 test.skip(page.viewportSize()!.width<=640,'Desktop SVG versus light strokes');await page.emulateMedia({reducedMotion:'reduce'});
 const rows:number[][]=[];
 for(const theme of ['dark','light']){
  await page.goto('/cv?theme='+theme);await page.locator('html[data-cv-controls-ready]').waitFor();const png=await page.locator('.menu-button').screenshot();
  rows.push(await page.evaluate(async({base64,theme})=>{
   const data=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));const image=await createImageBitmap(new Blob([data],{type:'image/png'}));
   const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const context=canvas.getContext('2d')!;context.drawImage(image,0,0);const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;const found:number[]=[];
   for(let y=0;y<canvas.height;y++){let hit=false;for(let x=0;x<canvas.width;x++){const i=(y*canvas.width+x)*4;const rgb=[pixels[i],pixels[i+1],pixels[i+2]];if(theme==='dark'?rgb.every(v=>v>230):rgb.every(v=>v<40)){hit=true;break;}}if(hit)found.push(y);}return found;
  },{base64:png.toString('base64'),theme}));
 }
 expect(rows[0].length).toBeGreaterThan(0);expect(rows[1]).toEqual(rows[0]);
});
