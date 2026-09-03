import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import "./Login.css";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data) => {
    setApiError("");

    try {
      await login(data);
      // Retomamos la ruta protegida que llevó al login.
      navigate(location.state?.from || "/", { replace: true });
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__icon"><FiLogIn /></div>
        <span className="auth-card__eyebrow">DriveHub</span>
        <h1>{t.loginTitle}</h1>
        <p className="auth-card__intro">{t.loginText}</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-form__field">
            <label htmlFor="email">{t.formEmail}</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email", {
                required: t.formRequired,
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t.formEmailInvalid },
              })}
            />
            {errors.email && <small>{errors.email.message}</small>}
          </div>

          <div className="auth-form__field">
            <label htmlFor="password">{t.password}</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password", { required: t.formRequired })}
            />
            {errors.password && <small>{errors.password.message}</small>}
          </div>

          {apiError && <p className="auth-form__error" role="alert">{apiError}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t.loggingIn : t.login}
          </button>
        </form>

        <p className="auth-card__switch">
          {t.noAccount} <Link to="/register">{t.register}</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
