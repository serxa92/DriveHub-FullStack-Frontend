const API_URL = import.meta.env.VITE_API_URL;

const parseResponse = async (response) => {
  // Algunos errores pueden llegar sin un JSON válido.
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "No se pudo completar la solicitud");
  }

  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  return parseResponse(response);
};

export const registerUser = async ({ username, email, password, image }) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);

  if (image) {
    formData.append("image", image);
  }

  // Dejamos que el navegador prepare la cabecera del FormData.
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
};

// Añadimos el Bearer sin repetirlo en cada servicio.
export const authenticatedFetch = (path, token, options = {}) => {
  const headers = new Headers(options.headers);

  // El navegador debe generar el boundary cuando enviamos FormData.
  if (options.body instanceof FormData) {
    headers.delete("Content-Type");
  }

  headers.set("Authorization", `Bearer ${token}`);

  return fetch(`${API_URL}${path}`, { ...options, headers });
};
