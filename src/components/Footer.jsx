import "./Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {currentYear} Universidad Mayor de San Simón</p>
        <p>Proyecto Educativo - Parola Magica</p>
      </div>
    </footer>
  )
}

export default Footer
