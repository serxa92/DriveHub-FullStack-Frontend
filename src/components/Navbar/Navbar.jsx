import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
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
  const { user, isAuthenticated, logout } = useAuth();

  const currentLanguage =
    languages.find((item) => item.code === language) || languages[0];

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Dejamos abierto solo uno de los dos menús.
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

  const handleLogout = () => {
    logout();
    closeMenu();
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

          {user?.role === "admin" && (
            <NavLink to="/admin" onClick={closeMenu}>
              {t.navAdmin}
            </NavLink>
          )}

          <span className="navbar__auth-divider" />

          {isAuthenticated ? (
            <>
              <span className="navbar__user" title={user.email}>
                {user.image ? (
                  <img src={user.image} alt="" />
                ) : (
                  <FiUser aria-hidden="true" />
                )}
                <span>{user.username}</span>
              </span>
              <button className="navbar__logout" type="button" onClick={handleLogout}>
                <FiLogOut aria-hidden="true" />
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                {t.login}
              </NavLink>
              <NavLink className="navbar__register" to="/register" onClick={closeMenu}>
                {t.register}
              </NavLink>
            </>
          )}
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