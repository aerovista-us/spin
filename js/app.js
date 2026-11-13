/* Cabinet UI + game flow. Play-money credits only. */
(function () {
  'use strict';
  const E = SlotEngine, G = SlotGames, A = SlotAudio, FX = SlotFX;
  const SW = 370, SH = 930, CELL = 160, RX = 25, RY = 240, REELS = E.REELS, ROWS = E.ROWS;
  const STORE = 'slotCabinet.v1', START_CREDITS = 1000, DENOM = 0.01;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const money = v => '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cr = v => Math.round(v / DENOM).toLocaleString('en-US');

  let state = { credits: START_CREDITS, betIndex: 3, gameId: 'wild125', muted: false, turbo: false, jackpots: {}, stats: { spins: 0, biggest: 0 } };
  let game = null, grid = null, spinning = false, presenting = false, auto = false, skip = false;
  let forced = null, anims = [], lineCycle = null, menuTab = 'games', lastWin = 0;
  const screens = [], reelEls = [];

  function load() {
    try { const s = JSON.parse(localStorage.getItem(STORE) || 'null'); if (s) state = Object.assign(state, s); } catch (e) { /* ignore */ }
    if (typeof state.credits !== 'number' || !isFinite(state.credits)) state.credits = START_CREDITS;
    state.betIndex = Math.max(0, Math.min(E.BET_LEVELS.length - 1, state.betIndex | 0));
    state.stats = state.stats || { spins: 0, biggest: 0 };
    state.jackpots = state.jackpots || {};
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  const bet = () => E.BET_LEVELS[state.betIndex];

  /* ---------------- background ---------------- */
  function buildBackground(theme) {
    $('.bg-tint').style.background = theme.pageTint;
    const layer = $('.bokeh-layer'); layer.innerHTML = '';
    const cols = theme.bokeh;
    for (let i = 0; i < 46; i++) {
      const b = document.createElement('div'), sz = 18 + Math.random() * 150, c = cols[i % cols.length];
      b.className = 'bokeh';
      b.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;` +
        `background:radial-gradient(circle, ${c} 0%, ${c}66 35%, transparent 70%);--d:${10 + Math.random() * 14}s;--t:${2 + Math.random() * 4}s;` +
        `--dx:${(Math.random() - 0.5) * 80}px;--dy:${(Math.random() - 0.5) * 60}px;--o1:${0.05 + Math.random() * 0.2};--o2:${0.3 + Math.random() * 0.5};animation-delay:${-Math.random() * 10}s,${-Math.random() * 5}s`;
      layer.appendChild(b);
    }
    const far = $('.far-machines'); far.innerHTML = '';
    for (let i = 0; i < 15; i++) {
      const m = document.createElement('i');
      m.style.cssText = `--c1:${cols[i % cols.length]};--c2:${cols[(i + 2) % cols.length]};height:${60 + Math.random() * 40}%;align-self:flex-end;animation-delay:${-Math.random() * 4}s`;
      far.appendChild(m);
    }
  }

  /* ---------------- toppers ---------------- */
  function roundRectPoint(w, h, r, d) {
    const sides = [w - 2 * r, h - 2 * r], arc = Math.PI * r / 2;
    const segs = [['l', sides[0], r, 0, 1, 0], ['a', arc, w - r, r, -Math.PI / 2], ['l', sides[1], w, r, 0, 1], ['a', arc, w - r, h - r, 0],
      ['l', sides[0], w - r, h, -1, 0], ['a', arc, r, h - r, Math.PI / 2], ['l', sides[1], 0, h - r, 0, -1], ['a', arc, r, r, Math.PI]];
    for (const s of segs) {
      if (d <= s[1]) {
        if (s[0] === 'l') return [s[2] + s[4] * d, s[3] + s[5] * d];
        const a = s[4] + (d / arc) * Math.PI / 2; return [s[2] + Math.cos(a) * r, s[3] + Math.sin(a) * r];
      }
      d -= s[1];
    }
    return [0, 0];
  }
  function addBulbs(el, w, h, r, spacing) {
    const per = 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r, n = Math.round(per / spacing);
    for (let i = 0; i < n; i++) {
      const [x, y] = roundRectPoint(w, h, r, (i / n) * per), b = document.createElement('i');
      b.className = 'bulb'; b.style.left = x + 'px'; b.style.top = y + 'px'; b.style.setProperty('--bd', (-(i % 3) * 0.3) + 's');
      el.appendChild(b);
    }
  }
  function buildToppers() {
    const wrap = $('.toppers');
    const beaconColors = ['#ff2030', '#ffb000', '#ff2030'];
    for (let i = 0; i < 3; i++) {
      const t = document.createElement('div'); t.className = 'topper t' + i;
      const nb = i === 1 ? 3 : 2;
      let bh = '<div class="beacons">';
      for (let k = 0; k < nb; k++) bh += `<div class="beacon" style="--bc:${beaconColors[(i + k) % 3]};--bd:${-(k * 0.4 + i * 0.2)}s"><div class="dome"></div></div>`;
      t.innerHTML = bh + '</div><div class="sign small"><div class="txt"></div><div class="shine"></div></div><div class="sign big"><div class="txt"></div><div class="shine" style="--sd:' + (i * 0.6) + 's"></div></div>';
      wrap.appendChild(t);
      // bulbs follow the sign's outer edge (sign box = 350 wide incl. 7px border)
      addBulbs($('.sign.small', t), 336, 90, 45, 24);
      addBulbs($('.sign.big', t), 336, 196, 16, 24);
      $$('.sign .bulb', t).forEach(b => { b.style.left = (parseFloat(b.style.left) + 0) + 'px'; });
    }
  }
  function fitScale(el, maxW) {
    if (!el) return;
    el.style.transform = 'none';
    const w = el.scrollWidth;
    if (w > maxW) el.style.transform = `scale(${maxW / w})`;
  }
  function fitText(el, maxW, maxPx) {
    el.style.fontSize = maxPx + 'px';
    let size = maxPx;
    while (el.scrollWidth > maxW && size > 12) { size -= 2; el.style.fontSize = size + 'px'; }
  }

  /* ---------------- screens ---------------- */
  function screenPath() {
    const i = 10, a = 11, W = SW, H = SH;
    return `M ${i} 16 Q ${W / 2} -6 ${W - i} 16 C ${W - i + a} ${H * 0.33} ${W - i - a} ${H * 0.66} ${W - i} ${H - 16} Q ${W / 2} ${H + 6} ${i} ${H - 16} C ${i - a} ${H * 0.66} ${i + a} ${H * 0.33} ${i} 16 Z`;
  }
  function buildScreens() {
    const wrap = $('.screens'), path = screenPath();
    for (let s = 0; s < 3; s++) {
      const el = document.createElement('div'); el.className = 'screen s' + s;
      el.innerHTML = `<div class="scr-clip" style="clip-path:path('${path}')">
          <div class="scr-bg"></div><div class="decor-layer"></div><div class="scr-header"></div>
          <div class="reels"><div class="reel"><div class="strip"></div></div><div class="reel"><div class="strip"></div></div></div>
          <svg class="lines" viewBox="0 0 ${SW} ${SH}"></svg>
          <div class="scr-foot"></div><div class="scr-overlay"></div><div class="scr-glare"></div></div>
        <svg class="scr-neon" viewBox="-24 -24 418 978">
          <path d="${path}" fill="none" stroke="#020202" stroke-width="26"/>
          <path d="${path}" fill="none" stroke="#2a2a30" stroke-width="15"/>
          <path class="glow" d="${path}" fill="none" stroke="#ff1530" stroke-width="7" filter="url(#f-neon)"/>
          <path d="${path}" fill="none" stroke="#ffd6da" stroke-width="2" opacity=".9"/></svg>`;
      wrap.appendChild(el);
      screens.push({ el, header: $('.scr-header', el), decor: $('.decor-layer', el), lines: $('.lines', el), foot: $('.scr-foot', el), overlay: $('.scr-overlay', el), reels: $('.reels', el) });
      $$('.reel', el).forEach(r => reelEls.push({ el: r, strip: $('.strip', r) }));
    }
  }
  function symHTML(cell) {
    const sym = game._byId[cell.id];
    let badge = '';
    if (cell.mult > 1) badge = `<div class="mult${cell.mult >= 50 ? ' huge' : ''}">x${cell.mult}</div>`;
    return `<div class="sym" data-sym="${cell.id}">${sym.svg}${badge}</div>`;
  }
  const cellHTML = c => `<div class="cell">${symHTML(c)}</div>`;
  function renderReel(r, cells) { reelEls[r].strip.innerHTML = cells.map(cellHTML).join(''); reelEls[r].strip.style.transform = 'translateY(0px)'; }
  function renderGrid() { for (let r = 0; r < REELS; r++) renderReel(r, grid[r]); }
  function cellEl(r, row) { return reelEls[r].strip.children[row]; }

  function renderHeaders() {
    const th = game.theme, jp = state.jackpots[game.id];
    screens[0].header.innerHTML = `<div class="h-title">${game.title}</div><div class="h-jp"><span class="lbl">GRAND</span><span class="val" id="jpGrand">${money(jp.grand)}</span></div>`;
    screens[1].header.innerHTML = `<div class="h-lbl">MAJOR JACKPOT</div><div class="h-big" id="jpMajor">${money(jp.major)}</div><div class="h-sub">${game.featureText}</div>`;
    screens[2].header.innerHTML = `<div class="h-rows"><div class="h-row"><span>DENOM</span><b>1¢</b></div><div class="h-row"><span>CREDITS</span><b id="hCredits">0</b></div><div class="h-row"><span>BET</span><b id="hBet">0</b></div></div>`;
    fitHeaders();
    setFoot(0, '20 LINES · PAYS LEFT TO RIGHT');
    setFoot(2, 'PLAY MONEY ONLY');
    screens.forEach((s, i) => {
      s.decor.innerHTML = '';
      for (let k = 0; k < 9; k++) {
        const d = document.createElement('div'); d.className = 'decor';
        const ang = (Math.random() * Math.PI) + Math.PI, dist = 90 + Math.random() * 120;
        d.style.cssText = `--dx:${Math.cos(ang) * dist * 1.3}px;--dy:${Math.sin(ang) * dist * 0.7 + 60}px;--dur:${2.4 + Math.random() * 1.6}s;--del:${-Math.random() * 4}s;--sc:${0.7 + Math.random() * 0.8};--rot:${(Math.random() - 0.5) * 720}deg`;
        d.innerHTML = th.decor; s.decor.appendChild(d);
      }
    });
  }
  function setFoot(i, t) { const f = screens[i].foot; f.innerHTML = '<span></span>'; f.firstChild.textContent = t; fitScale(f.firstChild, 300); }
  function setMessage(t) { setFoot(1, t); }

  /* ---------------- theme / game switching ---------------- */
  function applyGame(id, animate) {
    game = G.get(id) || G.list[0];
    E.prepare(game);
    state.gameId = game.id;
    if (!state.jackpots[game.id]) state.jackpots[game.id] = Object.assign({}, game.jackpots);
    const th = game.theme, st = $('#stage').style;
    const vars = { '--accent': th.accent, '--accent2': th.accent2, '--glow': th.glow, '--panel-a': th.panelA, '--panel-b': th.panelB, '--frame-a': th.frameA, '--frame-b': th.frameB,
      '--topper-text': th.topperText, '--topper-stroke': th.topperStroke, '--screen-bg': th.screenBg, '--cell-bg': th.cellBg, '--cell-border': th.cellBorder, '--title-font': th.font };
    Object.keys(vars).forEach(k => { st.setProperty(k, vars[k]); document.documentElement.style.setProperty(k, vars[k]); });
    buildBackground(th);
    $$('.topper').forEach((t, i) => {
      const tp = game.toppers[i] || game.toppers[0];
      const s = $('.sign.small .txt', t), b = $('.sign.big .txt', t);
      s.textContent = tp.small; b.textContent = tp.big;
      fitText(s, 300, 62); fitText(b, 310, 132);
    });
    renderHeaders();
    stopLineCycle(); clearHighlights();
    grid = E.spinGrid(game);
    // keep the idle screen free of a scatter trigger / huge tags
    renderGrid();
    setMessage(game.name.toUpperCase() + ' · GOOD LUCK!');
    updateDisplays();
    save();
    if (animate) {
      const sc = $('.screens'); sc.classList.remove('switching'); void sc.offsetWidth; sc.classList.add('switching');
      setTimeout(() => sc.classList.remove('switching'), 800);
    }
  }

  /* ---------------- displays ---------------- */
  function updateDisplays(winVal) {
    $('#dCredit').textContent = money(state.credits);
    $('#dBet').textContent = money(bet());
    if (winVal !== undefined) $('#dWin').textContent = money(winVal);
    const hc = $('#hCredits'), hb = $('#hBet');
    if (hc) hc.textContent = cr(state.credits);
    if (hb) hb.textContent = cr(bet());
    const jp = state.jackpots[game.id];
    const g = $('#jpGrand'), m = $('#jpMajor');
    if (g) g.textContent = money(jp.grand);
    if (m) m.textContent = money(jp.major);
    const busy = spinning || presenting;
    $('#bBetDown').disabled = spinning || state.betIndex === 0;
    $('#bBetUp').disabled = spinning || state.betIndex === E.BET_LEVELS.length - 1;
    $('#bMax').disabled = busy && spinning;
  }

  /* ---------------- reel animation ---------------- */
  function buildSpinPlan(finalGrid) {
    const turbo = state.turbo, v = turbo ? 7 : 4.6, Td = turbo ? 200 : 380;
    let scatters = 0, extra = 0;
    const scatId = game._scatter && game._scatter.id;
    const plans = [];
    for (let r = 0; r < REELS; r++) {
      let target = (turbo ? 320 : 820) + r * (turbo ? 90 : 230);
      const antic = !turbo && scatters >= 2;
      if (antic) extra += 1000;
      target += extra;
      const D = v * (target - Td) + v * Td / 2;
      const n = Math.max(4, Math.round(D / CELL) - 4);
      const dist = (4 + n) * CELL;
      const dur = (dist - v * Td / 2) / v + Td;
      plans.push({ r, n, dist, dur, v, Td, antic });
      finalGrid[r].forEach(c => { if (c.id === scatId) scatters++; });
    }
    return plans;
  }
  function spinReels(finalGrid) {
    return new Promise(resolve => {
      const plans = buildSpinPlan(finalGrid), now = performance.now();
      anims = plans.map(p => {
        const strip = reelEls[p.r].strip;
        const filler = [];
        for (let i = 0; i < p.n; i++) filler.push(E.randomCell(game, Math.random, false));
        const cells = [E.randomCell(game)].concat(finalGrid[p.r], filler, grid[p.r]);
        strip.innerHTML = cells.map(cellHTML).join('');
        const start = -(5 + p.n) * CELL;
        strip.style.transform = `translateY(${start}px)`;
        strip.classList.add('blur');
        return Object.assign(p, { strip, start, target: -CELL, t0: now + p.r * 45, done: false, phase: 'spin', anticShown: false });
      });
      let remaining = anims.length;
      function frame(t) {
        for (const a of anims) {
          if (a.done) continue;
          let pos;
          if (a.phase === 'spin') {
            const e = t - a.t0;
            if (a.antic && !a.anticShown && e > 0 && anims[a.r - 1] && anims[a.r - 1].done) { a.anticShown = true; reelEls[a.r].el.classList.add('anticipate'); A.anticipation(); }
            if (e <= 0) pos = a.start;
            else if (e < a.dur - a.Td) pos = a.start + a.v * e;
            else if (e < a.dur) { const u = e - (a.dur - a.Td); pos = a.start + a.v * (a.dur - a.Td) + a.v * u - a.v * u * u / (2 * a.Td); if (u > a.Td * 0.4) a.strip.classList.remove('blur'); }
            else { a.phase = 'bounce'; a.b0 = t; pos = a.target; a.strip.classList.remove('blur'); onReelStop(a.r); }
          } else if (a.phase === 'slam') {
            const u = Math.min(1, (t - a.s0) / a.sdur), ease = 1 - Math.pow(1 - u, 3);
            pos = a.sfrom + (a.target - a.sfrom) * ease;
            if (u >= 1) { a.phase = 'bounce'; a.b0 = t; a.strip.classList.remove('blur'); onReelStop(a.r); }
          }
          if (a.phase === 'bounce') {
            const u = Math.min(1, (t - a.b0) / 170);
            pos = a.target + Math.sin(u * Math.PI) * 16;
            if (u >= 1) { a.done = true; remaining--; pos = a.target; renderReel(a.r, finalGrid[a.r]); markLand(a.r, finalGrid[a.r]); continue; }
          }
          a.strip.style.transform = `translateY(${pos}px)`;
        }
        if (remaining > 0) requestAnimationFrame(frame); else resolve();
      }
      requestAnimationFrame(frame);
    });
  }
  function slam() {
    const t = performance.now();
    anims.forEach((a, i) => {
      if (a.done || a.phase !== 'spin') return;
      a.phase = 'slam'; a.s0 = t + i * 30; a.sdur = 140 + i * 35; a.sfrom = a.target - CELL * 0.9;
      reelEls[a.r].el.classList.remove('anticipate');
    });
  }
  function onReelStop(r) {
    A.reelStop(r);
    reelEls[r].el.classList.remove('anticipate');
    if (r === REELS - 1) A.spinLoop(false);
    const scatId = game._scatter && game._scatter.id;
    let seen = 0;
    for (let k = 0; k <= r; k++) for (let y = 0; y < ROWS; y++) if (grid._next[k][y].id === scatId) seen++;
    grid._next[r].forEach(c => { if (c.id === scatId) A.scatter(seen); });
  }
  function markLand(r, col) {
    const scatId = game._scatter && game._scatter.id;
    col.forEach((c, y) => { if (c.id === scatId || c.mult > 1) { const el = cellEl(r, y); if (el) el.classList.add('land'); } });
  }

  /* ---------------- win presentation ---------------- */
  function clearHighlights() {
    screens.forEach(s => { s.lines.innerHTML = ''; s.reels.classList.remove('dim'); });
    $$('.cell.win').forEach(c => c.classList.remove('win'));
  }
  function highlightCells(cells) { cells.forEach(([r, y]) => { const c = cellEl(r, y); if (c) c.classList.add('win'); }); screens.forEach(s => s.reels.classList.add('dim')); }
  function drawLine(li, color) {
    const L = E.LINES[li], cy = row => RY + CELL / 2 + row * CELL;
    for (let s = 0; s < 3; s++) {
      const a = 2 * s, b = a + 1, pts = [];
      pts.push([s === 0 ? 6 : 0, s === 0 ? cy(L[a]) : (cy(L[a - 1]) + cy(L[a])) / 2]);
      pts.push([RX + CELL / 2, cy(L[a])]);
      pts.push([RX + CELL * 1.5, cy(L[b])]);
      pts.push([s === 2 ? SW - 6 : SW, s === 2 ? cy(L[b]) : (cy(L[b]) + cy(L[b + 1])) / 2]);
      const pl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      pl.setAttribute('points', pts.map(p => p.join(',')).join(' '));
      pl.setAttribute('stroke', color);
      screens[s].lines.appendChild(pl);
    }
  }
  const lineColor = i => game.theme.lineColors[i % game.theme.lineColors.length];
  function stopLineCycle() { if (lineCycle) { clearInterval(lineCycle); lineCycle = null; } }
  function startLineCycle(res) {
    stopLineCycle();
    const items = res.lineWins.slice();
    if (res.scatter) items.push({ scatter: true });
    if (!items.length) return;
    let i = 0;
    const show = () => {
      clearHighlights();
      const w = items[i % items.length]; i++;
      if (w.scatter) { highlightCells(res.scatter.cells); setMessage(`${res.scatter.count} x ${game._scatter.name} · BONUS`); return; }
      highlightCells(w.cells); drawLine(w.line, lineColor(w.line));
      setMessage(`LINE ${w.line + 1} · ${w.count} x ${game._byId[w.symId].name}${w.mult > 1 ? ' · x' + w.mult : ''} · ${money(w.amount)}`);
    };
    show();
    if (items.length > 1) lineCycle = setInterval(show, 1500);
  }
  function stageRect(sIdx) { return screens[sIdx].el.getBoundingClientRect(); }
  function coinBurstFrom(sIdx, n, power) { const r = stageRect(sIdx); FX.burst(r.left + r.width / 2, r.bottom - r.height * 0.04, n, power); }
  function showOverlay(sIdx, html) { const o = screens[sIdx].overlay; o.innerHTML = html; o.classList.add('show'); return o; }
  function hideOverlays() { screens.forEach(s => s.overlay.classList.remove('show')); }

  function countUp(el, from, to, ms, tick) {
    return new Promise(resolve => {
      const t0 = performance.now(); let lastTick = 0;
      function f(t) {
        const u = skip ? 1 : Math.min(1, (t - t0) / ms), v = from + (to - from) * (1 - Math.pow(1 - u, 2));
        el.forEach(e => { e.textContent = money(v); });
        if (tick && t - lastTick > 70 && u < 1) { lastTick = t; A.coinTick(); }
        if (u < 1) requestAnimationFrame(f); else resolve();
      }
      requestAnimationFrame(f);
    });
  }

  async function present(res, b) {
    presenting = true; skip = false;
    let total = 0;
    const winEl = $('#dWin');
    const topMult = Math.max.apply(null, (game.wildMultipliers || [{ m: 1 }]).map(w => w.m));

    if (res.lineWins.length) {
      highlightCells([].concat.apply([], res.lineWins.map(w => w.cells)));
      res.lineWins.forEach(w => drawLine(w.line, lineColor(w.line)));
      setMessage(`${res.lineWins.length} WINNING LINE${res.lineWins.length > 1 ? 'S' : ''} · ${money(res.lineTotal)}`);
      const ratio = res.lineTotal / b;
      if (res.maxWildMult >= topMult) await featureHit(res.maxWildMult);
      A.win(ratio >= 5 ? 2 : 1);
      $('.lcd.win').classList.add('pop'); setTimeout(() => $('.lcd.win').classList.remove('pop'), 600);
      if (ratio >= 15) await bigWin(res.lineTotal, b, 0);
      else {
        if (ratio >= 3) coinBurstFrom(1, Math.min(60, 10 + ratio * 3), 0.9);
        await countUp([winEl], 0, res.lineTotal, Math.min(2500, 400 + ratio * 160), true);
      }
      total = res.lineTotal;
    }
    if (res.scatter) {
      const bonusWin = await bonusFeature(res.scatter, total);
      total = E.round2(total + bonusWin);
    }
    if (res.jackpot) {
      const jw = await jackpotWin(res.jackpot, total);
      total = E.round2(total + jw);
    }
    winEl.textContent = money(total);
    if (total > 0) {
      state.credits = E.round2(state.credits + total);
      if (total > state.stats.biggest) state.stats.biggest = total;
    }
    lastWin = total;
    save(); updateDisplays();
    hideOverlays();
    $('.cabinet').classList.remove('celebrate');
    if (total > 0) startLineCycle(res);
    else setMessage(auto ? 'AUTOPLAY ON' : 'PRESS SPIN TO PLAY');
    presenting = false; skip = false;
    updateDisplays();
  }

  async function featureHit(m) {
    A.featureHit();
    $('.cabinet').classList.add('celebrate');
    for (let s = 0; s < 3; s++) showOverlay(s, `<div class="ov-title">WILD</div><div class="ov-title" style="font-size:110px">x${m}!</div>`);
    for (let s = 0; s < 3; s++) coinBurstFrom(s, 40, 1.2);
    await sleep(skip ? 200 : 1800);
    hideOverlays();
  }

  async function bigWin(amount, b, already) {
    const ratio = amount / b;
    const label = ratio >= 125 ? 'EPIC WIN' : ratio >= 50 ? 'MEGA WIN' : 'BIG WIN';
    $('.cabinet').classList.add('celebrate');
    A.bigWin();
    const o = showOverlay(1, `<div class="ov-title">${label.replace(' ', '<br>')}</div><div class="ov-amount">$0.00</div><div class="ov-sub">${ratio.toFixed(0)}x BET</div>`);
    showOverlay(0, `<div class="ov-title" style="font-size:70px">${label.split(' ')[0]}</div>`);
    showOverlay(2, `<div class="ov-title" style="font-size:70px">WIN!</div>`);
    const rect = $('.screens').getBoundingClientRect();
    const dur = Math.min(6000, 2200 + ratio * 25);
    FX.rain(rect, dur, ratio >= 50 ? 2.2 : 1.5);
    for (let s = 0; s < 3; s++) coinBurstFrom(s, 30, 1.1);
    const burstTimer = setInterval(() => coinBurstFrom((Math.random() * 3) | 0, 16, 1), 600);
    await countUp([$('.ov-amount', o), $('#dWin')], already, already + amount, dur, true);
    clearInterval(burstTimer);
    await sleep(skip ? 100 : 900);
    hideOverlays();
  }

  async function bonusFeature(sc, sofar) {
    stopLineCycle();
    highlightCells(sc.cells);
    A.bonusLand();
    $('.cabinet').classList.add('celebrate');
    showOverlay(0, `<div class="ov-title" style="font-size:72px">BONUS!</div><div class="ov-sub">${sc.count} x ${game._scatter.name}</div>`);
    showOverlay(2, `<div class="ov-title" style="font-size:72px">BONUS!</div><div class="ov-sub">PAYS ${money(sc.base)}</div>`);
    const o = showOverlay(1, `<div class="ov-title" style="font-size:64px">MULTIPLIER<br>BONUS</div><div class="ov-wheel">x?</div><div class="ov-sub">${money(sc.base)} x ?</div>`);
    await sleep(skip ? 100 : 1100);
    const vals = game.bonusMultipliers.map(m => m.m), pick = E.pickBonusMultiplier(game);
    const wheel = $('.ov-wheel', o);
    const steps = 24 + Math.floor(Math.random() * 8);
    let idx = Math.floor(Math.random() * vals.length);
    for (let i = 0; i < steps; i++) {
      idx = (idx + 1) % vals.length;
      const isLast = i === steps - 1;
      const v = isLast ? pick : vals[idx];
      wheel.textContent = 'x' + v;
      wheel.classList.remove('tick'); void wheel.offsetWidth; wheel.classList.add('tick');
      A.bonusTick(i);
      if (!skip) await sleep(50 + Math.pow(i / steps, 3) * 380);
    }
    wheel.classList.remove('tick'); wheel.classList.add('landed');
    A.bonusLand();
    const award = E.round2(sc.base * pick);
    $('.ov-sub', o).textContent = `${money(sc.base)} x ${pick} = ${money(award)}`;
    coinBurstFrom(1, 50, 1.2);
    await sleep(skip ? 100 : 900);
    if (award / bet() >= 15) await bigWin(award, bet(), sofar);
    else await countUp([$('#dWin')], sofar, sofar + award, 1200, true);
    return award;
  }

  async function jackpotWin(kind, sofar) {
    const jp = state.jackpots[game.id], amt = E.round2(jp[kind]);
    jp[kind] = game.jackpots[kind];
    A.jackpot();
    $('.cabinet').classList.add('celebrate');
    const o = showOverlay(1, `<div class="ov-title">${kind.toUpperCase()}<br>JACKPOT</div><div class="ov-amount">${money(0)}</div>`);
    showOverlay(0, `<div class="ov-title" style="font-size:72px">JACK</div>`);
    showOverlay(2, `<div class="ov-title" style="font-size:72px">POT!</div>`);
    FX.rain($('.screens').getBoundingClientRect(), 6000, 4);
    await countUp([$('.ov-amount', o), $('#dWin')], sofar, sofar + amt, 5000, true);
    await sleep(skip ? 100 : 1200);
    return amt;
  }

  /* ---------------- spin ---------------- */
  async function spin() {
    A.unlock();
    if (!$('#menu').classList.contains('hidden')) return;
    if (spinning) { slam(); return; }
    if (presenting) { skip = true; return; }
    stopLineCycle(); clearHighlights(); hideOverlays();
    const b = bet();
    if (state.credits + 1e-9 < b) {
      A.error(); auto = false; $('#bAuto').classList.remove('on');
      setMessage('NOT ENOUGH CREDITS');
      const o = showOverlay(1, `<div class="ov-title" style="font-size:62px">OUT OF<br>CREDITS</div><div class="ov-sub">Play money only — top up for free.</div><button class="ov-btn" id="ovReset">RESET CREDITS</button>`);
      $('#ovReset', o).onclick = () => { resetCredits(); hideOverlays(); };
      return;
    }
    state.credits = E.round2(state.credits - b);
    state.stats.spins++;
    const jp = state.jackpots[game.id];
    jp.grand = E.round2(jp.grand + b * 0.005); jp.major = E.round2(jp.major + b * 0.01);
    spinning = true;
    $('#bSpin').classList.add('stop'); $('#spinLabel').textContent = 'STOP';
    updateDisplays(0); save();
    setMessage('GOOD LUCK!');
    A.spinStart();
    const finalGrid = forced ? forced : E.spinGrid(game);
    forced = null;
    grid._next = finalGrid;
    await spinReels(finalGrid);
    grid = finalGrid;
    spinning = false;
    A.spinLoop(false);
    $('#bSpin').classList.remove('stop'); $('#spinLabel').textContent = 'SPIN';
    updateDisplays();
    const res = E.evaluate(game, grid, b);
    window.__lastResult = res;
    await present(res, b);
    if (auto) { await sleep(lastWin > 0 ? 1400 : 500); if (auto && !spinning && !presenting) spin(); }
  }
  function changeBet(d) {
    if (spinning) return;
    const ni = Math.max(0, Math.min(E.BET_LEVELS.length - 1, state.betIndex + d));
    if (ni === state.betIndex) { A.error(); return; }
    state.betIndex = ni; A.click(); save(); updateDisplays();
    setMessage('BET ' + money(bet()) + ' · ' + money(bet() / 20) + ' PER LINE');
    if (menuTab === 'paytable' && !$('#menu').classList.contains('hidden')) renderMenu();
  }
  function maxBet() { if (spinning) return; state.betIndex = E.BET_LEVELS.length - 1; save(); updateDisplays(); spin(); }
  function toggleAuto() { A.unlock(); auto = !auto; $('#bAuto').classList.toggle('on', auto); A.click(); setMessage(auto ? 'AUTOPLAY ON' : 'AUTOPLAY OFF'); if (auto && !spinning && !presenting) spin(); }
  function toggleSound() { state.muted = !state.muted; A.setMuted(state.muted); $('#bSound').classList.toggle('muted', state.muted); $('#soundState').textContent = state.muted ? 'OFF' : 'ON'; A.click(); save(); if (!$('#menu').classList.contains('hidden')) renderMenu(); }
  function resetCredits() { state.credits = START_CREDITS; state.stats = { spins: 0, biggest: 0 }; save(); updateDisplays(0); setMessage('CREDITS RESET TO ' + money(START_CREDITS)); A.bonusLand(); }

  /* ---------------- menu ---------------- */
  function openMenu(tab) {
    if (spinning) return;
    auto = false; $('#bAuto').classList.remove('on');
    skip = true;
    menuTab = tab || menuTab || 'games';
    renderMenu();
    $('#menu').classList.remove('hidden'); A.menu(true);
  }
  function closeMenu() { $('#menu').classList.add('hidden'); A.menu(false); }
  function toggleMenu() { if ($('#menu').classList.contains('hidden')) openMenu(); else closeMenu(); }
  function fmtPays(sym) {
    const lb = bet() / 20;
    return [6, 5, 4, 3].filter(n => sym.pays[n]).map(n => `<b>${n}x</b> ${money(sym.pays[n] * lb)} <span style="opacity:.6">(${sym.pays[n]}x line)</span>`).join('<br>');
  }
  function renderMenu() {
    const m = $('#menu');
    const tabs = [['games', 'GAMES'], ['paytable', 'PAYTABLE'], ['help', 'HELP'], ['settings', 'SETTINGS']];
    let body = '';
    if (menuTab === 'games') {
      body = `<p class="menu-note">Choose the game shown on the cabinet screens. Your credits carry over between games. Play money only.</p><div class="game-cards">` +
        G.list.map(g => {
          E.prepare(g);
          const pv = g.symbols.filter(s => !s.type).slice(0, 2).concat([g.symbols.find(s => s.type === 'wild')]);
          const pvHTML = pv.map(s => `<div class="sym" style="background:${g.theme.cellBg};border-color:${g.theme.cellBorder}">${s.svg}</div>`).join('');
          const cur = g.id === game.id;
          return `<button class="gcard${cur ? ' current' : ''}" data-game="${g.id}">
            <div class="gc-art" style="background:${g.theme.screenBg}">${pvHTML}</div>
            <div class="gc-info"><div class="gc-name" style="font-family:${g.theme.font.replace(/"/g, "'")};color:${g.theme.accent};text-shadow:0 0 10px ${g.theme.glow}">${g.name}</div>
            <div class="gc-tag">${g.tagline}</div>
            <span class="gc-play" style="background:linear-gradient(180deg,${g.theme.panelA},${g.theme.panelB});border:2px solid ${g.theme.accent}">${cur ? 'NOW PLAYING' : 'PLAY THIS GAME'}</span></div>
            ${cur ? '<span class="gc-badge">ACTIVE</span>' : ''}</button>`;
        }).join('') + '</div>';
    } else if (menuTab === 'paytable') {
      const w = game._wild, s = game._scatter;
      const reg = game.symbols.filter(x => !x.type);
      body = `<p class="menu-note">${game.name} · values shown at your current bet of ${money(bet())} (${money(bet() / 20)} per line). Wins pay left to right on 20 lines across all three screens.</p><div class="pt-grid">` +
        `<div class="pt-item"><div class="sym">${w.svg}</div><div><h4>${w.name}</h4><div class="pays">${fmtPays(w)}</div></div></div>` +
        `<div class="pt-item" style="grid-column:span 2"><div><h4>WILD MULTIPLIERS</h4><div class="pays">Wild substitutes for every symbol except ${s.name}. Each wild can land tagged ` +
        game.wildMultipliers.filter(x => x.m > 1).map(x => '<b>x' + x.m + '</b>').join(' ') + `. A line win is multiplied by the biggest tag on it. 6 wilds on one line wins the <b>GRAND JACKPOT</b>.</div></div></div>` +
        `<div class="pt-item wide"><div class="sym">${s.svg}</div><div><h4>${s.name} · SCATTER · MULTIPLIER BONUS</h4><div class="pays">3+ anywhere pays ` +
        [3, 4, 5, 6].map(n => `<b>${n}x</b> ${money(game.scatterPays[n] * bet())}`).join(' · ') + ` (x total bet), then the bonus wheel multiplies it by ` +
        game.bonusMultipliers.map(x => '<b>x' + x.m + '</b>').join(' ') + `. 6 scatters also wins the <b>MAJOR JACKPOT</b>.</div></div></div>` +
        reg.map(x => `<div class="pt-item"><div class="sym">${x.svg}</div><div><h4>${x.name}</h4><div class="pays">${fmtPays(x)}</div></div></div>`).join('') + '</div>';
    } else if (menuTab === 'help') {
      const diags = E.LINES.map((L, i) => `<div class="ldiag"><div class="g">` + [0, 1, 2, 3].map(y => L.map(r => `<i class="${r === y ? 'on' : ''}"></i>`).join('')).join('') + `</div>${i + 1}</div>`).join('');
      body = `<h3 style="margin-top:0">HOW TO PLAY</h3>
        <p>The three curved screens form one 6-reel × 4-row game (two reels per screen). Press <b>SPIN</b> to play the current bet across all 20 paylines. Three or more matching symbols on a line, starting from the far-left reel, pay according to the paytable. Only the highest win per line is paid; wins on different lines add up.</p>
        <p>Press <b>SPIN</b> again while reels are moving to slam-stop them, or during a win count-up to skip it. <b>MAX BET</b> sets the highest bet and spins. <b>AUTO</b> keeps spinning until you press it again, open the menu, or run out of credits.</p>
        <h3>KEYBOARD</h3><p><span class="kbd">SPACE</span> spin / stop / skip &nbsp; <span class="kbd">+</span> <span class="kbd">-</span> bet &nbsp; <span class="kbd">M</span> menu &nbsp; <span class="kbd">ESC</span> close menu &nbsp; <span class="kbd">S</span> sound &nbsp; <span class="kbd">A</span> autoplay &nbsp; <span class="kbd">1</span>-<span class="kbd">${G.list.length}</span> switch game</p>
        <h3>PAYLINES</h3><div class="line-diags">${diags}</div>
        <h3>PLAY MONEY ONLY</h3><p>This is an entertainment demo. Credits are play money stored in your browser; they have no cash value and can't be bought, sold or withdrawn. There is no real-money wagering. Reset credits any time in Settings.</p>`;
    } else {
      body = `<div class="setting"><div><div class="lbl">SOUND</div><div class="desc">Synthesized WebAudio effects.</div></div><button class="mbtn ${state.muted ? '' : 'on'}" data-act="sound">${state.muted ? 'OFF' : 'ON'}</button></div>
        <div class="setting"><div><div class="lbl">TURBO SPIN</div><div class="desc">Faster reel stops, no anticipation.</div></div><button class="mbtn ${state.turbo ? 'on' : ''}" data-act="turbo">${state.turbo ? 'ON' : 'OFF'}</button></div>
        <div class="setting"><div><div class="lbl">RESET CREDITS</div><div class="desc">Sets play-money credits back to ${money(START_CREDITS)}. Current: ${money(state.credits)} · Spins: ${state.stats.spins} · Biggest win: ${money(state.stats.biggest)}</div></div><button class="mbtn danger" data-act="reset">RESET</button></div>
        <p class="menu-note">Saved automatically in this browser (localStorage).</p>`;
    }
    m.innerHTML = `<div class="menu-head"><h2>GAME MENU</h2><div class="tabs">` + tabs.map(t => `<button class="tab${t[0] === menuTab ? ' active' : ''}" data-tab="${t[0]}">${t[1]}</button>`).join('') +
      `<button class="m-close" data-act="close">✕ CLOSE</button></div></div><div class="menu-body">${body}</div>`;
  }
  function onMenuClick(e) {
    const t = e.target.closest('[data-tab],[data-game],[data-act]');
    if (!t) return;
    A.click();
    if (t.dataset.tab) { menuTab = t.dataset.tab; renderMenu(); }
    else if (t.dataset.game) { if (t.dataset.game !== game.id) { applyGame(t.dataset.game, true); A.bonusLand(); } closeMenu(); }
    else if (t.dataset.act === 'close') closeMenu();
    else if (t.dataset.act === 'sound') { toggleSound(); }
    else if (t.dataset.act === 'turbo') { state.turbo = !state.turbo; save(); renderMenu(); }
    else if (t.dataset.act === 'reset') {
      if (t.dataset.confirm) { resetCredits(); renderMenu(); }
      else { t.dataset.confirm = '1'; t.textContent = 'CONFIRM?'; }
    }
  }

  /* ---------------- layout & input ---------------- */
  function fit() {
    const s = Math.min(innerWidth / 1300, innerHeight / 1790);
    $('#stage').style.transform = `translate(-50%, -50%) scale(${s})`;
  }
  function press(id) { const b = $(id); if (!b) return; b.classList.add('pressed'); setTimeout(() => b.classList.remove('pressed'), 120); }
  function bind() {
    $('#bSpin').addEventListener('click', () => spin());
    $('#bMenu').addEventListener('click', () => { A.unlock(); A.click(); toggleMenu(); });
    $('#bSound').addEventListener('click', () => { A.unlock(); toggleSound(); });
    $('#bAuto').addEventListener('click', toggleAuto);
    $('#bBetDown').addEventListener('click', () => { A.unlock(); changeBet(-1); });
    $('#bBetUp').addEventListener('click', () => { A.unlock(); changeBet(1); });
    $('#bMax').addEventListener('click', () => { A.unlock(); maxBet(); });
    $('#menu').addEventListener('click', onMenuClick);
    addEventListener('keydown', e => {
      if (e.repeat && e.code !== 'Space') return;
      const menuOpen = !$('#menu').classList.contains('hidden');
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); if (e.repeat) return; if (!menuOpen) { press('#bSpin'); spin(); } }
      else if (e.key === 'Escape') { if (menuOpen) closeMenu(); }
      else if (e.key === 'm' || e.key === 'M') { A.unlock(); toggleMenu(); }
      else if (e.key === '+' || e.key === '=' || e.key === 'ArrowUp') { e.preventDefault(); press('#bBetUp'); changeBet(1); }
      else if (e.key === '-' || e.key === '_' || e.key === 'ArrowDown') { e.preventDefault(); press('#bBetDown'); changeBet(-1); }
      else if (e.key === 's' || e.key === 'S') { A.unlock(); toggleSound(); }
      else if (e.key === 'a' || e.key === 'A') { if (!menuOpen) toggleAuto(); }
      else if (/^[1-9]$/.test(e.key) && !spinning && !presenting) { const g = G.list[+e.key - 1]; if (g && g.id !== game.id) { applyGame(g.id, true); if (menuOpen) renderMenu(); } }
    });
    addEventListener('resize', fit);
  }

  function init() {
    document.body.insertAdjacentHTML('afterbegin', SlotArt.DEFS);
    load();
    A.setMuted(state.muted);
    $('#bSound').classList.toggle('muted', state.muted); $('#soundState').textContent = state.muted ? 'OFF' : 'ON';
    FX.init();
    buildToppers(); buildScreens();
    applyGame(state.gameId, false);
    updateDisplays(0);
    bind(); fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { applyGameText(); });
    // test hook
    // forceNext(cols): cols = 6 arrays of 4 symbol ids (optionally 'wild*5' for a x5 wild) — QA/demo only
    const forceNext = cols => { forced = cols.map(col => col.map(t => { const [id, m] = String(t).split('*'); return { id, mult: +m || 1 }; })); };
    window.SlotApp = { forceNext, spin, openMenu, closeMenu, applyGame: id => applyGame(id, true), state: () => state, busy: () => spinning || presenting, game: () => game.id, resetCredits };
  }
  function applyGameText() {
    $$('.topper').forEach(t => { fitText($('.sign.small .txt', t), 300, 62); fitText($('.sign.big .txt', t), 310, 132); });
    fitHeaders();
  }
  function fitHeaders() {
    const h0 = screens[0].header, h1 = screens[1].header;
    fitText($('.h-title', h0), 312, 70);
    fitScale($('.h-jp', h0), 312);
    fitScale($('.h-lbl', h1), 312);
    fitText($('.h-big', h1), 312, 66);
    fitScale($('.h-sub', h1), 312);
    screens.forEach(sc => { if (sc.foot.firstChild) fitScale(sc.foot.firstChild, 300); });
  }
  init();
})();
