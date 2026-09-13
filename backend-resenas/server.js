const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3004;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json());

function leerDatos() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

// GET /resenas               -> todas las reseñas
// GET /resenas?tipo=libro&id=1 -> reseñas de una entidad específica (libro, autor o editorial)
app.get("/resenas", (req, res) => {
  const { tipo, id } = req.query;
  let resenas = leerDatos();
  if (tipo) resenas = resenas.filter((r) => r.entidadTipo === tipo);
  if (id) resenas = resenas.filter((r) => r.entidadId === Number(id));
  res.json(resenas);
});

app.get("/resenas/:id", (req, res) => {
  const resenas = leerDatos();
  const resena = resenas.find((r) => r.id === Number(req.params.id));
  if (!resena) return res.status(404).json({ error: "Reseña no encontrada" });
  res.json(resena);
});

// POST /resenas -> crear una nueva reseña
// body: { entidadTipo: "libro"|"autor"|"editorial", entidadId, autorResena, comentario, calificacion }
app.post("/resenas", (req, res) => {
  const resenas = leerDatos();
  const nueva = { id: resenas.length ? Math.max(...resenas.map((r) => r.id)) + 1 : 1, ...req.body };
  resenas.push(nueva);
  fs.writeFileSync(DATA_FILE, JSON.stringify(resenas, null, 2));
  res.status(201).json(nueva);
});

app.get("/", (req, res) => {
  res.send("Backend de Reseñas funcionando. Endpoints: GET /resenas, GET /resenas?tipo=&id=, POST /resenas");
});

app.listen(PORT, () => {
  console.log(`Backend de Reseñas escuchando en http://localhost:${PORT}`);
});
