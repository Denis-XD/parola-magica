import { useEffect, useRef, useState } from "react";

export function useMicrofono(language = "it-IT") {
  const [resultado, setResultado] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Verifica compatibilidad
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Este navegador no soporta reconocimiento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false; // no mostrar resultados parciales
    recognition.continuous = false; // no continuar escuchando

    recognition.onresult = (event) => {
      const texto = event.results[0][0].transcript;
      console.log("Transcripción:", texto);
      setResultado(texto.toLowerCase());
    };

    recognition.onerror = (event) => {
      console.error("Error de reconocimiento:", event.error);
    };

    recognitionRef.current = recognition;
  }, [language]);

  const start = () => {
    if (!recognitionRef.current) return;

    setResultado("");

    // Solicitar permiso explícito
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        recognitionRef.current.start();
        console.log("🎤 Escuchando...");
      })
      .catch((err) => {
        alert("No se pudo acceder al micrófono.");
        console.error(err);
      });
  };

  const evaluar = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    return resultado;
  };

  return {
    resultado,
    start,
    evaluar,
  };
}
