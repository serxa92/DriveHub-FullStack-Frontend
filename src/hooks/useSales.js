import { useEffect, useState } from "react";
import { getSales } from "../services/saleService";

export const useSales = (authFetch) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Evitamos actualizar el estado si salimos antes de que termine la petición.
    let isActive = true;

    getSales(authFetch)
      .then((data) => {
        if (isActive) setSales(data);
      })
      .catch((requestError) => {
        if (isActive) setError(requestError.message);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [authFetch]);

  const removeSaleFromList = (id) => {
    setSales((currentSales) =>
      currentSales.filter((sale) => sale._id !== id),
    );
  };

  return { sales, loading, error, removeSaleFromList };
};
