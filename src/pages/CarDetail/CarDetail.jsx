import { Link, useLocation, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDroplet,
  FiHeart,
  FiMessageCircle,
  FiSettings,
} from "react-icons/fi";
import { useCar } from "../../hooks/useCar";
import { useLanguage } from "../../context/LanguageContext";
import { useFavorites } from "../../context/FavoritesContext";
import { getCarCover, handleCarImageError } from "../../utils/carImages";
import { capitalize } from "../../utils/capitalize";
import Loader from "../../components/Loader/Loader";
import "./CarDetail.css";

const CarDetail = () => {
  const { id } = useParams();
  const { car, loading, error } = useCar(id);
  const { language, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const location = useLocation();
  const locale = language === "es" ? "es-ES" : "en-US";
  const formatPrice = (value) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value ?? 0);

  const formatNumber = (value) =>
    new Intl.NumberFormat(locale).format(value ?? 0);
  const favorite = car ? isFavorite(car._id) : false;

  const statusLabels = {
    Available: t.carStatusAvailable,
    Reserved: t.carStatusReserved,
    Sold: t.carStatusSold,
  };
  const fuelLabels = {
    Gasoline: t.carFuelGasoline,
    Diesel: t.carFuelDiesel,
    Hybrid: t.carFuelHybrid,
    Electric: t.carFuelElectric,
    LPG: t.carFuelLpg,
  };
  const transmissionLabels = {
    Manual: t.carTransmissionManual,
    Automatic: t.carTransmissionAutomatic,
  };

  // Volvemos al listado desde el que se abrió el coche.
  const backUrl = location.state?.from || "/";

  if (loading) {
    return <Loader text={t.detailLoading} />;
  }

  if (error || !car) {
    return <Loader text={t.detailNotFound} />;
  }

  return (
    <section className="car-detail">
      <Link to={backUrl} className="car-detail__back">
        <FiArrowLeft />
        {t.detailBack}
      </Link>

      <div className="car-detail__grid">
        <div className="car-detail__image">
          <img
            src={getCarCover(car)}
            alt={`${capitalize(car.brand)} ${capitalize(car.model)}`}
            decoding="async"
            onError={handleCarImageError}
          />
        </div>

        <aside className="car-detail__panel">
          <span
            className={`car-detail__label car-detail__label--${car.status?.toLowerCase()}`}
          >
            {statusLabels[car.status] || car.status}
          </span>

          <h1>
            {capitalize(car.brand)} {capitalize(car.model)}
          </h1>

          <p className="car-detail__subtitle">
            {fuelLabels[car.fuel] || car.fuel} ·{" "}
            {transmissionLabels[car.transmission] || car.transmission}
          </p>

          <strong className="car-detail__price">{formatPrice(car.price)}</strong>

          <div className="car-detail__specs">
            <article>
              <FiCalendar />
              <div>
                <span>{t.detailYear}</span>
                <strong>{car.year}</strong>
              </div>
            </article>

            <article>
              <FiClock />
              <div>
                <span>{t.detailMileage}</span>
                <strong>{formatNumber(car.mileage)} km</strong>
              </div>
            </article>

            <article>
              <FiDroplet />
              <div>
                <span>{t.carFuel}</span>
                <strong>{fuelLabels[car.fuel] || car.fuel}</strong>
              </div>
            </article>

            <article>
              <FiSettings />
              <div>
                <span>{t.carTransmission}</span>
                <strong>
                  {transmissionLabels[car.transmission] || car.transmission}
                </strong>
              </div>
            </article>
          </div>

          {car.notes && (
            <div className="car-detail__description">
              <h2>{t.detailNotes}</h2>
              <p>{capitalize(car.notes)}</p>
            </div>
          )}

          <div className="car-detail__actions">
            {car.status === "Sold" ? (
              <span className="car-detail__primary car-detail__primary--sold">
                <FiCheckCircle aria-hidden="true" />
                {t.detailSoldAction}
              </span>
            ) : (
              <Link
                to="/contact"
                state={{ interestedCar: car }}
                className="car-detail__primary"
              >
                <FiMessageCircle />
                {t.detailContactSeller}
              </Link>
            )}

            <button
              type="button"
              className={`car-detail__secondary${favorite ? " is-favorite" : ""}`}
              onClick={() => toggleFavorite(car)}
              aria-pressed={favorite}
            >
              <FiHeart aria-hidden="true" />
              {favorite ? t.detailRemoveFavorites : t.detailAddFavorites}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CarDetail;
