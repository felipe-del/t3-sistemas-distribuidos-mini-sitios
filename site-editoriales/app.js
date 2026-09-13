const { useState, useEffect } = React;

function irAResenas(editorial) {
  if (window.parent !== window) {
    window.parent.postMessage(
      { accion: "verResenas", tipo: "editorial", id: editorial.id, nombre: editorial.nombre },
      "*"
    );
  } else {
    window.open(`${RESENAS_URL}?tipo=editorial&id=${editorial.id}`, "_blank");
  }
}

function App() {
  const [editoriales, setEditoriales] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/editoriales`)
      .then((res) => res.json())
      .then((data) => {
        setEditoriales(data);
        setCargando(false);
      })
      .catch(() => {
        setError(`No se pudo conectar con el backend de Editoriales (${API_URL}).`);
        setCargando(false);
      });
  }, []);

  const verDetalle = (id) => {
    setCargando(true);
    fetch(`${API_URL}/editoriales/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSeleccionada(data);
        setCargando(false);
      })
      .catch(() => {
        setError("No se pudo cargar el detalle de la editorial.");
        setCargando(false);
      });
  };

  if (seleccionada) {
    return (
      <div>
        <button className="back" onClick={() => setSeleccionada(null)}>&larr; Volver a la lista</button>
        <div className="detail">
          <h1>{seleccionada.nombre}</h1>
          <p><strong>País:</strong> {seleccionada.pais}</p>
          <p>{seleccionada.descripcion}</p>
          <a className="btn" href="#" onClick={(e) => { e.preventDefault(); irAResenas(seleccionada); }}>
            Ver reseñas de esta editorial ⭐
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>🏢 Editoriales</h1>
      {cargando && <p>Cargando editoriales...</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && !error && (
        <div className="grid">
          {editoriales.map((e) => (
            <div className="card" key={e.id} onClick={() => verDetalle(e.id)}>
              <h3>{e.nombre}</h3>
              <p>{e.pais}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
