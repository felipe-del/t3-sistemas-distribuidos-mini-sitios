const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3003;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json());

function leerDatos() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

app.get("/editoriales", (req, res) => {
  res.json(leerDatos());
});

app.get("/editoriales/:id", (req, res) => {
  const editoriales = leerDatos();
  const editorial = editoriales.find((e) => e.id === Number(req.params.id));
  if (!editorial) return res.status(404).json({ error: "Editorial no encontrada" });
  res.json(editorial);
});

app.post("/editoriales", (req, res) => {
  const editoriales = leerDatos();
  const nueva = { id: editoriales.length ? Math.max(...editoriales.map((e) => e.id)) + 1 : 1, ...req.body };
  editoriales.push(nueva);
  fs.writeFileSync(DATA_FILE, JSON.stringify(editoriales, null, 2));
  res.status(201).json(nueva);
});

app.get("/", (req, res) => {
  res.send("Backend de Editoriales funcionando. Endpoints: GET /editoriales, GET /editoriales/:id, POST /editoriales");
});

app.listen(PORT, () => {
  console.log(`Backend de Editoriales escuchando en http://localhost:${PORT}`);
});
