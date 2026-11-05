import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { createContactClient } from "../../services/clientService";
import { capitalize } from "../../utils/capitalize";
import "./Contact.css";

const Contact = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const interestedCar = location.state?.interestedCar;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const isSending = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const carLabel = interestedCar
    ? `${capitalize(interestedCar.brand || "")} ${capitalize(interestedCar.model || "")}`.trim()
    : "";

  const onSubmit = async (data) => {
    if (isSending.current) return;

    // Bloqueamos dobles clics aunque React todavía no haya actualizado el botón.
    isSending.current = true;
    setSubmitError("");
    setIsSubmitted(false);

    try {
      await createContactClient({
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        notes: data.notes,
        // Asociamos el coche solo cuando se llega desde su ficha.
        interestedCars: interestedCar?._id ? [interestedCar._id] : [],
      });
      setIsSubmitted(true);
      reset();
    } catch (requestError) {
      setSubmitError(requestError.message || t.formError);
    } finally {
      isSending.current = false;
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-page__header">
        <span>{t.contactEyebrow}</span>
        <h1>{t.contactTitle}</h1>
        <p>{t.contactText}</p>
      </div>

      <div className="contact-page__grid">
        <aside className="contact-info">
          <div className="contact-info__card">
            <FiMail />
            <div>
              <h3>Email</h3>
              <p>hello@drivehub.com</p>
            </div>
          </div>

          <div className="contact-info__card">
            <FiPhone />
            <div>
              <h3>{t.contactPhone}</h3>
              <p>+34 600 123 456</p>
            </div>
          </div>

          <div className="contact-info__card">
            <FiMapPin />
            <div>
              <h3>{t.contactLocation}</h3>
              <p>{t.contactAddress}</p>
            </div>
          </div>

          <div className="contact-info__highlight">
            <h2>{t.contactBoxTitle}</h2>
            <p>{t.contactBoxText}</p>
          </div>
        </aside>

        <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="contact-form__row">
            <div className="contact-form__field">
              <label htmlFor="name">{t.formName}</label>
              <input
                id="name"
                type="text"
                placeholder={t.formNamePlaceholder}
                {...register("name", {
                  required: t.formRequired,
                  minLength: {
                    value: 2,
                    message: t.formNameMin,
                  },
                })}
              />
              {errors.name && <small>{errors.name.message}</small>}
            </div>

            <div className="contact-form__field">
              <label htmlFor="email">{t.formEmail}</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: t.formRequired,
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t.formEmailInvalid,
                  },
                })}
              />
              {errors.email && <small>{errors.email.message}</small>}
            </div>
          </div>

          <div className="contact-form__row">
            <div className="contact-form__field">
              <label htmlFor="phone">{t.formPhone}</label>
              <input
                id="phone"
                type="tel"
                placeholder={t.formPhonePlaceholder}
                {...register("phone", { required: t.formRequired })}
              />
              {errors.phone && <small>{errors.phone.message}</small>}
            </div>

            <div className="contact-form__field">
              <label htmlFor="city">{t.formCity}</label>
              <input
                id="city"
                type="text"
                placeholder={t.formCityPlaceholder}
                {...register("city")}
              />
            </div>
          </div>

          {interestedCar?._id && (
            <div className="contact-form__interest">
              <span>{t.formInterestedCar}</span>
              <strong>{carLabel}</strong>
              {interestedCar.year && <small>{interestedCar.year}</small>}
            </div>
          )}

          <div className="contact-form__field">
            <label htmlFor="notes">{t.formMessage}</label>
            <textarea
              id="notes"
              rows="6"
              placeholder={t.formMessagePlaceholder}
              {...register("notes", {
                required: t.formRequired,
                minLength: {
                  value: 10,
                  message: t.formMessageMin,
                },
              })}
            />
            {errors.notes && <small>{errors.notes.message}</small>}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t.formSubmitting : t.formSubmit}
          </button>

          {submitError && (
            <p className="contact-form__error" role="alert">
              <FiAlertCircle aria-hidden="true" />
              {submitError}
            </p>
          )}

          {isSubmitted && (
            <p className="contact-form__success" role="status">
              <FiCheckCircle aria-hidden="true" />
              {t.formSuccess}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;