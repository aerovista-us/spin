/* EchoVerse Encore — original studio and record artwork using the shared engine. */
(function () {
  'use strict';
  var A = SlotArt, svg = A.svg, t = A.text;
  var ORB = "'Inter', system-ui, sans-serif";
  var record = '<circle cx="50" cy="50" r="36" fill="#100e25" stroke="#FF1493" stroke-width="3"/><g fill="none" stroke="#8068b0" stroke-width="1.5"><circle cx="50" cy="50" r="29"/><circle cx="50" cy="50" r="24"/><circle cx="50" cy="50" r="19"/></g><circle cx="50" cy="50" r="13" fill="url(#g-purple)"/><circle cx="50" cy="50" r="3" fill="#F8F1FF"/><path d="M26 29 L35 25 M65 75 L74 70" stroke="#F8F1FF" stroke-width="3" stroke-linecap="round"/>';
  function badge(inner, color) {
    return svg('<g filter="url(#f-sd)"><rect x="6" y="6" width="88" height="88" rx="22" fill="#221133" stroke="' + color + '" stroke-width="3"/><path d="M19 17 H42 M81 83 H58" stroke="' + color + '" stroke-width="2" opacity=".4"/>' + inner + '</g>');
  }
  function symbol(id, name, weight, pays, art) {
    return {id:id,name:name,weight:weight,pays:pays,svg:art};
  }
  SlotGames.register({
    id: 'echoverse', name: 'EchoVerse Encore',
    tagline: 'Sound. Story. Signal. Record rings, resonance and amplified x100 wilds.',
    title: 'ECHOVERSE',
    toppers: [{ small: 'ECHOVERSE', big: 'ENCORE' }, { small: 'AMPLIFIED', big: 'x100' }, { small: 'SOUND. STORY.', big: 'SIGNAL.' }],
    featureText: 'AMPLIFIED WILDS UP TO x100',
    jackpots: {grand:1000,major:100},
    theme: {
      font: ORB, bodyFont: "'Inter', system-ui, sans-serif", accent:'#FF1493',accent2:'#CFA8FF',glow:'#db73ff',
      panelA:'#35203F',panelB:'#221133',frameA:'#e786dd',frameB:'#FF1493',
      topperText:'linear-gradient(180deg,#F8F1FF 0%,#CFA8FF 65%,#FF1493 100%)',
      topperStroke:'#2a1239',
      screenBg:'repeating-linear-gradient(90deg,transparent 0 32px,rgba(239,136,218,.07) 32px 35px),radial-gradient(ellipse at 50% 10%,rgba(255,20,147,.12),transparent 42%),linear-gradient(180deg,#4a2459 0%,#281333 55%,#100c22 100%)',
      cellBg:'radial-gradient(circle at 50% 35%,#4a275c 0%,#221133 68%,#160e25 100%)',
      cellBorder:'rgba(238,136,218,.48)',
      lineColors:['#FF1493','#CFA8FF','#b7a6ff','#CFA8FF','#ffffff'],
      bokeh:['#FF1493','#CFA8FF','#a580ff','#FF1493'],
      pageTint:'radial-gradient(ellipse at 50% 25%,#381c47 0%,#130c20 65%,#07050d 100%)',
      decor:badge(record,'#FF1493')
    },
    symbols: [
      {id:'wild',name:'AMPLIFIED WILD',type:'wild',weight:2.6,pays:{3:25,4:100,5:400,6:1250},
        svg:svg('<g filter="url(#f-sd)"><path d="M8 30 L24 30 L24 18 L39 18 L39 8 L61 8 L61 18 L76 18 L76 30 L92 30 V81 L50 94 L8 81 Z" fill="#4a2459" stroke="#F8F1FF" stroke-width="4"/><path d="M24 42 V57 M37 31 V57 M50 22 V57 M63 31 V57 M76 42 V57" stroke="#FF1493" stroke-width="6" stroke-linecap="round"/>' + t('WILD',{font:ORB,size:22,y:79,fill:'#F8F1FF',stroke:'#341437',sw:2}) + '</g>')},
      {id:'record',name:'PLATINUM RECORD BONUS',type:'scatter',weight:1.9,pays:{},
        svg:badge('<g transform="translate(5 -6) scale(.9)">' + record + '</g>' + t('BONUS',{font:ORB,size:16,y:85,fill:'#F8F1FF',stroke:'#32123a',sw:1.5}),'#FF1493')},
      symbol('headphones','STUDIO HEADPHONES',4.2,{3:12,4:40,5:150,6:500},badge('<path d="M21 58 V44 C21 7 79 7 79 44 V58" fill="none" stroke="#FF1493" stroke-width="8"/><path d="M29 43 C29 17 71 17 71 43" fill="none" stroke="#F8F1FF" stroke-width="3"/><rect x="15" y="47" width="21" height="32" rx="8" fill="url(#g-purple)" stroke="#CFA8FF" stroke-width="3"/><rect x="64" y="47" width="21" height="32" rx="8" fill="url(#g-purple)" stroke="#CFA8FF" stroke-width="3"/>','#FF1493')),
      symbol('mic','GOLDEN MIC',5,{3:10,4:30,5:100,6:300},badge('<rect x="35" y="14" width="30" height="44" rx="15" fill="#F8F1FF" stroke="#5e302f" stroke-width="2"/><path d="M39 26 H61 M37 34 H63 M38 42 H62" stroke="#744550" stroke-width="3"/><path d="M26 44 V51 C26 80 74 80 74 51 V44 M50 73 V86 M35 86 H65" fill="none" stroke="#eac9ff" stroke-width="5" stroke-linecap="round"/>','#CFA8FF')),
      symbol('cassette','MIXTAPE',6,{3:8,4:25,5:75,6:200},badge('<rect x="13" y="26" width="74" height="51" rx="7" fill="url(#g-purple)" stroke="#FF1493" stroke-width="3"/><rect x="21" y="34" width="58" height="25" rx="4" fill="#1b122d" stroke="#f3bdde" stroke-width="2"/><circle cx="33" cy="46" r="8" fill="#b4a5d3"/><circle cx="67" cy="46" r="8" fill="#b4a5d3"/><path d="M41 46 H59 M30 77 L36 65 H64 L70 77" fill="none" stroke="#FF1493" stroke-width="3"/><circle cx="33" cy="46" r="3" fill="#21142d"/><circle cx="67" cy="46" r="3" fill="#21142d"/>','#CFA8FF')),
      symbol('synth','SYNTH KEYS',9,{3:4,4:12,5:35,6:100},badge('<rect x="12" y="25" width="76" height="53" rx="6" fill="#694072" stroke="#CFA8FF" stroke-width="2"/><rect x="18" y="43" width="64" height="28" rx="2" fill="#fff2df"/><path d="M29 44 V71 M40 44 V71 M50 44 V71 M61 44 V71 M72 44 V71" stroke="#5a3c65" stroke-width="2"/><path d="M29 44 V58 M40 44 V58 M61 44 V58 M72 44 V58" stroke="#20162e" stroke-width="6"/><circle cx="23" cy="34" r="3" fill="#FF1493"/><path d="M35 34 H49 M60 34 H77" stroke="#baf4e9" stroke-width="3"/>','#CFA8FF')),
      symbol('speaker','BASS CABINET',10,{3:3,4:10,5:30,6:80},badge('<rect x="24" y="13" width="52" height="74" rx="7" fill="#161222" stroke="#bba0ff" stroke-width="3"/><circle cx="50" cy="34" r="11" fill="#573467" stroke="#FF1493" stroke-width="2"/><circle cx="50" cy="65" r="17" fill="#382340" stroke="#CFA8FF" stroke-width="3"/><circle cx="50" cy="65" r="7" fill="#FF1493"/><circle cx="50" cy="34" r="4" fill="#f1cce9"/>','#CFA8FF')),
      symbol('resonance','ECHO RINGS',11,{3:3,4:8,5:25,6:60},badge('<g fill="none" stroke="#CFA8FF" stroke-width="3"><circle cx="50" cy="50" r="12"/><circle cx="50" cy="50" r="23"/><circle cx="50" cy="50" r="34"/></g><circle cx="50" cy="50" r="4" fill="#FF1493"/>','#FF1493')),
      symbol('wave','SOUNDWAVE',12,{3:2,4:6,5:20,6:50},badge('<path d="M16 45 V55 M27 33 V67 M39 21 V79 M50 37 V63 M61 16 V84 M73 29 V71 M84 43 V57" stroke="#a7f1e3" stroke-width="6" stroke-linecap="round"/>','#CFA8FF'))
    ],
    wildMultipliers:[{m:1,w:74},{m:2,w:15},{m:4,w:8},{m:10,w:2.4},{m:100,w:0.3}],
    scatterPays:{3:2,4:6,5:25,6:100},
    bonusMultipliers:[{m:2,w:34},{m:3,w:26},{m:4,w:18},{m:10,w:12},{m:20,w:6},{m:50,w:2.5},{m:100,w:1}]
  });
})();
