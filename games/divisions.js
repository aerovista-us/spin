/* Division collection: virtual entertainment only. */
(function(){
'use strict';
const A=SlotArt;
const divisions=[
['nexus','Nexus Core Overdrive','NEXUS','NETWORK RECONNECTION','#34e3b2','#b7fff1',['CPU','SERVER','NODE','CIRCUIT','CACHE','CLOUD','LINK']],
['skyforge','SkyForge Legends','SKYFORGE','ARTIFACT BUILDER','#ff9b42','#ffe3ab',['FORGE','ANVIL','GEM','FLAME','RUNE','HAMMER','STAR']],
['summit','Summit Peak Pursuit','SUMMIT','KNOWLEDGE CHALLENGE','#71d49b','#e8dc9a',['PEAK','BOOK','MAP','COMPASS','BADGE','FLAG','TRAIL']],
['lumina','Lumina Prism Spectrum','LUMINA','SPECTRUM COLLECTION','#e98cf4','#8cecff',['LENS','PRISM','FRAME','LIGHT','FILM','FOCUS','COLOR']],
['vespera','Vespera Midnight Chronicles','VESPERA','CHRONICLE COLLECTION','#aa91ef','#ebcf93',['BOOK','QUILL','MOON','INK','SCROLL','KEY','SEAL']],
['horizon','Horizon Above the Horizon','HORIZON','FLIGHT PATH','#5fbaff','#ffbf73',['DRONE','GPS','RADAR','CLOUD','WING','MAP','VISTA']]
];
const base=SlotGames.get('aerovista');
for(const [id,name,title,feature,accent,accent2,labels] of divisions){
 const art=(label,i)=>A.svg('<rect x="6" y="6" width="88" height="88" rx="13" fill="#101824" stroke="'+accent+'" stroke-width="3"/><circle cx="50" cy="39" r="22" fill="none" stroke="'+accent2+'" stroke-width="3"/><path d="M30 39 L50 19 L70 39 L50 59 Z" fill="'+accent+'" opacity=".35"/><path d="M38 39 H62 M50 27 V51" stroke="'+accent2+'" stroke-width="3"/>'+A.text(label,{size:label.length>7?11:15,y:83,fill:accent2,stroke:'#101824',sw:1}));
 const symbols=base.symbols.map((s,i)=>({...s,id:i===0?'wild':i===1?'bonus':labels[i-2].toLowerCase(),name:i===0?'DIVISION WILD':i===1?feature:labels[i-2],svg:art(i===0?'WILD':i===1?'BONUS':labels[i-2],i),pays:{...s.pays}}));
 SlotGames.register({...base,id,name,title,tagline:'Explore '+title+' in the virtual AeroVista arcade.',toppers:[{small:title,big:'ARCADE'},{small:'DIVISION',big:'PLAY'},{small:'VIRTUAL',big:'ONLY'}],featureText:feature,theme:{...base.theme,accent,accent2,glow:accent,frameA:accent,frameB:accent2,lineColors:[accent,accent2,'#ffffff'],bokeh:[accent,accent2],decor:art(title,0)},symbols,jackpots:{...base.jackpots},wildMultipliers:base.wildMultipliers.map(x=>({...x})),bonusMultipliers:base.bonusMultipliers.map(x=>({...x})),scatterPays:{...base.scatterPays}});
}
})();
