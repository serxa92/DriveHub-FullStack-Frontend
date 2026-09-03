import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMail, FiPhone, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";
import "./Contact.css";

const Contact = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Contact form data:", data);
    setIsSubmitted(true);
    reset();

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
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
              <p>Madrid, Spain</p>
            </div>
          </div>

          <div className="contact-info__highlight">
            <h2>{t.contactBoxTitle}</h2>
            <p>{t.contactBoxText}</p>
          </div>
        </aside>

        <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
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

          <div className="contact-form__field">
            <label htmlFor="subject">{t.formSubject}</label>
            <select
              id="subject"
              {...register("subject", {
                required: t.formRequired,
              })}
            >
              <option value="">{t.formSubjectPlaceholder}</option>
              <option value="buy">{t.formSubjectBuy}</option>
              <option value="sell">{t.formSubjectSell}</option>
              <option value="support">{t.formSubjectSupport}</option>
            </select>
            {errors.subject && <small>{errors.subject.message}</small>}
          </div>

          <div className="contact-form__field">
            <label htmlFor="message">{t.formMessage}</label>
            <textarea
              id="message"
              rows="6"
              placeholder={t.formMessagePlaceholder}
              {...register("message", {
                required: t.formRequired,
                minLength: {
                  value: 10,
                  message: t.formMessageMin,
                },
              })}
            />
            {errors.message && <small>{errors.message.message}</small>}
          </div>

          <button type="submit">{t.formSubmit}</button>

          {isSubmitted && (
            <p className="contact-form__success">
              <FiCheckCircle />
              {t.formSuccess}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;