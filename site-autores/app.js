const { createApp } = Vue;

createApp({
  data() {
    return {
      autores: [],
      autorSeleccionado: null,
      cargando: true,
      error: null,
    };
  },
  methods: {
    async cargarAutores() {
      this.cargando = true;
      this.error = null;
      try {
        const res = await fetch(`${API_URL}/autores`);
        this.autores = await res.json();
      } catch (e) {
        this.error = `No se pudo conectar con el backend de Autores (${API_URL}).`;
      } finally {
        this.cargando = false;
      }
    },
    async verDetalle(id) {
      this.cargando = true;
      try {
        const res = await fetch(`${API_URL}/autores/${id}`);
        this.autorSeleccionado = await res.json();
      } catch (e) {
        this.error = "No se pudo cargar el detalle del autor.";
      } finally {
        this.cargando = false;
      }
    },
    volver() {
      this.autorSeleccionado = null;
    },
    irAResenas(autor) {
      // Igual patrón que en el sitio de Libros: aviso al shell por postMessage
      // si estamos embebidos en el iframe, o navego directo si no.
      if (window.parent !== window) {
        window.parent.postMessage(
          { accion: "verResenas", tipo: "autor", id: autor.id, nombre: autor.nombre },
          "*"
        );
      } else {
        window.open(`${RESENAS_URL}?tipo=autor&id=${autor.id}`, "_blank");
      }
    },
  },
  mounted() {
    this.cargarAutores();
  },
  template: `
    <div>
      <template v-if="autorSeleccionado">
        <button class="back" @click="volver">&larr; Volver a la lista</button>
        <div class="detail">
          <h1>{{ autorSeleccionado.nombre }}</h1>
          <p><strong>Nacionalidad:</strong> {{ autorSeleccionado.nacionalidad }}</p>
          <p>{{ autorSeleccionado.bio }}</p>
          <a class="btn" href="#" @click.prevent="irAResenas(autorSeleccionado)">Ver reseñas de este autor ⭐</a>
        </div>
      </template>
      <template v-else>
        <h1>✍️ Autores</h1>
        <p v-if="cargando">Cargando autores...</p>
        <p v-else-if="error" class="error">{{ error }}</p>
        <div v-else class="grid">
          <div class="card" v-for="a in autores" :key="a.id" @click="verDetalle(a.id)">
            <h3>{{ a.nombre }}</h3>
            <p>{{ a.nacionalidad }}</p>
          </div>
        </div>
      </template>
    </div>
  `,
}).mount("#app");
