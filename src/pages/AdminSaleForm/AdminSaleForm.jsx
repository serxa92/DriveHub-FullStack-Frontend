import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiArrowLeft, FiCheckCircle, FiDollarSign, FiSave } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  createSale,
  getSaleById,
  getSaleCars,
  getSaleClients,
  updateSale,
} from "../../services/saleService";
import { capitalize } from "../../utils/capitalize";
import "../AdminCarNew/AdminCarNew.css";
import "./AdminSaleForm.css";

const getFormValues = (sale) => ({
  car: sale.car?._id || sale.car || "",
  client: sale.client?._id || sale.client || "",
  salePrice: sale.salePrice ?? "",
  paymentMethod: sale.paymentMethod || "Bank transfer",
  status: sale.status || "Pending",
  notes: sale.notes || "",
});

const AdminSaleForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { authFetch } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [clients, setClients] = useState([]);
  const [originalCarId, setOriginalCarId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: getFormValues({}),
  });

  useEffect(() => {
    let isActive = true;
    const requests = [getSaleCars(authFetch), getSaleClients(authFetch)];

    // En edición también necesitamos los datos actuales de la venta.
    if (isEditing) requests.push(getSaleById(id, authFetch));

    Promise.all(requests)
      .then(([availableCars, availableClients, sale]) => {
        if (!isActive) return;

        setCars(availableCars);
        setClients(availableClients);
        if (sale) {
          const values = getFormValues(sale);
          setOriginalCarId(values.car);
          reset(values);
        }
      })
      .catch((requestError) => {
        if (isActive) setLoadError(requestError.message);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [authFetch, id, isEditing, reset]);

  const selectableCars = cars.filter(
    (car) => car.status === "Available" || car._id === originalCarId,
  );

  const onSubmit = async (data) => {
    if (isSaving) return;

    setApiError("");
    setIsSuccess(false);
    setIsSaving(true);

    const sale = {
      ...data,
      // El vendedor y el estado del coche los resuelve el backend.
      salePrice: Number(data.salePrice),
    };

    try {
      if (isEditing) await updateSale(id, sale, authFetch);
      else await createSale(sale, authFetch);

      setIsSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      navigate("/admin/sales", { replace: true });
    } catch (requestError) {
      setApiError(
        requestError.message ||
          (isEditing ? t.saleEditError : t.saleCreateError),
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="admin-car-new admin-sale-form__state" aria-live="polite">
        <div className="admin-sale-form__spinner" />
        <p>{t.saleFormLoading}</p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="admin-car-new admin-sale-form__state" role="alert">
        <FiDollarSign aria-hidden="true" />
        <h1>{t.saleFormLoadError}</h1>
        <p>{loadError}</p>
        <Link className="admin-car-new__back" to="/admin/sales">
          <FiArrowLeft aria-hidden="true" />
          {t.adminSalesBack}
        </Link>
      </main>
    );
  }

  return (
    <main className="admin-car-new">
      <Link className="admin-car-new__back" to="/admin/sales">
        <FiArrowLeft aria-hidden="true" />
        {t.adminSalesBack}
      </Link>

      <header className="admin-car-new__header">
        <span>{t.adminSalesEyebrow}</span>
        <h1>{isEditing ? t.saleEditTitle : t.saleNewTitle}</h1>
        <p>{isEditing ? t.saleEditText : t.saleNewText}</p>
      </header>

      <form className="admin-car-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="admin-car-form__section">
          <div className="admin-car-form__section-title">
            <h2>{t.saleData}</h2>
            <p>{t.saleDataText}</p>
          </div>

          <div className="admin-car-form__grid">
            <div className="admin-car-form__field">
              <label htmlFor="car">{t.saleCar}</label>
              <select id="car" {...register("car", { required: t.formRequired })}>
                <option value="">{t.saleSelectCar}</option>
                {selectableCars.map((car) => (
                  <option key={car._id} value={car._id}>
                    {capitalize(car.brand || "")} {capitalize(car.model || "")} ({car.year})
                  </option>
                ))}
              </select>
              {errors.car && <small>{errors.car.message}</small>}
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="client">{t.saleClient}</label>
              <select
                id="client"
                {...register("client", { required: t.formRequired })}
              >
                <option value="">{t.saleSelectClient}</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
              {errors.client && <small>{errors.client.message}</small>}
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="salePrice">{t.salePrice}</label>
              <input
                id="salePrice"
                type="number"
                min="0.01"
                step="0.01"
                {...register("salePrice", {
                  required: t.formRequired,
                  min: { value: 0.01, message: t.carPriceInvalid },
                })}
              />
              {errors.salePrice && <small>{errors.salePrice.message}</small>}
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="paymentMethod">{t.salePaymentMethod}</label>
              <select
                id="paymentMethod"
                {...register("paymentMethod", { required: t.formRequired })}
              >
                <option value="Cash">{t.salePaymentCash}</option>
                <option value="Financing">{t.salePaymentFinancing}</option>
                <option value="Bank transfer">{t.salePaymentTransfer}</option>
              </select>
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="status">{t.carStatus}</label>
              <select id="status" {...register("status", { required: t.formRequired })}>
                <option value="Pending">{t.saleStatusPending}</option>
                <option value="Completed">{t.saleStatusCompleted}</option>
                <option value="Cancelled">{t.saleStatusCancelled}</option>
              </select>
            </div>
          </div>

          <div className="admin-car-form__field">
            <label htmlFor="notes">{t.carNotes}</label>
            <textarea
              id="notes"
              rows="5"
              placeholder={t.saleNotesPlaceholder}
              {...register("notes")}
            />
          </div>
        </section>

        {apiError && (
          <p className="admin-car-form__message admin-car-form__message--error" role="alert">
            {apiError}
          </p>
        )}

        {isSuccess && (
          <p className="admin-car-form__message admin-car-form__message--success" role="status">
            <FiCheckCircle aria-hidden="true" />
            {isEditing ? t.saleEditSuccess : t.saleCreateSuccess}
          </p>
        )}

        <div className="admin-car-form__actions">
          <Link to="/admin/sales">{t.cancel}</Link>
          <button type="submit" disabled={isSaving || isSuccess}>
            <FiSave aria-hidden="true" />
            {isSaving
              ? t.saleSaving
              : isEditing
                ? t.carSave
                : t.saleCreate}
          </button>
        </div>
      </form>
    </main>
  );
};

export default AdminSaleForm;
