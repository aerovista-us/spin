/* AeroVista Apex — parent-brand geometry. See docs/BRAND_AND_MOBILE.md. */
(function () {
  'use strict';
  var A = SlotArt, svg = A.svg, t = A.text;
  var ORB = "'Orbitron', sans-serif";
  var apex = '<path d="M20 78 L50 22 L80 78 M36 62 H64" fill="none" stroke="#C0C0C0" stroke-width="8" stroke-linejoin="miter"/><path d="M24 78 L50 30" fill="none" stroke="#00AEEF" stroke-width="3"/>';
  function badge(inner, accent) {
    return svg('<rect x="7" y="7" width="86" height="86" rx="5" fill="#0F1115" stroke="' + (accent || '#414850') + '" stroke-width="2"/><path d="M15 28 V15 H28 M72 85 H85 V72" fill="none" stroke="#00AEEF" stroke-width="2"/>' + inner);
  }
  function symbol(id, name, weight, pays, art) {
    return { id:id, name:name, weight:weight, pays:pays, svg:art };
  }
  SlotGames.register({
    id:'aerovista', name:'AeroVista Apex',
    tagline:'Seven Divisions. One Vision. Precision geometry, connected systems and x125 Core wilds.',
    title:'AEROVISTA',
    toppers:[{small:'AEROVISTA',big:'APEX'},{small:'CORE SYSTEM',big:'x125'},{small:'ONE VISION',big:'CONNECTED'}],
    featureText:'CORE WILDS UP TO x125',
    jackpots:{grand:1250,major:125},
    theme:{
      font:ORB, bodyFont:"'Montserrat', system-ui, sans-serif", accent:'#00AEEF',accent2:'#C0C0C0',glow:'#00AEEF',
      panelA:'#20252C',panelB:'#0F1115',frameA:'#414850',frameB:'#C0C0C0',
      topperText:'linear-gradient(180deg,#E8EDF2,#C0C0C0)',topperStroke:'#0F1115',
      screenBg:'repeating-linear-gradient(90deg,transparent 0 91px,rgba(192,192,192,.045) 91px 92px),linear-gradient(180deg,#20252C,#0F1115)',
      cellBg:'linear-gradient(145deg,#252B33,#0F1115)',cellBorder:'rgba(192,192,192,.22)',
      lineColors:['#00AEEF','#C0C0C0','#E8EDF2','#748695','#536A7C'],
      bokeh:['#0F1115','#20252C'],pageTint:'linear-gradient(180deg,#161A20,#0F1115)',
      decor:badge(apex)
    },
    symbols:[
      {id:'wild',name:'CORE WILD',type:'wild',weight:2.6,pays:{3:25,4:100,5:400,6:1250},
        svg:badge('<g transform="translate(9 -8) scale(.82)">'+apex+'</g>'+t('WILD',{font:ORB,size:18,y:83,fill:'#E8EDF2',stroke:'#0F1115',sw:0}), '#00AEEF')},
      {id:'core',name:'SYSTEM BONUS',type:'scatter',weight:1.9,pays:{},
        svg:badge('<g fill="none" stroke="#697783" stroke-width="2"><path d="M50 46 L25 27 M50 46 L75 27 M50 46 V17 M50 46 L22 55 M50 46 L78 55"/><rect x="37" y="33" width="26" height="26"/></g><g fill="#C0C0C0"><rect x="19" y="21" width="12" height="12"/><rect x="69" y="21" width="12" height="12"/><rect x="44" y="11" width="12" height="12"/><rect x="16" y="49" width="12" height="12"/><rect x="72" y="49" width="12" height="12"/></g><rect x="44" y="40" width="12" height="12" fill="#00AEEF"/>'+t('BONUS',{font:ORB,size:15,y:82,fill:'#E8EDF2',stroke:'#0F1115',sw:0}), '#00AEEF')},
      symbol('apex','APEX MARK',4.2,{3:12,4:40,5:150,6:500},badge(apex)),
      symbol('nodes','CONNECTED NODES',5,{3:10,4:30,5:100,6:300},badge('<path d="M24 27 L72 26 L52 73 Z M24 27 L48 48 L72 26 M48 48 L52 73" fill="none" stroke="#697783" stroke-width="3"/><g fill="#C0C0C0"><rect x="17" y="20" width="14" height="14"/><rect x="65" y="19" width="14" height="14"/><rect x="45" y="66" width="14" height="14"/></g><rect x="41" y="41" width="14" height="14" fill="#00AEEF"/>')),
      symbol('prism','PRECISION PRISM',6,{3:8,4:25,5:75,6:200},badge('<path d="M50 18 L78 34 V66 L50 82 L22 66 V34 Z M22 34 L50 50 L78 34 M50 50 V82" fill="none" stroke="#C0C0C0" stroke-width="3"/><path d="M50 18 V50 L22 66" fill="none" stroke="#00AEEF" stroke-width="2"/>')),
      symbol('grid','SYSTEM GRID',9,{3:4,4:12,5:35,6:100},badge('<g fill="none" stroke="#697783" stroke-width="2"><path d="M23 23 H77 V77 H23 Z M41 23 V77 M59 23 V77 M23 41 H77 M23 59 H77"/></g><rect x="42" y="42" width="16" height="16" fill="#00AEEF"/><path d="M25 25 H39 V39 H25 Z" fill="#C0C0C0"/>')),
      symbol('signal','SIGNAL TRACE',10,{3:3,4:10,5:30,6:80},badge('<path d="M17 64 H31 V38 H50 V64 H69 V38 H83" fill="none" stroke="#C0C0C0" stroke-width="4"/><g fill="#00AEEF"><rect x="13" y="60" width="8" height="8"/><rect x="79" y="34" width="8" height="8"/></g>')),
      symbol('stack','MODULE STACK',11,{3:3,4:8,5:25,6:60},badge('<g fill="#20252C" stroke="#C0C0C0" stroke-width="2"><rect x="23" y="20" width="54" height="16"/><rect x="23" y="42" width="54" height="16"/><rect x="23" y="64" width="54" height="16"/></g><path d="M29 28 H39 M29 50 H39 M29 72 H39" stroke="#00AEEF" stroke-width="3"/>')),
      symbol('frame','SPEC FRAME',12,{3:2,4:6,5:20,6:50},badge('<path d="M31 20 H20 V37 M69 20 H80 V37 M20 63 V80 H37 M80 63 V80 H63" fill="none" stroke="#C0C0C0" stroke-width="4"/><path d="M35 50 H65 M50 35 V65" stroke="#00AEEF" stroke-width="3"/><rect x="29" y="29" width="42" height="42" fill="none" stroke="#414850" stroke-width="1"/>'))
    ],
    wildMultipliers:[{m:1,w:78},{m:2,w:15},{m:5,w:6},{m:125,w:0.35}],
    scatterPays:{3:2,4:6,5:25,6:100},
    bonusMultipliers:[{m:2,w:34},{m:3,w:26},{m:5,w:20},{m:10,w:12},{m:25,w:5},{m:50,w:2},{m:125,w:1}]
  });
})();
