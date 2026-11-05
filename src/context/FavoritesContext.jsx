import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext();
const FAVORITES_STORAGE_KEY = "drivehub-favorites";

const getFavoriteIds = (storedValue) => {
  try {
    const parsedFavorites = storedValue ? JSON.parse(storedValue) : [];

    if (!Array.isArray(parsedFavorites)) return [];

    return [
      ...new Set(
        parsedFavorites
          .map((favorite) =>
            typeof favorite === "string" ? favorite : favorite?._id,
          )
          .filter((id) => typeof id === "string" && id.length > 0),
      ),
    ];
  } catch {
    return [];
  }
};

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(() =>
    getFavoriteIds(localStorage.getItem(FAVORITES_STORAGE_KEY)),
  );

  // Persistimos únicamente IDs para no conservar datos obsoletos del vehículo.
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    const syncFavorites = (event) => {
      if (event.key === FAVORITES_STORAGE_KEY) {
        setFavoriteIds(getFavoriteIds(event.newValue));
      }
    };

    window.addEventListener("storage", syncFavorites);
    return () => window.removeEventListener("storage", syncFavorites);
  }, []);

  const isFavorite = (carId) => favoriteIds.includes(carId);

  const addFavorite = (car) => {
    if (!car?._id) return;

    setFavoriteIds((currentIds) =>
      currentIds.includes(car._id) ? currentIds : [...currentIds, car._id],
    );
  };

  const removeFavorite = (carId) => {
    setFavoriteIds((currentIds) => currentIds.filter((id) => id !== carId));
  };

  const toggleFavorite = (car) => {
    if (!car?._id) return;

    setFavoriteIds((currentIds) =>
      currentIds.includes(car._id)
        ? currentIds.filter((id) => id !== car._id)
        : [...currentIds, car._id],
    );
  };

  const reconcileFavorites = (cars) => {
    const currentCarIds = new Set(cars.map((car) => car._id));

    setFavoriteIds((currentIds) => {
      const validIds = currentIds.filter((id) => currentCarIds.has(id));
      return validIds.length === currentIds.length ? currentIds : validIds;
    });
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        reconcileFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
