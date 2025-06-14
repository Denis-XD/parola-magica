import { useState, useEffect } from "react"
import "./Countdown.css"

const Countdown = ({ onComplete }) => {
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Small delay before calling onComplete to show the logo
      const timer = setTimeout(() => {
        onComplete()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [count, onComplete])

  return (
    <div className="countdown-overlay">
      <div className="countdown-container">
        {count > 0 ? (
          <>
            <div className="countdown-number">{count}</div>
            <div className="italy-flag">
              <div className="flag-green"></div>
              <div className="flag-white"></div>
              <div className="flag-red"></div>
            </div>
          </>
        ) : (
          <>
            <div className="countdown-go">VAI!</div>
            <div className="countdown-logo">
              <img src="/images/logo.png" alt="Parola Magica" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Countdown
