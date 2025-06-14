import { useEffect, useState } from "react"
import "./MagicStarsEffect.css"

const MagicStarsEffect = () => {
  const [stars, setStars] = useState([])

  useEffect(() => {
    const generateStars = () => {
      const newStars = []
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          left: Math.random() * 100,
          animationDelay: Math.random() * 3,
          size: Math.random() * 20 + 10,
        })
      }
      setStars(newStars)
    }

    generateStars()
  }, [])

  return (
    <div className="magic-stars-overlay">
      {stars.map((star) => (
        <div
          key={star.id}
          className="magic-star"
          style={{
            left: `${star.left}%`,
            animationDelay: `${star.animationDelay}s`,
            fontSize: `${star.size}px`,
          }}
        >
          ⭐
        </div>
      ))}
    </div>
  )
}

export default MagicStarsEffect
