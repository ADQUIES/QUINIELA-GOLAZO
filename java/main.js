async function enviarQuiniela() {
  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const inputs = document.querySelectorAll('[data-partido]'); // tus 9 partidos
  const pronosticos = Array.from(inputs).map(i => i.value);

  if(!nombre ||!telefono){
    alert("Pon tu nombre y WhatsApp");
    return;
  }

  // Generamos el folio aquí mismo
  const folio = Date.now().toString().slice(-5); // ej: 48291

  // Mensaje instantáneo al cliente
  document.getElementById('resultado').innerHTML = `
    <h2>¡Gracias ${nombre}!</h2>
    <p>Tu folio es: <b>#${folio}</b></p>
    <p>Te contactaremos al: ${telefono}</p>
  `;

  // Lo mandamos a tu BASEDEDATOS con TELÉFONO
  await fetch("https://script.google.com/macros/s/AKfycbxYg3CKot4gItmNJO9xeRGXMru8GgDwhVcMQxdjackV7r2Z6nEu_iuXKxrSlEfvRl9E/exec", {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      id: folio,
      nombre: nombre,
      telefono: telefono,
      pronosticos: pronosticos,
      costo: 20
    })
  });
}
