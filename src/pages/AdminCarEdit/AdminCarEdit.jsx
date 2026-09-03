import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiImage,
  FiSave,
  FiTrash2,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  deleteCarImage,
  getCarById,
  setCarCover,
  updateCar,
} from "../../services/carService";
import "../AdminCarNew/AdminCarNew.css";
import "./AdminCarEdit.css";

const getFormValues = (car) => ({
  brand: car.brand ?? "",
  model: car.model ?? "",
  year: car.year ?? "",
  mileage: car.mileage ?? "",
  price: car.price ?? "",
  fuel: car.fuel ?? "Gasoline",
  transmission: car.transmission ?? "Manual",
  status: car.status ?? "Available",
  notes: car.notes ?? "",
  images: null,
});

const AdminCarEdit = () => {
  const { id } = useParams();
  const { authFetch } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState("");
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [selectedCover, setSelectedCover] = useState(null);
  const currentYear = new Date().getFullYear();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    let isActive = true;

    getCarById(id)
      .then((currentCar) => {
        if (!isActive) return;

        setCar(currentCar);
        reset(getFormValues(currentCar));
        const cover = currentCar.images?.find((image) => image.isCover);
        const firstImage = currentCar.images?.[0];
        const selectedImage = cover || firstImage;

        if (selectedImage?.publicId) {
          setSelectedCover({ type: "existing", publicId: selectedImage.publicId });
        }
      })
      .catch((error) => {
        if (isActive) setLoadError(error.message);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [id, reset]);

  // Liberamos las previews de las imágenes nuevas.
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [newImagePreviews]);

  const imagesRegistration = register("images", {
    validate: {
      maxLength: (files) => !files?.length || files.length <= 10 || t.carImagesMax,
      size: (files) =>
        Array.from(files || []).every((file) => file.size <= 5 * 1024 * 1024) ||
        t.carImagesSize,
      format: (files) =>
        Array.from(files || []).every((file) =>
          ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        ) || t.carImagesFormat,
    },
  });

  const handleImagesChange = (event) => {
    imagesRegistration.onChange(event);
    const files = Array.from(event.target.files || []);

    setNewImagePreviews(
      files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    );
    setSelectedCover((currentCover) =>
      currentCover?.type === "existing"
        ? currentCover
        : files.length > 0
          ? { type: "new", index: 0 }
          : null,
    );
  };

  const handleDeleteImage = async (image) => {
    if (isSaving || deletingImageId || !image.publicId) return;

    if (!window.confirm(t.carImageDeleteConfirm)) return;

    setApiError("");
    setDeletingImageId(image.publicId);

    try {
      const updatedCar = await deleteCarImage(id, image.publicId, authFetch);
      setCar(updatedCar);

      const selectedImageWasDeleted =
        selectedCover?.type === "existing" &&
        selectedCover.publicId === image.publicId;

      if (image.isCover || selectedImageWasDeleted) {
        // El backend elige otra portada cuando borramos la actual.
        const nextCover =
          updatedCar.images?.find((currentImage) => currentImage.isCover) ||
          updatedCar.images?.[0];

        setSelectedCover(
          nextCover?.publicId
            ? { type: "existing", publicId: nextCover.publicId }
            : newImagePreviews.length > 0
              ? { type: "new", index: 0 }
              : null,
        );
      }
    } catch (deleteRequestError) {
      setApiError(deleteRequestError.message || t.carImageDeleteError);
    } finally {
      setDeletingImageId("");
    }
  };

  const onSubmit = async (data) => {
    if (deletingImageId) return;

    setApiError("");
    setIsSuccess(false);
    setIsSaving(true);

    try {
      const previousImageIds = new Set(
        (car.images || []).map((image) => image.publicId),
      );
      const newImages = newImagePreviews.map((preview) => preview.file);
      const updatedCar = await updateCar(
        id,
        { ...data, images: newImages },
        authFetch,
      );
      const addedImages = (updatedCar.images || []).filter(
        (image) => !previousImageIds.has(image.publicId),
      );
      const coverPublicId =
        selectedCover?.type === "existing"
          ? selectedCover.publicId
          : addedImages[selectedCover?.index]?.publicId;

      // Limpiamos los archivos para no volver a subirlos si falla la portada.
      setCar(updatedCar);
      setNewImagePreviews([]);
      reset(getFormValues(updatedCar));

      if (coverPublicId) {
        setSelectedCover({ type: "existing", publicId: coverPublicId });
        const currentCover = updatedCar.images?.find((image) => image.isCover);

        if (currentCover?.publicId !== coverPublicId) {
          await setCarCover(id, coverPublicId, authFetch);
        }
      }

      setIsSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      navigate("/admin/cars", { replace: true });
    } catch (error) {
      setApiError(
        error.code === "REQUEST_TIMEOUT" ? t.carCreateTimeout : error.message,
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="admin-car-new admin-car-edit__state" aria-live="polite">
        <div className="admin-car-edit__spinner" />
        <p>{t.carEditLoading}</p>
      </main>
    );
  }

  if (loadError || !car) {
    return (
      <main className="admin-car-new admin-car-edit__state" role="alert">
        <FiImage aria-hidden="true" />
        <h1>{t.carEditLoadError}</h1>
        <p>{loadError}</p>
        <Link className="admin-car-new__back" to="/admin/cars">
          <FiArrowLeft aria-hidden="true" />
          {t.adminCarsBack}
        </Link>
      </main>
    );
  }

  return (
    <main className="admin-car-new">
      <Link className="admin-car-new__back" to="/admin/cars">
        <FiArrowLeft aria-hidden="true" />
        {t.adminCarsBack}
      </Link>

      <header className="admin-car-new__header">
        <span>{t.adminCarsEyebrow}</span>
        <h1>{t.carEditTitle}</h1>
        <p>{t.carEditText}</p>
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
                  valueAsNumber: true,
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
                  valueAsNumber: true,
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
                step="any"
                {...register("price", {
                  required: t.formRequired,
                  valueAsNumber: true,
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
            <p>{t.carEditImagesText}</p>
          </div>

          <h3 className="admin-car-edit__images-title">{t.carCurrentImages}</h3>
          {car.images?.length > 0 ? (
            <div className="admin-car-form__previews admin-car-edit__images">
              {car.images.map((image, index) => {
                const isCover =
                  selectedCover?.type === "existing" &&
                  selectedCover.publicId === image.publicId;

                return (
                  <figure
                    className={isCover ? "admin-car-form__preview--cover" : ""}
                    key={image.publicId || image.url}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        image.publicId &&
                        setSelectedCover({ type: "existing", publicId: image.publicId })
                      }
                      disabled={isSaving || Boolean(deletingImageId)}
                      aria-label={`${t.carSetCover}: ${index + 1}`}
                      aria-pressed={isCover}
                    >
                      <img src={image.url} alt={`${car.brand} ${car.model} ${index + 1}`} />
                    </button>
                    <button
                      className="admin-car-edit__delete-image"
                      type="button"
                      onClick={() => handleDeleteImage(image)}
                      disabled={isSaving || Boolean(deletingImageId)}
                      aria-label={`${t.carDeleteImage}: ${index + 1}`}
                      aria-busy={deletingImageId === image.publicId}
                    >
                      <FiTrash2 aria-hidden="true" />
                    </button>
                    {isCover && <span>{t.carCover}</span>}
                  </figure>
                );
              })}
            </div>
          ) : (
            <p className="admin-car-edit__empty-images">{t.carNoCurrentImages}</p>
          )}

          <h3 className="admin-car-edit__images-title">{t.carNewImages}</h3>
          <div className="admin-car-form__field">
            <label className="admin-car-form__upload" htmlFor="images">
              <FiImage aria-hidden="true" />
              <span>{t.carAddImages}</span>
              <small>{t.carImagesHint}</small>
            </label>
            <input
              id="images"
              className="admin-car-form__file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              name={imagesRegistration.name}
              ref={imagesRegistration.ref}
              onBlur={imagesRegistration.onBlur}
              onChange={handleImagesChange}
              disabled={isSaving || Boolean(deletingImageId)}
            />
            {errors.images && <small>{errors.images.message}</small>}
          </div>

          {newImagePreviews.length > 0 && (
            <div className="admin-car-form__previews">
              {newImagePreviews.map((preview, index) => {
                const isCover =
                  selectedCover?.type === "new" && selectedCover.index === index;

                return (
                  <figure
                    className={isCover ? "admin-car-form__preview--cover" : ""}
                    key={`${preview.file.name}-${preview.file.lastModified}-${index}`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedCover({ type: "new", index })}
                      disabled={isSaving || Boolean(deletingImageId)}
                      aria-label={`${t.carSetCover}: ${preview.file.name}`}
                      aria-pressed={isCover}
                    >
                      <img src={preview.url} alt={preview.file.name} />
                    </button>
                    {isCover && <span>{t.carCover}</span>}
                    <figcaption>{preview.file.name}</figcaption>
                  </figure>
                );
              })}
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
            {t.carEditSuccess}
          </p>
        )}

        <div className="admin-car-form__actions">
          <Link to="/admin/cars">{t.cancel}</Link>
          <button
            type="submit"
            disabled={isSaving || Boolean(deletingImageId) || isSuccess}
          >
            <FiSave aria-hidden="true" />
            {isSaving ? t.carSaving : t.carSave}
          </button>
        </div>
      </form>
    </main>
  );
};

export default AdminCarEdit;
