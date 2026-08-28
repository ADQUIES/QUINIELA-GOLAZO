const URL_SHEET = "https://script.google.com/macros/s/AKfycbztSJZVua2Qj5Cfeiblsos0GOn3AGwHIQRtLjJU_kADwBqudkAA2r18Zc0tGrAjHzWy/exec";
let modoDobles = false;
let actual = Array(9).fill(null).map(()=>[]);
let quinielas = [];
const PRECIO = 20;

function selection(el){
  let letra=el.id[0]; let idx=parseInt(el.id.substring(1))-1;
  if(!modoDobles){
    actual[idx]=[letra];
    ["L","E","V"].forEach(t=>{ let e=document.getElementById(t+(idx+1)); if(e){e.innerText=""; e.classList.remove("selected");} });
    el.innerText=letra; el.classList.add("selected");
  }else{
    if(actual[idx].includes(letra)){ actual[idx]=actual[idx].filter(x=>x!=letra); el.innerText=""; el.classList.remove("selected"); }
    else if(actual[idx].length<3){ actual[idx].push(letra); el.innerText=letra; el.classList.add("selected"); }
  }
  document.getElementById("text").innerText=actual.map(a=>a.length==0?"-":(a.length==1?a[0]:"("+a.join("")+")")).join(" ");
}
function clean(){
  actual=Array(9).fill(null).map(()=>[]);
  for(let i=1;i<=9;i++){ ["L","E","V"].forEach(t=>{ let e=document.getElementById(t+i); if(e){e.innerText=""; e.classList.remove("selected");} }); }
  document.getElementById("text").innerText="- - - - - - - - -";
}
function save(){
  if(actual.some(a=>a.length==0)){ alert("Llena los 9 partidos con L,E,V"); return; }
  let res=[[]]; for(let i=0;i<9;i++){ let n=[]; for(let r of res){ for(let o of actual[i]){ n.push([...r,o]); } } res=n; }
  res.forEach(c=>quinielas.push(c)); clean(); renderLista();
}
function renderLista(){
  let tabla=document.getElementById("display"); if(!tabla) return; tabla.innerHTML="";
  let nombre=document.getElementById("nombre")?document.getElementById("nombre").value||"Sin nombre":"Sin nombre";
  quinielas.forEach((q,idx)=>{
    let tr=document.createElement("tr");
    tr.innerHTML=`<td>${q.join(" ")}</td><td>${nombre}</td><td><button onclick="borrarUna(${idx})" style="background:#990000;color:white;border-radius:50%;border:none;width:22px;height:22px;cursor:pointer">x</button></td>`;
    tabla.appendChild(tr);
  });
  let total=quinielas.length*PRECIO;
  document.getElementById("costo").innerText="Costo: $"+(quinielas.length>0?PRECIO:0);
  document.getElementById("total").innerText="Total: $"+total;
  document.getElementById("numquinielas").innerText=quinielas.length+" Quiniela(s)";
  document.querySelector(".botonenviar span").innerText=quinielas.length;
}
function borrarUna(i){ quinielas.splice(i,1); renderLista(); }
function deleteall(){ if(!confirm("¿Borrar todo?")) return; quinielas=[]; clean(); renderLista(); }
function clearname(){ document.getElementById("nombre").value=""; renderLista(); }
function random(){ const o=["L","E","V"]; for(let i=0;i<9;i++){ let l=o[Math.floor(Math.random()*3)]; actual[i]=[l]; ["L","E","V"].forEach(t=>{ let e=document.getElementById(t+(i+1)); if(e){ e.innerText=(t==l)?l:""; if(t==l) e.classList.add("selected"); else e.classList.remove("selected"); } }); } document.getElementById("text").innerText=actual.map(a=>a[0]).join(" "); }
function allowcombination(){ modoDobles=!modoDobles; let lbl=document.getElementById("checkcombinaciones"); if(lbl){ lbl.innerText=modoDobles?"Dobles y Triples: ON":"Dobles y Triples"; lbl.style.background=modoDobles?"#ffeb00":"#1f1f1f"; lbl.style.color=modoDobles?"black":"white"; } }
async function send(){
  let q=quinielas.length; if(!q||q<1){ save(); q=quinielas.length; }
  if(q>0){
    let nom=document.getElementById("nombre").value.trim(); if(!nom){ alert("Pon tu nombre"); return; }
    let btn=document.querySelector(".botonenviar"); if(btn) btn.innerHTML="Guardando...";
    for(let qq of quinielas){ let d={nombre:nom,p1:qq[0],p2:qq[1],p3:qq[2],p4:qq[3],p5:qq[4],p6:qq[5],p7:qq[6],p8:qq[7],p9:qq[8]}; try{ await fetch(URL_SHEET,{method:"POST",mode:"no-cors",body:JSON.stringify(d)});}catch(e){} }
    let res=quinielas.map(x=>x.join(" ")); localStorage.setItem("results",nom+" - "+res.join(" * "));
    let txt=encodeURI(localStorage.getItem("results")).split('*').join('%0D').replace(/#/g,"");
    alert("¡Tu quiniela se ha enviado correctamente! ✅\nGracias "+nom+", recibimos "+q+" quiniela(s) - Total: $"+(q*PRECIO)+"\n¡Suerte! 🍀");
    window.location.href="https://wa.me/524498476015?text="+txt+"%0D%0ATotal: $"+(q*PRECIO)+"%0D%0A*Quiniela Golazo*";
    quinielas=[]; clean(); renderLista(); if(btn) btn.innerHTML='Enviar <span>0</span> <img src="whatsapp-logo-5.png" height="23px">';
  }
}
window.selection=selection; window.clean=clean; window.save=save; window.deleteall=deleteall; window.clearname=clearname; window.random=random; window.allowcombination=allowcombination; window.send=send; window.borrarUna=borrarUna;
document.addEventListener("DOMContentLoaded", ()=>{ clean(); renderLista(); });
