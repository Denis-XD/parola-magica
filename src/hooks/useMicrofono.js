import { useEffect, useRef, useState } from "react";

export function useMicrofono(language = "it-IT") {
  const [resultado, setResultado] = useState("");
  const [escuchando, setEscuchando] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Este navegador no soporta reconocimiento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.continuous = true; // importante en móvil
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setEscuchando(true);
      console.log("🎤 Reconocimiento iniciado");
    };

    recognition.onresult = (event) => {
      const texto = event.results[event.results.length - 1][0].transcript;
      console.log("📝 Transcripción:", texto);
      setResultado(texto.toLowerCase());
    };

    recognition.onerror = (event) => {
      console.error("❌ Error de reconocimiento:", event.error);
    };

    recognition.onend = () => {
      setEscuchando(false);
      console.log("🛑 Reconocimiento detenido");
    };

    recognitionRef.current = recognition;
  }, [language]);

  const start = () => {
    if (!recognitionRef.current) return;

    setResultado("");

    try {
      recognitionRef.current.start(); // no getUserMedia
    } catch (err) {
      console.error("❗️ Error al iniciar reconocimiento:", err);
    }
  };

  const evaluar = () => {
    if (recognitionRef.current && escuchando) {
      recognitionRef.current.stop();
    }
    return resultado;
  };

  return {
    resultado,
    start,
    evaluar,
    escuchando,
  };
}
