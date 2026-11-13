/* Procedural SVG art helpers (pure strings, no DOM). All art is original, drawn in code. */
(function (root) {
  'use strict';
  function lg(id, stops, x2, y2) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (x2 || 0) + '" y2="' + (y2 === undefined ? 1 : y2) + '">' +
      stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"/>'; }).join('') + '</linearGradient>';
  }
  function rg(id, stops, cx, cy) {
    return '<radialGradient id="' + id + '" cx="' + (cx || 0.4) + '" cy="' + (cy || 0.35) + '" r="0.75">' +
      stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"/>'; }).join('') + '</radialGradient>';
  }
  // Shared gradients / filters, injected once into the page by app.js
  var DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    lg('g-gold', [[0, '#fffbd0'], [0.3, '#ffd84a'], [0.62, '#e09a10'], [1, '#7a4300']]) +
    lg('g-goldh', [[0, '#7a4300'], [0.2, '#ffd84a'], [0.5, '#fffbd0'], [0.8, '#ffd84a'], [1, '#7a4300']], 1, 0) +
    rg('g-coin', [[0, '#fffbe0'], [0.35, '#ffd84a'], [0.8, '#d48a0c'], [1, '#8a5200']]) +
    lg('g-red', [[0, '#ffb0a8'], [0.35, '#ff2a2a'], [0.75, '#b00010'], [1, '#500008']]) +
    lg('g-blue', [[0, '#d0f4ff'], [0.35, '#38a8ff'], [0.75, '#1046c8'], [1, '#081a60']]) +
    lg('g-green', [[0, '#e0ffc8'], [0.35, '#44e04a'], [0.75, '#0c8a20'], [1, '#04400c']]) +
    lg('g-purple', [[0, '#f6d0ff'], [0.35, '#c040ff'], [0.75, '#6a10c0'], [1, '#2a0558']]) +
    lg('g-violet', [[0, '#7a2ad8'], [0.5, '#3a0b7a'], [1, '#160430']]) +
    lg('g-silver', [[0, '#ffffff'], [0.4, '#d6dce8'], [0.75, '#8a94a8'], [1, '#3a404c']]) +
    lg('g-orange', [[0, '#ffe0b0'], [0.4, '#ff9a1a'], [1, '#a03a00']]) +
    lg('g-yellow', [[0, '#ffffd8'], [0.4, '#ffe83a'], [1, '#b08a00']]) +
    lg('g-plum', [[0, '#e8b0ff'], [0.4, '#8a2ad0'], [1, '#2a0650']]) +
    lg('g-leaf', [[0, '#b8ff8a'], [1, '#1a7a10']]) +
    lg('g-rainbow', [[0, '#ff3a3a'], [0.25, '#ffb21a'], [0.5, '#ffe83a'], [0.75, '#3aff6a'], [1, '#3ab0ff']], 1, 0) +
    rg('g-orb', [[0, '#ffffff'], [0.25, '#7ff6ff'], [0.6, '#008ab0'], [1, 'rgba(0,30,60,0)']], 0.5, 0.5) +
    '<filter id="f-sd" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="2.5" stdDeviation="1.6" flood-color="#000" flood-opacity=".75"/></filter>' +
    '<filter id="f-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '<filter id="f-neon" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '<filter id="f-mblur" x="0" y="-10%" width="100%" height="120%"><feGaussianBlur stdDeviation="0 9"/></filter>' +
    '</defs></svg>';

  function svg(inner, vb) {
    return '<svg viewBox="' + (vb || '0 0 100 100') + '" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }
  function starPts(cx, cy, R, r, n) {
    n = n || 5; var pts = [];
    for (var i = 0; i < n * 2; i++) {
      var a = -Math.PI / 2 + i * Math.PI / n, rad = i % 2 ? r : R;
      pts.push((cx + Math.cos(a) * rad).toFixed(1) + ',' + (cy + Math.sin(a) * rad).toFixed(1));
    }
    return pts.join(' ');
  }
  function polyHex(cx, cy, r) {
    var p = [];
    for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; p.push((cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1)); }
    return p.join(' ');
  }
  function text(t, o) {
    o = o || {};
    var font = o.font || "Anton, Impact, 'Arial Black', sans-serif";
    var base = ' x="' + (o.x || 50) + '" y="' + (o.y || 70) + '" text-anchor="middle" font-family="' + font + '" font-size="' + (o.size || 60) + '"' +
      (o.ls ? ' letter-spacing="' + o.ls + '"' : '') + (o.tl ? ' textLength="' + o.tl + '" lengthAdjust="spacingAndGlyphs"' : '');
    var s = '';
    if (o.outer) s += '<text' + base + ' fill="none" stroke="' + o.outer + '" stroke-width="' + (o.outerW || 9) + '" stroke-linejoin="round">' + t + '</text>';
    s += '<text' + base + ' fill="' + (o.fill || 'url(#g-gold)') + '" stroke="' + (o.stroke || '#1a0800') + '" stroke-width="' + (o.sw === undefined ? 3 : o.sw) +
      '" paint-order="stroke" stroke-linejoin="round"' + (o.filter ? ' filter="url(#' + o.filter + ')"' : '') + '>' + t + '</text>';
    return s;
  }
  function cardLetter(ch, grad, outer) {
    return svg('<g filter="url(#f-sd)">' + text(ch, { size: 74, y: 78, fill: 'url(#' + grad + ')', outer: outer || 'url(#g-gold)', outerW: 10, sw: 3 }) + '</g>');
  }
  function coin(cx, cy, r, label) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#g-coin)" stroke="#6a3c00" stroke-width="' + (r * 0.08) + '"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.76) + '" fill="none" stroke="#a86a00" stroke-width="' + (r * 0.07) + '" stroke-dasharray="' + (r * 0.12) + ' ' + (r * 0.1) + '"/>' +
      (label ? text(label, { x: cx, y: cy + r * 0.38, size: r * 1.1, fill: 'url(#g-gold)', stroke: '#7a4300', sw: r * 0.08 }) : '');
  }
  function ingot(x, y, w, h) {
    return '<polygon points="' + x + ',' + (y + h) + ' ' + (x + w) + ',' + (y + h) + ' ' + (x + w - h * 0.6) + ',' + y + ' ' + (x + h * 0.6) + ',' + y + '" fill="url(#g-gold)" stroke="#5a3000" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<polygon points="' + (x + h * 0.6 + 3) + ',' + (y + 4) + ' ' + (x + w - h * 0.6 - 3) + ',' + (y + 4) + ' ' + (x + w - h * 0.6 - 6) + ',' + (y + h * 0.45) + ' ' + (x + h * 0.6 + 6) + ',' + (y + h * 0.45) + '" fill="#fff8c8" opacity=".55"/>';
  }
  function neon(inner, color) {
    return '<g fill="none" stroke="' + color + '" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" filter="url(#f-glow)">' + inner + '</g>';
  }

  var api = { DEFS: DEFS, svg: svg, text: text, starPts: starPts, polyHex: polyHex, cardLetter: cardLetter, coin: coin, ingot: ingot, neon: neon };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.SlotArt = api;
})(this);
