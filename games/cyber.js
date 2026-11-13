/* Game 2 — CYBER SURGE. Neon wireframe icons on a synthwave grid. */
(function () {
  var A = SlotArt, svg = A.svg, t = A.text, N = A.neon;
  var ORB = "'Orbitron', 'Russo One', 'Arial Black', sans-serif";
  SlotGames.register({
    id: 'cyber',
    name: 'Cyber Surge',
    tagline: 'Neon synthwave grid. Overload wilds hit x2, x4, x10 or x100.',
    title: 'CYBER SURGE',
    toppers: [
      { small: 'NEON', big: 'SURGE' },
      { small: 'OVERLOAD', big: 'x100' },
      { small: 'NEON', big: 'SURGE' }
    ],
    featureText: 'OVERLOAD WILDS UP TO x100',
    jackpots: { grand: 2077.00, major: 207.70 },
    theme: {
      font: ORB,
      accent: '#00f0ff', accent2: '#ff2bd6', glow: '#00e0ff',
      panelA: '#14003a', panelB: '#00283a', frameA: '#ff2bd6', frameB: '#00f0ff',
      topperText: 'linear-gradient(180deg,#ffffff 0%,#9ffcff 35%,#00e0ff 60%,#ff2bd6 100%)', topperStroke: '#18003a',
      screenBg: 'linear-gradient(180deg, transparent 55%, rgba(255,43,214,.25) 100%), repeating-linear-gradient(90deg, rgba(0,240,255,.16) 0 2px, transparent 2px 46px), repeating-linear-gradient(0deg, rgba(255,43,214,.14) 0 2px, transparent 2px 46px), radial-gradient(ellipse at 50% 12%, #4a0a7a 0%, #12002a 55%, #05000f 100%)',
      cellBg: 'radial-gradient(circle at 50% 45%, rgba(20,0,50,.95) 0%, rgba(6,0,18,.95) 100%)',
      cellBorder: 'rgba(0,240,255,.45)',
      lineColors: ['#00f0ff', '#ff2bd6', '#ffe600', '#39ff14', '#ff7a00'],
      bokeh: ['#00f0ff', '#ff2bd6', '#7a3aff', '#00ffa0'],
      pageTint: 'radial-gradient(ellipse at 50% 30%, #1a0638 0%, #05010f 60%, #000 100%)',
      decor: svg(N('<polygon points="56,6 20,56 46,56 38,94 80,40 54,40"/>', '#ffe600'))
    },
    symbols: [
      { id: 'wild', name: 'WILD', type: 'wild', weight: 2.6, pays: { 3: 25, 4: 100, 5: 400, 6: 1250 },
        svg: svg('<polygon points="' + A.polyHex(50, 50, 44) + '" fill="#12002a" stroke="#ff2bd6" stroke-width="4" filter="url(#f-glow)"/>' +
          t('WILD', { font: ORB, size: 27, y: 60, fill: '#bffcff', stroke: '#00e0ff', sw: 1.5, filter: 'f-glow' })) },
      { id: 'surge', name: 'SURGE ORB', type: 'scatter', weight: 1.9, pays: {},
        svg: svg('<circle cx="50" cy="44" r="38" fill="url(#g-orb)"/>' + N('<circle cx="50" cy="44" r="36"/>', '#00f0ff') +
          N('<polygon points="54,16 34,48 48,48 42,72 66,38 52,38"/>', '#ffffff') +
          t('SURGE', { font: ORB, size: 16, y: 95, fill: '#ff9cf0', stroke: '#ff2bd6', sw: 0.8, filter: 'f-glow', ls: 1 })) },
      { id: 'bolt', name: 'BOLT', weight: 4.2, pays: { 3: 12, 4: 40, 5: 150, 6: 500 },
        svg: svg(N('<polygon points="58,6 20,56 46,56 38,94 80,40 54,40" fill="rgba(255,230,0,.18)"/>', '#ffe600')) },
      { id: 'eye', name: 'CYBER EYE', weight: 5, pays: { 3: 10, 4: 30, 5: 100, 6: 300 },
        svg: svg(N('<path d="M8 50 Q50 10 92 50 Q50 90 8 50 Z" fill="rgba(255,43,214,.15)"/>', '#ff2bd6') + N('<circle cx="50" cy="50" r="15"/>', '#00f0ff') + '<circle cx="50" cy="50" r="6" fill="#fff" filter="url(#f-glow)"/>') },
      { id: 'cube', name: 'CUBE', weight: 6, pays: { 3: 8, 4: 25, 5: 75, 6: 200 },
        svg: svg(N('<polygon points="' + A.polyHex(50, 50, 40).split(' ').map(function (p) { var a = p.split(','); return a[0] + ',' + a[1]; }).join(' ') + '" fill="rgba(57,255,20,.12)"/><path d="M50 50 L50 90 M50 50 L15.4 30 M50 50 L84.6 30"/>', '#39ff14')) },
      { id: 'hex', name: 'HEX', weight: 9, pays: { 3: 4, 4: 12, 5: 35, 6: 100 },
        svg: svg(N('<polygon points="' + A.polyHex(50, 50, 40) + '"/><polygon points="' + A.polyHex(50, 50, 22) + '"/>', '#ff7a00')) },
      { id: 'tri', name: 'TRIANGLE', weight: 10, pays: { 3: 3, 4: 10, 5: 30, 6: 80 },
        svg: svg(N('<polygon points="50,10 92,84 8,84"/><polygon points="50,40 70,74 30,74"/>', '#4d7cff')) },
      { id: 'ring', name: 'RING', weight: 11, pays: { 3: 3, 4: 8, 5: 25, 6: 60 },
        svg: svg(N('<circle cx="50" cy="50" r="38"/><circle cx="50" cy="50" r="22"/><circle cx="50" cy="50" r="6"/>', '#ff4fa0')) },
      { id: 'square', name: 'GRID', weight: 12, pays: { 3: 2, 4: 6, 5: 20, 6: 50 },
        svg: svg(N('<rect x="14" y="14" width="72" height="72" rx="6"/><path d="M14 50 H86 M50 14 V86"/>', '#a06aff')) }
    ],
    wildMultipliers: [{ m: 1, w: 74 }, { m: 2, w: 15 }, { m: 4, w: 8 }, { m: 10, w: 2.4 }, { m: 100, w: 0.3 }],
    scatterPays: { 3: 2, 4: 6, 5: 25, 6: 100 },
    bonusMultipliers: [{ m: 2, w: 34 }, { m: 3, w: 26 }, { m: 4, w: 18 }, { m: 10, w: 12 }, { m: 20, w: 6 }, { m: 50, w: 2.5 }, { m: 100, w: 1 }]
  });
})();
