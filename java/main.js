let partidosData = [];
let combinaciones = {};

async function cargarPartidos(){
  let r = await fetch(SCRIPT_URL+"?action=get_admin");
  partidosData = await r.json();
  renderTabla();
}

function renderTabla(){
  let cont = document.getElementById("lista-partidos");
  let html = `<table class="tabla-fondo"><tr>
    <td class="col-L" style="background:#001525;color:#d4ff00">L</td>
    <td class="col-nombre" style="background:#001525;color:#d4ff00">LOCAL</td>
    <td class="col-escudo" style="background:#001525"></td>
    <td class="col-E" style="background:#001525;color:#d4ff00">E</td>
    <td class="col-escudo" style="background:#001525"></td>
    <td class="col-nombre" style="background:#001525;color:#d4ff00">VISITA</td>
    <td class="col-V" style="background:#001525;color:#d4ff00">V</td>
  </tr></table>`;

  partidosData.forEach((p,i)=>{
    let idx = i+1;
    combinaciones[idx] = "";
    let localClean = p.local.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().trim();
    let visitaClean = p.visita.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().trim();

    html += `
    <div class="fila-partido">
      <table class="tabla-fondo">
        <tr>
          <td class="col-L"></td>
          <td class="col-nombre">${p.local.toUpperCase()}</td>
          <td class="col-escudo"><img src="img/ESCUDOS/${localClean}.png" onerror="this.src='img/logo.png'"></td>
          <td class="col-E"></td>
          <td class="col-escudo"><img src="img/ESCUDOS/${visitaClean}.png" onerror="this.src='img/logo.png'"></td>
          <td class="col-nombre">${p.visita.toUpperCase()}</td>
          <td class="col-V"></td>
        </tr>
      </table>
      <div class="botonera">
        <div class="boton" id="L${idx}" onclick="toggleLetra(${idx},'L')">L</div>
        <div></div><div></div>
        <div class="boton" id="E${idx}" onclick="toggleLetra(${idx},'E')">E</div>
        <div></div><div></div>
        <div class="boton" id="V${idx}" onclick="toggleLetra(${idx},'V')">V</div>
      </div>
    </div>`;
  });
  cont.innerHTML = html;
}

function toggleLetra(idx, letra){
  let actual = combinaciones[idx] || "";
  if(actual.includes(letra)) actual = actual.replace(letra,"");
  else actual += letra;
  actual = actual.split("").sort((a,b)=>["L","E","V"].indexOf(a)-["L","E","V"].indexOf(b)).join("");
  combinaciones[idx]=actual;
  ["L","E","V"].forEach(l=>{
    let el=document.getElementById(l+idx);
    if(actual.includes(l)) el.classList.add("active"); else el.classList.remove("active");
  });
}

function generar(){
  let nombre=document.getElementById("nombre").value.trim();
  let nQ = parseInt(document.getElementById("numQuinielas").value) || 1;
  if(!nombre){ alert("Pon nombre"); return; }
  let texto="";
  let arrays=[]; for(let i=1;i<=partidosData.length;i++){ if(!combinaciones[i]){ alert("Falta partido "+i); return; } arrays.push(combinaciones[i].split("")); }
  let c=0; function back(pos, act){ if(c>=nQ) return; if(pos>partidosData.length){ c++; texto+=act.join(" ")+" "+nombre.toUpperCase()+" *\n"; return; } for(let l of arrays[pos-1]){ act[pos-1]=l; back(pos+1,[...act]); } }
  back(1,[]);
  document.getElementById("resultado").value=texto;
}

cargarPartidos();
