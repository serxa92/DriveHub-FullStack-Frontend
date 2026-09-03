import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiDatabase } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";
import "./Footer.css";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer__container">
        <section className="footer__brand">
          <img src="/favicon.png" alt="DriveHub" className="footer__logo" />

          <div>
            <h2>DriveHub</h2>
            <p>{t.footerText}</p>
          </div>
        </section>

        <section>
          <h3>{t.footerNavigation}</h3>

          <nav>
            <Link to="/">{t.navHome}</Link>
            <Link to="/favorites">{t.navFavorites}</Link>
            <Link to="/contact">{t.navContact}</Link>
          </nav>
        </section>

        <section>
          <h3>{t.footerResources}</h3>

          <nav>
            <a
              href="https://github.com/serxa92"
              target="_blank"
              rel="noreferrer"
            >
              <FiGithub />
              GitHub
            </a>

            <a
              href="https://backend-q3pm.onrender.com/cars"
              target="_blank"
              rel="noreferrer"
            >
              <FiDatabase />
              API
            </a>

            <a
              href="https://www.linkedin.com/in/sergioagulla/"
              target="_blank"
              rel="noreferrer"
            >
              <FiLinkedin />
              LinkedIn
            </a>
          </nav>
        </section>
      </div>

      <div className="footer__bottom">
        <span>© 2026 Sergio Agulla</span>

        <span>{t.footerRights}</span>
      </div>
    </footer>
  );
};

export default Footer;
