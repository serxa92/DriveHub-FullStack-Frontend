import CarCard from "../../components/CarCard/CarCard";
import { useFavorites } from "../../context/FavoritesContext";
import { useLanguage } from "../../context/LanguageContext";
import "./Favorites.css";

const Favorites = () => {
  const { favorites } = useFavorites();
  const { t } = useLanguage();

  return (
    <section className="favorites-page">
      <div className="favorites-page__header">
        <span>{t.favoritesEyebrow}</span>
        <h1>{t.favoritesTitle}</h1>
        <p>{t.favoritesText}</p>
      </div>

      {favorites.length === 0 ? (
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