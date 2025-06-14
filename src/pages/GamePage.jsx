import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMicrofono } from "../hooks/useMicrofono";
import { reproducirPalabra } from "../utils/voz";
import { useGameContext } from "../context/GameContext";
import { Mic, Check, X, Clock, Ear } from "lucide-react";
import "./GamePage.css";
import Countdown from "../components/Countdown";

// Game data
const gameData = {
  animali: [
    { id: "gatto", word: "Gatto", translation: "gato" },
    { id: "rana", word: "Rana", translation: "rana" },
    { id: "lupo", word: "Lupo", translation: "lobo" },
    { id: "topo", word: "Topo", translation: "ratón" },
    { id: "orso", word: "Orso", translation: "oso" },
  ],
  colori: [
    { id: "rosso", word: "Rosso", translation: "rojo" },
    { id: "giallo", word: "Giallo", translation: "amarillo" },
    { id: "verde", word: "Verde", translation: "verde" },
    { id: "blu", word: "Blu", translation: "azul" },
    { id: "nero", word: "Nero", translation: "negro" },
  ],
  oggetti: [
    { id: "letto", word: "Letto", translation: "cama" },
    { id: "sedia", word: "Sedia", translation: "silla" },
    { id: "porta", word: "Porta", translation: "puerta" },
    { id: "specchio", word: "Specchio", translation: "espejo" },
    { id: "tavolo", word: "Tavolo", translation: "mesa" },
  ],
  vestiti: [
    { id: "camicia", word: "Camicia", translation: "camisa" },
    { id: "giacca", word: "Giacca", translation: "chaqueta" },
    { id: "scarpa", word: "Scarpa", translation: "zapato" },
    { id: "maglia", word: "Maglia", translation: "polera" },
    { id: "cintura", word: "Cintura", translation: "cinturón" },
  ],
};

