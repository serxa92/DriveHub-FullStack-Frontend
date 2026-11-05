import { FiHeart } from "react-icons/fi";
import { getCarCover, handleCarImageError } from "../../utils/carImages";
import { capitalize } from "../../utils/capitalize";
import { useFavorites } from "../../context/FavoritesContext";
import { useLanguage } from "../../context/LanguageContext";
import { Link, useLocation } from "react-router-dom";
import { memo } from "react";
import "./CarCard.css";

const CarCard = ({ car }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLanguage();
  const favorite = isFavorite(car._id);
  const location = useLocation();

  const statusLabels = {
    Available: t.carStatusAvailable,
    Reserved: t.carStatusReserved,
    Sold: t.carStatusSold,
  };

  return (
    <article className="car-card">
      <Link
        to={`/cars/${car._id}`}
        state={{ from: location.pathname }}
        className="car-card__link"
      >
        <div className="car-card__image">
          <img
            src={getCarCover(car)}
            alt={`${capitalize(car.brand)} ${capitalize(car.model)}`}
            loading="lazy"
            decoding="async"
            onError={handleCarImageError}
          />
          {["Reserved", "Sold"].includes(car.status) && (
            <span
              className={`car-card__status car-card__status--${car.status?.toLowerCase()}`}
            >
              {car.status === "Sold" ? t.carStatusSold : t.carStatusReserved}
            </span>
          )}
        </div>

        <div className="car-card__content">
          <h3>
            {capitalize(car.brand)} {capitalize(car.model)}
          </h3>

          <p>
            {car.year} · {car.mileage} km
          </p>

          <strong>
            {car.notes
              ? capitalize(car.notes)
              : statusLabels[car.status] || t.carStatusAvailable}
          </strong>
        </div>
      </Link>

      <button
        type="button"
        aria-label={favorite ? t.detailRemoveFavorites : t.detailAddFavorites}
        aria-pressed={favorite}
        className={`car-card__favorite${favorite ? " is-favorite" : ""}`}
        onClick={() => toggleFavorite(car)}
      >
        <FiHeart aria-hidden="true" />
      </button>
    </article>
  );
};

export default memo(CarCard);
