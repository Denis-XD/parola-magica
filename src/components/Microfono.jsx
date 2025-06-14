import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function Microfono({ palabra, onEvaluar }) {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [resultado, setResultado] = useState("");

  const start = () => {
    resetTranscript();
    setResultado("");
    SpeechRecognition.startListening({ language: "it-IT" });
  };

  const evaluar = () => {
    SpeechRecognition.stopListening();
    const texto = transcript.toLowerCase();
    setResultado(texto); // guardar lo dicho en este componente
    onEvaluar(texto);
  };

  return (
    <div>
      <button className="btn btn-outline-primary me-2" onClick={start}>
        🎤 Habla
      </button>
      <button className="btn btn-success" onClick={evaluar}>
        ✔️ Evaluar
      </button>
      <p className="mt-2">
        Dijiste: <strong>{resultado}</strong>
      </p>
    </div>
  );
}
