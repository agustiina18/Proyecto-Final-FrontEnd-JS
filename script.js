// Elementos
const contenedorProductos = document.getElementById("productos");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

fetch('productos.json')
  .then(response => response.json())
  .then(data => mostrarProductos(data));

function mostrarProductos(productos) {
  const contenedor = document.getElementById('lista-productos');
  contenedor.innerHTML = ''; // limpia antes
  productos.forEach(prod => {
    const card = document.createElement('article');
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.titulo}">
      <h3>${prod.titulo}</h3>
      <p>Precio: $${prod.precio}</p>
      <button onclick="agregarAlCarrito(${prod.id}, '${prod.titulo}', ${prod.precio})">Agregar al carrito</button>
    `;
    contenedor.appendChild(card);
  });
}

  function buscarProducto() {
  const consulta = document.getElementById("buscador").value.toLowerCase();
  const productos = document.querySelectorAll("#lista-productos article");

  productos.forEach(producto => {
    const titulo = producto.querySelector("h3").textContent.toLowerCase();
    producto.style.display = titulo.includes(consulta) ? "block" : "none";
  });
}

  function agregarAlCarrito(id, titulo, precio) {
  const productoExistente = carrito.find(p => p.id === id);
  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({ id, titulo, precio, cantidad: 1 });
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  const contenedor = document.getElementById('lista-carrito');
  const totalElement = document.getElementById('total');
  contenedor.innerHTML = '';
  let total = 0;

  carrito.forEach(prod => {
    total += prod.precio * prod.cantidad;
    const item = document.createElement('div');
    item.innerHTML = `
      <strong>${prod.titulo}</strong> x${prod.cantidad} - $${prod.precio * prod.cantidad}
      <button onclick="eliminarDelCarrito(${prod.id})">Eliminar</button>
    `;
    contenedor.appendChild(item);
  });

  totalElement.textContent = total;
  localStorage.setItem("carrito", JSON.stringify(carrito));
  document.getElementById("contador-carrito").textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);
}

function cambiarCantidad(id, cantidad) {
  const producto = carrito.find(p => p.id === id);
  if (producto) {
    producto.cantidad += cantidad;
    if (producto.cantidad <= 0) {
      eliminarDelCarrito(id);
    } else {
      actualizarCarrito();
    }
  }
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(prod => prod.id !== id);
  actualizarCarrito();
}

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let resumen = "Gracias por tu compra:\n";
  carrito.forEach(prod => {
    resumen += `- ${prod.titulo} x${prod.cantidad}: $${prod.precio * prod.cantidad}\n`;
  });

  resumen += `\nTotal: $${carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)}`;

  alert(resumen);

  carrito = [];
  actualizarCarrito();

  document.getElementById("contador-carrito").textContent = 0;
  localStorage.removeItem("carrito");

}

const form = document.getElementById('form-contacto');
const mensajeFormulario = document.getElementById('mensaje-formulario');

form.addEventListener('submit', function(event) {
  event.preventDefault(); // evitar que se envíe inmediatamente

  const nombre = form.nombre.value.trim();
  const email = form.email.value.trim();
  const mensaje = form.mensaje.value.trim();

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (nombre === '') {
    mostrarMensaje('Por favor ingresa tu nombre.');
    return;
  }
  if (!emailValido.test(email)) {
    mostrarMensaje('Por favor ingresa un correo electrónico válido.');
    return;
  }
  if (mensaje.length < 10) {
    mostrarMensaje('El mensaje debe tener al menos 10 caracteres.');
    return;
  }

  mensajeFormulario.style.color = 'green';
  mostrarMensaje('Formulario enviado correctamente. ¡Gracias!');

  form.submit(); // enviar realmente el formulario
});

function mostrarMensaje(msg) {
  mensajeFormulario.textContent = msg;
  mensajeFormulario.style.color = 'red';
}
