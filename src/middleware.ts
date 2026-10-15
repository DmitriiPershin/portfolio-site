import {defineMiddleware} from 'astro:middleware';
import {LANGUAGE_KEY,requestLanguage} from './lib/language';
export const onRequest=defineMiddleware(async(context,next)=>{
  context.locals.language=requestLanguage(context.request,context.cookies.get(LANGUAGE_KEY)?.value);
  const response=await next();
  if(context.url.pathname==='/'||context.url.pathname==='/cv')response.headers.append('Vary','Accept-Language, Cookie');
  if(context.url.pathname!=='/'||!response.headers.get('content-type')?.includes('text/html'))return response;
  // Locale spans/SVG text are authored in both languages. Select them in SSR too,
  // so first paint and no-JavaScript requests follow the same browser preference.
  const html=(await response.text()).replace(/<([a-z][\w:-]*)(\s[^>]*\bdata-locale="(en|ru)"[^>]*)>/gi,(_tag,name,attributes,language)=>
    `<${name}${attributes.replace(/\s+hidden(?:="[^"]*")?/g,'')}${language===context.locals.language?'':' hidden'}>`);
  const headers=new Headers(response.headers);headers.delete("content-length");
  return new Response(html,{status:response.status,statusText:response.statusText,headers});
});
