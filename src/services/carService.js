const API_URL = import.meta.env.VITE_API_URL;

export const getCars = async () => {
  const response = await fetch(`${API_URL}/cars`);

  if (!response.ok) {
    throw new Error(`Error fetching cars: ${response.status}`);
  }

  return response.json();
};

export const getCarById = async (id) => {
  const response = await fetch(`${API_URL}/cars/${id}`);

  if (!response.ok) {
    throw new Error(`Error fetching car: ${response.status}`);
  }

  return response.json();
};