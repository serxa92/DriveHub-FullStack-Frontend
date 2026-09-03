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

export const createCar = async (car, authFetch) => {
  const formData = new FormData();
  const fields = [
    "brand",
    "model",
    "year",
    "mileage",
    "price",
    "fuel",
    "transmission",
    "status",
    "notes",
  ];

  fields.forEach((field) => {
    formData.append(field, car[field] ?? "");
  });

  // Añadimos cada imagen con el nombre que espera el backend.
  Array.from(car.images || []).forEach((image) => {
    formData.append("images", image);
  });

  const response = await authFetch("/cars", {
    method: "POST",
    body: formData,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "The car could not be created",
    );
  }

  // La API puede devolver el coche directamente o dentro de data.
  return data.data || data;
};