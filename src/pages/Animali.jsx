import { useState } from "react";
import { reproducirPalabra } from "../utils/voz";
import { useProgreso } from "../store/useProgreso";
import { sonidoGanar, sonidoError } from "../utils/sonidos";
import { useMicrofono } from "../hooks/useMicrofono";

const palabras = ["gatto", "rana", "lupo", "topo", "orso"];

export default function Animali() {
  const { completar, progreso } = useProgreso();
  const [palabraActual, setPalabraActual] = useState(null);

  const {
    resultado,
    start,
    evaluar
  } = useMicrofono("it-IT");

  const manejarEvaluacion = (palabra) => {
    const dicho = evaluar();
    if (dicho.includes(palabra)) {
      completar("Animali", palabra);
      sonidoGanar.play();
    } else {
      sonidoError.play();
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2>🦁 Categoria: Animali</h2>
      {palabras.map((palabra) => (
        <div key={palabra} className="mb-4">
          <h3>{palabra}</h3>
          <button
            className="btn btn-warning me-3"
            onClick={() => reproducirPalabra("animali", palabra)}
          >
            🔊 Escuchar
          </button>
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => {
              setPalabraActual(palabra);
              start();
            }}
          >
            🎤 Habla
          </button>
          <button
            className="btn btn-success"
            onClick={() => manejarEvaluacion(palabra)}
          >
            ✔️ Evaluar
          </button>
          <p className="mt-2">
            Dijiste: <strong>{palabra === palabraActual ? resultado : ""}</strong>
          </p>
          <p>
            ✅ {progreso.Animali.includes(palabra) ? "Completado" : "Pendiente"}
          </p>
        </div>
      ))}
    </div>
  );
}
