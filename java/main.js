let res = ['_','_','_','_','_','_','_','_','_'];
let quantity = localStorage.getItem('quantity');
let name = localStorage.getItem("alias");
let combinations = false;
var aux; var id = 0;

function start(){
    recovername();
    let tel = localStorage.getItem("tel"); if(tel) document.getElementById("telefono").value = tel;
    display = document.getElementById("display");
    let container = document.getElementById("text");
    container.innerHTML = res.join("\xa0\xa0");
    if (quantity) document.querySelector('.botonenviar span').textContent = quantity;
    let results = localStorage.getItem("results");
    if (results){
        results = results.split("*");
        for (var i = 0; i < quantity; i++){
            if (results[i] && results[i]!= undefined){
                let fila = display.insertRow(i);
                if (results[i].split("\xa0\xa0")[0][0]!="L" && results[i].split("\xa0\xa0")[0][0]!="E" && results[i].split("\xa0\xa0")[0][0]!="V") results[i] = results[i].slice(1);
                for (var j =0; j < 9; j++) {
                    cell1 = fila.insertCell(j); cell1.innerHTML += results[i].split("\xa0\xa0")[j]; cell1.style.width = "7%";
                    if (results[i].split("\xa0\xa0")[j].length == 2) cell1.style.fontSize = "small";
                    if (results[i].split("\xa0\xa0")[j].length == 3) cell1.style.fontSize = "x-small";
                }
                let cell2 = fila.insertCell(9); cell2.innerHTML += "<pre>" +results[i].split("\xa0\xa0")[9] + "</pre>"; cell2.style.fontSize = "small"; cell2.className = "cellname";
                let cell3 = fila.insertCell(10); cell3.innerHTML += '<ion-icon name="close-circle" style="color:rgb(120,0,0);"></ion-icon>'; cell3.style.width = "7%"; cell3.style.border = "none"; cell3.id = "x" + i; cell3.className = "deleter"; cell3.addEventListener('click', function(){remove(this);});
            } else break;
        }
        id = i; document.getElementById("total").innerHTML = "Total: $" + quantity*15 +"\n";
    }
    cargarPartidos();
}

async function cargarPartidos(){
  try{
    let r = await fetch(SCRIPT_URL+"?action=get_admin"); let data = await r.json();
    if(data && data.length>0){ renderPartidos(data); return; }
  }catch(e){}
  let local = JSON.parse(localStorage.getItem("quiniela_nueva")||"null");
  if(local && local.length>0) renderPartidos(local); else document.getElementById("lista-partidos").innerHTML="Esperando partidos del Admin...";
}
function renderPartidos(lista){
  let cont = document.getElementById("lista-partidos"); cont.innerHTML = "";
  lista.forEach((p,i)=>{
    let idx=i+1;
    cont.innerHTML += `<div class="partido-row"><div class="equipo"><img src="img/ESCUDOS/${p.local.toUpperCase()}.png" onerror="this.src='img/logo.png'"><br>${p.local}</div><div class="sel"><span id="L${idx}" onclick="selection(this)">L</span><span id="E${idx}" onclick="selection(this)">E</span><span id="V${idx}" onclick="selection(this)">V</span></div><div class="equipo"><img src="img/ESCUDOS/${p.visita.toUpperCase()}.png" onerror="this.src='img/logo.png'"><br>${p.visita}</div></div>`;
  });
}

