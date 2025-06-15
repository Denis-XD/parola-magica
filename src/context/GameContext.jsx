import { createContext, useState, useContext, useEffect } from "react";

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameHistory, setGameHistory] = useState(() => {
    const saved = localStorage.getItem("gameHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentGame, setCurrentGame] = useState({
    category: "",
    startTime: null,
    endTime: null,
    score: 0,
    totalItems: 5,
    duration: 0,
  });

  useEffect(() => {
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
  }, [gameHistory]);

  const startGame = (category) => {
    setCurrentGame({
      category,
      startTime: new Date(),
      endTime: null,
      score: 0,
      totalItems: 5,
      duration: 0,
    });
  };

  const endGame = (score, durationInSeconds = null) => {
    const endTime = new Date();
    let finalDuration = durationInSeconds;

    // If no duration provided, calculate from start time
    if (finalDuration === null) {
      finalDuration = Math.floor((endTime - currentGame.startTime) / 1000);
    }

    const updatedGame = {
      ...currentGame,
      endTime,
      score,
      duration: finalDuration, // duration in seconds
    };

    setCurrentGame(updatedGame);
    setGameHistory((prev) => [updatedGame, ...prev]);

    return updatedGame;
  };

  return (
    <GameContext.Provider
      value={{
        gameHistory,
        currentGame,
        startGame,
        endGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
