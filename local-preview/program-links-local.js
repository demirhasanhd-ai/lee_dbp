document.addEventListener("DOMContentLoaded",()=>{
 document.querySelectorAll("#local-departments article").forEach(card=>{
  card.setAttribute("role","link");card.setAttribute("tabindex","0");card.style.cursor="pointer";
  const open=()=>{const name=card.querySelector("b")?.textContent||"Program";const detail=card.querySelector("small")?.textContent||name;location.href=`/programlar/?program=${encodeURIComponent(name+"|"+detail)}`};
  card.addEventListener("click",open);card.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();open()}});
 });
});
