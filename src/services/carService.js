const API_URL = import.meta.env.VITE_API_URL;
const CAR_WRITE_TIMEOUT = 45000;

const readResponse = async (response) => {
  const body = await response.text();

  if (!body) return {};

  try {
    return JSON.parse(body);
  } catch {
    return { message: body.startsWith("<") ? "" : body };
  }
};

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

const toNumberText = (value) => {
  if (value === "" || value === null || value === undefined) return "";

  const number = Number(value);
  return Number.isFinite(number) ? String(number) : "";
};

const buildCarFormData = (car) => {
  const formData = new FormData();
  formData.append("brand", car.brand ?? "");
  formData.append("model", car.model ?? "");
  formData.append("fuel", car.fuel ?? "");
  formData.append("transmission", car.transmission ?? "");
  formData.append("status", car.status ?? "");
  formData.append("notes", car.notes ?? "");

  // FormData recibe números simples, sin formato visual.
  formData.append("year", toNumberText(car.year));
  formData.append("mileage", toNumberText(car.mileage));
  formData.append("price", toNumberText(car.price));

  Array.from(car.images || []).forEach((image) => {
    formData.append("images", image);
  });

  return formData;
};

const sendCarForm = async (path, method, car, authFetch) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CAR_WRITE_TIMEOUT);

  try {
    const response = await authFetch(path, {
      method,
      body: buildCarFormData(car),
      signal: controller.signal,
    });
    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(
        data.detail ||
          data.message ||
          data.error ||
          `No se pudo guardar el coche (${response.status})`,
      );
    }

    return data.data || data;
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("REQUEST_TIMEOUT");
      timeoutError.code = "REQUEST_TIMEOUT";
      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const createCar = (car, authFetch) =>
  sendCarForm("/cars", "POST", car, authFetch);

export const updateCar = (id, car, authFetch) =>
  sendCarForm(`/cars/${id}`, "PUT", car, authFetch);

export const setCarCover = async (id, publicId, authFetch) => {
  const response = await authFetch(`/cars/${id}/images/cover`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  });
  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || data.error || "No se pudo cambiar la portada",
    );
  }

  return data.data || data;
};

export const deleteCar = async (id, authFetch) => {
  const response = await authFetch(`/cars/${id}`, { method: "DELETE" });
  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || data.error || "No se pudo eliminar el coche",
    );
  }

  return data;
};

export const deleteCarImage = async (id, publicId, authFetch) => {
  const response = await authFetch(`/cars/${id}/images`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  });
  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || data.error || "No se pudo eliminar la imagen",
    );
  }

  return data.data || data;
};
