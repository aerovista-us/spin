import {createBrowserAppAdapter} from '/adapter/browser.js';
const av=createBrowserAppAdapter({appId:'spin',appOrigin:location.origin,stateStorageKey:'spin_handoff_state'});
const panel=document.createElement('aside');
panel.setAttribute('aria-label','AeroVista account');
panel.style.cssText='position:fixed;top:8px;right:8px;z-index:9999;background:#101824;color:#fff;padding:8px;border-radius:8px;font:14px system-ui;max-width:90vw';
const label=document.createElement('span');label.setAttribute('role','status');panel.append(label);
const btn=(name,fn)=>{const b=document.createElement('button');b.textContent=name;b.style.marginLeft='6px';b.onclick=fn;panel.append(b);return b;};
document.body.append(panel);
const login=btn('Sign in',()=>av.auth.beginLogin({next:'/'}));
const register=btn('Register',()=>av.auth.beginRegistration({next:'/'}));
const logout=btn('Sign out',async()=>{try{await av.auth.logout();location.reload();}catch{label.textContent='Sign-out not confirmed. Retry.';}});
logout.hidden=true;login.hidden=true;register.hidden=true;
try{
 if(location.pathname==='/auth/callback'){
  const url=location.href;history.replaceState(null,'','/');
  await av.auth.completeLogin({url});
 }
 const s=await av.auth.session();
 if(s.authenticated){label.textContent='AeroVista · '+(s.identity?.name||'Member');logout.hidden=false;}
 else{label.textContent='Guest play';login.hidden=false;register.hidden=false;}
}catch{label.textContent='Account unavailable · guest play';login.hidden=false;register.hidden=false;}
