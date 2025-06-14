import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { Trophy, Clock, Home, RefreshCw, ThumbsUp } from "lucide-react";
import "./ResultPage.css";
import StarRating from "../components/StarRating";
import MagicStarsEffect from "../components/MagicStarsEffect";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameResult = location.state?.gameResult;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!gameResult) {
      navigate("/");
    }
  }, [gameResult, navigate]);

  if (!gameResult) return null;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreMessage = () => {
    const percentage = (gameResult.score / gameResult.totalItems) * 100;

    if (percentage === 100)
      return {
        main: "Perfetto! Hai fatto tutto!",
        translation: "(¡Perfecto! ¡Lo has logrado todo!)",
      };
    if (percentage >= 80)
      return {
        main: "Molto bene! Quasi perfetto.",
        translation: "(¡Muy bien! Casi perfecto.)",
      };
    if (percentage >= 60)
      return {
        main: "Buon lavoro. Continua a praticare.",
        translation: "(Buen trabajo. Sigue practicando.)",
      };
    if (percentage >= 40)
      return {
        main: "Stai andando bene. Continua a provare.",
        translation: "(Vas por buen camino. Sigue intentándolo.)",
      };
    return {
      main: "Continua a praticare. Farai meglio la prossima volta!",
      translation: "(Sigue practicando. ¡Lo harás mejor la próxima vez!)",
    };
  };

  const getCategoryName = () => {
    switch (gameResult.category) {
      case "animali":
        return "Animali (Animales)";
      case "colori":
        return "Colori (Colores)";
      case "oggetti":
        return "Oggetti della casa (Objetos de la casa)";
      case "vestiti":
        return "Vestiti (Ropa)";
      default:
        return gameResult.category;
    }
  };

  const getAnimationSrc = () => {
    const percentage = (gameResult.score / gameResult.totalItems) * 100;

    if (percentage === 100)
      return "https://assets9.lottiefiles.com/packages/lf20_touohxv0.json"; // Trophy
    if (percentage >= 60)
      return "https://assets10.lottiefiles.com/packages/lf20_jbrw3hcz.json"; // Star
    return null; // We'll use ThumbsUp icon instead
  };

  const scoreMessage = getScoreMessage();
  const animationSrc = getAnimationSrc();

  return (
    <div className="result-page">
      <div className="result-background">
        <img
          src="/images/landing-background.png"
          alt="Fondo"
          className="background-image"
        />
      </div>

      <div className="result-content">
        <div className="result-container">
          <div className="result-title">
            <h1>Risultati</h1>
            <p className="title-translation">(Resultados)</p>
          </div>

          <div className="result-animation">
            {animationSrc ? (
              <Player
                autoplay
                loop
                src={animationSrc}
                style={{ height: "200px", width: "200px" }}
              />
            ) : (
              <div className="thumbs-up-icon">
                <ThumbsUp size={80} />
              </div>
            )}
          </div>

          <div className="result-details">
            <div className="result-card">
              <div className="result-header">
                <h2>{getCategoryName()}</h2>
                <div className="result-message">
                  <p className="message-main">{scoreMessage.main}</p>
                  <p className="message-translation">
                    {scoreMessage.translation}
                  </p>
                </div>
                <StarRating
                  score={gameResult.score}
                  totalItems={gameResult.totalItems}
                />
              </div>

              <div className="result-stats">
                <div className="stat-item">
                  <Trophy size={24} />
                  <div className="stat-content">
                    <div className="stat-label">
                      <span className="label-main">Punteggio</span>
                      <span className="label-translation">(Puntuación)</span>
                    </div>
                    <span className="stat-value">
                      {gameResult.score}/{gameResult.totalItems}
                    </span>
                  </div>
                </div>

                <div className="stat-item">
                  <Clock size={24} />
                  <div className="stat-content">
                    <div className="stat-label">
                      <span className="label-main">Tempo</span>
                      <span className="label-translation">(Tiempo)</span>
                    </div>
                    <span className="stat-value">
                      {formatTime(gameResult.duration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="result-actions">
            <div className="action-button-container">
              <button
                className="action-button home"
                onClick={() => navigate("/")}
              >
                <Home size={20} />
                <span className="button-main">Inizio</span>
              </button>
              <span className="button-translation">(Inicio)</span>
            </div>

            <div className="action-button-container">
              <button
                className="action-button play-again"
                onClick={() => navigate(`/game/${gameResult.category}`)}
              >
                <RefreshCw size={20} />
                <span className="button-main">Gioca di nuovo</span>
              </button>
              <span className="button-translation">(Jugar de nuevo)</span>
            </div>
          </div>
        </div>
        {gameResult.score === gameResult.totalItems && <MagicStarsEffect />}
      </div>
    </div>
  );
};

export default ResultPage;
