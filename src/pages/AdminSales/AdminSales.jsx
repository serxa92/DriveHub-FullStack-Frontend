import { useState } from "react";
import {
  FiArrowLeft,
  FiDollarSign,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useSales } from "../../hooks/useSales";
import { deleteSale } from "../../services/saleService";
import { capitalize } from "../../utils/capitalize";
import "../AdminCars/AdminCars.css";
import "./AdminSales.css";

const getCarLabel = (car) => {
  if (!car || typeof car === "string") return car || "—";
  return `${capitalize(car.brand || "")} ${capitalize(car.model || "")}`.trim();
};

const getClientLabel = (client) => {
  if (!client || typeof client === "string") return client || "—";
  return client.name || client.email || "—";
};

const getSellerLabel = (seller) => {
  if (!seller || typeof seller === "string") return seller || "—";
  return seller.username || seller.email || "—";
};

const normalizeSearch = (value, locale) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase(locale);

const AdminSales = () => {
  const { authFetch } = useAuth();
  const { language, t } = useLanguage();
  const { sales, loading, error, removeSaleFromList } = useSales(authFetch);
  const [deletingId, setDeletingId] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const locale = language === "es" ? "es-ES" : "en-US";

  const statusLabels = {
    Pending: t.saleStatusPending,
    Completed: t.saleStatusCompleted,
    Cancelled: t.saleStatusCancelled,
  };

  const paymentLabels = {
    Cash: t.salePaymentCash,
    Financing: t.salePaymentFinancing,
    "Bank transfer": t.salePaymentTransfer,
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(value ?? 0);

  const formatDate = (value) =>
    value ? new Intl.DateTimeFormat(locale).format(new Date(value)) : "—";

  const normalizedSearch = normalizeSearch(searchTerm.trim(), locale);
  const filteredSales = sales.filter((sale) => {
    if (!normalizedSearch) return true;

    const searchableValues = [
      getCarLabel(sale.car),
      getClientLabel(sale.client),
      getSellerLabel(sale.seller),
      formatPrice(sale.salePrice),
      paymentLabels[sale.paymentMethod] || sale.paymentMethod,
      statusLabels[sale.status] || sale.status,
      formatDate(sale.saleDate || sale.createdAt),
    ];

    return searchableValues.some((value) =>
      normalizeSearch(value, locale).includes(normalizedSearch),
    );
  });

  const handleDelete = async (sale) => {
    if (deletingId) return;

    const confirmed = window.confirm(
      t.saleDeleteConfirm.replace("{{car}}", getCarLabel(sale.car)),
    );

    if (!confirmed) return;

    setDeleteError("");
    setDeletingId(sale._id);

    try {
      await deleteSale(sale._id, authFetch);
      // Quitamos la venta cuando el backend confirma el borrado.
      removeSaleFromList(sale._id);
    } catch (requestError) {
      setDeleteError(requestError.message || t.saleDeleteError);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="admin-cars admin-sales">
      <Link className="admin-cars__back" to="/admin">
        <FiArrowLeft aria-hidden="true" />
        {t.adminBack}
      </Link>

      <header className="admin-cars__header">
        <div>
          <span>{t.adminSalesEyebrow}</span>
          <h1>{t.adminSalesTitle}</h1>
          <p>{t.adminSalesText}</p>
        </div>

        <Link className="admin-cars__new" to="/admin/sales/new">
          <FiPlus aria-hidden="true" />
          {t.adminNewSale}
        </Link>
      </header>

      {deleteError && (
        <p className="admin-cars__message admin-cars__message--error" role="alert">
          {deleteError}
        </p>
      )}

      {!loading && !error && sales.length > 0 && (
        <label className="admin-list-search">
          <FiSearch aria-hidden="true" />
          <span className="sr-only">{t.adminSalesSearchLabel}</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t.adminSalesSearchPlaceholder}
          />
        </label>
      )}

      {loading ? (
        <section className="admin-cars__state" aria-live="polite">
          <div className="admin-cars__spinner" />
          <p>{t.adminSalesLoading}</p>
        </section>
      ) : error ? (
        <section
          className="admin-cars__state admin-cars__state--error"
          role="alert"
        >
          <h2>{t.adminSalesErrorTitle}</h2>
          <p>{error || t.adminSalesErrorText}</p>
        </section>
      ) : sales.length === 0 ? (
        <section className="admin-cars__state">
          <FiDollarSign aria-hidden="true" />
          <h2>{t.adminSalesEmptyTitle}</h2>
          <p>{t.adminSalesEmptyText}</p>
        </section>
      ) : (
        <section className="admin-cars__inventory">
          <div className="admin-cars__count">
            <strong>{filteredSales.length}</strong> {t.adminSalesCount}
          </div>

          {filteredSales.length === 0 ? (
            <div className="admin-list-search__empty">
              <FiSearch aria-hidden="true" />
              <h2>{t.adminSalesNoResultsTitle}</h2>
              <p>{t.adminSalesNoResultsText}</p>
            </div>
          ) : (
            <div className="admin-cars__table-wrap">
              <table>
              <thead>
                <tr>
                  <th scope="col">{t.saleCar}</th>
                  <th scope="col">{t.saleClient}</th>
                  <th scope="col">{t.saleSeller}</th>
                  <th scope="col">{t.salePrice}</th>
                  <th scope="col">{t.salePaymentMethod}</th>
                  <th scope="col">{t.carStatus}</th>
                  <th scope="col">{t.saleDate}</th>
                  <th scope="col">{t.carActions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale._id}>
                    <td><strong>{getCarLabel(sale.car)}</strong></td>
                    <td>{getClientLabel(sale.client)}</td>
                    <td>{getSellerLabel(sale.seller)}</td>
                    <td>{formatPrice(sale.salePrice)}</td>
                    <td>{paymentLabels[sale.paymentMethod] || sale.paymentMethod}</td>
                    <td>
                      <span
                        className={`admin-sale-status admin-sale-status--${sale.status?.toLowerCase()}`}
                      >
                        {statusLabels[sale.status] || sale.status}
                      </span>
                    </td>
                    <td>{formatDate(sale.saleDate || sale.createdAt)}</td>
                    <td>
                      <div className="admin-cars__actions">
                        <Link
                          className="admin-cars__edit"
                          to={`/admin/sales/${sale._id}/edit`}
                        >
                          <FiEdit2 aria-hidden="true" />
                          {t.edit}
                        </Link>
                        <button
                          className="admin-cars__delete"
                          type="button"
                          onClick={() => handleDelete(sale)}
                          disabled={Boolean(deletingId)}
                          aria-busy={deletingId === sale._id}
                        >
                          <FiTrash2 aria-hidden="true" />
                          {deletingId === sale._id ? t.deleting : t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default AdminSales;
