// QUINIELA GOLAZO - FINAL - Link: AKfycbztSJZVua2Qj5Cfeiblsos0GOn3AGwHIQRtLjJU_kADwBqudkAA2r18Zc0tGrAjHzWy
const URL_SHEET = "https://script.google.com/macros/s/AKfycbztSJZVua2Qj5Cfeiblsos0GOn3AGwHIQRtLjJU_kADwBqudkAA2r18Zc0tGrAjHzWy/exec";
let modoDobles = false;
let actual = Array(9).fill(null).map(()=>[]);
let quinielas = [];
const PRECIO = 20;


function selection(el){
  if(!el ||!el.id) return;
  let letra = el.id[0];
  let idx = parseInt(el.id.substring(1))-1;
  if(idx<0 || idx>8) return;
  if(!modoDobles){
    actual[idx] = [letra];
    ["L","E","V"].forEach(t=>{
      let e = document.getElementById(t+(idx+1));
      if(e){ e.innerText=""; e.classList.remove("selected"); }
    });
    el.innerText=letra;
    el.classList.add("selected");
  } else {
    if(actual[idx].includes(letra)){
      actual[idx] = actual[idx].filter(x=>x!=letra);
      el.innerText=""; el.classList.remove("selected");
    } else {
      if(actual[idx].length<3){
        actual[idx].push(letra);
        el.innerText=letra; el.classList.add("selected");
      }
    }
  }
  actualizarTextLine();
}

function actualizarTextLine(){
  let txt = document.getElementById("text");
  if(!txt) return;
  let linea = actual.map(a=> a.length==0? "-" : (a.length==1? a[0] : "("+a.join("")+")")).join(" ");
  txt.innerText = linea;
}

function clean(){
  actual = Array(9).fill(null).map(()=>[]);
  for(let i=1;i<=9;i++){
    ["L","E","V"].forEach(t=>{
      let e=document.getElementById(t+i);
      if(e){ e.innerText=""; e.classList.remove("selected"); }
    });
  }
  actualizarTextLine();
}

function save(){
  if(actual.some(a=>a.length==0)){
    alert("Llena los 9 partidos con L,E,V");
    return;
  }
  let combinaciones = expandir(actual);
  combinaciones.forEach(c=> quinielas.push(c));
  clean();
  renderLista();
}

function expandir(base){
  let res=[[]];
  for(let i=0;i<9;i++){
    let nuevo=[];
    for(let r of res){
      for(let op of base[i]){
        nuevo.push([...r, op]);
      }
    }
    res=nuevo;
  }
  return res;
}

function renderLista(){
  let tabla = document.getElementById("display");
  if(!tabla) return;
  tabla.innerHTML="";
  let nombre = document.getElementById("nombre")? document.getElementById("nombre").value || "Sin nombre" : "Sin nombre";
  quinielas.forEach((q,idx)=>{
    let tr=document.createElement("tr");
    tr.innerHTML=`<td style="font-family:monospace;padding:4px">${q.join(" ")}</td><td>${nombre}</td><td><button onclick="borrarUna(${idx})" style="background:#990000;color:white;border-radius:50%;border:none;width:20px;height:20px;cursor:pointer">x</button></td>`;
    tabla.appendChild(tr);
  });
  let costoEl=document.getElementById("costo");
  let totalEl=document.getElementById("total");
  let numEl=document.getElementById("numquinielas");
  let btnSpan=document.querySelector(".botonenviar span");
  let total = quinielas.length * PRECIO;
  if(costoEl) costoEl.innerText="Costo: $"+(quinielas.length>0?PRECIO:0);
  if(totalEl) totalEl.innerText="Total: $"+total;
  if(numEl) numEl.innerText=quinielas.length+" Quiniela(s)";
  if(btnSpan) btnSpan.innerText=quinielas.length;
}

function borrarUna(i){
  quinielas.splice(i,1);
  renderLista();
}

function deleteall(){
  if(quinielas.length==0 && actual.every(a=>a.length==0)) return;
  if(!confirm("¿Borrar todo?")) return;
  quinielas=[];
  clean();
  renderLista();
}

function clearname(){
  let n=document.getElementById("nombre");
  if(n) n.value="";
  renderLista();
}

function random(){
  const ops=["L","E","V"];
  for(let i=0;i<9;i++){
    let letra=ops[Math.floor(Math.random()*3)];
    actual[i]=[letra];
    ["L","E","V"].forEach(t=>{
      let e=document.getElementById(t+(i+1));
      if(e){
        e.innerText = (t==letra)?letra:"";
        if(t==letra) e.classList.add("selected"); else e.classList.remove("selected");
      }
    });
  }
  actualizarTextLine();
}

function allowcombination(){
  modoDobles =!modoDobles;
  let lbl=document.getElementById("checkcombinaciones");
  if(lbl){
    lbl.innerText = modoDobles? "Dobles y Triples: ON" : "Dobles y Triples";
    lbl.style.background = modoDobles? "#ffeb00" : "";
    lbl.style.color = modoDobles? "black" : "";
  }
  if(!modoDobles){
    for(let i=0;i<9;i++){
      if(actual[i].length>1){
        let keep=actual[i][0];
        actual[i]=[keep];
        ["L","E","V"].forEach(t=>{
          let e=document.getElementById(t+(i+1));
          if(e){
            if(t==keep){ e.innerText=keep; e.classList.add("selected"); }
            else { e.innerText=""; e.classList.remove("selected"); }
          }
        });
      }
    }
    actualizarTextLine();
  }
}

async function send(){
    // Si no ha dado +, guardamos la que está marcada
    let quantity = quinielas.length;
    if (!quantity || quantity < 1){
        save();
        quantity = quinielas.length;
    }

    if (quantity > 0){
        let nombreInput = document.getElementById("nombre");
        let nombre = nombreInput? nombreInput.value.trim() : "Sin nombre";
        if(!nombre){ alert("Pon tu nombre"); return; }

        // 1. GUARDAR EN GOOGLE SHEET (tu link nuevo)
        let btn = document.querySelector(".botonenviar");
        if(btn) btn.innerHTML = "Guardando...";
        for(let q of quinielas){
            let datos={nombre:nombre,p1:q[0],p2:q[1],p3:q[2],p4:q[3],p5:q[4],p6:q[5],p7:q[6],p8:q[7],p9:q[8]};
            try{ await fetch(URL_SHEET,{method:"POST",mode:"no-cors",body:JSON.stringify(datos)}); }catch(e){}
        }

        // 2. ENVIAR A WHATSAPP con tu formato original
        let res = quinielas.map(q=> q.join(" "));
        localStorage.setItem("results", nombre + " - " + res.join(" * "));
        let whatsapptext = res.join("%20%20");
        whatsapptext = encodeURI(localStorage.getItem("results"));
        whatsapptext = whatsapptext.split('*').join('%0D').replace(/#/g,"");

        // TU NUMERO - aqui va tu numero 524498476015
        window.location.href = "https://wa.me/524498476015?text=" + whatsapptext + "%0D%0ATotal: $" + (quantity*20);
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
  clean(); renderLista();
});
