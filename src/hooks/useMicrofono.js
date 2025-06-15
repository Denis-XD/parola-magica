import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export function useMicrofono(language = "it-IT") {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [resultado, setResultado] = useState("");

  useEffect(() => {
    console.log("transcript:", transcript);
  }, [transcript]);

  const start = () => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Este navegador no soporta reconocimiento de voz.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        resetTranscript();
        setResultado("");
        console.log("Iniciando reconocimiento...");
        SpeechRecognition.startListening({
          language: "it-IT",
          continuous: false,
        });
        console.log("Reconocimiento iniciado");
      })
      .catch((err) => {
        alert("El acceso al micrófono fue denegado o falló.");
        console.error("Error al obtener el micrófono:", err);
      });
  };

  const evaluar = () => {
    SpeechRecognition.stopListening();
    const texto = transcript.toLowerCase();
    setResultado(texto);
    return texto;
  };

  return {
    resultado,
    start,
    evaluar,
  };
}
