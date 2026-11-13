/* Game 1 — WILD x125! (default). Gold coins, purple/blue panels: matches the reference cabinet. */
(function () {
  var A = SlotArt, svg = A.svg, t = A.text;
  SlotGames.register({
    id: 'wild125',
    name: 'Wild x125!',
    tagline: 'Gold-coin classic. Wilds can land with x2, x5 — or a monster x125 multiplier.',
    title: 'WILD x125!',
    toppers: [
      { small: 'WILD', big: 'x125!' },
      { small: 'GRAND', big: 'JACKPOT' },
      { small: 'WILD', big: 'x125!' }
    ],
    featureText: 'WILDS PAY UP TO x125',
    jackpots: { grand: 1250.00, major: 125.90 },
    theme: {
      font: "'Anton', Impact, 'Arial Black', sans-serif",
      accent: '#ffd84a', accent2: '#ff3040', glow: '#ffb020',
      panelA: '#5a18c8', panelB: '#1530a8', frameA: '#ff2030', frameB: '#ffd040',
      topperText: 'linear-gradient(180deg,#fffbd0 0%,#ffe060 35%,#f0a010 65%,#a05a00 100%)', topperStroke: '#2a0050',
      screenBg: 'radial-gradient(ellipse at 50% 18%, rgba(255,210,80,.45), transparent 42%), repeating-conic-gradient(from 0deg at 50% 15%, rgba(255,220,120,.10) 0 6deg, transparent 6deg 14deg), linear-gradient(180deg,#2a0a6a 0%,#1a0d5a 40%,#0c0a38 100%)',
      cellBg: 'radial-gradient(circle at 50% 40%, #3a1890 0%, #1c0a50 70%, #120634 100%)',
      cellBorder: 'rgba(255,200,80,.35)',
      lineColors: ['#ffd84a', '#ff3a3a', '#3ad0ff', '#ff6af0', '#7aff5a'],
      bokeh: ['#ffb020', '#ff3040', '#8a40ff', '#3a6aff', '#ffd84a'],
      pageTint: 'radial-gradient(ellipse at 50% 30%, #2a0d4a 0%, #0a0418 60%, #030108 100%)',
      decor: svg(A.coin(50, 50, 44, '$'))
    },
    symbols: [
      { id: 'wild', name: 'WILD', type: 'wild', weight: 2.6, pays: { 3: 25, 4: 100, 5: 400, 6: 1250 },
        svg: svg('<g filter="url(#f-sd)"><rect x="5" y="20" width="90" height="60" rx="13" fill="url(#g-violet)" stroke="url(#g-gold)" stroke-width="5"/>' +
          '<polygon points="' + A.starPts(14, 22, 9, 4) + '" fill="#fff6a0"/><polygon points="' + A.starPts(88, 78, 8, 3.5) + '" fill="#fff6a0"/>' +
          t('WILD', { size: 40, y: 66, ls: 1, stroke: '#2a0050', sw: 3 }) + '</g>') },
      { id: 'bonus', name: 'BONUS COIN', type: 'scatter', weight: 1.9, pays: {},
        svg: svg('<g filter="url(#f-sd)">' + A.coin(50, 44, 38, '$') +
          '<rect x="8" y="70" width="84" height="22" rx="6" fill="url(#g-red)" stroke="url(#g-gold)" stroke-width="3"/>' +
          t('BONUS', { size: 19, y: 88, fill: '#fff', stroke: '#500008', sw: 2, ls: 1 }) + '</g>') },
      { id: 'crown', name: 'CROWN', weight: 4.2, pays: { 3: 12, 4: 40, 5: 150, 6: 500 },
        svg: svg('<g filter="url(#f-sd)"><path d="M14 72 L9 30 L32 50 L50 18 L68 50 L91 30 L86 72 Z" fill="url(#g-gold)" stroke="#5a3000" stroke-width="3" stroke-linejoin="round"/>' +
          '<rect x="12" y="70" width="76" height="14" rx="4" fill="url(#g-gold)" stroke="#5a3000" stroke-width="3"/>' +
          '<circle cx="9" cy="29" r="5" fill="url(#g-gold)" stroke="#5a3000" stroke-width="2"/><circle cx="50" cy="16" r="5" fill="url(#g-gold)" stroke="#5a3000" stroke-width="2"/><circle cx="91" cy="29" r="5" fill="url(#g-gold)" stroke="#5a3000" stroke-width="2"/>' +
          '<circle cx="50" cy="56" r="8" fill="url(#g-red)" stroke="#5a0000" stroke-width="2"/><circle cx="30" cy="60" r="5.5" fill="url(#g-blue)"/><circle cx="70" cy="60" r="5.5" fill="url(#g-green)"/>' +
          '<circle cx="47" cy="53" r="2.4" fill="#fff" opacity=".8"/></g>') },
      { id: 'ingot', name: 'GOLD BARS', weight: 5, pays: { 3: 10, 4: 30, 5: 100, 6: 300 },
        svg: svg('<g filter="url(#f-sd)">' + A.ingot(6, 60, 46, 24) + A.ingot(48, 60, 46, 24) + A.ingot(27, 34, 46, 24) +
          '<polygon points="' + A.starPts(76, 30, 8, 3) + '" fill="#fff"/></g>') },
      { id: 'diamond', name: 'DIAMOND', weight: 6, pays: { 3: 8, 4: 25, 5: 75, 6: 200 },
        svg: svg('<g filter="url(#f-sd)"><polygon points="18,38 34,18 66,18 82,38 50,88" fill="url(#g-blue)" stroke="#0a1a5a" stroke-width="3" stroke-linejoin="round"/>' +
          '<polygon points="18,38 82,38 50,88" fill="#1a5ae0" opacity=".55"/><polygon points="34,18 42,38 50,18" fill="#e8faff" opacity=".8"/>' +
          '<polygon points="50,18 58,38 66,18" fill="#bfefff" opacity=".6"/><polygon points="42,38 58,38 50,88" fill="#7ad0ff" opacity=".6"/>' +
          '<polygon points="' + A.starPts(30, 30, 7, 2.2) + '" fill="#fff"/></g>') },
      { id: 'A', name: 'A', weight: 9, pays: { 3: 4, 4: 12, 5: 35, 6: 100 }, svg: A.cardLetter('A', 'g-red') },
      { id: 'K', name: 'K', weight: 10, pays: { 3: 3, 4: 10, 5: 30, 6: 80 }, svg: A.cardLetter('K', 'g-blue') },
      { id: 'Q', name: 'Q', weight: 11, pays: { 3: 3, 4: 8, 5: 25, 6: 60 }, svg: A.cardLetter('Q', 'g-green') },
      { id: 'J', name: 'J', weight: 12, pays: { 3: 2, 4: 6, 5: 20, 6: 50 }, svg: A.cardLetter('J', 'g-purple') }
    ],
    // Each wild that lands rolls a multiplier tag; a line win uses the biggest tag on it.
    wildMultipliers: [{ m: 1, w: 78 }, { m: 2, w: 15 }, { m: 5, w: 6 }, { m: 125, w: 0.35 }],
    // 3+ BONUS anywhere: pays (x total bet) then the Multiplier Bonus wheel multiplies it.
    scatterPays: { 3: 2, 4: 6, 5: 25, 6: 100 },
    bonusMultipliers: [{ m: 2, w: 34 }, { m: 3, w: 26 }, { m: 5, w: 20 }, { m: 10, w: 12 }, { m: 25, w: 5 }, { m: 50, w: 2 }, { m: 125, w: 1 }]
  });
})();
