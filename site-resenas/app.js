const app = document.getElementById("app");

const params = new URLSearchParams(window.location.search);
let filtroTipo = params.get("tipo") || null;
let filtroId = params.get("id") || null;
let filtroNombre = params.get("nombre") || null;

const ETIQUETAS = { libro: "libro", autor: "autor", editorial: "editorial" };

function estrellas(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

async function cargarResenas() {
  app.innerHTML = "<p>Cargando reseñas...</p>";
  try {
    let url = `${API_URL}/resenas`;
    if (filtroTipo && filtroId) url += `?tipo=${filtroTipo}&id=${filtroId}`;
    const res = await fetch(url);
    const resenas = await res.json();
    render(resenas);
  } catch (err) {
    app.innerHTML = `<p class="error">No se pudo conectar con el backend de Reseñas (${API_URL}). Verifique que esté corriendo.</p>`;
  }
}

function render(resenas) {
  app.innerHTML = `
    <h1>⭐ Reseñas</h1>
    <div class="filtro">
      ${
        filtroTipo && filtroId
          ? `Mostrando reseñas de ${ETIQUETAS[filtroTipo] || filtroTipo}${filtroNombre ? `: <strong>${filtroNombre}</strong>` : ` #${filtroId}`}
             <button id="verTodas">Ver todas las reseñas</button>`
          : "Mostrando todas las reseñas"
      }
    </div>
    <div class="lista">
      ${
        resenas.length
          ? resenas
              .map(
                (r) => `
          <div class="resena">
            <h4>${r.autorResena} <span class="estrellas">${estrellas(r.calificacion)}</span></h4>
            <p>${r.comentario}</p>
            <p style="font-size:0.8rem;color:#8a7a63;">Sobre: ${r.entidadTipo} #${r.entidadId}</p>
          </div>`
              )
              .join("")
          : `<p class="vacio">Aún no hay reseñas para mostrar.</p>`
      }
    </div>

    <h2>Agregar una reseña</h2>
    <form id="formResena">
      <label>Tipo de contenido
        <select name="entidadTipo" required>
          <option value="libro" ${filtroTipo === "libro" ? "selected" : ""}>Libro</option>
          <option value="autor" ${filtroTipo === "autor" ? "selected" : ""}>Autor</option>
          <option value="editorial" ${filtroTipo === "editorial" ? "selected" : ""}>Editorial</option>
        </select>
      </label>
      <label>ID del elemento
        <input type="number" name="entidadId" min="1" value="${filtroId || ""}" required />
      </label>
      <label>Tu nombre
        <input type="text" name="autorResena" required />
      </label>
      <label>Comentario
        <textarea name="comentario" rows="3" required></textarea>
      </label>
      <label>Calificación (1 a 5)
        <input type="number" name="calificacion" min="1" max="5" value="5" required />
      </label>
      <button type="submit" class="btn">Publicar reseña</button>
    </form>
  `;

  if (filtroTipo && filtroId) {
    document.getElementById("verTodas").addEventListener("click", () => {
      filtroTipo = null;
      filtroId = null;
      filtroNombre = null;
      cargarResenas();
    });
  }

  document.getElementById("formResena").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const nueva = {
      entidadTipo: fd.get("entidadTipo"),
      entidadId: Number(fd.get("entidadId")),
      autorResena: fd.get("autorResena"),
      comentario: fd.get("comentario"),
      calificacion: Number(fd.get("calificacion")),
    };
    await fetch(`${API_URL}/resenas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nueva),
    });
    cargarResenas();
  });
}

cargarResenas();
