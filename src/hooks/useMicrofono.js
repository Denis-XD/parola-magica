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
    recognition.continuous = false;

    recognition.onstart = () => {
      setEscuchando(true);
      console.log("🎤 Reconocimiento iniciado");
    };

    recognition.onresult = (event) => {
      const texto = event.results[0][0].transcript;
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

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        // Espera mínima en móviles para asegurar activación
        setTimeout(() => {
          recognitionRef.current.start();
          console.log("🎤 Escuchando...");
        }, 200); // puedes probar subirlo a 500ms si no activa
      })
      .catch((err) => {
        alert("No se pudo acceder al micrófono.");
        console.error(err);
      });
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
