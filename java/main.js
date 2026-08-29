let partidosData = [];
let combinaciones = {};
let nextIdGlobal = 101;

async function cargarPartidos(){
  try{
    let r = await fetch(SCRIPT_URL+"?action=get_admin");
    partidosData = await r.json();
    renderTabla();
    getNextId();
  }catch(e){
    document.getElementById("lista-partidos").innerHTML="<p style='color:red'>Error cargando</p>";
  }
}

function renderTabla(){
  let cont = document.getElementById("lista-partidos");
  let html = `<div class="tabla-encabezado"><div>L</div><div>LOCAL</div><div></div><div>E</div><div></div><div>VISITA</div><div>V</div></div>`;

  partidosData.forEach((p,i)=>{
    let idx=i+1; combinaciones[idx]="";
    let localClean = p.local.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().trim();
    let visitaClean = p.visita.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().trim();
    let hora = p.hora; if(typeof hora==='string' && hora.includes('T')) hora=hora.substring(11,16);

    html+=`
      <div class="fila-partido">
        <div class="boton" id="L${idx}" onclick="toggleLetra(${idx},'L')">L</div>
        <div class="col-nombre">${p.local.toUpperCase()}</div>
        <div class="col-escudo"><img src="img/ESCUDOS/${localClean}.png" onerror="this.src='img/logo.png'"></div>
        <div class="boton" id="E${idx}" onclick="toggleLetra(${idx},'E')">E</div>
        <div class="col-escudo"><img src="img/ESCUDOS/${visitaClean}.png" onerror="this.src='img/logo.png'"></div>
        <div class="col-nombre">${p.visita.toUpperCase()}</div>
        <div class="boton" id="V${idx}" onclick="toggleLetra(${idx},'V')">V</div>
      </div>`;
  });
  cont.innerHTML=html;
}

function toggleLetra(idx, letra){
  let actual=combinaciones[idx]||"";
  if(actual.includes(letra)) actual=actual.replace(letra,""); else actual+=letra;
  actual=actual.split("").sort((a,b)=>["L","E","V"].indexOf(a)-["L","E","V"].indexOf(b)).join("");
  combinaciones[idx]=actual;
  ["L","E","V"].forEach(l=>{
    let el=document.getElementById(l+idx);
    if(actual.includes(l)) el.classList.add("active"); else el.classList.remove("active");
  });
}

async function getNextId(){ try{ let r=await fetch(SCRIPT_URL+"?action=get_next_id"); let j=await r.json(); nextIdGlobal=j.nextId; document.getElementById("infoIDs").textContent="Folio: "+nextIdGlobal; }catch(e){} }
function generar(){
  let nombre=document.getElementById("nombre").value.trim(); let nQ=parseInt(document.getElementById("numQuinielas").value)||1;
  if(!nombre){ alert("Pon nombre"); return; }
  let arrays=[]; for(let i=1;i<=partidosData.length;i++){ if(!combinaciones[i]){ alert("Falta partido "+i); return; } arrays.push(combinaciones[i].split("")); }
  let texto=""; let c=0; function back(pos,act){ if(c>=nQ) return; if(pos>partidosData.length){ c++; texto+=act.join(" ")+" "+nombre.toUpperCase()+" *\n"; return; } for(let l of arrays[pos-1]){ act[pos-1]=l; back(pos+1,[...act]); } } back(1,[]);
  document.getElementById("resultado").value=texto; document.getElementById("infoCosto").textContent=`Total: $${nQ*15} por ${nQ} quinielas`;
}
function enviarWhatsApp(){ let t=document.getElementById("resultado").value; if(!t){ alert("Genera primero"); return; } window.open("https://wa.me/?text="+encodeURIComponent(t)); }
async function guardarEnBase(){ let nombre=document.getElementById("nombre").value.trim(); let tel=document.getElementById("telefono").value.trim(); let txt=document.getElementById("resultado").value.trim(); if(!nombre||!tel||!txt){ alert("Falta dato"); return; } let lineas=txt.split("\n").filter(l=>l.trim()!="").length; document.getElementById("statusBase").textContent="Guardando..."; try{ await fetch(SCRIPT_URL,{method:"POST",mode:"no-cors",body:JSON.stringify({action:"guardar_basededatos",nombre:nombre.toUpperCase(),telefono:tel,quinielas:txt,id_inicio:nextIdGlobal,total:lineas,costo:lineas*15})}); document.getElementById("statusBase").textContent=`Guardado ${nextIdGlobal} al ${nextIdGlobal+lineas-1}`; nextIdGlobal+=lineas; }catch(e){ document.getElementById("statusBase").textContent="Error"; } }

cargarPartidos();
