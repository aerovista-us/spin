import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createServerAppAdapter} from '@aerovista-us/app-adapter/server';
import {createIdentityHandler} from './identity.mjs';
const origin=process.env.SPIN_ORIGIN;
const secret=process.env.SPIN_IDENTITY_SECRET;
if(!origin||!secret||new URL(origin).origin!==origin||!origin.startsWith('https://'))throw new Error('SPIN_ORIGIN and SPIN_IDENTITY_SECRET required');
const adapter=createServerAppAdapter({appId:'spin',identityGatewaySecret:secret,identityGatewayOrigin:process.env.IDENTITY_GATEWAY_ORIGIN});
const handle=createIdentityHandler({adapter,origin});
const root=new URL('../',import.meta.url);
const browserDir=new URL('.',import.meta.resolve('@aerovista-us/app-adapter/browser'));
const types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8'};
createServer(async(req,res)=>{
 try{
  const path=new URL(req.url,origin).pathname;
  if(await handle(req,res,path))return;
  if(req.method!=='GET'){res.writeHead(405);res.end();return;}
  if(path==='/health'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({ok:true,app:'spin',scope:'process'}));return;}
  let file;
  if(path==='/'||path==='/auth/callback')file=new URL('index.html',root);
  else if(/^\/(js|games|css)\/[a-zA-Z0-9_-]+\.(js|css)$/.test(path))file=new URL(path.slice(1),root);
  else if(/^\/adapter\/(browser|types|http|content)\.js$/.test(path))file=new URL(path.split('/').pop(),browserDir);
  else{res.writeHead(404);res.end();return;}
  let bytes=await readFile(fileURLToPath(file));
  const ext=file.pathname.split('.').pop();
  if(ext==='html')bytes=bytes.toString().replace('</body>','<script type="module" src="/js/account.js"></script></body>');
  res.writeHead(200,{'Content-Type':types[ext],'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY'});res.end(bytes);
 }catch(e){res.writeHead(e.code==='ENOENT'?404:500);res.end();}
}).listen(Number(process.env.PORT||5318),'127.0.0.1');
