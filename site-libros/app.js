const app = document.getElementById("app");

function renderLista(libros) {
  app.innerHTML = `
    <h1>📚 Libros</h1>
    <div class="grid">
      ${libros
        .map(
          (l) => `
        <div class="card" data-id="${l.id}">
          <h3>${l.titulo}</h3>
          <p>${l.anio}</p>
        </div>`
        )
        .join("")}
    </div>
  `;
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => cargarDetalle(card.dataset.id));
  });
}

async function cargarLista() {
  app.innerHTML = "<p>Cargando libros...</p>";
  try {
    const res = await fetch(`${API_URL}/libros`);
    const libros = await res.json();
    renderLista(libros);
  } catch (err) {
    app.innerHTML = `<p class="error">No se pudo conectar con el backend de Libros (${API_URL}). Verifique que esté corriendo.</p>`;
  }
}

async function cargarDetalle(id) {
  app.innerHTML = "<p>Cargando...</p>";
  try {
    const res = await fetch(`${API_URL}/libros/${id}`);
    const libro = await res.json();
    app.innerHTML = `
      <button class="back" id="volver">&larr; Volver a la lista</button>
      <div class="detail">
        <h1>${libro.titulo}</h1>
        <p><strong>Año:</strong> ${libro.anio}</p>
        <p>${libro.descripcion}</p>
        <a class="btn" id="verResenas">Ver reseñas de este libro ⭐</a>
      </div>
    `;
    document.getElementById("volver").addEventListener("click", cargarLista);
    document.getElementById("verResenas").addEventListener("click", (e) => {
      e.preventDefault();
      irAResenas("libro", libro.id, libro.titulo);
    });
  } catch (err) {
    app.innerHTML = `<p class="error">No se pudo cargar el detalle del libro.</p>`;
  }
}

// Enlace hacia el mini-sitio de Reseñas (ejercicio 2/3 de la Tarea 3).
// Si el sitio corre embebido dentro del shell (index.html), le avisamos al
// shell por postMessage para que cambie el iframe al mini-sitio de reseñas.
// Si se abre suelto (fuera del shell), navegamos directamente a RESENAS_URL.
function irAResenas(tipo, id, nombre) {
  if (window.parent !== window) {
    window.parent.postMessage({ accion: "verResenas", tipo, id, nombre }, "*");
  } else {
    window.open(`${RESENAS_URL}?tipo=${tipo}&id=${id}`, "_blank");
  }
}

cargarLista();
