import { useEffect, useState } from "react";
import { getCarById } from "../services/carService";

export const useCar = (id) => {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCarById(id)
      .then((data) => setCar(data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { car, loading, error };
};