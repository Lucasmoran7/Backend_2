const socket = io();

// Renderizar productos
socket.on("productos", (products) => {
  const lista = document.getElementById("product-list");
  lista.innerHTML = "";
  products.forEach((p) => {
    lista.innerHTML += `
      <li id="${p._id}">
        <strong>${p.title}</strong> - $${p.price}
        <button onclick="eliminarProducto('${p._id}')">Eliminar</button>
      </li>
    `;
  });
});

// Formulario para agregar producto
const form = document.getElementById("form-producto");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    title: form.title.value,
    price: form.price.value,
  };
  socket.emit("agregarProducto", data);
  form.reset();
});

// Eliminar producto
function eliminarProducto(id) {
  socket.emit("eliminarProducto", id);
}
