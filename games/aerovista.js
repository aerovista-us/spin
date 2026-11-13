/* AeroVista Skybound — original flight and horizon artwork using the shared engine. */
(function () {
  'use strict';
  var A = SlotArt, svg = A.svg, t = A.text;
  var ORB = "'Orbitron', 'Arial Black', sans-serif";
  var wing = '<path d="M10 60 L45 43 L48 16 L54 16 L57 43 L90 60 L90 67 L57 59 L55 79 L65 85 L65 90 L50 86 L35 90 L35 85 L45 79 L43 59 L10 67 Z" fill="url(#g-silver)" stroke="#07566b" stroke-width="2.5" stroke-linejoin="round"/>';
  function badge(inner, color) {
    return svg('<g filter="url(#f-sd)"><circle cx="50" cy="50" r="43" fill="#062b40" stroke="' + color + '" stroke-width="3"/><circle cx="50" cy="50" r="36" fill="none" stroke="' + color + '" opacity=".28"/>' + inner + '</g>');
  }
  function symbol(id, name, weight, pays, art) {
    return { id: id, name: name, weight: weight, pays: pays, svg: art };
  }
  SlotGames.register({
    id: 'aerovista', name: 'AeroVista Skybound',
    tagline: 'Where Vision Takes Flight. Silver wings, mountain horizons and golden x125 wilds.',
    title: 'AEROVISTA',
    toppers: [{ small: 'WHERE VISION', big: 'TAKES FLIGHT' }, { small: 'SKYBOUND', big: 'x125' }, { small: 'AEROVISTA', big: 'SOAR HIGH' }],
    featureText: 'SKYBOUND WILDS UP TO x125',
    jackpots: { grand: 1250, major: 125 },
    theme: {
      font: ORB, accent: '#79f2ed', accent2: '#ffd184', glow: '#36d9ee',
      panelA: '#075c79', panelB: '#082944', frameA: '#64e5ef', frameB: '#f4cf8b',
      topperText: 'linear-gradient(180deg,#ffffff 0%,#c5fcff 35%,#6de2ed 65%,#e5b968 100%)',
      topperStroke: '#052238',
      screenBg: 'radial-gradient(ellipse at 50% 10%,rgba(255,215,143,.32),transparent 38%),linear-gradient(165deg,transparent 48%,rgba(94,224,227,.12) 49%,transparent 50%),linear-gradient(180deg,#0a536b 0%,#08283d 55%,#031622 100%)',
      cellBg: 'radial-gradient(circle at 50% 30%,#12516a 0%,#062b40 65%,#021925 100%)',
      cellBorder: 'rgba(130,241,241,.48)',
      lineColors: ['#79f2ed','#ffd184','#ffffff','#71b7ff','#a6ffbc'],
      bokeh: ['#79f2ed','#ffd184','#71b7ff','#e7ffff'],
      pageTint: 'radial-gradient(ellipse at 50% 25%,#093c51 0%,#03141f 65%,#01070c 100%)',
      decor: badge(wing, '#79f2ed')
    },
    symbols: [
      { id: 'wild', name: 'SKYBOUND WILD', type: 'wild', weight: 2.6, pays: { 3:25, 4:100, 5:400, 6:1250 },
        svg: svg('<g filter="url(#f-sd)"><path d="M8 27 L50 8 L92 27 L84 78 L50 94 L16 78 Z" fill="#073c52" stroke="url(#g-gold)" stroke-width="4"/><path d="M18 35 L39 43 L50 22 L61 43 L82 35 L68 58 H32 Z" fill="url(#g-silver)"/>' + t('WILD',{font:ORB,size:22,y:77,fill:'#fff2c8',stroke:'#073347',sw:2}) + '</g>') },
      { id: 'horizon', name: 'HORIZON BONUS', type: 'scatter', weight: 1.9, pays: {},
        svg: badge('<circle cx="50" cy="40" r="19" fill="url(#g-gold)"/><path d="M12 61 L33 37 L50 58 L69 32 L88 61 V73 H12 Z" fill="#17687c" stroke="#b7ffff" stroke-width="2"/>' + t('BONUS',{font:ORB,size:15,y:82,fill:'#fff2c8',stroke:'#073347',sw:1}), '#ffd184') },
      symbol('jet','SILVER WINGS',4.2,{3:12,4:40,5:150,6:500},badge(wing,'#d3faff')),
      symbol('drone','HORIZON DRONE',5,{3:10,4:30,5:100,6:300},badge('<g fill="none" stroke="#79f2ed" stroke-width="4"><path d="M30 30 L70 70 M70 30 L30 70"/><ellipse cx="27" cy="29" rx="15" ry="8"/><ellipse cx="73" cy="29" rx="15" ry="8"/><ellipse cx="27" cy="71" rx="15" ry="8"/><ellipse cx="73" cy="71" rx="15" ry="8"/></g><rect x="38" y="37" width="24" height="27" rx="7" fill="url(#g-silver)"/><circle cx="50" cy="54" r="6" fill="#083247" stroke="#ffd184" stroke-width="2"/>','#79f2ed')),
      symbol('summit','SUMMIT PEAK',6,{3:8,4:25,5:75,6:200},badge('<path d="M12 78 L49 19 L88 78 Z" fill="url(#g-blue)" stroke="#b6faff" stroke-width="3"/><path d="M49 19 L32 46 L45 41 L53 50 L62 39 Z" fill="#efffff"/><path d="M49 50 L37 78 H70 Z" fill="#12526a"/>','#a5deff')),
      symbol('compass','NORTH STAR',9,{3:4,4:12,5:35,6:100},badge('<circle cx="50" cy="50" r="28" fill="none" stroke="#ffd184" stroke-width="2"/><path d="M50 13 L59 42 L87 50 L59 58 L50 87 L41 58 L13 50 L41 42 Z" fill="url(#g-gold)" stroke="#664216" stroke-width="2"/><path d="M50 22 V50 H30 Z" fill="#ffffff"/>','#ffd184')),
      symbol('lens','VISION LENS',10,{3:3,4:10,5:30,6:80},badge('<rect x="16" y="31" width="68" height="45" rx="9" fill="url(#g-silver)" stroke="#073347" stroke-width="2"/><path d="M29 31 L35 23 H57 L63 31" fill="#a3d8e8"/><circle cx="50" cy="53" r="21" fill="#041e32" stroke="#79f2ed" stroke-width="3"/><circle cx="50" cy="53" r="12" fill="url(#g-blue)"/><circle cx="46" cy="49" r="4" fill="#ffffff" opacity=".8"/>','#83e9df')),
      symbol('feather','SKY FEATHER',11,{3:3,4:8,5:25,6:60},badge('<path d="M24 75 Q12 28 76 16 Q90 47 45 71 L28 78 Z" fill="url(#g-silver)" stroke="#79f2ed" stroke-width="2"/><path d="M20 85 L71 25 M38 64 L34 43 M49 51 L66 49 M57 40 L56 27" fill="none" stroke="#14718a" stroke-width="3" stroke-linecap="round"/>','#b6faff')),
      symbol('cloud','CLOUD NINE',12,{3:2,4:6,5:20,6:50},badge('<path d="M25 70 C5 70 8 43 27 43 C25 14 66 13 68 41 C91 34 97 68 76 70 Z" fill="url(#g-silver)" stroke="#96f3ff" stroke-width="2"/><path d="M30 79 H70 M39 86 H61" stroke="#79f2ed" stroke-width="3" stroke-linecap="round"/>','#79f2ed'))
    ],
    wildMultipliers: [{m:1,w:78},{m:2,w:15},{m:5,w:6},{m:125,w:0.35}],
    scatterPays: {3:2,4:6,5:25,6:100},
    bonusMultipliers: [{m:2,w:34},{m:3,w:26},{m:5,w:20},{m:10,w:12},{m:25,w:5},{m:50,w:2},{m:125,w:1}]
  });
})();
