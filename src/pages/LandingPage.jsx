import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);

  const handleStart = () => {
    navigate("/welcome");
  };

  const handleInstructions = () => {
    setShowInstructions(true);
  };

  const closeInstructions = () => {
    setShowInstructions(false);
  };

  return (
    <div className="landing-page">
      <div className="landing-background">
        <img
          src="/images/landing-background.png"
          alt="Fondo"
          className="background-image"
        />
      </div>

      <div className="landing-content">
        <div className="landing-logo">
          <img
            src="/images/logo.png"
            alt="Parola Magica Logo"
            className="logo-image"
          />
        </div>

        <div className="landing-header">
          <h1>¡Bienvenido a Parola Magica! - Palabra Mágica</h1>
        </div>

        <div className="project-info">
          <div className="authors-section">
            <h3>
              Autores:{" "}
              <span className="authors-names">
                Marcelo Brun De La Fuente, Zaida Mallcu Calani
              </span>
            </h3>
          </div>

          <div className="subject-section">
            <h3>
              Materia: <span>Linguistica</span>
            </h3>
          </div>

          <div className="university-section">
            <h2>Universidad Mayor de San Simón</h2>
          </div>
        </div>

        <div className="landing-buttons">
          <div className="button-container">
            <button
              className="landing-button start-button"
              onClick={handleStart}
            >
              COMINCIA
            </button>
            <span className="button-translation">(Comenzar)</span>
          </div>

          <div className="button-container">
            <button
              className="landing-button instructions-button"
              onClick={handleInstructions}
            >
              INSTRUZIONI
            </button>
            <span className="button-translation">(Instrucciones)</span>
          </div>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="instructions-modal-overlay" onClick={closeInstructions}>
          <div
            className="instructions-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Instrucciones del Juego</h2>
              <button className="close-button" onClick={closeInstructions}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-content">
              <div className="instructions-content">
                <div className="age-info">
                  <h3>Edad recomendada: 8 a 10 años</h3>
                </div>

                <h3>Instrucciones:</h3>

                <p className="intro-text">
                  Para empezar a jugar el niño debe escoger entre las cuatro
                  categorías que aparecen al principio (animali, colori,
                  vestiti, oggetti della casa). Cuando el niño escoja una
                  categoría el tiempo empieza a correr y tiene que realizar lo
                  siguiente:
                </p>

                <div className="instruction-section">
                  <h4>Escucha y pronuncia</h4>
                  <ul>
                    <li>
                      En la parte superior aparecerán cinco imágenes de la
                      categoría que escogió y en la parte inferior aparecerán
                      cinco palabras correspondientes a las imágenes de la parte
                      superior.
                    </li>
                    <li>
                      El niño presiona una imagen y se le dice el nombre de la
                      imagen en italiano, por ejemplo el niño presiona en la
                      imagen "gatto" y puede escuchar la pronunciación de la
                      palabra "gatto".
                    </li>
                    <li>
                      A continuación, cuando el niño escucha la palabra
                      correspondiente a la imagen debe pronunciar la palabra, si
                      el sonido pronunciado por el niño coincide con la correcta
                      pronunciación de la palabra se desbloqueará la imagen.
                    </li>
                  </ul>
                </div>

                <div className="instruction-section">
                  <h4>Arrastra las imágenes</h4>
                  <ul>
                    <li>
                      Cuando el niño desbloquee una imagen, deberá arrastrarla
                      hacia la palabra correspondiente que aparece en la parte
                      inferior. Es importante tener en cuenta que, una vez
                      colocada, la imagen quedará fija en ese lugar y no podrá
                      ser movida nuevamente.
                    </li>
                    <li>
                      Las palabras de la parte inferior no aparecen en el mismo
                      orden que las imágenes, por lo que el niño gracias a la
                      pronunciación de las imágenes tiene que asociar estas
                      imágenes con la escritura de las palabras.
                    </li>
                  </ul>
                </div>

                <div className="instruction-section">
                  <h4>¿Cómo se gana cada categoría?</h4>
                  <ul>
                    <li>
                      Cuando el niño pronuncie correctamente la palabra y
                      arrastre la imagen hacia la palabra correspondiente se
                      gana un punto y así sucesivamente hasta completar las
                      cinco palabras, una vez terminadas las cinco palabras se
                      le da a finalizar. Si no se equivocó en ninguna palabra el
                      niño obtendrá un 5/5 ya que cada palabra vale 1 punto.
                    </li>
                    <li>
                      Tiene que tratar de realizar el juego en el menor tiempo
                      posible, ya que desde que se escoge una categoría el
                      tiempo empieza a correr.
                    </li>
                    <li>
                      Al finalizar el juego hay un historial donde el niño puede
                      ir comparando cuál fue su menor tiempo y cuántas acertó en
                      cada juego.
                    </li>
                  </ul>
                </div>

                <div className="note-section">
                  <h4>Nota:</h4>
                  <ul>
                    <li>
                      En dispositivo móvil toque y mantenga presionado en la
                      parte inferior de la figura para arrastrarla al lugar
                      correcto.
                    </li>
                    <li>
                      Al usar el micrófono, hable de forma clara, rápida y con
                      buena pronunciación.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
