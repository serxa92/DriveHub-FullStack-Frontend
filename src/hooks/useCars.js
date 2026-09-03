import { useEffect, useState } from "react";
import { getCars } from "../services/carService";

export const useCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCars()
      .then((data) => {
        setCars(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { cars, loading, error };
};