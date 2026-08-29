let partidosData = [];
let combinaciones = {}; // {1: "L", 2: "LE", etc}
let nextIdGlobal = 101;

async function cargarPartidos(){
  try{
    let r = await fetch(SCRIPT_URL+"?action=get_admin");
    partidosData = await r.json();
    if(!partidosData || partidosData.length==0) throw "vacio";
    renderPartidos();
    getNextId();
  }catch(e){
    document.getElementById("lista-partidos").innerHTML="<p style='color:red;text-align:center'>No se pudo cargar ADMIN. Revisa tu Apps Script</p>";
  }
}

function renderPartidos(){
  let cont = document.getElementById("lista-partidos");
  cont.innerHTML="";
  partidosData.forEach((p,i)=>{
    let idx=i+1;
    combinaciones[idx]="";

    // limpia acentos y mayusculas para que encuentre el escudo
    let localClean = p.local.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().trim();
    let visitaClean = p.visita.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().trim();

    // Si tu hoja trae hora como fecha rara, la arreglamos aqui tambien
    let horaTxt = p.hora;
    if(typeof horaTxt === 'string' && horaTxt.includes('T')){ horaTxt = horaTxt.substring(11,16); }

    cont.innerHTML+=`
      <div class="card-partido">
        <div class="num">${idx}</div>

        <div class="col">
          <div class="equipo"><img src="img/ESCUDOS/${localClean}.png" onerror="this.src='img/logo.png'"><span>${p.local}</span></div>
          <span id="L${idx}" class="btn-letra" onclick="toggleLetra(${idx},'L')">L</span>
        </div>

        <div class="col center">
          <div class="vs">VS</div>
          <span id="E${idx}" class="btn-letra" onclick="toggleLetra(${idx},'E')">E</span>
        </div>

        <div class="col">
          <div class="equipo"><img src="img/ESCUDOS/${visitaClean}.png" onerror="this.src='img/logo.png'"><span>${p.visita}</span></div>
          <span id="V${idx}" class="btn-letra" onclick="toggleLetra(${idx},'V')">V</span>
        </div>

        <div class="info-bar">${p.diaLetra} ${p.dia}/${p.mes} ${horaTxt} ${p.trans}</div>
      </div>`;
  });
}

function toggleLetra(idx, letra){
  let actual = combinaciones[idx] || "";
  if(actual.includes(letra)) actual = actual.replace(letra,"");
  else actual += letra;
  // ordenar L E V
  let orden = ["L","E","V"];
  actual = actual.split("").sort((a,b)=>orden.indexOf(a)-orden.indexOf(b)).join("");
  combinaciones[idx]=actual;

  ["L","E","V"].forEach(l=>{
    let el=document.getElementById(l+idx);
    if(!el) return;
    if(actual.includes(l)) el.classList.add("active");
    else el.classList.remove("active");
  });
}

async function getNextId(){
  try{
    let r = await fetch(SCRIPT_URL+"?action=get_next_id");
    let j = await r.json();
    nextIdGlobal=j.nextId;
    document.getElementById("infoIDs").textContent="Tu folio iniciará en: "+nextIdGlobal;
  }catch(e){ nextIdGlobal=101; }
}

function generar(){
  let nombre=document.getElementById("nombre").value.trim();
  let nQ = parseInt(document.getElementById("numQuinielas").value) || 1;
  if(!nombre){ alert("Pon tu nombre"); return; }
  for(let i=1;i<=partidosData.length;i++){
    if(!combinaciones[i]){ alert("Te falta seleccionar partido "+i); return; }
  }
  let arrays = [];
  for(let i=1;i<=partidosData.length;i++){ arrays.push(combinaciones[i].split("")); }
  let totalCombinaciones = arrays.reduce((a,b)=>a*b.length,1);
  let texto="";
  let count=0;
  function backtrack(pos, actual){
    if(count>=nQ) return;
    if(pos>partidosData.length){ count++; texto+=actual.join(" ")+" "+nombre.toUpperCase()+" *\n"; return; }
    for(let letra of arrays[pos-1]){ if(count>=nQ) return; actual[pos-1]=letra; backtrack(pos+1, [...actual]); }
  }
  backtrack(1, []);
  document.getElementById("resultado").value=texto;
  let costo = nQ*15;
  document.getElementById("infoCosto").textContent=`Total quinielas: ${nQ} x $15 = $${costo} - Total combinaciones posibles: ${totalCombinaciones}`;
  document.getElementById("infoIDs").textContent=`Folios: ${nextIdGlobal} al ${nextIdGlobal+nQ-1}`;
}

function enviarWhatsApp(){
  let txt = document.getElementById("resultado").value;
  if(!txt){ alert("Primero genera"); return; }
  window.open("https://wa.me/?text="+encodeURIComponent(txt));
}

async function guardarEnBase(){
  let nombre=document.getElementById("nombre").value.trim();
  let tel=document.getElementById("telefono").value.trim();
  let txt=document.getElementById("resultado").value.trim();
  if(!nombre ||!tel ||!txt){ alert("Falta nombre, teléfono o generar quinielas"); return; }
  let lineas = txt.split("\n").filter(l=>l.trim()!="").length;
  let costoTotal = lineas*15;
  document.getElementById("statusBase").textContent="Guardando en BASEDEDATOS fila 15...";
  try{
    await fetch(SCRIPT_URL,{
      method:"POST", mode:"no-cors",
      body: JSON.stringify({
        action:"guardar_basededatos",
        nombre: nombre.toUpperCase(),
        telefono: tel,
        quinielas: txt,
        id_inicio: nextIdGlobal,
        total: lineas,
        costo: costoTotal
      })
    });
    document.getElementById("statusBase").textContent=`✅ Guardado! Folios ${nextIdGlobal} al ${nextIdGlobal+lineas-1} en BASEDEDATOS`;
    nextIdGlobal+=lineas;
  }catch(e){ document.getElementById("statusBase").textContent="Error al guardar"; }
}

cargarPartidos();
