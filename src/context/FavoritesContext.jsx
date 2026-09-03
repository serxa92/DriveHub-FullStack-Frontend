import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("drivehub-favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem("drivehub-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (carId) => {
    return favorites.some((car) => car._id === carId);
  };

  const addFavorite = (car) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((item) => item._id === car._id)) {
        return prevFavorites;
      }

      return [...prevFavorites, car];
    });
  };

  const removeFavorite = (carId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((car) => car._id !== carId)
    );
  };

  const toggleFavorite = (car) => {
    if (isFavorite(car._id)) {
      removeFavorite(car._id);
    } else {
      addFavorite(car);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);