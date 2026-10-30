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
  // Todas las peticiones de ventas necesitan permisos de administrador.
  const response = await authFetch(path, options);
  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        data.message ||
        `No se pudo completar la solicitud (${response.status})`,
    );
  }

  return data.data || data;
};

export const getSales = (authFetch) => request("/sales", authFetch);

export const getSaleById = (id, authFetch) =>
  request(`/sales/${id}`, authFetch);

export const getSaleCars = (authFetch) => request("/cars", authFetch);

export const getSaleClients = (authFetch) => request("/clients", authFetch);

export const createSale = (sale, authFetch) =>
  request("/sales", authFetch, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sale),
  });

export const updateSale = (id, sale, authFetch) =>
  request(`/sales/${id}`, authFetch, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sale),
  });

export const deleteSale = (id, authFetch) =>
  request(`/sales/${id}`, authFetch, { method: "DELETE" });
