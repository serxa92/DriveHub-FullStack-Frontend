import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./Navbar.css";

const languages = [
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const { language, changeLanguage, t } = useLanguage();

  const currentLanguage =
    languages.find((item) => item.code === language) || languages[0];

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsLangOpen(false);
  };

  const toggleLanguageMenu = () => {
    setIsLangOpen((prev) => !prev);
    setIsMenuOpen(false);
  };

  const handleLanguageChange = (code) => {
    changeLanguage(code);
    setIsLangOpen(false);
  };

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsLangOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={closeMenu}>
  <img
    className="navbar__logo"
    src="/favicon.png"
    alt="DriveHub"
  />

  <span className="navbar__brand-name">
    DriveHub
  </span>
</NavLink>

        <nav className={`navbar__nav ${isMenuOpen ? "is-open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            {t.navCars}
          </NavLink>

          <NavLink to="/favorites" onClick={closeMenu}>
            {t.navFavorites}
          </NavLink>

          <NavLink to="/contact" onClick={closeMenu}>
            {t.navContact}
          </NavLink>
        </nav>

        <div className="navbar__actions">
          <div className="language-selector">
            <button
              type="button"
              className="language-selector__button"
              onClick={toggleLanguageMenu}
              aria-expanded={isLangOpen}
              aria-label="Select language"
            >
              <span>{currentLanguage.short}</span>
              <span
                className={`language-selector__chevron ${
                  isLangOpen ? "is-open" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {isLangOpen && (
              <div className="language-selector__menu">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    className={item.code === language ? "is-active" : ""}
                    onClick={() => handleLanguageChange(item.code)}
                  >
                    <span>{item.short}</span>
                    <small>{item.label}</small>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className={`navbar__toggle ${isMenuOpen ? "is-open" : ""}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;