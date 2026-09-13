# Tarea 3 — Biblioteca Virtual

**Nombre:** [ESCRIBA AQUÍ SU NOMBRE COMPLETO]
**Dirección donde quedó publicada la tarea:** [ESCRIBA AQUÍ LA URL DEL SHELL YA DESPLEGADO]

## Descripción del proyecto

La aplicación está compuesta por un **shell** (`shell/index.html`) que integra,
dentro de un `<iframe>`, cuatro mini-sitios independientes, cada uno con su
propio backend REST:

| Mini-sitio  | Técnica de front-end          | Carpeta              | Backend            | Puerto local |
|-------------|--------------------------------|-----------------------|---------------------|--------------|
| Libros      | JavaScript vanilla + fetch     | `site-libros/`         | `backend-libros/`   | 3001 |
| Autores     | Vue 3 (CDN)                     | `site-autores/`        | `backend-autores/`  | 3002 |
| Editoriales | React (CDN + Babel standalone) | `site-editoriales/`    | `backend-editoriales/` | 3003 |
| **Reseñas** *(nuevo, ejercicio 2)* | JavaScript vanilla + fetch | `site-resenas/` | `backend-resenas/` | 3004 |

El mini-sitio de **Reseñas** es el requerido en el ejercicio 2 de la Tarea 3:
reutiliza la técnica de front-end de "Libros" (JavaScript vanilla) y consulta
su propio backend adicional (`backend-resenas`), siguiendo el mismo patrón
Express + JSON de los otros tres backends.

En los componentes de **detalle de Libros, Autores y Editoriales** se agregó
un botón/enlace **"Ver reseñas de este ⭐"** (ejercicio 3). Al hacer clic:

- Si el mini-sitio está embebido dentro del shell, envía un `postMessage`
  al shell, que cambia el `iframe` para mostrar el mini-sitio de Reseñas
  filtrado por el elemento consultado (`?tipo=...&id=...`).
- Si el mini-sitio se abre suelto (fuera del shell), abre el mini-sitio de
  Reseñas directamente en una nueva pestaña.

El shell (`shell/index.html`) también tiene un botón nuevo en la barra de
navegación ("⭐ Reseñas") que carga el mini-sitio de reseñas sin filtro,
mostrando todas las reseñas.

`shell/home.html` es la página de bienvenida/landing de la aplicación.

## Estructura de carpetas

```
tarea3/
├── readme.md
├── shell/                 (index.html, home.html, config.js)
├── site-libros/            + backend-libros/
├── site-autores/           + backend-autores/
├── site-editoriales/       + backend-editoriales/
└── site-resenas/           + backend-resenas/   (mini-sitio nuevo)
```

Cada `site-*` tiene su propio `config.js` con la variable `API_URL` que
apunta a su backend, y (cuando aplica) `RESENAS_URL` que apunta al mini-sitio
de reseñas. El shell tiene su propio `config.js` con `SITE_URLS`, el mapa de
direcciones de los cuatro mini-sitios.

---

## Cómo probarlo localmente

### 1. Instalar y levantar los 4 backends

En **cuatro terminales distintas** (uno por backend):

```bash
cd backend-libros && npm install && npm start        # http://localhost:3001
cd backend-autores && npm install && npm start       # http://localhost:3002
cd backend-editoriales && npm install && npm start   # http://localhost:3003
cd backend-resenas && npm install && npm start       # http://localhost:3004
```

Cada uno debe imprimir en consola algo como
`Backend de Libros escuchando en http://localhost:3001`.

### 2. Servir el front-end (shell + los 4 mini-sitios)

Como todos los mini-sitios usan rutas **relativas** entre sí
(`site-libros/`, `site-autores/`, etc.) y hacia el shell, basta con levantar
**un solo servidor estático en la raíz del proyecto** (`tarea3/`). Por
ejemplo, con Node instalado:

```bash
cd tarea3
npx http-server -p 5000
```

(o `npx serve -l 5000`, o la extensión "Live Server" de VS Code sobre la
carpeta `tarea3/`).

### 3. Abrir la aplicación

Con el servidor corriendo, abra en el navegador:

```
http://localhost:5000/shell/home.html
```

