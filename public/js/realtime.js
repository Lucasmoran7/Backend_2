const socket = io();

// AGREGAR producto
document.getElementById('formAgregar').addEventListener('submit', (e) => {
  e.preventDefault();

  const nuevoProd = {
    title: e.target.title.value,
    description: e.target.description.value,
    code: e.target.code.value,
    price: parseFloat(e.target.price.value),
    stock: parseInt(e.target.stock.value),
    category: e.target.category.value,
    thumbnails: [e.target.thumbnail.value],
    status: true
  };

  socket.emit('nuevoProducto', nuevoProd);
  e.target.reset();
});

// ELIMINAR producto
document.getElementById('formEliminar').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = e.target.idEliminar.value;
  socket.emit('eliminarProducto', id);
  e.target.reset();
});

// ACTUALIZAR lista
socket.on('productosActualizados', (productos) => {
  const lista = document.getElementById('listaProductos');
  lista.innerHTML = '';
  productos.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${p.title}</strong> - $${p.price}`;
    lista.appendChild(li);
  });
});

