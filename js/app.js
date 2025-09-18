// Variables
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaJuegos = document.querySelector("#lista-cursos"); // contenedor de productos
const carritoIcono = document.querySelector("#img-carrito"); // icono para desplegar carrito
let articulosCarrito = [];

// Listeners
cargarEventListeners();

function cargarEventListeners() {
  // Cuando agregas un juego con "Agregar al carrito"
  listaJuegos.addEventListener("click", agregarJuego);

  // Elimina juegos del carrito
  carrito.addEventListener("click", eliminarJuego);

  // Mostrar el carrito desde localStorage al cargar la página
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoHTML();
  });

  // Vaciar carrito
  vaciarCarritoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    articulosCarrito = [];
    limpiarHTML();
    sincronizarStorage();
  });

  // Mostrar/ocultar carrito al hacer click en el icono
  carritoIcono.addEventListener("click", () => {
    carrito.classList.toggle("activo");
  });
}

// Funciones
function agregarJuego(e) {
  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
    const juegoSeleccionado = e.target.parentElement.parentElement;
    leerDatosJuego(juegoSeleccionado);
  }
}

function eliminarJuego(e) {
  e.preventDefault();
  if (e.target.classList.contains("borrar-curso")) {
    const juegoId = e.target.getAttribute("data-id");

    // Filtra los que no coinciden con el ID eliminado
    articulosCarrito = articulosCarrito.filter((juego) => juego.id !== juegoId);

    carritoHTML();
  }
}

function leerDatosJuego(juego) {
  const infoJuego = {
    imagen: juego.querySelector("img").src,
    titulo: juego.querySelector("h4").textContent,
    // pillamos el precio rebajado (el que está en <span>)
    precio: juego.querySelector(".precio span").textContent.trim().replace("€", ""),
    id: juego.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  // Revisar si ya existe en el carrito
  const existe = articulosCarrito.some((juego) => juego.id === infoJuego.id);
  if (existe) {
    // Actualizar cantidad
    articulosCarrito = articulosCarrito.map((juego) => {
      if (juego.id === infoJuego.id) {
        juego.cantidad++;
        return juego;
      } else {
        return juego;
      }
    });
  } else {
    // Agregar al array del carrito
    articulosCarrito = [...articulosCarrito, infoJuego];
  }

  carritoHTML();
}

function carritoHTML() {
  limpiarHTML();

  let total = 0;

  articulosCarrito.forEach((juego) => {
    const { imagen, titulo, precio, cantidad, id } = juego;
    const subtotal = (parseFloat(precio) * cantidad).toFixed(2);
    total += parseFloat(subtotal);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <img src="${imagen}" width="80">
      </td>
      <td>${titulo}</td>
      <td>€${precio}</td>
      <td>${cantidad}</td>
      <td>€${subtotal}</td>
      <td>
        <a href="#" class="borrar-curso" data-id="${id}"> X </a>
      </td>
    `;
    contenedorCarrito.appendChild(row);
  });

  // Fila de total general
  if (articulosCarrito.length > 0) {
    const rowTotal = document.createElement("tr");
    rowTotal.innerHTML = `
      <td colspan="4" style="text-align:right; font-weight:bold;">Total:</td>
      <td colspan="2" style="font-weight:bold;">€${total.toFixed(2)}</td>
    `;
    contenedorCarrito.appendChild(rowTotal);
  }

  sincronizarStorage();
}

function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

function limpiarHTML() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}
