import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMicrofono } from "../hooks/useMicrofono";
import { reproducirPalabra } from "../utils/voz";
import { useGameContext } from "../context/GameContext";
import { Mic, Check, X, Clock, Ear, ChevronRight } from "lucide-react";
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
  const [dropZoneItems, setDropZoneItems] = useState([]);
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
  const [currentItemIndex, setCurrentItemIndex] = useState(2); // Start at middle item (index 2)
  const [currentDropIndex, setCurrentDropIndex] = useState(2); // Start at middle drop zone
  const [isDragging, setIsDragging] = useState(false);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const timerRef = useRef(null);
  const gameStartTimeRef = useRef(null);
  const itemsScrollRef = useRef(null);
  const dropScrollRef = useRef(null);
  const autoScrollRef = useRef(null);
  const dragPositionRef = useRef({ x: 0, y: 0 });

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

    // Shuffle items for top section
    const shuffledItems = [...gameData[category]].sort(
      () => Math.random() - 0.5
    );
    setItems(shuffledItems);

    // Create a different shuffle for drop zones
    const shuffledDropZones = [...gameData[category]].sort(
      () => Math.random() - 0.5
    );
    setDropZoneItems(shuffledDropZones);
  }, [category, navigate]);

  // Timer management - simplified
  useEffect(() => {
    if (gameStarted) {
      // Set start time
      gameStartTimeRef.current = Date.now();

      // Start timer
      timerRef.current = setInterval(() => {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor(
          (currentTime - gameStartTimeRef.current) / 1000
        );
        setTimer(elapsedSeconds);
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameStarted]);

  // Scroll to center item on mobile when game starts
  useEffect(() => {
    if (gameStarted && window.innerWidth <= 768) {
      setTimeout(() => {
        scrollToCenter();
      }, 500);
    }
  }, [gameStarted]);

  // Handle scroll events for carousel indicators
  useEffect(() => {
    const handleItemsScroll = () => {
      if (itemsScrollRef.current && window.innerWidth <= 768) {
        const scrollLeft = itemsScrollRef.current.scrollLeft;
        const itemWidth = 215; // 200px + 15px gap
        const index = Math.round(scrollLeft / itemWidth);
        setCurrentItemIndex(Math.max(0, Math.min(4, index)));
      }
    };

    const handleDropScroll = () => {
      if (dropScrollRef.current && window.innerWidth <= 768) {
        const scrollLeft = dropScrollRef.current.scrollLeft;
        const itemWidth = 215; // 200px + 15px gap
        const index = Math.round(scrollLeft / itemWidth);
        setCurrentDropIndex(Math.max(0, Math.min(4, index)));
      }
    };

    const itemsContainer = itemsScrollRef.current;
    const dropContainer = dropScrollRef.current;

    if (itemsContainer) {
      itemsContainer.addEventListener("scroll", handleItemsScroll);
    }
    if (dropContainer) {
      dropContainer.addEventListener("scroll", handleDropScroll);
    }

    return () => {
      if (itemsContainer) {
        itemsContainer.removeEventListener("scroll", handleItemsScroll);
      }
      if (dropContainer) {
        dropContainer.removeEventListener("scroll", handleDropScroll);
      }
    };
  }, []);

  // Auto-scroll functionality
  const startAutoScroll = (direction) => {
    if (autoScrollRef.current) return; // Already scrolling

    const scrollSpeed = 3; // pixels per frame
    const scroll = () => {
      if (dropScrollRef.current && isDragging) {
        const currentScroll = dropScrollRef.current.scrollLeft;
        const maxScroll =
          dropScrollRef.current.scrollWidth - dropScrollRef.current.clientWidth;

        if (direction === "left" && currentScroll > 0) {
          dropScrollRef.current.scrollLeft = Math.max(
            0,
            currentScroll - scrollSpeed
          );
        } else if (direction === "right" && currentScroll < maxScroll) {
          dropScrollRef.current.scrollLeft = Math.min(
            maxScroll,
            currentScroll + scrollSpeed
          );
        }

        if (isDragging) {
          autoScrollRef.current = requestAnimationFrame(scroll);
        }
      }
    };
    autoScrollRef.current = requestAnimationFrame(scroll);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  const handleDragPosition = (clientX, clientY) => {
    if (!dropScrollRef.current || window.innerWidth > 768) return;

    const dropContainer = dropScrollRef.current;
    const rect = dropContainer.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const containerWidth = rect.width;

    // Define scroll zones (20% on each side)
    const scrollZoneWidth = containerWidth * 0.2;
    const leftZone = scrollZoneWidth;
    const rightZone = containerWidth - scrollZoneWidth;

    stopAutoScroll(); // Stop any existing auto-scroll

    if (relativeX < leftZone) {
      // Left scroll zone
      startAutoScroll("left");
    } else if (relativeX > rightZone) {
      // Right scroll zone
      startAutoScroll("right");
    }
    // Center zone - no auto-scroll
  };

  const scrollToCenter = () => {
    if (itemsScrollRef.current) {
      const itemWidth = 215; // 200px + 15px gap
      itemsScrollRef.current.scrollTo({
        left: itemWidth * 2, // Scroll to 3rd item (index 2)
        behavior: "smooth",
      });
    }
    if (dropScrollRef.current) {
      const itemWidth = 215;
      dropScrollRef.current.scrollTo({
        left: itemWidth * 2,
        behavior: "smooth",
      });
    }
  };

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
    setIsDragging(true);
    e.target.classList.add("dragging");

    // Store initial position
    dragPositionRef.current = {
      x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
      y: e.clientY || (e.touches && e.touches[0].clientY) || 0,
    };
  };

  const handleDragOver = (e, targetZoneId) => {
    e.preventDefault();
    dragOverItem.current = targetZoneId;

    // Handle auto-scroll on drag over
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (clientX && clientY) {
      handleDragPosition(clientX, clientY);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    stopAutoScroll();

    document.querySelectorAll(".dragging").forEach((el) => {
      el.classList.remove("dragging");
    });

    dragItem.current = null;
    dragOverItem.current = null;
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

    handleDragEnd();
  };

  // Touch event handlers for mobile devices
  const handleTouchStart = (e, itemId) => {
    if (!unlockedItems.includes(itemId) || isItemPlaced(itemId)) return;

    dragItem.current = itemId;
    setIsDragging(true);

    const touch = e.touches[0];
    dragPositionRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !dragItem.current) return;

    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];

    // Handle auto-scroll
    handleDragPosition(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e) => {
    if (!isDragging || !dragItem.current) return;

    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );

    // Find the drop zone
    let dropZone = elementBelow;
    while (dropZone && !dropZone.classList.contains("drop-zone")) {
      dropZone = dropZone.parentElement;
    }

    if (dropZone) {
      const targetZoneId = dropZone.getAttribute("data-zone-id");
      if (targetZoneId && !dropZoneContents[targetZoneId]) {
        setDropZoneContents((prev) => ({
          ...prev,
          [targetZoneId]: dragItem.current,
        }));
      }
    }

    handleDragEnd();
  };

  const handleFinish = () => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop any auto-scroll
    stopAutoScroll();

    // Calculate final time
    const endTime = Date.now();
    const finalDuration = Math.floor(
      (endTime - gameStartTimeRef.current) / 1000
    );

    // Calculate correct matches
    let correctMatches = 0;
    Object.entries(dropZoneContents).forEach(([zoneId, itemId]) => {
      if (zoneId === itemId) {
        correctMatches++;
      }
    });

    const gameResult = endGame(correctMatches, finalDuration);
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
            <div className="items-grid" ref={itemsScrollRef}>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`item-card ${
                    isItemPlaced(item.id) ? "placed" : ""
                  } ${
                    window.innerWidth <= 768 && index === currentItemIndex
                      ? "center-item"
                      : ""
                  }`}
                  draggable={
                    unlockedItems.includes(item.id) && !isItemPlaced(item.id)
                  }
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={(e) => handleTouchStart(e, item.id)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
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
            {window.innerWidth <= 768 && (
              <>
                <div className="carousel-indicators">
                  {items.map((_, index) => (
                    <div
                      key={index}
                      className={`carousel-dot ${
                        index === currentItemIndex ? "active" : ""
                      }`}
                    />
                  ))}
                </div>
                <div className="swipe-hint">
                  <span>Desliza para ver más</span>
                  <ChevronRight className="swipe-hint-icon" size={16} />
                </div>
              </>
            )}
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
            <div
              className="drop-zones"
              ref={dropScrollRef}
              onDragOver={(e) => {
                e.preventDefault();
                const clientX = e.clientX;
                const clientY = e.clientY;
                if (clientX && clientY) {
                  handleDragPosition(clientX, clientY);
                }
              }}
            >
              {dropZoneItems.map((item, index) => (
                <div
                  key={item.id}
                  data-zone-id={item.id}
                  className={`drop-zone ${
                    dropZoneContents[item.id] ? "filled" : ""
                  } ${
                    window.innerWidth <= 768 && index === currentDropIndex
                      ? "center-zone"
                      : ""
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
            {window.innerWidth <= 768 && (
              <>
                <div className="carousel-indicators">
                  {dropZoneItems.map((_, index) => (
                    <div
                      key={index}
                      className={`carousel-dot ${
                        index === currentDropIndex ? "active" : ""
                      }`}
                    />
                  ))}
                </div>
                <div className="swipe-hint">
                  <span>Desliza para ver más</span>
                  <ChevronRight className="swipe-hint-icon" size={16} />
                </div>
              </>
            )}
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
