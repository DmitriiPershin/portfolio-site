import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {motionEase,motionNumber,motionSeconds} from './motion-tokens';

gsap.registerPlugin(ScrollTrigger);
let animations:gsap.core.Tween[]=[];
/** Text is present in HTML. Only motion, never content loading, depends on JavaScript. */
export function initCvReveals(animateVisible=true){
  animations.forEach(animation=>{animation.scrollTrigger?.kill();animation.kill();});animations=[];
  const root=document.documentElement;
  const items=Array.from(document.querySelectorAll<HTMLElement>('.cv-profile > *, .cv-experience > h2, .cv-job, .cv-practice > section, .cv-footer'));
  if(root.dataset.cvView || matchMedia('(prefers-reduced-motion: reduce)').matches){gsap.set(items,{opacity:1,clearProps:'transform'});root.dataset.cvMotion='reduced';return;}
  for(const item of items){
    const rect=item.getBoundingClientRect();
    if(rect.top<0||(!animateVisible&&rect.top<innerHeight*.88)){gsap.set(item,{opacity:1,clearProps:'transform'});continue;}
    const tween=gsap.fromTo(item,{opacity:0,y:motionNumber('--motion-reveal-distance')},{opacity:1,y:0,duration:motionSeconds('--motion-reveal-duration'),ease:motionEase('reveal'),scrollTrigger:{trigger:item,start:'top 88%',once:true},onComplete:()=>gsap.set(item,{clearProps:'transform'})});
    animations.push(tween);
  }
  void document.fonts.ready.then(()=>ScrollTrigger.refresh());
  root.dataset.cvMotion='full';
}
