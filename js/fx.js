/* Canvas particle effects: gold coin bursts, coin rain, sparkles. */
(function (root) {
  'use strict';
  var canvas, ctx, dpr = 1, parts = [], running = false, sprite = null, rains = [], last = 0, MAX = 420;
  function makeSprite() {
    var s = document.createElement('canvas'), S = 96; s.width = s.height = S;
    var c = s.getContext('2d'), r = S / 2 - 3;
    var g = c.createRadialGradient(S * 0.38, S * 0.32, 4, S / 2, S / 2, r);
    g.addColorStop(0, '#fffbe0'); g.addColorStop(0.35, '#ffd84a'); g.addColorStop(0.8, '#d48a0c'); g.addColorStop(1, '#7a4500');
    c.fillStyle = g; c.beginPath(); c.arc(S / 2, S / 2, r, 0, Math.PI * 2); c.fill();
    c.lineWidth = 4; c.strokeStyle = '#6a3c00'; c.stroke();
    c.beginPath(); c.arc(S / 2, S / 2, r * 0.74, 0, Math.PI * 2); c.strokeStyle = 'rgba(140,80,0,.8)'; c.lineWidth = 3; c.stroke();
    c.fillStyle = '#a86400'; c.font = 'bold ' + (S * 0.5) + 'px Anton, Impact, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('$', S / 2, S / 2 + 3);
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(S * 0.36, S * 0.3, S * 0.14, S * 0.07, -0.6, 0, Math.PI * 2); c.fill();
    return s;
  }
  function resize() {
    dpr = Math.min(root.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  }
  function init() {
    canvas = document.getElementById('fx'); ctx = canvas.getContext('2d');
    sprite = makeSprite(); resize(); root.addEventListener('resize', resize);
  }
  function addCoin(x, y, vx, vy, size) {
    parts.push({ k: 'c', x: x, y: y, vx: vx, vy: vy, size: size, spin: Math.random() * 6, vs: 0.1 + Math.random() * 0.25, life: 0, max: 220 + Math.random() * 80 });
  }
  function addSpark(x, y) {
    var a = Math.random() * Math.PI * 2, v = 2 + Math.random() * 6;
    parts.push({ k: 's', x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, size: 2 + Math.random() * 4, life: 0, max: 40 + Math.random() * 30, hue: 40 + Math.random() * 20 });
  }
  function burst(x, y, n, power) {
    power = power || 1;
    var unit = Math.min(innerWidth, innerHeight) / 800;
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (Math.random() - 0.5) * 1.3, v = (11 + Math.random() * 10) * power * unit;
      addCoin(x + (Math.random() - 0.5) * 40 * unit, y, Math.cos(a) * v, Math.sin(a) * v, (9 + Math.random() * 11) * unit);
    }
    for (i = 0; i < n / 2; i++) addSpark(x, y);
    start();
  }
  function rain(rect, ms, rate) {
    rains.push({ rect: rect, until: performance.now() + ms, rate: rate || 3 }); start();
  }
  function clear() { parts.length = 0; rains.length = 0; }
  function start() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(loop); } }
  function loop(now) {
    var k = Math.min(3, Math.max(0.2, (now - last) / 16.67)); last = now;
    if (parts.length > MAX) parts.splice(0, parts.length - MAX);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    var unit = Math.min(innerWidth, innerHeight) / 800;
    for (var r = rains.length - 1; r >= 0; r--) {
      var R = rains[r];
      if (now > R.until) { rains.splice(r, 1); continue; }
      for (var q = 0; q < R.rate * k; q++) if (Math.random() < 0.6) addCoin(R.rect.left + Math.random() * R.rect.width, R.rect.top - 20, (Math.random() - 0.5) * 2, 4 + Math.random() * 5, (8 + Math.random() * 10) * unit);
    }
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.life++;
      if (p.k === 'c') {
        p.vy += 0.5 * unit * k; p.x += p.vx * k; p.y += p.vy * k; p.spin += p.vs * k; p.life += k - 1;
        if (p.y > innerHeight + 60 || p.life > p.max) { parts.splice(i, 1); continue; }
        var sx = Math.cos(p.spin);
        ctx.save(); ctx.translate(p.x, p.y); ctx.scale(Math.max(0.08, Math.abs(sx)), 1);
        if (sx < 0) ctx.globalAlpha = 0.85;
        ctx.drawImage(sprite, -p.size, -p.size, p.size * 2, p.size * 2);
        ctx.restore();
      } else {
        p.vx *= Math.pow(0.94, k); p.vy *= Math.pow(0.94, k); p.x += p.vx * k; p.y += p.vy * k; p.life += k - 1;
        if (p.life > p.max) { parts.splice(i, 1); continue; }
        var a = 1 - p.life / p.max;
        ctx.fillStyle = 'hsla(' + p.hue + ',100%,75%,' + a + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2); ctx.fill();
      }
    }
    if (parts.length || rains.length) requestAnimationFrame(loop);
    else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  root.SlotFX = { init: init, burst: burst, rain: rain, clear: clear, count: function () { return parts.length; } };
})(this);
