/* WebAudio synth sound effects — everything is generated, no audio files. */
(function (root) {
  'use strict';
  var ctx = null, master = null, muted = false, noiseBuf = null;
  function ensure() {
    if (!ctx) {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.55;
      var comp = ctx.createDynamicsCompressor();
      master.connect(comp); comp.connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      var d = noiseBuf.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, dur, o) {
    o = o || {};
    var c = ensure(); if (!c || muted) return;
    var t = c.currentTime + (o.delay || 0);
    var osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t + dur);
    if (o.detune) osc.detune.value = o.detune;
    var vol = o.vol === undefined ? 0.25 : o.vol;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + (o.attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    var out = g;
    if (o.lp) { var f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; g.connect(f); out = f; }
    osc.connect(g); out.connect(master);
    osc.start(t); osc.stop(t + dur + 0.05);
  }
  function noise(dur, o) {
    o = o || {};
    var c = ensure(); if (!c || muted) return;
    var t = c.currentTime + (o.delay || 0);
    var src = c.createBufferSource(); src.buffer = noiseBuf;
    var f = c.createBiquadFilter(); f.type = o.type || 'bandpass'; f.Q.value = o.q || 1;
    f.frequency.setValueAtTime(o.freq || 1500, t);
    if (o.sweepTo) f.frequency.exponentialRampToValueAtTime(o.sweepTo, t + dur);
    var g = c.createGain(); var vol = o.vol || 0.2;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + (o.attack || 0.01)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t); src.stop(t + dur + 0.05);
  }
  var NOTE = function (n) { return 440 * Math.pow(2, (n - 69) / 12); };
  function bell(freq, delay, vol) {
    tone(freq, 0.9, { type: 'sine', vol: vol || 0.18, delay: delay });
    tone(freq * 2.01, 0.5, { type: 'sine', vol: (vol || 0.18) * 0.4, delay: delay });
    tone(freq * 3.02, 0.25, { type: 'triangle', vol: (vol || 0.18) * 0.2, delay: delay });
  }
  var spinTimer = null;
  var api = {
    unlock: ensure,
    setMuted: function (m) { muted = !!m; if (master) master.gain.value = muted ? 0 : 0.55; },
    isMuted: function () { return muted; },
    click: function () { tone(1700, 0.05, { type: 'square', vol: 0.06 }); tone(900, 0.04, { type: 'sine', vol: 0.08 }); },
    spinStart: function () {
      noise(0.45, { freq: 400, sweepTo: 3500, q: 2, vol: 0.18 });
      tone(180, 0.35, { type: 'sawtooth', slideTo: 520, vol: 0.06, lp: 1800 });
      api.spinLoop(true);
    },
    spinLoop: function (on) {
      clearInterval(spinTimer); spinTimer = null;
      if (on) spinTimer = setInterval(function () { tone(1100 + Math.random() * 200, 0.025, { type: 'square', vol: 0.025 }); }, 70);
    },
    reelStop: function (i) {
      noise(0.09, { type: 'lowpass', freq: 380, vol: 0.5 });
      tone(130 - i * 6, 0.16, { type: 'triangle', slideTo: 55, vol: 0.35 });
      tone(2400, 0.03, { type: 'square', vol: 0.03 });
    },
    scatter: function (n) { var base = [72, 76, 79, 84, 88, 91][Math.min(n, 6) - 1] || 72; bell(NOTE(base), 0, 0.2); bell(NOTE(base + 12), 0.08, 0.12); },
    anticipation: function () { for (var i = 0; i < 6; i++) tone(NOTE(60 + i * 2), 0.12, { type: 'square', vol: 0.04, delay: i * 0.12, lp: 2500 }); },
    win: function (level) {
      var seq = level >= 2 ? [72, 76, 79, 84, 88, 91] : [72, 76, 79, 84];
      seq.forEach(function (n, i) { tone(NOTE(n), 0.25, { type: 'square', vol: 0.06, delay: i * 0.07, lp: 3000 }); bell(NOTE(n), i * 0.07, 0.08); });
    },
    coinTick: function () { tone(2600 + Math.random() * 900, 0.05, { type: 'square', vol: 0.035 }); tone(4100 + Math.random() * 500, 0.04, { type: 'sine', vol: 0.05 }); },
    bigWin: function () {
      var chords = [[60, 64, 67], [65, 69, 72], [67, 71, 74], [72, 76, 79, 84]];
      chords.forEach(function (ch, i) {
        ch.forEach(function (n) { tone(NOTE(n), i === 3 ? 1.4 : 0.32, { type: 'sawtooth', vol: 0.05, delay: i * 0.22, lp: 2600 }); tone(NOTE(n - 12), 0.3, { type: 'square', vol: 0.03, delay: i * 0.22, lp: 1200 }); });
      });
      noise(1.6, { freq: 6000, q: 0.5, vol: 0.05, delay: 0.66 });
    },
    featureHit: function () {
      tone(80, 0.8, { type: 'sawtooth', slideTo: 40, vol: 0.2, lp: 600 });
      noise(0.9, { freq: 200, sweepTo: 6000, q: 1, vol: 0.2 });
      [84, 88, 91, 96].forEach(function (n, i) { bell(NOTE(n), 0.15 + i * 0.09, 0.15); });
    },
    bonusTick: function (i) { tone(NOTE(76 + (i % 5)), 0.06, { type: 'square', vol: 0.05 }); },
    bonusLand: function () { [72, 79, 84, 88].forEach(function (n, i) { bell(NOTE(n), i * 0.05, 0.16); }); tone(NOTE(48), 0.8, { type: 'triangle', vol: 0.2 }); },
    jackpot: function () { for (var i = 0; i < 16; i++) bell(NOTE(84 + [0, 4, 7, 12][i % 4]), i * 0.11, 0.12); api.bigWin(); },
    menu: function (open) { tone(open ? 520 : 780, 0.12, { type: 'triangle', slideTo: open ? 780 : 520, vol: 0.12 }); },
    error: function () { tone(160, 0.25, { type: 'square', vol: 0.08, lp: 900 }); tone(120, 0.3, { type: 'square', vol: 0.08, delay: 0.12, lp: 900 }); }
  };
  root.SlotAudio = api;
})(this);