function updatedisplay(modo){
    let display = document.getElementById("display"); let lastIndex = display.getElementsByTagName("tr").length;
    if (modo == 1){
        if (aux == undefined) aux=0; let fila = display.insertRow(lastIndex);
        for (var j =0; j < 9; j++) { cell1 = fila.insertCell(j); cell1.innerHTML += res[j]; cell1.style.width = "7%"; if (res[j].length == 2) cell1.style.fontSize = "small"; if (res[j].length == 3) cell1.style.fontSize = "x-small"; }
        if (aux>1){ var cellname = fila.insertCell(9); cellname.innerHTML += name + " (" + aux + ")"; } else{ var cellname = fila.insertCell(9); cellname.innerHTML += name; }
        cellname.style.fontSize = "small"; cellname.className = "cellname";
        let cell3 = fila.insertCell(10); cell3.innerHTML += '<ion-icon name="close-circle" style="color:rgb(120,0,0);"></ion-icon>'; cell3.style.width = "7%"; cell3.style.border = "none"; cell3.id = "x" + id; cell3.className = "deleter"; cell3.addEventListener('click', function(){remove(this);}); id++; aux = 1;
    } else if (modo == 2){ id = 0; deleters = display.getElementsByClassName("deleter"); for (var i = 0; i < lastIndex ;i++) { deleters[i].id = "x" + id; id++; } }
    document.getElementById("total").innerHTML = "Total: $" + quantity*15;
}
function selection(element){
    let index = parseInt(element.id.slice(1)) - 1; let container = document.getElementById("text");
    if (!element.classList.contains("active")){
        if (!combinations){ validation(element); res[index] = element.id.slice(0,1); } else{ res[index] += element.id.slice(0,1); res[index] = res[index].split('_').join(''); }
        element.classList.add("active"); element.style.backgroundColor = "rgb(250, 30, 30)";
    } else{
        if(combinations){ element.classList.remove("active"); element.style.backgroundColor = ""; if (res[index]!= "_" && res[index].length>1) res[index] = res[index].split(element.id.slice(0,1)).join(''); else res[index] = "_"; }
    }
    costoactual(); container.innerHTML = res.join("\xa0\xa0");
}
function validation(element){ let index = parseInt(element.id.slice(1)); document.getElementById("L"+index)?.classList.remove("active"); document.getElementById("E"+index)?.classList.remove("active"); document.getElementById("V"+index)?.classList.remove("active"); document.getElementById("L"+index).style.backgroundColor = null; document.getElementById("E"+index).style.backgroundColor = null; document.getElementById("V"+index).style.backgroundColor = null; }
function number(){ quantity = localStorage.getItem("quantity"); if (quantity) localStorage.setItem('quantity', ++quantity); else{ localStorage.setItem('quantity', 1); quantity = localStorage.getItem("quantity");} document.querySelector('.botonenviar span').textContent = quantity; localStorage.setItem('alias', name); }
function result(){ results = localStorage.getItem("results"); name = document.getElementById("nombre").value; name = name.split('*').join(''); if (results){ if (aux > 1) localStorage.setItem('results', results + "\n" + res.join("\xa0\xa0") + "\xa0\xa0" + name + " (" + aux + ")" + "*"); else localStorage.setItem('results', results + "\n" + res.join("\xa0\xa0") + "\xa0\xa0" + name + "*"); } else{ if (aux > 1) localStorage.setItem('results',res.join("\xa0\xa0") + "\xa0\xa0" + name + " (" + aux + ")" + "*"); else localStorage.setItem('results',res.join("\xa0\xa0") + "\xa0\xa0" + name+ "*"); } }
function save(){ if(id < 150){ name = document.getElementById("nombre").value; if (res.join("\xa0\xa0").includes("_")) alert("Debes llenar todas las casillas"); else if (!name){ alert("Debes elegir un nombre"); document.getElementById("nombre").focus(); return 0;} else{ if (combinations) calculate(); else number(); result(); updatedisplay(1); clean();} } else alert("Envía tus quinielas registradas antes de capturar más"); }
function clean(){ res = ['_','_','_','_','_','_','_','_','_']; document.getElementById("text").innerHTML = res.join("\xa0\xa0"); let spans = document.querySelectorAll(".sel span"); spans.forEach(s=>{s.classList.remove("active"); s.style.backgroundColor="";}); document.getElementById("costo").innerHTML = "Costo: $0"; document.getElementById("numquinielas").innerHTML = "0 Quiniela(s)"; }
function recovername(){ name = localStorage.getItem("alias"); if (name!= null && name!="null") document.getElementById("nombre").value = name; }
function clearname(){ document.getElementById("nombre").value = ""; }
function allowcombination(){ if (!combinations){ combinations = true; document.getElementById("checkcombinaciones").style.backgroundColor = "rgb(0,117,255)"; document.getElementById("checkcombinaciones").style.color = "white"; } else{ combinations= false; document.getElementById("checkcombinaciones").style.backgroundColor = "rgba(255,255,255,0.35)"; document.getElementById("checkcombinaciones").style.color = "#777777"; clean(); } }
function calculate(){ aux = 1; for (var i=0;i<9;i++){ aux*= res[i].length; } quantity = localStorage.getItem("quantity"); if (quantity){ localStorage.setItem('quantity', parseInt(quantity)+aux); quantity = localStorage.getItem('quantity');} else{ localStorage.setItem('quantity', aux); quantity = localStorage.getItem("quantity");} document.querySelector('.botonenviar span').textContent = quantity; localStorage.setItem('alias', name); }
function random(){ clean(); let partidos = document.getElementsByClassName("partido-row"); for (var i = 0; i < 9; i++){ var r = getRandomInt(0,2); let sel = partidos[i]?.getElementsByTagName("span")[r]; if(sel){ sel.classList.add("active"); sel.style.backgroundColor = "rgb(234, 255, 0)"; res[i] = ["L","E","V"][r]; } } document.getElementById("text").innerHTML = res.join("\xa0\xa0"); costoactual(); }
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function costoactual(){ let aux2 = 1; for (var i=0;i<9;i++){ aux2*= res[i].length; } document.getElementById("costo").innerHTML = "Costo: $" + aux2*15; document.getElementById("numquinielas").innerHTML = aux2 + " Quiniela(s)"; }
function remove(e){ display = document.getElementById("display"); eindex = e.id.slice(1); tr = display.getElementsByTagName("tr")[eindex]; display.deleteRow(eindex); results = localStorage.getItem("results").split("*"); let removing = results[eindex].split("\xa0\xa0"); if (removing[0][0]!="L" && removing[0][0]!="E" && removing[0][0]!="V") removing[0] = removing[0].slice(1); let aux3 = 1; for (var i=0;i<9;i++) aux3*= removing[i].length; quantity -= aux3; localStorage.setItem("quantity",quantity); results.splice(eindex,1); localStorage.setItem("results",results.join("*")); document.querySelector('.botonenviar span').textContent = quantity; document.getElementById("total").innerHTML = "Total: $" + quantity*15 +"\n"; updatedisplay(2); }
function deleteall(){ if(confirm("Se borrará todo, también se borrará las quinielas que ya capturaste")){ localStorage.setItem("quantity",""); localStorage.setItem("results",""); localStorage.setItem("alias",""); location.reload(); } }

