import { useEffect, useMemo } from "react";
import CarCard from "../../components/CarCard/CarCard";
import Loader from "../../components/Loader/Loader";
import { useFavorites } from "../../context/FavoritesContext";
import { useLanguage } from "../../context/LanguageContext";
import { useCars } from "../../hooks/useCars";
import "./Favorites.css";

const Favorites = () => {
  const { favoriteIds, reconcileFavorites } = useFavorites();
  const { cars, loading, error } = useCars();
  const { t } = useLanguage();

  const favorites = useMemo(() => {
    const carsById = new Map(cars.map((car) => [car._id, car]));
    return favoriteIds.map((id) => carsById.get(id)).filter(Boolean);
  }, [cars, favoriteIds]);

  useEffect(() => {
    if (!loading && !error) reconcileFavorites(cars);
  }, [cars, error, loading, reconcileFavorites]);

  return (
    <section className="favorites-page">
      <div className="favorites-page__header">
        <span>{t.favoritesEyebrow}</span>
        <h1>{t.favoritesTitle}</h1>
        <p>{t.favoritesText}</p>
      </div>

      {favoriteIds.length > 0 && loading ? (
        <Loader text={t.loadingCars} />
      ) : error ? (
        <div className="favorites-empty">
          <h2>{t.favoritesUnavailableTitle}</h2>
          <p>{t.favoritesUnavailableText}</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="favorites-empty">
          <h2>{t.favoritesEmptyTitle}</h2>
          <p>{t.favoritesEmptyText}</p>
        </div>
      ) : (
        <div className="car-grid">
          {favorites.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Favorites;
