import { gsap } from 'gsap';
import { revealHeroRole } from './motion';
import { motionEase, motionNumber as token, motionSeconds } from './motion-tokens';

type Arrival = {x:number;y:number;width:number;height:number;time:number;settled:boolean};
const returnKey = 'portfolio-return';
/** One exact SVG, uniform scaling in both directions and native anchors as fallback. */
export function initCvNavigation() {
  let navigating=false;
  let explicitReturn=false;
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reset=()=>{
    document.querySelectorAll('.cv-route-transition').forEach(layer=>layer.remove());
    document.querySelectorAll<HTMLElement>('[data-cv-source-hidden]').forEach(source=>{source.style.removeProperty('visibility');delete source.dataset.cvSourceHidden;});
    document.querySelector('.floating-header')?.removeAttribute('data-scroll-hidden');
    delete document.documentElement.dataset.cvNavigating;navigating=false;
  };
  const saveReturn=(settled:boolean)=>{
    const source=document.querySelector<HTMLImageElement>('.cv-wordmark img');if(!source)return;
    const r=source.getBoundingClientRect();
    try {sessionStorage.setItem(returnKey,JSON.stringify({x:r.x,y:r.y,width:r.width,height:r.height,time:Date.now(),settled}));}catch{}
  };
  const flight=(source:HTMLImageElement,from:Arrival,to:{x:number;y:number;width:number},done:()=>void,introduce=false)=>{
    const layer=document.createElement('div');layer.className='cv-route-transition';layer.setAttribute('aria-hidden','true');
    const backdrop=document.createElement('div');backdrop.className='cv-route-transition__backdrop';
    // Portfolio is always dark. The background settles while the single wordmark moves.
    backdrop.style.background='#000';
    const logo=source.cloneNode(false) as HTMLImageElement;logo.className='cv-route-transition__logo';logo.style.width=`${from.width}px`;logo.style.height=`${from.height}px`;
    layer.append(backdrop,logo);document.body.append(layer);source.style.visibility='hidden';source.dataset.cvSourceHidden='';
    document.documentElement.dataset.cvNavigating='true';
    gsap.set(logo,{x:from.x,y:from.y,opacity:introduce?0:1});gsap.set(backdrop,{opacity:0});
    const intro=introduce?motionSeconds('--cv-duration-backdrop'):0;
    const timeline=gsap.timeline({onComplete:done})
      .to(backdrop,{opacity:1,duration:motionSeconds('--cv-duration-backdrop'),ease:motionEase('change')},0)
      .to(logo,{x:to.x,y:to.y,scale:to.width/from.width,duration:motionSeconds('--cv-duration-logo'),ease:motionEase('route')},intro/2);
    if(introduce)timeline.to(logo,{opacity:1,duration:intro,ease:motionEase('change')},0);
  };
  const portfolioTarget=()=>{
    const width=innerWidth<=640?Math.min(token('--portfolio-logo-mobile-max'), innerWidth-token('--portfolio-logo-mobile-gutters')):Math.min(token('--cv-transition-source-max'),document.documentElement.clientWidth-2*token('--page-gutter'));
    return {x:(document.documentElement.clientWidth-width)/2,y:token(innerWidth<=640?'--portfolio-logo-mobile-top':'--portfolio-logo-top'),width};
  };
  const arrive=async()=>{
    if(location.pathname!=='/')return;
    if(location.hash){try{sessionStorage.removeItem(returnKey);}catch{}delete document.documentElement.dataset.routeArrival;return;}
    let stored:Arrival|null=null;
    try{stored=JSON.parse(sessionStorage.getItem(returnKey)||'null');sessionStorage.removeItem(returnKey);}catch{}
    if(!stored||Date.now()-stored.time>10000){delete document.documentElement.dataset.routeArrival;return;}
    window.scrollTo({top:0,behavior:'instant'});reset();
    const hero=document.querySelector<HTMLImageElement>('.hero__logo img');
    await document.fonts.ready;
    if(!hero||stored.settled||reduced()||innerWidth<=640){revealHeroRole();delete document.documentElement.dataset.routeArrival;return;}
    await hero.decode().catch(()=>{});
    const target=portfolioTarget();
    if(stored.y<0||stored.y>innerHeight)stored.y=token('--cv-top');
    flight(hero,stored,target,()=>{reset();revealHeroRole();delete document.documentElement.dataset.routeArrival;});
  };
  window.addEventListener('pageshow',()=>{reset();void arrive();});
  window.addEventListener('pagehide',()=>{if(location.pathname==='/cv'&&!explicitReturn)saveReturn(false);});
  if(document.readyState==='complete')void arrive();
  document.addEventListener('click',async event=>{
    const target=event.target instanceof Element?event.target:null;
    if(target?.closest('[data-portfolio-section-link]')){explicitReturn=true;try{sessionStorage.removeItem(returnKey);}catch{}return;}
    const link=target?.closest<HTMLAnchorElement>('[data-cv-link], [data-menu-cv-link], [data-portfolio-link]');
    if(!link||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||reduced())return;
    const reverse=link.hasAttribute('data-portfolio-link');
    const source=document.querySelector<HTMLImageElement>(reverse?'.cv-wordmark img':'.hero__logo img');if(!source)return;
    event.preventDefault();if(navigating)return;navigating=true;
    document.querySelector('.floating-header')?.removeAttribute('data-scroll-hidden');
    if(innerWidth<=640){if(reverse){explicitReturn=true;saveReturn(true);}location.assign(link.href);return;}
    await source.decode().catch(()=>{});
    const r=source.getBoundingClientRect();
    const gutter=token('--cv-gutter');const contentWidth=Math.min(token('--cv-width'),document.documentElement.clientWidth-2*gutter);
    const to=reverse?portfolioTarget():{x:(document.documentElement.clientWidth-contentWidth)/2,y:token(innerWidth<=640?'--cv-mobile-screen-top':'--cv-top'),width:Math.min(token('--cv-logo-width'),contentWidth)};
    const inView=r.bottom>0&&r.top<innerHeight;
    const staging=reverse?{...to,width:Math.min(token('--cv-logo-width'),contentWidth)}:portfolioTarget();
    const width=inView?r.width:staging.width;
    const height=width*source.naturalHeight/source.naturalWidth;
    const from={x:inView?r.x:(document.documentElement.clientWidth-width)/2,y:inView?r.y:staging.y,width,height,time:Date.now(),settled:false};
    flight(source,from,to,()=>{
      if(reverse){explicitReturn=true;saveReturn(true);}
      location.assign(link.href);
    },!inView);
  });
}
