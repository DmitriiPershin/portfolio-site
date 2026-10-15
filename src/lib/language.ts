export type Language = 'en' | 'ru';
export const LANGUAGE_KEY = 'portfolio-language';
// Legacy versions wrote LANGUAGE_KEY even without a user selection.
const MANUAL_LANGUAGE_KEY = 'portfolio-language-choice';
const supported = (value: string | null | undefined): Language | undefined => {
  const code=value?.trim().toLowerCase().split('-')[0];return code==='en'||code==='ru'?code:undefined;
};
export function resolveLanguage(explicit?:string|null,saved?:string|null,languages:readonly string[]=[]):Language {
  return supported(explicit)||supported(saved)||languages.map(supported).find(Boolean)||'en';
}
export function requestLanguage(request:Request,cookie?:string):Language {
  const languages=(request.headers.get('accept-language')||'').split(',').map((entry,index)=>{
    const [code,...parameters]=entry.trim().split(';');const quality=parameters.find(value=>value.trim().startsWith('q='));
    return {code,q:quality?Number(quality.trim().slice(2)):1,index};
  }).filter(entry=>Number.isFinite(entry.q)&&entry.q>0).sort((a,b)=>b.q-a.q||a.index-b.index).map(entry=>entry.code);
  return resolveLanguage(new URL(request.url).searchParams.get('lang'),cookie,languages);
}
export function clientLanguage():Language {
  let saved:string|null=null;try{saved=localStorage.getItem(MANUAL_LANGUAGE_KEY);}catch{}
  const cookie=document.cookie.split('; ').find(item=>item.startsWith(LANGUAGE_KEY+'='))?.split('=')[1];
  return resolveLanguage(new URL(location.href).searchParams.get('lang'),cookie||saved,navigator.languages?.length?navigator.languages:[navigator.language]);
}
export function saveLanguage(language:Language){
  try{localStorage.setItem(MANUAL_LANGUAGE_KEY,language);localStorage.setItem(LANGUAGE_KEY,language);}catch{}
  document.cookie=`${LANGUAGE_KEY}=${language}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;
}
