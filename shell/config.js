// Direcciones de los mini-sitios que el shell carga dentro del iFrame.
// En local (sirviendo toda la carpeta tarea3/ con un solo servidor estático)
// funcionan como rutas relativas.
//
// TRAS PUBLICAR cada mini-sitio en su hosting estático (GitHub Pages, Netlify,
// Vercel, etc.) reemplace cada valor por la URL real de esa publicación, p.ej:
//
// libros: "https://mi-sitio-libros.netlify.app/index.html",
// autores: "https://mi-usuario.github.io/site-autores/index.html",
// editoriales: "https://mi-sitio-editoriales.vercel.app/index.html",
// resenas: "https://mi-sitio-resenas.netlify.app/index.html",

const SITE_URLS = {
  libros: "../site-libros/index.html",
  autores: "../site-autores/index.html",
  editoriales: "../site-editoriales/index.html",
  resenas: "../site-resenas/index.html",
};
