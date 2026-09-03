import { FiHeart } from "react-icons/fi";
import { getCarImage } from "../../utils/carImages";
import { capitalize } from "../../utils/capitalize";
import { useFavorites } from "../../context/FavoritesContext";
import { Link, useLocation } from "react-router-dom";
import { memo } from "react";
import "./CarCard.css";

const CarCard = ({ car }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(car._id);
  const location = useLocation();

  const handleFavoriteClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(car);
  };

  return (
    <Link
      to={`/cars/${car._id}`}
      state={{ from: location.pathname }}
      className="car-card"
    >
      <div
        className="car-card__image"
        style={{
          backgroundImage: `url(${car.image || getCarImage(car.brand)})`,
        }}
      >
        <button
          type="button"
          aria-label="Add to favorites"
          className={favorite ? "is-favorite" : ""}
          onClick={handleFavoriteClick}
        >
          <FiHeart />
        </button>
      </div>

      <div className="car-card__content">
        <h3>
          {capitalize(car.brand)} {capitalize(car.model)}
        </h3>

        <p>
          {car.year} · {car.mileage} km
        </p>

        <strong>{car.notes ? capitalize(car.notes) : "Available now"}</strong>
      </div>
    </Link>
  );
};

export default memo(CarCard);
