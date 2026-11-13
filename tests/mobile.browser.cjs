/* Run with npm test after npm install. Uses Chromium mobile emulation, not physical-device certification. */
const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const puppeteer = require('puppeteer');
const root = path.resolve(__dirname, '..');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
  const browser = await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  try {
    const page = await browser.newPage(), errors = [];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('requestfailed',r=>errors.push(r.url()+': '+r.failure().errorText));
    const cdp = await page.createCDPSession();
    await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
    await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:3});
    await page.goto(pathToFileURL(path.join(root,'index.html')).href,{waitUntil:'networkidle0'});
    await page.evaluate(()=>{localStorage.clear();localStorage.setItem('slotCabinet.v1',JSON.stringify({muted:true,turbo:true,gameId:'aerovista'}));});
    await page.reload({waitUntil:'networkidle0'});
    await page.evaluate(()=>document.fonts.ready);
    async function bounds() {
      const result = await page.evaluate(()=>{
        const rect = el => {const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
        return {
          width:innerWidth,height:innerHeight,scrollW:document.documentElement.scrollWidth,scrollH:document.documentElement.scrollHeight,
          deck:rect(document.querySelector('.deck')),
          controls:['bMenu','bSound','bAuto','bMax','bBetDown','bBetUp','bSpin'].map(id=>{
            const el=document.getElementById(id),r=rect(el),hit=document.elementFromPoint(r.x+r.w/2,r.y+r.h/2);
            return {id,...r,hit:hit===el||el.contains(hit)};
          })
        };
      });
      assert.ok(result.scrollW<=result.width+1,'Horizontal overflow');
      assert.ok(result.scrollH<=result.height+1,'Vertical overflow');
      for (const r of result.controls) {
        assert.ok(r.w>=44&&r.h>=44,r.id+' touch target');
        assert.ok(r.x>=0&&r.y>=0&&r.right<=result.width+1&&r.bottom<=result.height+1,r.id+' clipped');
        assert.ok(r.hit,r.id+' hit target obstructed');
      }
      return result;
    }
    async function resize(width,height) {
      await page.setViewport({width,height,isMobile:true,hasTouch:true,deviceScaleFactor:3});
      await pause(180);
      return bounds();
    }
    for (const [w,h] of [[320,568],[375,667],[390,700],[390,844],[412,915],[568,320],[667,375],[844,390]]) {
      await resize(w,h);
      await page.tap('#bMenu');
      await page.waitForFunction(()=>getComputedStyle(document.querySelector('.menu')).transform==='none');
      for (const tab of ['games','paytable','help','settings']) {
        await page.locator('[data-tab="'+tab+'"]').click();
        const menu=await page.evaluate(()=>{
          const el=document.querySelector('.menu'),b=document.querySelector('.menu-body'),r=el.getBoundingClientRect();
          return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:innerWidth,height:innerHeight,client:b.clientWidth,scroll:b.scrollWidth,tabs:[...document.querySelectorAll('.tab')].map(t=>t.getBoundingClientRect().y)};
        });
        assert.ok(menu.x>=0&&menu.y>=0&&menu.right<=w+1&&menu.bottom<=h+1,'Menu bounds');
        assert.ok(menu.scroll<=menu.client+1,'Menu horizontal overflow');
        assert.ok(Math.max(...menu.tabs)-Math.min(...menu.tabs)<1,'Wrapped tabs');
      }
      await page.tap('.m-close');
      console.log(w+'x'+h+': controls, hit targets and all menu tabs pass');
    }
    await resize(390,844);
    await page.evaluate(()=>SlotApp.openMenu('games'));
    assert.equal(await page.$$eval('[data-game]',els=>els.length),5);
    await page.tap('.m-close');
    for (const id of ['aerovista','echoverse','wild125','cyber','fruits']) {
      await page.evaluate(()=>SlotApp.openMenu('games'));
      await page.locator('[data-game="'+id+'"]').click();
      await page.evaluate(()=>document.fonts.ready);
      await pause(900);
      assert.equal(await page.evaluate(()=>SlotApp.game()),id);
      const before = await bounds();
      // Compare the opaque control area, excluding transparent rounded cabinet corners.
      const clip=await page.$eval('.buttons',el=>{const r=el.getBoundingClientRect();return {x:Math.ceil(r.x),y:Math.ceil(r.y),width:Math.floor(r.width)-2,height:Math.floor(r.height)-2};});
      await page.evaluate(()=>SlotFX.clear());
      const pixelsBefore=await page.screenshot({clip});
      await page.evaluate(()=>{
        const r=document.querySelector('.deck').getBoundingClientRect();
        SlotFX.burst(r.x+r.width/2,r.y+r.height/2,60,1);
      });
      await pause(120);
      assert.ok(await page.evaluate(()=>SlotFX.count()>0&&SlotFX.count()<=90),'Mobile particle budget');
      const pixelsDuring=await page.screenshot({clip});
      if (!Buffer.from(pixelsBefore).equals(Buffer.from(pixelsDuring))) {
        require('node:fs').writeFileSync(path.join(require('node:os').tmpdir(),'spin-'+id+'-before.png'),pixelsBefore);
        require('node:fs').writeFileSync(path.join(require('node:os').tmpdir(),'spin-'+id+'-during.png'),pixelsDuring);
        assert.fail(id+': particles or idle motion changed control pixels');
      }
      const during=await bounds();
      assert.deepEqual(during.controls,before.controls,id+': effect moved controls');
      await page.evaluate(()=>SlotFX.clear());
      const credits=await page.evaluate(()=>SlotApp.state().credits);
      await page.evaluate(()=>{
        const symbols=SlotGames.get(SlotApp.game()).symbols.filter(s=>!s.type);
        SlotApp.forceNext(Array.from({length:6},(_,c)=>Array(4).fill(symbols[c%2].id)));
      });
      await page.tap('#bSpin');
      await page.waitForFunction(()=>SlotApp.busy());
      await resize(390,700);await resize(844,390);await resize(390,844);
      await page.waitForFunction(()=>!SlotApp.busy(),{timeout:20000});
      assert.ok(await page.evaluate(b=>SlotApp.state().credits<b,credits),'Touch spin did not settle');
      console.log(id+': deck pixels and bounds stable under particles; spin and rotation pass');
    }
    await page.evaluate(()=>{
      SlotApp.state().turbo=false;
      const syms=SlotGames.get(SlotApp.game()).symbols.filter(s=>!s.type);
      SlotApp.forceNext(Array.from({length:6},(_,c)=>Array(4).fill(syms[c%2].id)));
    });
    await page.tap('#bSpin');
    await page.waitForFunction(()=>SlotApp.busy());
    await page.tap('#bSpin');
    await page.waitForFunction(()=>!SlotApp.busy(),{timeout:20000});
    await bounds();
    await page.evaluate(()=>SlotApp.applyGame('aerovista'));
    assert.ok(await page.evaluate(()=>!SlotGames.get('aerovista').symbols.some(s=>/wing|plane|drone|mountain|compass|flight/i.test(s.name))));
    assert.equal(await page.evaluate(()=>SlotGames.get('aerovista').theme.accent),'#00AEEF');
    assert.equal(await page.evaluate(()=>SlotGames.get('echoverse').theme.accent),'#FF1493');
    await page.reload({waitUntil:'networkidle0'});
    assert.equal(await page.evaluate(()=>SlotApp.game()),'aerovista');
    await page.evaluate(()=>{SlotApp.state().credits=0;SlotApp.spin();});
    await page.waitForSelector('#ovReset');
    const reset=await page.$eval('#ovReset',el=>{const r=el.getBoundingClientRect();return {w:r.width,h:r.height};});
    assert.ok(reset.w>=44&&reset.h>=44,'Reset target '+JSON.stringify(reset));
    await page.tap('#ovReset');
    assert.equal(await page.evaluate(()=>SlotApp.state().credits),1000);
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.evaluate(()=>{SlotFX.clear();SlotFX.burst(100,100,60,1);SlotFX.rain({left:0,top:0,width:390,height:800},1000,3);});
    assert.equal(await page.evaluate(()=>SlotFX.count()),0,'Reduced motion emitted particles');
    await page.emulateMediaFeatures([]);
    await page.setViewport({width:1280,height:800,isMobile:false,hasTouch:false,deviceScaleFactor:1});
    await pause(250);
    assert.ok(await page.evaluate(()=>!document.documentElement.classList.contains('mobile-layout')));
    await page.click('#bMenu');
    await page.locator('[data-tab="games"]').click();
    await page.locator('[data-game="echoverse"]').click();
    assert.equal(await page.evaluate(()=>SlotApp.game()),'echoverse');
    assert.deepEqual(errors,[]);
    console.log('PASS: DPR 3, CPU 4x throttling, 8 mobile viewports, 5 games, FX paint isolation, rotation during play, reset, saved selection, reduced motion and desktop.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
