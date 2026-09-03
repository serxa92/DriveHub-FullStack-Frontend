import { FiActivity, FiArrowRight, FiLock, FiTruck, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import "./Admin.css";

const Admin = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <span>{t.adminEyebrow}</span>
        <h1>{t.adminTitle}</h1>
        <p>{t.adminWelcome.replace("{{username}}", user.username)}</p>
      </header>

      <section className="admin-summary" aria-label={t.adminSummary}>
        <article className="admin-summary__card">
          <FiUser aria-hidden="true" />
          <div>
            <span>{t.adminAccount}</span>
            <strong>{user.email}</strong>
          </div>
        </article>

        <article className="admin-summary__card">
          <FiLock aria-hidden="true" />
          <div>
            <span>{t.adminAccess}</span>
            <strong>{t.adminRole}</strong>
          </div>
        </article>

        <article className="admin-summary__card">
          <FiActivity aria-hidden="true" />
          <div>
            <span>{t.adminStatus}</span>
            <strong>{t.adminReady}</strong>
          </div>
        </article>
      </section>

      <Link className="admin-placeholder admin-module" to="/admin/cars">
        <FiTruck aria-hidden="true" />
        <div>
          <h2>{t.adminInventoryTitle}</h2>
          <p>{t.adminInventoryText}</p>
        </div>
        <span>
          {t.adminInventoryOpen}
          <FiArrowRight aria-hidden="true" />
        </span>
      </Link>
    </main>
  );
};

export default Admin;