Desde ahí, presione **"Entrar a la aplicación"** para llegar al shell
(`index.html`), navegue entre Libros / Autores / Editoriales / Reseñas con
los botones superiores, entre a un libro/autor/editorial y presione
**"Ver reseñas..."** para comprobar que el shell cambia el `iframe` al
mini-sitio de reseñas filtrado.

> Con los 4 backends corriendo y el front-end servido, la app funciona
> exactamente igual que en producción, solo que apuntando a `localhost`.

---

## Cómo desplegarlo en producción

### A. Backends (elegir cualquier hosting con soporte para Node.js)

Opciones gratuitas típicas: **Render**, **Railway**, **Cyclic**, **Fly.io**.
Pasos generales para cada uno de los 4 backends (`backend-libros`,
`backend-autores`, `backend-editoriales`, `backend-resenas`):

1. Suba la carpeta del backend a un repositorio de GitHub (uno por backend,
   o los 4 dentro del mismo repo indicando el "root directory" del servicio).
2. En el proveedor elegido, cree un nuevo servicio "Web Service"/"Node app"
   apuntando a esa carpeta.
3. Comando de build: `npm install`. Comando de arranque: `npm start`.
4. El proveedor asignará una URL pública, por ejemplo
   `https://backend-libros.onrender.com`.
5. Verifique que responde entrando a esa URL en el navegador (debe mostrar
   el mensaje "Backend de ... funcionando").

Repita para los 4 backends y anote las 4 URLs resultantes.

### B. Mini-sitios y shell (hosting estático)

Opciones típicas: **GitHub Pages**, **Netlify**, **Vercel**. Cada mini-sitio
(y el shell) puede publicarse por separado (no necesitan el mismo
proveedor):

1. Para cada carpeta (`shell`, `site-libros`, `site-autores`,
   `site-editoriales`, `site-resenas`), publíquela como un sitio estático
   independiente (por ejemplo, arrastrando la carpeta a Netlify, o
   publicando esa carpeta como GitHub Pages).
2. Anote la URL pública de cada uno, por ejemplo:
   - `https://mi-sitio-libros.netlify.app`
   - `https://mi-usuario.github.io/site-autores`
   - `https://mi-sitio-editoriales.vercel.app`
   - `https://mi-sitio-resenas.netlify.app`
   - `https://mi-shell.netlify.app` (o donde publique `shell/`)

### C. Actualizar las direcciones reales (paso obligatorio del enunciado)

Una vez desplegados backends y mini-sitios, **edite los `config.js`** con las
URLs reales antes de volver a publicar cada sitio:

- `site-libros/config.js` → `API_URL` (URL de `backend-libros`) y
  `RESENAS_URL` (URL de `site-resenas`).
- `site-autores/config.js` → `API_URL` (URL de `backend-autores`) y
  `RESENAS_URL`.
- `site-editoriales/config.js` → `API_URL` (URL de `backend-editoriales`) y
  `RESENAS_URL`.
- `site-resenas/config.js` → `API_URL` (URL de `backend-resenas`).
- `shell/config.js` → los 4 valores de `SITE_URLS` (URLs de cada mini-sitio
  ya publicado).
- `shell/home.html` → si el shell y home quedan en dominios distintos,
  ajuste el enlace `href="index.html"` por la URL real del shell.

Después de editar los `config.js`, vuelva a publicar (redeploy) cada sitio
para que tome los cambios.

---

## Notas técnicas

- Los 4 backends son Express + CORS, cada uno con su propio archivo
  `data.json` como base de datos simple (se lee y escribe en disco al
  crear nuevos registros vía `POST`).
- El backend de Reseñas (`backend-resenas`) modela reseñas genéricas con
  `entidadTipo` (`libro` | `autor` | `editorial`) y `entidadId`, para poder
  asociarlas a cualquiera de los otros tres mini-sitios, cumpliendo el
  requisito de enlazar el nuevo mini-sitio desde libros, autores **y**
  editoriales.
- La comunicación entre un mini-sitio embebido y el shell se hace con
  `window.parent.postMessage(...)`, un mecanismo estándar y seguro para
  comunicar iframes con su página contenedora.
- No se incluyen carpetas `node_modules` en este zip; ejecute `npm install`
  en cada backend antes de iniciarlo.
