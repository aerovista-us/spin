/* Game 3 — LUCKY 7s. Classic fruit machine: cherries, bells, BARs and hot 7s. */
(function () {
  var A = SlotArt, svg = A.svg, t = A.text;
  var LG = "'Luckiest Guy', 'Titan One', 'Arial Black', sans-serif";
  function bar(y, h) {
    return '<rect x="10" y="' + y + '" width="80" height="' + h + '" rx="5" fill="#111" stroke="url(#g-gold)" stroke-width="3"/>' +
      t('BAR', { font: LG, size: h * 0.82, y: y + h * 0.82, fill: '#fff', stroke: '#c01010', sw: 2, ls: 2 });
  }
  var cherry = '<path d="M34 62 Q40 30 62 14 M66 58 Q64 34 62 14" fill="none" stroke="#2a8a10" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M62 14 Q80 8 88 24 Q72 28 62 14 Z" fill="url(#g-leaf)" stroke="#145a08" stroke-width="2"/>' +
    '<circle cx="32" cy="68" r="20" fill="url(#g-red)" stroke="#500008" stroke-width="2.5"/><circle cx="68" cy="64" r="20" fill="url(#g-red)" stroke="#500008" stroke-width="2.5"/>' +
    '<ellipse cx="25" cy="60" rx="6" ry="4" fill="#fff" opacity=".7"/><ellipse cx="61" cy="56" rx="6" ry="4" fill="#fff" opacity=".7"/>';
  SlotGames.register({
    id: 'fruits',
    name: 'Lucky 7s',
    tagline: 'Old-school fruit machine with BARs and hot 7s. Wilds land with x2, x3, x7 or x77.',
    title: 'LUCKY 7s',
    toppers: [
      { small: 'HOT', big: '7 7 7' },
      { small: 'FRUIT', big: 'FRENZY' },
      { small: 'HOT', big: '7 7 7' }
    ],
    featureText: 'LUCKY WILDS UP TO x77',
    jackpots: { grand: 777.77, major: 77.77 },
    theme: {
      font: LG,
      accent: '#ffe83a', accent2: '#ff2a2a', glow: '#ff8a00',
      panelA: '#c0101a', panelB: '#5a0008', frameA: '#ffd040', frameB: '#ffffff',
      topperText: 'linear-gradient(180deg,#ffffff 0%,#fff47a 40%,#ffb000 75%,#c05a00 100%)', topperStroke: '#5a0008',
      screenBg: 'repeating-conic-gradient(from 0deg at 50% 12%, rgba(255,255,255,.07) 0 8deg, transparent 8deg 16deg), radial-gradient(ellipse at 50% 12%, #2a7aff 0%, #0c2a9a 45%, #050f40 100%)',
      cellBg: 'radial-gradient(circle at 50% 40%, #ffffff 0%, #fff3d0 60%, #e8c890 100%)',
      cellBorder: 'rgba(255,215,64,.8)',
      lineColors: ['#ff2a2a', '#ffe83a', '#2ad04a', '#2a8aff', '#ff6af0'],
      bokeh: ['#ff2a2a', '#ffe83a', '#ff8a00', '#2a8aff'],
      pageTint: 'radial-gradient(ellipse at 50% 30%, #3a0810 0%, #12020a 60%, #040004 100%)',
      decor: svg(cherry)
    },
    symbols: [
      { id: 'wild', name: 'WILD', type: 'wild', weight: 2.6, pays: { 3: 25, 4: 100, 5: 400, 6: 1250 },
        svg: svg('<g filter="url(#f-sd)"><rect x="6" y="22" width="88" height="56" rx="28" fill="url(#g-red)" stroke="url(#g-gold)" stroke-width="5"/>' +
          t('WILD', { font: LG, size: 36, y: 64, fill: 'url(#g-yellow)', stroke: '#5a0008', sw: 3, ls: 1 }) + '</g>') },
      { id: 'star', name: 'BONUS STAR', type: 'scatter', weight: 1.9, pays: {},
        svg: svg('<g filter="url(#f-sd)"><polygon points="' + A.starPts(50, 50, 46, 20) + '" fill="url(#g-gold)" stroke="#7a3a00" stroke-width="3" stroke-linejoin="round"/>' +
          t('BONUS', { font: LG, size: 17, y: 58, fill: '#fff', stroke: '#c01010', sw: 2.5 }) + '</g>') },
      { id: 'seven', name: 'HOT 7', weight: 4.2, pays: { 3: 12, 4: 40, 5: 150, 6: 500 },
        svg: svg('<g filter="url(#f-sd)"><path d="M16 14 H86 V30 C68 48 56 66 52 90 H28 C32 64 46 46 62 32 H16 Z" fill="url(#g-red)" stroke="url(#g-gold)" stroke-width="6" stroke-linejoin="round"/>' +
          '<path d="M22 19 H80" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/></g>') },
      { id: 'bar3', name: 'TRIPLE BAR', weight: 5, pays: { 3: 10, 4: 30, 5: 100, 6: 300 },
        svg: svg('<g filter="url(#f-sd)">' + bar(14, 22) + bar(39, 22) + bar(64, 22) + '</g>') },
      { id: 'bell', name: 'BELL', weight: 6, pays: { 3: 8, 4: 25, 5: 75, 6: 200 },
        svg: svg('<g filter="url(#f-sd)"><circle cx="50" cy="13" r="6" fill="url(#g-gold)" stroke="#6a3a00" stroke-width="2"/>' +
          '<path d="M50 16 C30 16 26 34 26 52 C26 64 18 70 13 78 L87 78 C82 70 74 64 74 52 C74 34 70 16 50 16 Z" fill="url(#g-gold)" stroke="#6a3a00" stroke-width="3" stroke-linejoin="round"/>' +
          '<circle cx="50" cy="84" r="8" fill="url(#g-gold)" stroke="#6a3a00" stroke-width="2"/><path d="M38 28 Q32 42 33 60" stroke="#fff" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/></g>') },
      { id: 'cherry', name: 'CHERRIES', weight: 9, pays: { 3: 4, 4: 12, 5: 35, 6: 100 }, svg: svg('<g filter="url(#f-sd)">' + cherry + '</g>') },
      { id: 'plum', name: 'PLUM', weight: 10, pays: { 3: 3, 4: 10, 5: 30, 6: 80 },
        svg: svg('<g filter="url(#f-sd)"><ellipse cx="50" cy="56" rx="36" ry="33" fill="url(#g-plum)" stroke="#2a0650" stroke-width="2.5"/>' +
          '<path d="M50 26 Q46 40 50 88" stroke="#3a0870" stroke-width="2" fill="none" opacity=".6"/><path d="M50 24 Q66 6 82 16 Q70 30 50 24 Z" fill="url(#g-leaf)" stroke="#145a08" stroke-width="2"/>' +
          '<ellipse cx="34" cy="44" rx="8" ry="5" fill="#fff" opacity=".5"/></g>') },
      { id: 'lemon', name: 'LEMON', weight: 11, pays: { 3: 3, 4: 8, 5: 25, 6: 60 },
        svg: svg('<g filter="url(#f-sd)"><path d="M8 52 Q14 44 22 42 Q50 12 78 42 Q86 44 92 52 Q86 60 78 62 Q50 92 22 62 Q14 60 8 52 Z" fill="url(#g-yellow)" stroke="#8a6a00" stroke-width="2.5"/>' +
          '<ellipse cx="38" cy="40" rx="10" ry="5" fill="#fff" opacity=".6"/></g>') },
      { id: 'melon', name: 'WATERMELON', weight: 12, pays: { 3: 2, 4: 6, 5: 20, 6: 50 },
        svg: svg('<g filter="url(#f-sd)"><path d="M8 36 A42 42 0 0 0 92 36 Z" fill="#1a8a20" stroke="#0a4a0c" stroke-width="2.5"/>' +
          '<path d="M14 36 A36 36 0 0 0 86 36 Z" fill="#fff4d0"/><path d="M18 36 A32 32 0 0 0 82 36 Z" fill="url(#g-red)"/>' +
          '<g fill="#111"><ellipse cx="36" cy="48" rx="2.4" ry="4"/><ellipse cx="50" cy="54" rx="2.4" ry="4"/><ellipse cx="64" cy="48" rx="2.4" ry="4"/><ellipse cx="43" cy="60" rx="2.2" ry="3.6"/><ellipse cx="57" cy="60" rx="2.2" ry="3.6"/></g></g>') }
    ],
    wildMultipliers: [{ m: 1, w: 68 }, { m: 2, w: 17 }, { m: 3, w: 10 }, { m: 7, w: 4.5 }, { m: 77, w: 0.5 }],
    scatterPays: { 3: 2, 4: 6, 5: 25, 6: 100 },
    bonusMultipliers: [{ m: 2, w: 34 }, { m: 3, w: 26 }, { m: 5, w: 18 }, { m: 7, w: 12 }, { m: 17, w: 6 }, { m: 37, w: 2.5 }, { m: 77, w: 1 }]
  });
})();
