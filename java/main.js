const URL_SHEET = "https://script.google.com/macros/s/AKfycbxyCWyIBASE4W4RM3u48frVfwQf5ksP34_8ZgosoGkvj-tRZJJxAa7qvDPa5UL8CjW92A/exec";
const PRECIO = 20;
let picks = Array(9).fill("");
let quinielas = JSON.parse(localStorage.getItem("quinielas_golazo")||"[]");

window.selection = function(el){
  let idx=parseInt(el.id.substring(1))-1;
  let row=el.parentElement; row.querySelectorAll("span").forEach(s=>s.classList.remove("selected"));
  el.classList.add("selected"); picks[idx]=el.id[0];
  let t=document.getElementById("text"); if(t) t.textContent=picks.map(v=>v||"-").join(" ");
}
window.clean = function(){
  picks=Array(9).fill(""); document.querySelectorAll(".partido span").forEach(s=>s.classList.remove("selected"));
  let t=document.getElementById("text"); if(t) t.textContent="- - - - - - - - -";
}
window.save = function(){
  if(picks.includes("")){ alert("Completa los 9 partidos"); return; }
  let nom=document.getElementById("nombre").value.trim(); if(!nom){ alert("Pon nombre"); return; }
  quinielas.push({q:[...picks],nombre:nom}); localStorage.setItem("quinielas_golazo",JSON.stringify(quinielas));
  renderLista(); clean(); updateTotal();
}
window.deleteall = function(){
  if(!confirm("Borrar todo?")) return; quinielas=[]; localStorage.removeItem("quinielas_golazo"); renderLista(); updateTotal();
}
window.borrarUna = function(i){ quinielas.splice(i,1); localStorage.setItem("quinielas_golazo",JSON.stringify(quinielas)); renderLista(); updateTotal(); }
window.clearname = function(){ let n=document.getElementById("nombre"); if(n) n.value=""; }
function updateTotal(){
  let num=quinielas.length; let costo=num*PRECIO;
  let c=document.getElementById("costo"), tt=document.getElementById("total"), nq=document.getElementById("numquinielas"), be=document.querySelector(".botonenviar span");
  if(c) c.textContent="Costo: $"+costo; if(tt) tt.textContent="Total: $"+costo; if(nq) nq.textContent=num+" Quiniela(s)"; if(be) be.textContent=num;
}
function renderLista(){
  let d=document.getElementById("display"); if(!d) return; d.innerHTML="";
  quinielas.forEach((it,idx)=>{
    let tr=document.createElement("tr");
    tr.innerHTML=`<td class="q-text">${it.q.join(" ")} -</td><td class="q-name">${it.nombre}</td><td class="q-del"><button onclick="borrarUna(${idx})" style="background:#990000;color:white;border-radius:50%;border:none;width:22px;height:22px;cursor:pointer">x</button></td>`;
    d.appendChild(tr);
  }); updateTotal();
}
window.random = function(){ clean(); for(let i=0;i<9;i++){ let ops=["L","E","V"]; let r=ops[Math.floor(Math.random()*3)]; let el=document.getElementById(r+(i+1)); if(el) selection(el); } }
window.allowcombination = function(){ alert("Dobles y Triples - Usa + para agregar varias"); }
window.send = function(){
  if(quinielas.length===0){ alert("No hay quinielas"); return; }
  let costo=quinielas.length*PRECIO;
  quinielas.forEach(item=>{
    let datos={nombre:item.nombre,p1:item.q[0],p2:item.q[1],p3:item.q[2],p4:item.q[3],p5:item.q[4],p6:item.q[5],p7:item.q[6],p8:item.q[7],p9:item.q[8],costo:costo};
    fetch(URL_SHEET,{method:"POST",mode:"no-cors",body:JSON.stringify(datos)});
  });
  let txt=`*QUINIELA GOLAZO*%0A`; quinielas.forEach((it,i)=>{ txt+=`${i+1}. ${it.q.join(" ")} - ${it.nombre}%0A`; }); txt+=`%0ACOSTO: $${costo}%0A`;
  window.open("https://wa.me/524776482132?text="+txt,"_blank");
  alert("Guardado en BASEDEDATOS1 con COSTO $"+costo);
}
document.addEventListener("DOMContentLoaded",()=>{ renderLista(); });
