const leeRows=window.LEE_DBP_PROGRAM_ROWS||[];
const readVisibility=window.LEE_DBP_READ_PUBLIC_VISIBILITY||(()=>({}));
const isPublic=window.LEE_DBP_IS_PROGRAM_PUBLIC||(()=>true);
const publicLevels=window.LEE_DBP_PUBLIC_LEVELS||((row)=>window.LEE_DBP_LEVELS_FROM_FLAGS?.(row?.[3])||["Tezli YL"]);
const levelBadges=(row,visibility)=>publicLevels(row,visibility).map((level)=>`<span class="${level==="Doktora"?"doctorate":level.startsWith("Tezsiz")?"non-thesis":"thesis"}">${level}</span>`).join("");
const programCards=document.querySelector(".program-cards");
function renderProgramDirectory(){
  if(!programCards)return;
  const visibility=readVisibility();
  const publicRows=leeRows.filter(row=>publicLevels(row,visibility).length>0);
  const leeMains=[...new Set(publicRows.map(x=>x[0]))];
  const totals={
    main:leeMains.length,
    tezsiz:publicRows.filter(x=>publicLevels(x,visibility).includes("Tezsiz YL")).length,
    tezli:publicRows.filter(x=>publicLevels(x,visibility).includes("Tezli YL")).length,
    doktora:publicRows.filter(x=>publicLevels(x,visibility).includes("Doktora")).length
  };
  programCards.outerHTML=`<div class="local-program-directory"><div class="local-directory-summary"><div><b>${totals.main}</b><span>Ana ABD / ASD</span></div><div><b>${totals.tezsiz}</b><span>Tezsiz YL</span></div><div><b>${totals.tezli}</b><span>Tezli YL</span></div><div><b>${totals.doktora}</b><span>Doktora</span></div><label>⌕<input id="local-program-search" placeholder="ABD, program veya düzey ara..."></label></div><div id="local-departments">${leeMains.map((main,i)=>`<details ${i<2?'open':''} data-main="${main.toLocaleLowerCase('tr-TR')}"><summary><span>▦</span><b>${main}</b><i>⌄</i></summary><div>${publicRows.filter(x=>x[0]===main).map(x=>`<article data-search="${(x[0]+x[1]+x[2]+publicLevels(x,visibility).join(" ")).toLocaleLowerCase('tr-TR')}"><div><b>${x[1]}</b>${x[1]!==x[2]?`<small>${x[2]}</small>`:''}</div><p>${levelBadges(x,visibility)}</p></article>`).join('')}</div></details>`).join('')}</div></div>`;
  document.getElementById("local-program-search").oninput=e=>{const q=e.target.value.toLocaleLowerCase('tr-TR');document.querySelectorAll("#local-departments details").forEach(d=>{const match=d.dataset.main.includes(q)||[...d.querySelectorAll('article')].some(a=>a.dataset.search.includes(q));d.hidden=!match;if(q&&match)d.open=true})};
  document.dispatchEvent(new Event("lee-dbp-directory-rendered"));
}
renderProgramDirectory();
