import {saveLanguage} from "../lib/language";
import { gsap } from 'gsap';
import { initOverlays, initMenuFit, initTypeCrossfades, initSectionFeedback, initBorderGlow, initMobileScrollGlow } from './motion';
import { initCardBorders } from "./borders";
import { initCvReveals } from "./cv-motion";
import { motionEase, motionSeconds } from './motion-tokens';
import pdfManifest from '../data/cv-pdf-manifest.json';

type Theme = 'dark' | 'light';
type Language = 'en' | 'ru';
const colors = {dark:{'--color-bg':'#000000','--color-text':'#f6f4ff','--cv-accent':'#b995dc'},light:{'--color-bg':'#f6f4ff','--color-text':'#000000','--cv-accent':'#765592'}};
const preferenceURL = (lang: string, theme: string) => `/cv?lang=${lang}&theme=${theme}`;

export async function initCvControls() {
  const root = document.documentElement;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let themeTimeline: gsap.core.Timeline | undefined;
  let languageRequest: AbortController | undefined;
  let disposeBorders: (() => void) | undefined;
  let disposeGlow: (() => void) | undefined;
  const initActionBorders = () => {
    disposeBorders?.();disposeGlow?.();
    if(root.dataset.cvView)return;
    disposeBorders=initCardBorders();
    if(!reduced())disposeGlow=innerWidth<=640?initMobileScrollGlow():initBorderGlow();
  };

  const syncPreferences = () => {
    const lang = root.lang === 'ru' ? 'ru' : 'en';
    const theme = root.dataset.cvTheme === 'light' ? 'light' : 'dark';
    const toggle = document.querySelector<HTMLAnchorElement>('.cv-control--theme');
    if (toggle) {
      toggle.href = preferenceURL(lang, theme === 'dark' ? 'light' : 'dark');
      toggle.setAttribute('aria-label', lang === 'ru' ? (theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему') : (theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'));
    }
    document.querySelectorAll<HTMLElement>('[data-language-option]').forEach(choice => choice.setAttribute('aria-pressed', String(choice.dataset.languageOption === lang)));

    document.querySelectorAll<HTMLElement>('[data-pdf-format]').forEach(choice => {
      const url = pdfManifest.approved ? (pdfManifest.variants as Record<string,{url:string}>)[`${lang}-${theme}-${choice.dataset.pdfFormat}`]?.url : undefined;
      if (choice instanceof HTMLAnchorElement) { if (url) choice.href=url; else {choice.removeAttribute('href');choice.setAttribute('aria-disabled','true');} }
    });
    document.querySelectorAll<HTMLAnchorElement>('.cv-nojs a').forEach(link => {const target = new URL(link.href).searchParams.get('lang') || 'en';link.href=preferenceURL(target,theme);});
    const cvLink=document.querySelector<HTMLAnchorElement>(".cv-controls .floating-header__cv");if(cvLink)cvLink.href=preferenceURL(lang,theme);
    history.replaceState(history.state, '', preferenceURL(lang, theme) + location.hash);
  };

  const setTheme = (next: Theme) => {
    const properties = Object.keys(colors.dark);
    const current = getComputedStyle(root);
    const start = Object.fromEntries(properties.map(key => [key,current.getPropertyValue(key).trim()]));
    themeTimeline?.kill();
    properties.forEach(key => root.style.setProperty(key,start[key]));
    root.dataset.cvTheme = next;
    const icon = document.querySelector<HTMLImageElement>('.cv-control--theme img');
    const swapIcon = () => {if (icon) icon.src=next === 'dark' ? '/assets/cv-theme-light.svg' : '/assets/cv-theme-dark.svg';};
    const finish = () => {properties.forEach(key => root.style.removeProperty(key));if(icon)gsap.set(icon,{clearProps:'opacity,transform'});};
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colors[next]['--color-bg']);
    syncPreferences();
    if (reduced()) {swapIcon();finish();return;}
    themeTimeline=gsap.timeline({onComplete:finish});
    themeTimeline.to(root,{...colors[next],duration:motionSeconds('--cv-duration-theme'),ease:motionEase('change')},0);
    if(icon){
      themeTimeline.to(icon,{opacity:0,duration:motionSeconds('--cv-duration-theme-icon'),ease:motionEase('change')},0)
        .call(swapIcon,[],motionSeconds('--cv-duration-theme-icon'))
        .to(icon,{opacity:1,duration:motionSeconds('--cv-duration-theme-icon'),ease:motionEase('change')},motionSeconds('--cv-duration-theme-icon'));
    }
  };

  const setLanguage = async (lang: Language) => {
    languageRequest?.abort();
    if (root.lang === lang) {document.querySelector<HTMLButtonElement>('[data-language-toggle]')?.focus({preventScroll:true});return;}
    const request = new AbortController();languageRequest=request;
    try {
      const response=await fetch(preferenceURL(lang,root.dataset.cvTheme || 'dark'),{signal:request.signal});
      if(!response.ok)throw new Error('CV language unavailable');
      const incoming=new DOMParser().parseFromString(await response.text(),'text/html');
      if(request.signal.aborted)return;
      const main=document.querySelector('.cv-page');const translated=incoming.querySelector('.cv-page');
      if(!main||!translated)throw new Error('CV content missing');
      main.replaceChildren(...Array.from(translated.childNodes));
      initCvReveals(false);
      initActionBorders();
      root.lang=lang;document.title=incoming.title;
      document.querySelector('meta[name="description"]')?.setAttribute('content',incoming.querySelector('meta[name="description"]')?.getAttribute('content') || '');
      for(const selector of ['.cv-control--menu','.cv-control--language','[data-language-close]','[data-menu-close]','.language-dialog']){
        const target=document.querySelector(selector);const source=incoming.querySelector(selector);const label=source?.getAttribute('aria-label');if(target&&label)target.setAttribute('aria-label',label);
      }

      const toggle=document.querySelector<HTMLButtonElement>('[data-language-toggle]');toggle?.focus({preventScroll:true});
      syncPreferences();
    } catch(error) {
      if(!request.signal.aborted)location.assign(preferenceURL(lang,root.dataset.cvTheme || 'dark'));
    }
  };

  initOverlays();
  initSectionFeedback();
  initCvReveals();
  document.addEventListener('click',event => {
    const target=event.target instanceof Element ? event.target : null;
    const theme=target?.closest<HTMLAnchorElement>('.cv-control--theme');
    if(theme&&event instanceof MouseEvent&&event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){event.preventDefault();setTheme(root.dataset.cvTheme === 'dark' ? 'light' : 'dark');return;}
    const language=target?.closest<HTMLElement>('[data-language-option]');
    if(language){const next=language.dataset.languageOption;if(next==='en'||next==='ru'){saveLanguage(next);void setLanguage(next);}return;}
  });
  window.addEventListener('pageshow',event=>{if(event.persisted)initActionBorders();});
  window.addEventListener('pagehide',()=>{themeTimeline?.kill();languageRequest?.abort();disposeBorders?.();disposeGlow?.();});
  await Promise.allSettled([document.fonts.load('16px "Joyride Outline"'),document.fonts.load('16px "Joyride Regular"'),document.fonts.load('16px "LINE Seed JP"')]);
  initMenuFit();initTypeCrossfades();initActionBorders();root.dataset.cvControlsReady='';
}
