import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {createIdentityHandler} from './identity.mjs';
test('identity boundary: anonymous, origin, handoff, live identity, revoke',async()=>{
 const origin='https://spin.example';let active=true,exchanges=0;
 const adapter={auth:{exchangeHandoff:async()=>{exchanges++;return {ok:true,sessionToken:'private-token',expiresAt:new Date(Date.now()+60000).toISOString()};},revokeSession:async()=>{active=false;return {ok:true,revoked:true};}},identity:{describe:async t=>({ok:true,authenticated:active&&t==='private-token',identity:{status:'active',name:'Test Member',email:'private@example.com',profile:{division:'Test'}}})}};
 const handler=createIdentityHandler({adapter,origin});
 const s=createServer((q,r)=>handler(q,r,q.url));await new Promise(r=>s.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+s.address().port;
 try{
  assert.deepEqual(await (await fetch(base+'/api/auth/session')).json(),{authenticated:false});
  const post={method:'POST',headers:{'Content-Type':'application/json',Origin:'https://other.example'},body:'{"code":"one"}'};
  assert.equal((await fetch(base+'/api/auth/handoff-exchange',post)).status,403);assert.equal(exchanges,0);
  post.headers.Origin=origin;const e=await fetch(base+'/api/auth/handoff-exchange',post);assert.equal(e.status,200);assert.deepEqual(await e.json(),{ok:true});
  const c=e.headers.get('set-cookie');assert.match(c,/HttpOnly/);assert.match(c,/Secure/);
  const headers={Cookie:c.split(';')[0],Origin:origin};
  const v=await (await fetch(base+'/api/auth/session',{headers})).json();assert.deepEqual(v,{authenticated:true,identity:{name:'Test Member',division:'Test'}});
  assert.equal((await fetch(base+'/api/auth/logout',{method:'POST',headers})).status,200);
  assert.equal((await (await fetch(base+'/api/auth/session',{headers})).json()).authenticated,false);
 }finally{s.closeAllConnections();await new Promise(r=>s.close(r));}
});
