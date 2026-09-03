import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiArrowLeft, FiCheckCircle, FiImage, FiSave } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { createCar } from "../../services/carService";
import "./AdminCarNew.css";

const AdminCarNew = () => {
  const { authFetch } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const currentYear = new Date().getFullYear();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fuel: "Gasoline",
      transmission: "Manual",
      status: "Available",
    },
  });

  // Liberamos las previews temporales cuando dejan de usarse.
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  const imagesRegistration = register("images", {
    validate: {
      required: (files) => files?.length > 0 || t.formRequired,
      maxLength: (files) => files?.length <= 10 || t.carImagesMax,
    },
  });

  const handleImagesChange = (event) => {
    // Mantenemos el input conectado con react-hook-form.
    imagesRegistration.onChange(event);
    const files = Array.from(event.target.files || []);
    setImagePreviews(
      files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    );
  };

  const onSubmit = async (data) => {
    setApiError("");
    setIsSuccess(false);

    try {
      await createCar(data, authFetch);
      setIsSuccess(true);
      // Dejamos que se vea la confirmación antes de volver.
      await new Promise((resolve) => setTimeout(resolve, 900));
      navigate("/admin/cars", { replace: true });
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <main className="admin-car-new">
      <Link className="admin-car-new__back" to="/admin/cars">
        <FiArrowLeft aria-hidden="true" />
        {t.adminCarsBack}
      </Link>

      <header className="admin-car-new__header">
        <span>{t.adminCarsEyebrow}</span>
        <h1>{t.carNewTitle}</h1>
        <p>{t.carNewText}</p>
      </header>

      <form className="admin-car-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="admin-car-form__section">
          <div className="admin-car-form__section-title">
            <h2>{t.carBasicData}</h2>
            <p>{t.carBasicDataText}</p>
          </div>

          <div className="admin-car-form__grid">
            <div className="admin-car-form__field">
              <label htmlFor="brand">{t.carBrand}</label>
              <input
                id="brand"
                type="text"
                {...register("brand", { required: t.formRequired })}
              />
              {errors.brand && <small>{errors.brand.message}</small>}
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="model">{t.carModel}</label>
              <input
                id="model"
                type="text"
                {...register("model", { required: t.formRequired })}
              />
              {errors.model && <small>{errors.model.message}</small>}
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="year">{t.carYear}</label>
              <input
                id="year"
                type="number"
                {...register("year", {
                  required: t.formRequired,
                  min: { value: 1900, message: t.carYearInvalid },
                  max: { value: currentYear + 1, message: t.carYearInvalid },
                })}
              />
              {errors.year && <small>{errors.year.message}</small>}
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="mileage">{t.carMileage}</label>
              <input
                id="mileage"
                type="number"
                min="0"
                {...register("mileage", {
                  required: t.formRequired,
                  min: { value: 0, message: t.carNumberInvalid },
                })}
              />
              {errors.mileage && <small>{errors.mileage.message}</small>}
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="price">{t.carPrice}</label>
              <input
                id="price"
                type="number"
                min="1"
                {...register("price", {
                  required: t.formRequired,
                  min: { value: 1, message: t.carPriceInvalid },
                })}
              />
              {errors.price && <small>{errors.price.message}</small>}
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="fuel">{t.carFuel}</label>
              <select id="fuel" {...register("fuel", { required: t.formRequired })}>
                <option value="Gasoline">{t.carFuelGasoline}</option>
                <option value="Diesel">{t.carFuelDiesel}</option>
                <option value="Hybrid">{t.carFuelHybrid}</option>
                <option value="Electric">{t.carFuelElectric}</option>
                <option value="LPG">{t.carFuelLpg}</option>
              </select>
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="transmission">{t.carTransmission}</label>
              <select
                id="transmission"
                {...register("transmission", { required: t.formRequired })}
              >
                <option value="Manual">{t.carTransmissionManual}</option>
                <option value="Automatic">{t.carTransmissionAutomatic}</option>
              </select>
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="status">{t.carStatus}</label>
              <select id="status" {...register("status", { required: t.formRequired })}>
                <option value="Available">{t.carStatusAvailable}</option>
                <option value="Reserved">{t.carStatusReserved}</option>
                <option value="Sold">{t.carStatusSold}</option>
              </select>
            </div>
          </div>

          <div className="admin-car-form__field">
            <label htmlFor="notes">{t.carNotes}</label>
            <textarea
              id="notes"
              rows="5"
              placeholder={t.carNotesPlaceholder}
              {...register("notes")}
            />
          </div>
        </section>

        <section className="admin-car-form__section">
          <div className="admin-car-form__section-title">
            <h2>{t.carImages}</h2>
            <p>{t.carImagesText}</p>
          </div>

          <div className="admin-car-form__field">
            <label className="admin-car-form__upload" htmlFor="images">
              <FiImage aria-hidden="true" />
              <span>{t.carImagesSelect}</span>
              <small>{t.carImagesHint}</small>
            </label>
            <input
              id="images"
              className="admin-car-form__file"
              type="file"
              accept="image/*"
              multiple
              name={imagesRegistration.name}
              ref={imagesRegistration.ref}
              onBlur={imagesRegistration.onBlur}
              onChange={handleImagesChange}
            />
            {errors.images && <small>{errors.images.message}</small>}
          </div>

          {imagePreviews.length > 0 && (
            <div className="admin-car-form__previews">
              {imagePreviews.map((preview, index) => (
                <figure key={`${preview.file.name}-${preview.file.lastModified}`}>
                  <img src={preview.url} alt={preview.file.name} />
                  {index === 0 && <span>{t.carCover}</span>}
                  <figcaption>{preview.file.name}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>

        {apiError && (
          <p className="admin-car-form__message admin-car-form__message--error" role="alert">
            {apiError}
          </p>
        )}

        {isSuccess && (
          <p className="admin-car-form__message admin-car-form__message--success" role="status">
            <FiCheckCircle aria-hidden="true" />
            {t.carCreateSuccess}
          </p>
        )}

        <div className="admin-car-form__actions">
          <Link to="/admin/cars">{t.cancel}</Link>
          <button type="submit" disabled={isSubmitting || isSuccess}>
            <FiSave aria-hidden="true" />
            {isSubmitting ? t.carCreating : t.carCreate}
          </button>
        </div>
      </form>
    </main>
  );
};

export default AdminCarNew;
