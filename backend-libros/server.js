const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json());

function leerDatos() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

// GET /libros -> lista completa
app.get("/libros", (req, res) => {
  res.json(leerDatos());
});

// GET /libros/:id -> detalle de un libro
app.get("/libros/:id", (req, res) => {
  const libros = leerDatos();
  const libro = libros.find((l) => l.id === Number(req.params.id));
  if (!libro) return res.status(404).json({ error: "Libro no encontrado" });
  res.json(libro);
});

// POST /libros -> crear un nuevo libro (en memoria)
app.post("/libros", (req, res) => {
  const libros = leerDatos();
  const nuevo = { id: libros.length ? Math.max(...libros.map((l) => l.id)) + 1 : 1, ...req.body };
  libros.push(nuevo);
  fs.writeFileSync(DATA_FILE, JSON.stringify(libros, null, 2));
  res.status(201).json(nuevo);
});

app.get("/", (req, res) => {
  res.send("Backend de Libros funcionando. Endpoints: GET /libros, GET /libros/:id, POST /libros");
});

app.listen(PORT, () => {
  console.log(`Backend de Libros escuchando en http://localhost:${PORT}`);
});
