import { useState } from "react";
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useClients } from "../../hooks/useClients";
import { deleteClient } from "../../services/clientService";
import { capitalize } from "../../utils/capitalize";
import "../AdminCars/AdminCars.css";
import "./AdminClients.css";

// interestedCars puede llegar poblado o solo con el ID.
const getCarLabel = (car) => {
  if (typeof car === "string") return car;
  return `${capitalize(car.brand || "")} ${capitalize(car.model || "")}`.trim();
};

const AdminClients = () => {
  const { authFetch } = useAuth();
  const { t } = useLanguage();
  const { clients, loading, error, removeClientFromList } = useClients(authFetch);
  const [deletingId, setDeletingId] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const statusLabels = {
    Interested: t.clientStatusInterested,
    Contacted: t.clientStatusContacted,
    Negotiating: t.clientStatusNegotiating,
    Customer: t.clientStatusCustomer,
  };

  const handleDelete = async (client) => {
    if (deletingId) return;

    const confirmed = window.confirm(
      t.clientDeleteConfirm.replace("{{client}}", client.name),
    );

    if (!confirmed) return;

    setDeleteError("");
    setDeletingId(client._id);

    try {
      await deleteClient(client._id, authFetch);
      // Actualizamos la tabla después de confirmar el borrado.
      removeClientFromList(client._id);
    } catch (deleteRequestError) {
      setDeleteError(deleteRequestError.message || t.clientDeleteError);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="admin-cars admin-clients">
      <Link className="admin-cars__back" to="/admin">
        <FiArrowLeft aria-hidden="true" />
        {t.adminBack}
      </Link>

      <header className="admin-cars__header">
        <div>
          <span>{t.adminClientsEyebrow}</span>
          <h1>{t.adminClientsTitle}</h1>
          <p>{t.adminClientsText}</p>
        </div>
      </header>

      {deleteError && (
        <p className="admin-cars__message admin-cars__message--error" role="alert">
          {deleteError}
        </p>
      )}

      {loading ? (
        <section className="admin-cars__state" aria-live="polite">
          <div className="admin-cars__spinner" />
          <p>{t.adminClientsLoading}</p>
        </section>
      ) : error ? (
        <section
          className="admin-cars__state admin-cars__state--error"
          role="alert"
        >
          <h2>{t.adminClientsErrorTitle}</h2>
          <p>{error || t.adminClientsErrorText}</p>
        </section>
      ) : clients.length === 0 ? (
        <section className="admin-cars__state">
          <FiUsers aria-hidden="true" />
          <h2>{t.adminClientsEmptyTitle}</h2>
          <p>{t.adminClientsEmptyText}</p>
        </section>
      ) : (
        <section className="admin-cars__inventory">
          <div className="admin-cars__count">
            <strong>{clients.length}</strong> {t.adminClientsCount}
          </div>

          <div className="admin-cars__table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">{t.clientName}</th>
                  <th scope="col">{t.formEmail}</th>
                  <th scope="col">{t.clientPhone}</th>
                  <th scope="col">{t.clientCity}</th>
                  <th scope="col">{t.carStatus}</th>
                  <th scope="col">{t.clientInterestedCars}</th>
                  <th scope="col">{t.carActions}</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client._id}>
                    <td>
                      <strong>{client.name}</strong>
                    </td>
                    <td>
                      <a className="admin-clients__contact" href={`mailto:${client.email}`}>
                        {client.email}
                      </a>
                    </td>
                    <td>
                      <a className="admin-clients__contact" href={`tel:${client.phone}`}>
                        {client.phone}
                      </a>
                    </td>
                    <td>{client.city || t.clientNoCity}</td>
                    <td>
                      <span
                        className={`admin-client-status admin-client-status--${client.status?.toLowerCase()}`}
                      >
                        {statusLabels[client.status] || client.status}
                      </span>
                    </td>
                    <td>
                      {client.interestedCars?.length > 0 ? (
                        <div className="admin-clients__cars">
                          {client.interestedCars.map((car) => (
                            <span key={car._id || car}>{getCarLabel(car)}</span>
                          ))}
                        </div>
                      ) : (
                        t.clientNoInterestedCars
                      )}
                    </td>
                    <td>
                      <div className="admin-cars__actions">
                        <Link
                          className="admin-cars__edit"
                          to={`/admin/clients/${client._id}/edit`}
                        >
                          <FiEdit2 aria-hidden="true" />
                          {t.edit}
                        </Link>
                        <button
                          className="admin-cars__delete"
                          type="button"
                          onClick={() => handleDelete(client)}
                          disabled={Boolean(deletingId)}
                          aria-busy={deletingId === client._id}
                        >
                          <FiTrash2 aria-hidden="true" />
                          {deletingId === client._id ? t.deleting : t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
};

export default AdminClients;
