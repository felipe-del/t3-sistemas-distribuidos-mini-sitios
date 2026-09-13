const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3002;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json());

function leerDatos() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

app.get("/autores", (req, res) => {
  res.json(leerDatos());
});

app.get("/autores/:id", (req, res) => {
  const autores = leerDatos();
  const autor = autores.find((a) => a.id === Number(req.params.id));
  if (!autor) return res.status(404).json({ error: "Autor no encontrado" });
  res.json(autor);
});

app.post("/autores", (req, res) => {
  const autores = leerDatos();
  const nuevo = { id: autores.length ? Math.max(...autores.map((a) => a.id)) + 1 : 1, ...req.body };
  autores.push(nuevo);
  fs.writeFileSync(DATA_FILE, JSON.stringify(autores, null, 2));
  res.status(201).json(nuevo);
});

app.get("/", (req, res) => {
  res.send("Backend de Autores funcionando. Endpoints: GET /autores, GET /autores/:id, POST /autores");
});

app.listen(PORT, () => {
  console.log(`Backend de Autores escuchando en http://localhost:${PORT}`);
});
