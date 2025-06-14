import { useNavigate } from "react-router-dom";
import { useGameContext } from "../context/GameContext";
import { Trophy, Clock, Calendar, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import "./HistoryPage.css";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { gameHistory } = useGameContext();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatTime = (seconds) => {
    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryName = (category) => {
    switch (category) {
      case "animali":
        return "Animali (Animales)";
      case "colori":
        return "Colori (Colores)";
      case "oggetti":
        return "Oggetti della casa (Objetos de la casa)";
      case "vestiti":
        return "Vestiti (Ropa)";
      default:
        return category;
    }
  };

  return (
    <div className="history-page">
      <div className="history-background">
        <img
          src="/images/landing-background.png"
          alt="Fondo"
          className="background-image"
        />
      </div>

      <div className="history-content">
        <div className="history-header">
          <div className="back-button-container">
            <button
              className="back-button"
              onClick={() => navigate("/welcome")}
            >
              <ArrowLeft size={20} />
              <span className="button-main">Tornare</span>
            </button>
            <span className="button-translation">(Volver)</span>
          </div>
          <div className="history-title">
            <h1>Cronologia dei giochi</h1>
            <p className="title-translation">(Historial de juegos)</p>
          </div>
        </div>

        <div className="history-main-content">
          {gameHistory.length === 0 ? (
            <div className="empty-history">
              <div className="empty-message">
                <p className="message-main">
                  Non hai ancora giocato nessuna partita.
                </p>
                <p className="message-translation">
                  (Aún no has jugado ninguna partida.)
                </p>
              </div>
              <div className="start-button-container">
                <button className="start-button" onClick={() => navigate("/")}>
                  Inizia a giocare
                </button>
                <span className="button-translation">(Comenzar a jugar)</span>
              </div>
            </div>
          ) : (
            <div className="history-list-container">
              <div className="history-list-title">
                <h3>I tuoi risultati</h3>
                <p className="history-list-subtitle">(Tus resultados)</p>
              </div>

              <div className="history-list-scroll">
                <div className="history-list">
                  {gameHistory.map((game, index) => (
                    <div key={index} className="history-item">
                      <div className="history-item-header">
                        <h3>{getCategoryName(game.category)}</h3>
                        <div className="history-date">
                          <Calendar size={16} />
                          <span>{formatDate(game.endTime)}</span>
                        </div>
                      </div>

                      <div className="history-item-stats">
                        <div className="history-stat">
                          <Trophy size={20} />
                          <span>
                            {game.score}/{game.totalItems}
                          </span>
                        </div>

                        <div className="history-stat">
                          <Clock size={20} />
                          <span>{formatTime(game.duration)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
