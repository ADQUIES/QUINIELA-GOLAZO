const partidos = [
  {local:"TOLUCA", visita:"PUEBLA", escudoLocal:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F219.png", escudoVisita:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F222.png"},
  {local:"GUADALAJARA", visita:"JUAREZ", escudoLocal:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F205.png", escudoVisita:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F12325.png"},
  {local:"CRUZ AZUL", visita:"ATLAS", escudoLocal:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F203.png", escudoVisita:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F200.png"},
  {local:"TIGRES", visita:"LEON", escudoLocal:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F228.png", escudoVisita:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F212.png"},
  {local:"AMERICA", visita:"PACHUCA", escudoLocal:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F201.png", escudoVisita:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F221.png"},
  {local:"MONTERREY", visita:"MAZATLAN", escudoLocal:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F220.png", escudoVisita:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F23373.png"},
  {local:"NECAXA", visita:"SANTOS", escudoLocal:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F218.png", escudoVisita:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F227.png"},
  {local:"PUMAS", visita:"QUERETARO", escudoLocal:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F224.png", escudoVisita:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F225.png"},
  {local:"AT SAN LUIS", visita:"TIJUANA", escudoLocal:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F226.png", escudoVisita:"https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F229.png"}
];

let selecciones = {};

function cargar() {
  const cont = document.getElementById('lista-partidos');
  let html = `<div class="encabezado"><div>LOCAL</div><div></div><div>L</div><div>E</div><div>V</div><div></div><div>VISITA</div></div>`;
  partidos.forEach((p,i)=>{
    html+=`<div class="fila">
      <div class="n">${p.local}</div>
      <div class="e"><img src="${p.escudoLocal}"></div>
      <div class="b"><button id="l${i}" onclick="marcar(${i},'L')">L</button></div>
      <div class="b"><button id="e${i}" onclick="marcar(${i},'E')">E</button></div>
      <div class="b"><button id="v${i}" onclick="marcar(${i},'V')">V</button></div>
      <div class="e"><img src="${p.escudoVisita}"></div>
      <div class="n">${p.visita}</div>
    </div>`;
  });
  cont.innerHTML = html;
}
function marcar(i, letra){
  selecciones[i]=letra;
  document.getElementById('l'+i).classList.remove('active');
  document.getElementById('e'+i).classList.remove('active');
  document.getElementById('v'+i).classList.remove('active');
  document.getElementById(letra.toLowerCase()+i).classList.add('active');
}
function generar(){
  let nombre = document.getElementById('nombre').value || 'SIN NOMBRE';
  let n = parseInt(document.getElementById('numQuinielas').value)||1;
  let base = '';
  for(let i=0;i<partidos.length;i++){ base+= selecciones[i] || 'L'; }
  let txt = '';
  for(let q=1;q<=n;q++){
    let res = base.split('').sort(()=>0.5-Math.random()).join('').substring(0,partidos.length);
    txt+= `${nombre} Q${q}: ${res}\n`;
  }
  document.getElementById('resultado').value = txt;
  document.getElementById('infoCosto').innerText = `Total a pagar: $${n*15}`;
}
function enviarWhatsApp(){
  let txt = encodeURIComponent(document.getElementById('resultado').value);
  window.open(`https://wa.me/?text=${txt}`);
}
function guardarEnBase(){
  document.getElementById('statusBase').innerText = 'Guardado (demo local)';
}
cargar();