async function enviarFinal(){
  let nombre = document.getElementById("nombre").value.trim();
  let telefono = document.getElementById("telefono").value.trim();
  quantity = localStorage.getItem("quantity"); let results = localStorage.getItem("results");
  if(!nombre){ alert("Pon tu nombre"); return; }
  if(!telefono || telefono.length < 10){ alert("Pon tu WhatsApp a 10 dígitos"); return; }
  if(!quantity || quantity==0){ alert("Agrega quiniela con +"); return; }
  let btn = document.querySelector(".botonenviar"); btn.innerHTML = "Enviando...";
  localStorage.setItem("tel",telefono);
  try{
    let rId = await fetch(SCRIPT_URL+"?action=get_next_id"); let dId = await rId.json(); let idBase = dId.nextId;
    let payload = {action:"guardar_basededatos", nombre:nombre, telefono:telefono, quinielas:results, total:quantity, costo:quantity*15, id_inicio:idBase };
    await fetch(SCRIPT_URL,{method:"POST",mode:"no-cors",body:JSON.stringify(payload)});
    let idFin = idBase + parseInt(quantity) -1;
    let rango = (quantity==1)? `ID: ${idBase}` : `IDs: ${idBase} al ${idFin}`;
    alert(`✅ REGISTRADO\n${rango}\nNombre: ${nombre}\nTotal: ${quantity}\nA PAGAR: $${quantity*15}\n\nTe abrira WhatsApp`);
    let whatsapptext = `*QUINIELA GOLAZO*%0A${rango}%0ANombre: ${nombre}%0ATel: ${telefono}%0ATotal: $${quantity*15}%0A%0A${results}`;
    window.location.href = "https://wa.me/527296898884?text="+encodeURIComponent(whatsapptext);
    localStorage.setItem("quantity",""); localStorage.setItem("results","");
  }catch(e){ alert("Error: "+e); btn.innerHTML = `Enviar<span>${quantity}</span>`; }
}
window.addEventListener("load",start,false);
