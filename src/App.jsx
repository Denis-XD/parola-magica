import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Welcome from "./pages/Welcome";
import GamePage from "./pages/GamePage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import Layout from "./components/Layout";
import { GameProvider } from "./context/GameContext";

function App() {
  return (
    <Router>
      <GameProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/welcome"
            element={
              <Layout>
                <Welcome />
              </Layout>
            }
          />
          <Route
            path="/game/:category"
            element={
              <Layout>
                <GamePage />
              </Layout>
            }
          />
          <Route
            path="/result"
            element={
              <Layout>
                <ResultPage />
              </Layout>
            }
          />
          <Route
            path="/history"
            element={
              <Layout>
                <HistoryPage />
              </Layout>
            }
          />
        </Routes>
      </GameProvider>
    </Router>
  );
}

export default App;
