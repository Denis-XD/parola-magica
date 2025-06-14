import "./StarRating.css"

const StarRating = ({ score, totalItems }) => {
  const stars = []

  for (let i = 0; i < totalItems; i++) {
    stars.push(
      <div key={i} className={`star ${i < score ? "filled" : "empty"}`} style={{ animationDelay: `${i * 0.2}s` }}>
        ⭐
      </div>,
    )
  }

  return <div className="star-rating">{stars}</div>
}

export default StarRating
