import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import "../Login/Login.css";

const Register = () => {
  const { register: createAccount, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const password = watch("password");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async ({ username, email, password: userPassword, image }) => {
    setApiError("");

    try {
      await createAccount({
        username,
        email,
        password: userPassword,
        // El perfil solo admite una imagen.
        image: image?.[0],
      });
      navigate("/", { replace: true });
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card auth-card--wide">
        <div className="auth-card__icon"><FiUserPlus /></div>
        <span className="auth-card__eyebrow">DriveHub</span>
        <h1>{t.registerTitle}</h1>
        <p className="auth-card__intro">{t.registerText}</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-form__row">
            <div className="auth-form__field">
              <label htmlFor="username">{t.username}</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                {...register("username", {
                  required: t.formRequired,
                  minLength: { value: 2, message: t.usernameMin },
                })}
              />
              {errors.username && <small>{errors.username.message}</small>}
            </div>

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
          </div>

          <div className="auth-form__row">
            <div className="auth-form__field">
              <label htmlFor="password">{t.password}</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password", {
                  required: t.formRequired,
                  minLength: { value: 6, message: t.passwordMin },
                })}
              />
              {errors.password && <small>{errors.password.message}</small>}
            </div>

            <div className="auth-form__field">
              <label htmlFor="confirmPassword">{t.confirmPassword}</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword", {
                  required: t.formRequired,
                  validate: (value) => value === password || t.passwordMismatch,
                })}
              />
              {errors.confirmPassword && <small>{errors.confirmPassword.message}</small>}
            </div>
          </div>

          <div className="auth-form__field">
            <label htmlFor="image">{t.profileImage}</label>
            <input id="image" type="file" accept="image/*" {...register("image")} />
            <span className="auth-form__hint">{t.profileImageHint}</span>
          </div>

          {apiError && <p className="auth-form__error" role="alert">{apiError}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t.registering : t.createAccount}
          </button>
        </form>

        <p className="auth-card__switch">
          {t.hasAccount} <Link to="/login">{t.login}</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
