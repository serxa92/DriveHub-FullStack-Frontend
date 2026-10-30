import { useEffect, useState } from "react";
import { getClients } from "../services/clientService";

export const useClients = (authFetch) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Evitamos actualizar el estado al salir de la página.
    let isActive = true;

    getClients(authFetch)
      .then((data) => {
        if (isActive) setClients(data);
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

  const removeClientFromList = (id) => {
    setClients((currentClients) =>
      currentClients.filter((client) => client._id !== id),
    );
  };

  return { clients, loading, error, removeClientFromList };
};
