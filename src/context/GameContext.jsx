import { createContext, useState, useContext, useEffect } from "react"

const GameContext = createContext()

export const useGameContext = () => useContext(GameContext)

export const GameProvider = ({ children }) => {
  const [gameHistory, setGameHistory] = useState(() => {
    const saved = localStorage.getItem("gameHistory")
    return saved ? JSON.parse(saved) : []
  })

  const [currentGame, setCurrentGame] = useState({
    category: "",
    startTime: null,
    endTime: null,
    score: 0,
    totalItems: 5,
  })

  useEffect(() => {
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory))
  }, [gameHistory])

  const startGame = (category) => {
    setCurrentGame({
      category,
      startTime: new Date(),
      endTime: null,
      score: 0,
      totalItems: 5,
    })
  }

  const endGame = (score) => {
    const endTime = new Date()
    const updatedGame = {
      ...currentGame,
      endTime,
      score,
      duration: (endTime - currentGame.startTime) / 1000, // in seconds
    }

    setCurrentGame(updatedGame)
    setGameHistory((prev) => [updatedGame, ...prev])

    return updatedGame
  }

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
  )
}
