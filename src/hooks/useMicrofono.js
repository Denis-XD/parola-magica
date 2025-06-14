import { useState } from "react"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"

export function useMicrofono(language = "it-IT") {
  const { transcript, resetTranscript } = useSpeechRecognition()
  const [resultado, setResultado] = useState("")

  const start = () => {
    resetTranscript()
    setResultado("")
    SpeechRecognition.startListening({ language })
  }

  const evaluar = () => {
    SpeechRecognition.stopListening()
    const texto = transcript.toLowerCase()
    setResultado(texto)
    return texto
  }

  return {
    resultado,
    start,
    evaluar,
  }
}