const GamePage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { currentGame, endGame } = useGameContext();
  const { resultado, start, evaluar } = useMicrofono("it-IT");

  const [items, setItems] = useState([]);
  const [unlockedItems, setUnlockedItems] = useState([]);
  const [dropZoneContents, setDropZoneContents] = useState({}); // {zoneId: itemId}
  const [listeningFor, setListeningFor] = useState(null);
  const [feedback, setFeedback] = useState({
    show: false,
    correct: false,
    word: "",
  });
  const [timer, setTimer] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [showCountdown, setShowCountdown] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const timerRef = useRef(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Initialize game
  useEffect(() => {
    if (!gameData[category]) {
      navigate("/");
      return;
    }

    // Shuffle items
    const shuffledItems = [...gameData[category]].sort(
      () => Math.random() - 0.5
    );
    setItems(shuffledItems);

    // Start timer only when game has started
    if (gameStarted) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [category, navigate, gameStarted]);

  // Check speech recognition result
  useEffect(() => {
    if (resultado && listeningFor) {
      const currentItem = items.find((item) => item.id === listeningFor);

      if (currentItem) {
        const isCorrect = resultado
          .toLowerCase()
          .includes(currentItem.word.toLowerCase());

        setFeedback({
          show: true,
          correct: isCorrect,
          word: currentItem.word,
        });

        if (isCorrect && !unlockedItems.includes(listeningFor)) {
          setUnlockedItems((prev) => [...prev, listeningFor]);
        }

        // Hide feedback after 2 seconds
        setTimeout(() => {
          setFeedback({ show: false, correct: false, word: "" });
          setListeningFor(null);
          setIsListening(false);
        }, 2000);
      }
    }
  }, [resultado, listeningFor, items, unlockedItems]);

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setGameStarted(true);
  };

  const handleItemClick = (itemId) => {
    if (!gameStarted) return;
    reproducirPalabra(category, itemId);
  };

  const handleMicClick = (itemId) => {
    if (!gameStarted) return;
    setListeningFor(itemId);
    setIsListening(true);
    start();
  };

  const handleMicStop = () => {
    evaluar();
    setIsListening(false);
  };

  const isItemPlaced = (itemId) => {
    return Object.values(dropZoneContents).includes(itemId);
  };

  const handleDragStart = (e, itemId) => {
    if (!unlockedItems.includes(itemId) || isItemPlaced(itemId)) return;

    dragItem.current = itemId;
    e.target.classList.add("dragging");
  };

  const handleDragOver = (e, targetZoneId) => {
    e.preventDefault();
    dragOverItem.current = targetZoneId;
  };

  const handleDrop = (e, targetZoneId) => {
    e.preventDefault();

    const draggedItemId = dragItem.current;

    if (draggedItemId && !dropZoneContents[targetZoneId]) {
      // Place item in the drop zone
      setDropZoneContents((prev) => ({
        ...prev,
        [targetZoneId]: draggedItemId,
      }));
    }

    document.querySelectorAll(".dragging").forEach((el) => {
      el.classList.remove("dragging");
    });

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleFinish = () => {
    clearInterval(timerRef.current);

    // Calculate correct matches
    let correctMatches = 0;
    Object.entries(dropZoneContents).forEach(([zoneId, itemId]) => {
      if (zoneId === itemId) {
        correctMatches++;
      }
    });

    const gameResult = endGame(correctMatches);
    navigate("/result", { state: { gameResult } });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="game-page">
      <div className="game-background">
        <img
          src="/images/landing-background.png"
          alt="Fondo"
          className="background-image"
        />
      </div>

      <div className="game-content">
        <div className="game-timer">
          <Clock size={20} />
          <span>{formatTime(timer)}</span>
        </div>

        <div className="game-area">
          <div className="items-container">
            <div className="section-title">
              <h2>Ascolta e pronuncia le parole</h2>
              <p className="section-subtitle">
                (Escucha y pronuncia las palabras)
              </p>
            </div>
            <div className="items-grid">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`item-card ${
                    isItemPlaced(item.id) ? "placed" : ""
                  }`}
                  draggable={
                    unlockedItems.includes(item.id) && !isItemPlaced(item.id)
                  }
                  onDragStart={(e) => handleDragStart(e, item.id)}
                >
                  <div
                    className="item-image"
                    onClick={() => handleItemClick(item.id)}
                  >
                    <img
                      src={`/images/${category}/${item.id}.png`}
                      alt={item.word}
                    />
                    {!unlockedItems.includes(item.id) && (
                      <div className="lock-overlay">
                        <div className="lock-icon">🔒</div>
                      </div>
                    )}
                  </div>
                  <div className="item-controls">
                    <button
                      className={`mic-button ${
                        isListening && listeningFor === item.id
                          ? "listening"
                          : ""
                      }`}
                      onClick={() =>
                        isListening ? handleMicStop() : handleMicClick(item.id)
                      }
                    >
                      <Mic size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {feedback.show && (
            <div
              className={`feedback-container ${
                feedback.correct ? "correct" : "incorrect"
              }`}
            >
              {feedback.correct ? (
                <>
                  <Check size={40} />
                  <p className="feedback-main">Corretto!</p>
                  <p className="feedback-translation">(¡Correcto!)</p>
                </>
              ) : (
                <>
                  <X size={40} />
                  <p className="feedback-main">Riprova!</p>
                  <p className="feedback-translation">(Intenta de nuevo)</p>
                </>
              )}
            </div>
          )}

          <div className="drop-container">
            <div className="section-title">
              <h2>Trascina le immagini al posto giusto</h2>
              <p className="section-subtitle">
                (Arrastra las imágenes a su lugar correcto)
              </p>
            </div>
            <div className="drop-zones">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`drop-zone ${
                    dropZoneContents[item.id] ? "filled" : ""
                  }`}
                  onDragOver={(e) => handleDragOver(e, item.id)}
                  onDrop={(e) => handleDrop(e, item.id)}
                >
                  <div className="drop-zone-label">{item.word}</div>
                  {dropZoneContents[item.id] && (
                    <div className="dropped-item">
                      <img
                        src={`/images/${category}/${
                          dropZoneContents[item.id]
                        }.png`}
                        alt={dropZoneContents[item.id]}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="game-actions">
            <div className="finish-button-container">
              <button className="finish-button" onClick={handleFinish}>
                Finire
              </button>
              <span className="button-translation">(Terminar)</span>
            </div>
          </div>
        </div>

        {isListening && (
          <div className="listening-animation">
            <div className="listening-icon">
              <Ear size={60} />
            </div>
            <p>Ascoltando...</p>
            <p className="listening-subtitle">(Escuchando...)</p>
          </div>
        )}
        {showCountdown && <Countdown onComplete={handleCountdownComplete} />}
      </div>
    </div>
  );
};

export default GamePage;
