import { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export function useMicrofono(language = "it-IT") {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [resultado, setResultado] = useState("");

  const start = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        resetTranscript();
        setResultado("");
        SpeechRecognition.startListening({ language: "it-IT" });
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
