import { useLocation } from "react-router-dom";
import { Home, Clock, Grid3X3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useGameContext } from "../context/GameContext";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const { currentGame } = useGameContext();

  // Only show game info on game page
  const showGameInfo = location.pathname.includes("/game");

  const getCategoryInfo = () => {
    switch (currentGame.category) {
      case "animali":
        return {
          title: "Animali",
          objective: "Practica sonidos /r/, /s/, /l/",
        };
      case "colori":
        return {
          title: "Colori",
          objective: "Practica sonidos /r/, /s/",
        };
      case "oggetti":
        return {
          title: "Oggetti della casa",
          objective: "Practica sonidos /k/, /l/, /r/, /s/",
        };
      case "vestiti":
        return {
          title: "Vestiti",
          objective: "Practica sonidos /l/, /r/, /tʃ/, /z/",
        };
      default:
        return { title: "", objective: "" };
    }
  };

  const categoryInfo = getCategoryInfo();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img
            src="/images/logo.png"
            alt="Parola Magica"
            className="header-logo"
          />
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            <Home size={24} />
            <span>Inicio</span>
          </Link>
          <Link to="/welcome" className="nav-link">
            <Grid3X3 size={24} />
            <span>Categorías</span>
          </Link>
          <Link to="/history" className="nav-link">
            <Clock size={24} />
            <span>Historial</span>
          </Link>
        </div>

        {showGameInfo && (
          <div className="game-info">
            <div className="info-item">
              <span className="info-label">Categoría:</span>
              <span className="info-value">{categoryInfo.title}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Objetivo:</span>
              <span className="info-value">{categoryInfo.objective}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
