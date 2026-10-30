// Algunos errores pueden llegar como texto en vez de JSON.
const readResponse = async (response) => {
  const body = await response.text();

  if (!body) return {};

  try {
    return JSON.parse(body);
  } catch {
    return { message: body.startsWith("<") ? "" : body };
  }
};

const request = async (path, authFetch, options = {}) => {
  // Las peticiones de clientes siempre llevan la sesión.
  const response = await authFetch(path, options);
  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.message ||
        data.error ||
        `No se pudo completar la solicitud (${response.status})`,
    );
  }

  return data.data || data;
};

export const getClients = (authFetch) => request("/clients", authFetch);

export const getClientById = (id, authFetch) =>
  request(`/clients/${id}`, authFetch);

export const getClientCars = (authFetch) => request("/cars", authFetch);

export const updateClient = (id, client, authFetch) =>
  request(`/clients/${id}`, authFetch, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(client),
  });

export const deleteClient = (id, authFetch) =>
  request(`/clients/${id}`, authFetch, { method: "DELETE" });
