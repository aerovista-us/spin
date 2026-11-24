// Same-origin SPIN session boundary; gateway is authoritative.
const COOKIE = '__Host-spin_session';
const json = (res,status,data,headers={}) => {res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers});res.end(JSON.stringify(data));};
function token(req){const c=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='));try{return c?decodeURIComponent(c.slice(COOKIE.length+1)):null;}catch{return null;}}
const cookie=(value,age)=>COOKIE+'='+encodeURIComponent(value)+'; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age='+age;
async function body(req){let s='';for await(const chunk of req){s+=chunk;if(s.length>8192)throw Object.assign(new Error('body too large'),{status:413});}try{return JSON.parse(s);}catch{throw Object.assign(new Error('invalid body'),{status:400});}}
function safeIdentity(i){return {name:typeof i.name==='string'?i.name:null,division:i.profile?.division??null};}
export function createIdentityHandler({adapter,origin}){
 if(!adapter||!origin)throw new Error('Adapter and origin required');
 return async function handle(req,res,path){
  if(!path.startsWith('/api/auth/'))return false;
  try{
   const post=['/api/auth/handoff-exchange','/api/auth/logout'].includes(path);
   const read=['/api/auth/session','/api/auth/me'].includes(path);
   if(!post&&!read){json(res,404,{error:'not_found'});return true;}
   if(req.method!==(post?'POST':'GET')){json(res,405,{error:'method_not_allowed'});return true;}
   if(post&&(req.headers.origin!==origin||req.headers['sec-fetch-site']==='cross-site')){json(res,403,{error:'origin_denied'});return true;}
   const t=token(req);
   if(path==='/api/auth/handoff-exchange'){
    if(!String(req.headers['content-type']||'').startsWith('application/json')){json(res,415,{error:'json_required'});return true;}
    const data=await body(req);if(typeof data?.code!=='string'||!data.code||data.code.length>4096){json(res,400,{error:'invalid_code'});return true;}
    const x=await adapter.auth.exchangeHandoff(data.code);
    const age=Math.floor((Date.parse(x.expiresAt)-Date.now())/1000);
    if(!x.ok||typeof x.sessionToken!=='string'||!x.sessionToken||!Number.isFinite(age)||age<=0){json(res,502,{error:'exchange_failed'});return true;}
    json(res,200,{ok:true},{'Set-Cookie':cookie(x.sessionToken,Math.min(age,86400))});return true;
   }
   if(path==='/api/auth/logout'){
    if(t){const r=await adapter.auth.revokeSession(t);if(!r.ok||!r.revoked){json(res,503,{error:'revocation_unconfirmed'});return true;}}
    json(res,200,{ok:true},{'Set-Cookie':cookie('',0)});return true;
   }
   if(!t){json(res,200,{authenticated:false});return true;}
   const d=await adapter.identity.describe(t);
   if(!d.ok){json(res,503,{error:'identity_unavailable'});return true;}
   if(!d.authenticated||!d.identity||d.identity.status!=='active'){json(res,200,{authenticated:false},{'Set-Cookie':cookie('',0)});return true;}
   json(res,200,{authenticated:true,identity:safeIdentity(d.identity)});return true;
  }catch(e){const status=[400,413].includes(e.status)?e.status:([401,403].includes(e.status)?401:503);json(res,status,{error:status===503?'identity_unavailable':'request_denied'});return true;}
 };
}
