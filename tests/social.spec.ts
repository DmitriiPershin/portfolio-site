import {test, expect} from '@playwright/test';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';

const copy = {
  en: {name:'Dmitrii Pershin',description:'AI-assisted design, design systems and complex fintech interfaces. Around 20 years of experience in design.',locale:'en_US'},
  ru: {name:'Дмитрий Першин',description:'AI-процессы, дизайн-системы и сложные fintech-интерфейсы. Около 20 лет опыта в дизайне.',locale:'ru_RU'},
};

test('crawlers receive localized route metadata and exact public Figma assets without JavaScript',async({request,browser},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium','HTTP metadata/asset matrix is viewport independent');
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  for(const route of ['/','/cv']) for(const language of ['en','ru'] as const){
    const response=await request.get(`${route}?lang=${language}`,{headers:{'Accept-Language':language==='en'?'ru':'en','User-Agent':'facebookexternalhit/1.1'}});
    expect(response.ok()).toBeTruthy();
    await page.setContent(await response.text());
    const data=copy[language],cv=route==='/cv';
    const title=`${data.name} — ${cv?'CV | ':''}Senior Product Designer`;
    const description=`${cv?'CV: ':''}${data.description}`;
    await expect(page).toHaveTitle(title);
    for(const selector of ['meta[property="og:title"]','meta[name="twitter:title"]'])await expect(page.locator(selector)).toHaveAttribute('content',title);
    for(const selector of ['meta[name="description"]','meta[property="og:description"]','meta[name="twitter:description"]'])await expect(page.locator(selector)).toHaveAttribute('content',description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://pershindmitrii.com${route}?lang=${language}`);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content',`https://pershindmitrii.com${route}?lang=${language}`);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content',data.locale);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content','https://pershindmitrii.com/assets/og-image.png');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content','summary_large_image');
    await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href','/favicon.svg');
  }
  for(const [path,width,height,type] of [
    ['/assets/og-image.png',1280,630,'image/png'],['/favicon-32.png',32,32,'image/png'],['/apple-touch-icon.png',180,180,'image/png'],['/favicon.svg',150,150,'image/svg+xml'],
  ] as const){
    const response=await request.get(path);expect(response.ok()).toBeTruthy();expect(response.headers()['content-type']).toContain(type);
    const bytes=await response.body();expect(createHash('sha256').update(bytes).digest('hex')).toBe(createHash('sha256').update(readFileSync(`public${path}`)).digest('hex'));
    if(type==='image/png'){expect(bytes.readUInt32BE(16)).toBe(width);expect(bytes.readUInt32BE(20)).toBe(height);}
    else {expect(bytes.toString()).toContain('width="150"');expect(bytes.toString()).not.toMatch(/<text|https?:\/\/(?!www.w3.org)/);}
  }
  await context.close();
});

for(const route of ['/','/cv']) test(`share copy follows in-place language changes on ${route}`,async({page})=>{
  await page.goto(`${route}?lang=en`);await page.emulateMedia({reducedMotion:'reduce'});
  for(const language of ['ru','en'] as const){
    await page.locator('[data-language-toggle]').click();
    await page.locator(`[data-language-option="${language}"]`).click();
    await expect(page.locator('html')).toHaveAttribute('lang',language);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',`${copy[language].name} — ${route==='/cv'?'CV | ':''}Senior Product Designer`);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content',copy[language].locale);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content',`https://pershindmitrii.com${route}?lang=${language}`);
  }
});
