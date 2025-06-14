import { useNavigate } from "react-router-dom";
import { useGameContext } from "../context/GameContext";
import { useEffect } from "react";
import "./Welcome.css";

const Welcome = () => {
  const navigate = useNavigate();
  const { startGame } = useGameContext();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCategorySelect = (category) => {
    startGame(category);
    navigate(`/game/${category}`);
  };

  return (
    <div className="welcome-container">
      <div className="welcome-background">
        <img
          src="/images/landing-background.png"
          alt="Fondo"
          className="background-image"
        />
      </div>

      <div className="welcome-content">
        <div className="welcome-image">
          <img
            src="/images/welcome-hero.png"
            alt="Parola Magica Hero"
            className="hero-image"
          />
        </div>

        <div className="categories-container">
          <div className="categories-title">
            <h2>Scegli una categoria per iniziare:</h2>
            <p className="title-translation">
              (Elige una categoría para comenzar:)
            </p>
          </div>

          <div className="categories-grid">
            <div
              className="category-card"
              onClick={() => handleCategorySelect("animali")}
            >
              <div className="category-icon">🐾</div>
              <h3>Animali</h3>
              <p>Aprende nombres de animales</p>
            </div>

            <div
              className="category-card"
              onClick={() => handleCategorySelect("colori")}
            >
              <div className="category-icon">🎨</div>
              <h3>Colori</h3>
              <p>Descubre los colores</p>
            </div>

            <div
              className="category-card"
              onClick={() => handleCategorySelect("oggetti")}
            >
              <div className="category-icon">🏠</div>
              <h3>Oggetti della casa</h3>
              <p>Objetos de la casa</p>
            </div>

            <div
              className="category-card"
              onClick={() => handleCategorySelect("vestiti")}
            >
              <div className="category-icon">👕</div>
              <h3>Vestiti</h3>
              <p>Aprende sobre la ropa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
